import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

interface IconProps {
  size?: number;
  color?: string;
}

const ChevronLeft: React.FC<IconProps> = ({ size = 16, color = "#000" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight: React.FC<IconProps> = ({ size = 16, color = "#000" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const RotateCcw: React.FC<IconProps> = ({ size = 16, color = "#000" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </svg>
);

const BookOpen: React.FC<IconProps> = ({ size = 16, color = "#fff" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 4h7a2 2 0 0 1 2 2v14H4a2 2 0 0 1-2-2z" />
    <path d="M22 4h-7a2 2 0 0 0-2 2v14h7a2 2 0 0 0 2-2z" />
  </svg>
);

const Target: React.FC<IconProps> = ({ size = 16, color = "#fff" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const Eye: React.FC<IconProps> = ({ size = 16, color = "#fff" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

interface CompassIconProps {
  size?: number;
  color?: string;
}

const CompassIcon: React.FC<CompassIconProps> = ({
  size = 18,
  color = "#4A4DC9",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polygon
      points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
      fill={color}
      opacity="0.2"
      stroke={color}
    />
  </svg>
);

const DS = {
  primary: "#4A4DC9",
  primaryDark: "#533086",
  accent: "#FF7212",
  accentSoft: "#FC9145",
  lavender: "#C1C1EA",
  peach: "#FFF3E4",
  lavenderBg: "#EEEDF8",
  peachBg: "#FFF8F0",
  gray900: "#4E4E4E",
  gray400: "#CACACA",
  gray200: "#EBEBEB",
  gray100: "#F5F5F5",
  white: "#FFFFFF",
  black: "#1A1A2E",
  success: "#2ECC71",
  danger: "#E74C3C",
  font: "'Poppins', sans-serif",
  radius: 24,
  radiusSm: 12,
  radiusXs: 8,
};

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutQuad = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const easeOutElastic = (t: number) => {
  const c = (2 * Math.PI) / 3;
  return t === 0
    ? 0
    : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c) + 1;
};

/* ═══ Responsive container-width hook ═══ */
const useContainerWidth = (ref: React.RefObject<HTMLElement>) => {
  const [w, setW] = useState(800);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setW(e.contentRect.width);
    });
    ro.observe(ref.current);
    setW(ref.current.offsetWidth);
    return () => ro.disconnect();
  }, [ref]);
  return w;
};

const EyesConstructionTool = () => {
  const containerRef = useRef(null);
  const cw = useContainerWidth(containerRef);

  /* ═══ Responsive breakpoints ═══ */
  const isMobile = cw < 480;
  const isTablet = cw >= 480 && cw < 700;
  const isDesktop = cw >= 700;
  const bp = isMobile ? "sm" : isTablet ? "md" : "lg";

  const pad = isMobile ? 10 : isTablet ? 14 : 18;
  const hPad = isMobile ? 12 : isTablet ? 18 : 28;
  const fs = (base) =>
    isMobile
      ? Math.round(base * 0.82)
      : isTablet
        ? Math.round(base * 0.92)
        : base;
  const canvasH = isMobile ? 240 : isTablet ? 300 : 360;
  const btnH = isMobile ? 34 : 40;
  const btnPad = isMobile ? "0 14px" : "0 24px";
  const btnFs = isMobile ? 11 : 13;
  const btnRad = isMobile ? 18 : 24;

  const SEG = 280,
    CR_DEF = 180,
    CX = 340,
    CY = 235;
  const XP = { x: CX - SEG / 2, y: CY },
    YP = { x: CX + SEG / 2, y: CY };
  const calcInt = useCallback((r: number, above: boolean) => {
    const h2 = SEG / 2;
    if (r <= h2) return { x: CX, y: above ? CY - 10 : CY + 10 };
    return {
      x: CX,
      y: above
        ? CY - Math.sqrt(r * r - h2 * h2)
        : CY + Math.sqrt(r * r - h2 * h2),
    };
  }, []);

  const learnSteps = [
    {
      id: 1,
      title: "The Supporting Line XY",
      desc: "Here is line segment XY — the supporting line for our eye shape. Pick a compass radius that is more than half of XY so the arcs will cross. Try the slider!",
    },
    {
      id: 2,
      title: "Arcs Above — Finding Point A",
      desc: "Watch carefully! The compass is placed at point X (see the pulsing ring). It sweeps an arc above. Then it lifts and is placed at Y, sweeping another arc. Where they cross is point A!",
    },
    {
      id: 3,
      title: "Arcs Below — Finding Point B",
      desc: "Now the compass is placed at X again and sweeps below. Then placed at Y to sweep below. The arcs meet at point B. Both A and B are equidistant from X and Y!",
    },
    {
      id: 4,
      title: "Drawing the Eye Shape",
      desc: "The compass is placed at A as centre and draws the upper eye arc. Then placed at B for the lower arc. Together they form a symmetrical eye!",
    },
    {
      id: 5,
      title: "Explore — Drag to Reshape",
      desc: isMobile
        ? "Drag A and B up/down to reshape the eye. Symmetry is always preserved!"
        : "Drag A and B along the perpendicular bisector. Every point on this line is equidistant from X and Y, so the eye stays symmetrical!",
    },
  ];
  const practiceSteps = [
    {
      id: 10,
      title: "Practice: Build the Eyes",
      desc: "Set a compass radius, then click each button to build step by step.",
    },
    {
      id: 11,
      title: "Practice: Experiment",
      desc: "What if the radius is barely more than half XY? Or very large?",
    },
  ];

  const [selectedMode, setSelectedMode] = useState("learn");
  const [si, setSi] = useState(0);
  const [trans, setTrans] = useState(false);
  const [cr, setCr] = useState(CR_DEF);
  const [rv, setRv] = useState(true);
  const [animT, setAnimT] = useState(0);
  const aRef = useRef(0);
  const [dA, setDA] = useState(null);
  const [dB, setDB] = useState(null);
  const [drA, setDrA] = useState(false);
  const [drB, setDrB] = useState(false);
  const svgRef = useRef(null);
  const [ps, setPs] = useState(0);
  const [pcr, setPcr] = useState(180);
  const [paT, setPaT] = useState(1);
  const paRef = useRef(0);

  const ms = selectedMode === "learn" ? learnSteps : practiceSteps;
  const cs = ms[si] || ms[0];
  const sid = cs?.id ?? 1;
  const pA = useMemo(
    () => (sid === 5 && dA ? dA : calcInt(cr, true)),
    [cr, sid, dA, calcInt],
  );
  const pB = useMemo(
    () => (sid === 5 && dB ? dB : calcInt(cr, false)),
    [cr, sid, dB, calcInt],
  );
  useEffect(() => {
    setRv(cr > SEG / 2);
  }, [cr]);

  useEffect(() => {
    setAnimT(0);
    const DUR = 7000;
    let s0: number | null = null;
    const tick = (ts: number) => {
      if (s0 === null) s0 = ts;
      const t = Math.min((ts - s0) / DUR, 1);
      setAnimT(t);
      if (t < 1) aRef.current = requestAnimationFrame(tick);
    };
    aRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(aRef.current);
  }, [si, selectedMode]);
  useEffect(() => {
    setPaT(0);
    const DUR = 5000;
    let s0: number | null = null;
    const tick = (ts: number) => {
      if (s0 === null) s0 = ts;
      const t = Math.min((ts - s0) / DUR, 1);
      setPaT(t);
      if (t < 1) paRef.current = requestAnimationFrame(tick);
    };
    paRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(paRef.current);
  }, [ps]);
  useEffect(() => {
    if (sid === 5) {
      setDA(calcInt(cr, true));
      setDB(calcInt(cr, false));
    }
  }, [sid, cr, calcInt]);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    const kf = `
            @keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
            @keyframes popIn{0%{transform:scale(0);opacity:0}60%{transform:scale(1.25)}100%{transform:scale(1);opacity:1}}
            @keyframes pulseGlow{0%,100%{filter:drop-shadow(0 0 4px ${DS.accent}50)}50%{filter:drop-shadow(0 0 18px ${DS.accent}CC)}}
            @keyframes pulseGlowPurple{0%,100%{filter:drop-shadow(0 0 4px ${DS.primary}40)}50%{filter:drop-shadow(0 0 18px ${DS.primary}AA)}}
            @keyframes pivotPulse{0%,100%{r:8;opacity:.5}50%{r:16;opacity:.15}}
            @keyframes pivotPulseSmall{0%,100%{r:6;opacity:.6}50%{r:12;opacity:.2}}
            @keyframes dragHint{0%,100%{transform:translateY(0)}30%{transform:translateY(-10px)}70%{transform:translateY(10px)}}
            @keyframes slideRight{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
            @keyframes sparkle{0%{r:0;opacity:1}100%{r:20;opacity:0}}
            @keyframes fadeInScale{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:scale(1)}}
            @keyframes placeBurst{0%{r:0;opacity:.8;stroke-width:3}100%{r:30;opacity:0;stroke-width:0}}
        `;
    const el = document.createElement("style");
    el.id = "eyes-kf-r";
    el.textContent = kf;
    document.head.appendChild(el);
    return () => {
      const e = document.getElementById("eyes-kf-r");
      if (e) document.head.removeChild(e);
      try {
        link.remove();
      } catch (ex) {}
    };
  }, []);

  const goTo = useCallback((i) => {
    setTrans(true);
    setTimeout(() => {
      setSi(i);
      setTrans(false);
    }, 200);
  }, []);

  /* ═══ TOUCH + MOUSE DRAG for step 5 ═══ */
  const handleMD = useCallback(
    (p) => (e) => {
      e.preventDefault();
      p === "A" ? setDrA(true) : setDrB(true);
    },
    [],
  );

  const getPointerY = useCallback((e) => {
    if (!svgRef.current) return 0;
    const rect = svgRef.current.getBoundingClientRect();
    const sY = 460 / rect.height;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return (clientY - rect.top) * sY;
  }, []);

  const handlePointerMove = useCallback(
    (e) => {
      if (!drA && !drB) return;
      const mY = getPointerY(e);
      if (drA) setDA({ x: CX, y: Math.max(30, Math.min(CY - 20, mY)) });
      if (drB) setDB({ x: CX, y: Math.max(CY + 20, Math.min(430, mY)) });
    },
    [drA, drB, getPointerY],
  );

  const handlePointerUp = useCallback(() => {
    setDrA(false);
    setDrB(false);
  }, []);

  // Touch handlers for SVG drag points
  const handleTouchStart = useCallback(
    (p) => (e) => {
      e.preventDefault();
      e.stopPropagation();
      p === "A" ? setDrA(true) : setDrB(true);
    },
    [],
  );

  const dist = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  const ptOn = (cx, cy, r, sd, ed, f) => {
    const a = ((sd + (ed - sd) * f) * Math.PI) / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };
  const arcP = (cx, cy, r, sd, ed, f) => {
    if (f <= 0) return "";
    const ae = sd + (ed - sd) * f,
      s = {
        x: cx + r * Math.cos((sd * Math.PI) / 180),
        y: cy + r * Math.sin((sd * Math.PI) / 180),
      },
      e = {
        x: cx + r * Math.cos((ae * Math.PI) / 180),
        y: cy + r * Math.sin((ae * Math.PI) / 180),
      };
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${Math.abs(ae - sd) > 180 ? 1 : 0} ${ae >= sd ? 1 : 0} ${e.x} ${e.y}`;
  };
  const arcF = (cx, cy, r, sd, ed) => arcP(cx, cy, r, sd, ed, 1);
  const eyeP = (cen, up, f) => {
    if (f <= 0) return "";
    const r = dist(cen, XP),
      aX = Math.atan2(XP.y - cen.y, XP.x - cen.x),
      aY = Math.atan2(YP.y - cen.y, YP.x - cen.x);
    const sa = up ? aY : aX,
      ea = up ? aX : aY,
      ae = sa + (ea - sa) * f;
    const s = { x: cen.x + r * Math.cos(sa), y: cen.y + r * Math.sin(sa) },
      e = { x: cen.x + r * Math.cos(ae), y: cen.y + r * Math.sin(ae) };
    return `M ${s.x} ${s.y} A ${r} ${r} 0 0 1 ${e.x} ${e.y}`;
  };
  const eyeF = (c, u) => eyeP(c, u, 1);

  const renderSvgCompass = (tipX, tipY, pivX, pivY, color, op, label) => {
    if (op <= 0) return null;
    const ang = Math.atan2(tipY - pivY, tipX - pivX);
    const nl = 28,
      bx = tipX - nl * Math.cos(ang),
      by = tipY - nl * Math.sin(ang);
    const px = 4.5 * Math.cos(ang + Math.PI / 2),
      py = 4.5 * Math.sin(ang + Math.PI / 2);
    return (
      <g opacity={op}>
        <line
          x1={pivX}
          y1={pivY}
          x2={tipX}
          y2={tipY}
          stroke={color}
          strokeWidth={1.5}
          strokeDasharray="5 3"
          opacity={0.6}
        />
        <circle
          cx={pivX}
          cy={pivY}
          r={8}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          style={{ animation: "pivotPulse 1s ease-in-out infinite" }}
        />
        <circle
          cx={pivX}
          cy={pivY}
          r={5}
          fill={color}
          stroke={DS.white}
          strokeWidth={2}
        />
        {label && (
          <g>
            <rect
              x={pivX - 54}
              y={pivY + 14}
              width={108}
              height={22}
              rx={11}
              fill={color}
              opacity={0.92}
            />
            <text
              x={pivX}
              y={pivY + 29}
              textAnchor="middle"
              style={{
                fontSize: "10px",
                fontWeight: 600,
                fill: DS.white,
                fontFamily: DS.font,
              }}
            >
              {label}
            </text>
          </g>
        )}
        <polygon
          points={`${tipX},${tipY} ${bx + px},${by + py} ${bx - px},${by - py}`}
          fill={color}
          opacity={0.8}
        />
        <circle
          cx={tipX}
          cy={tipY}
          r={3}
          fill={DS.black}
          stroke={DS.white}
          strokeWidth={1}
        />
        <circle cx={tipX} cy={tipY} r={12} fill={color} opacity={0.15} />
      </g>
    );
  };

  const placeBurst = (x, y, color, show) =>
    show ? (
      <circle
        cx={x}
        cy={y}
        r={0}
        fill="none"
        stroke={color}
        strokeWidth={3}
        style={{ animation: "placeBurst 0.8s ease-out both" }}
      />
    ) : null;
  const sparkle = (x, y, col, del) => (
    <circle
      key={del}
      cx={x}
      cy={y}
      r={0}
      fill="none"
      stroke={col}
      strokeWidth={2}
      style={{ animation: `sparkle 1s ease-out ${del} both` }}
    />
  );

  /* ═══ LEARN CANVAS (SVG is intrinsically responsive via viewBox) ═══ */
  const renderCanvas = () => {
    const isS5 = sid === 5,
      prevA = sid >= 3,
      prevB = sid >= 4,
      showBis = sid >= 4;
    const cA = isS5 && dA ? dA : pA,
      cB = isS5 && dB ? dB : pB;
    const t = easeInOutQuad(animT);

    const s2place1 = sid === 2 && t >= 0 && t < 0.08,
      s2xf = sid === 2 ? Math.max(0, Math.min(1, (t - 0.05) / 0.37)) : 1,
      s2travel = sid === 2 ? Math.max(0, Math.min(1, (t - 0.42) / 0.1)) : 1,
      s2place2 = sid === 2 && t >= 0.52 && t < 0.6,
      s2yf = sid === 2 ? Math.max(0, Math.min(1, (t - 0.57) / 0.25)) : 1,
      s2r = sid === 2 ? Math.max(0, Math.min(1, (t - 0.82) / 0.18)) : 1;
    const s3place1 = sid === 3 && t >= 0 && t < 0.08,
      s3xf = sid === 3 ? Math.max(0, Math.min(1, (t - 0.05) / 0.37)) : 1,
      s3travel = sid === 3 ? Math.max(0, Math.min(1, (t - 0.42) / 0.1)) : 1,
      s3place2 = sid === 3 && t >= 0.52 && t < 0.6,
      s3yf = sid === 3 ? Math.max(0, Math.min(1, (t - 0.57) / 0.25)) : 1,
      s3r = sid === 3 ? Math.max(0, Math.min(1, (t - 0.82) / 0.18)) : 1;
    const s4place1 = sid === 4 && t >= 0 && t < 0.06,
      s4uf = sid === 4 ? Math.max(0, Math.min(1, (t - 0.04) / 0.36)) : 1,
      s4travel = sid === 4 ? Math.max(0, Math.min(1, (t - 0.4) / 0.08)) : 1,
      s4place2 = sid === 4 && t >= 0.48 && t < 0.54,
      s4lf = sid === 4 ? Math.max(0, Math.min(1, (t - 0.52) / 0.36)) : 1,
      s4bf = sid === 4 ? Math.max(0, Math.min(1, (t - 0.88) / 0.12)) : 1;

    let ct2 = { x: 0, y: 0 },
      cp2 = { x: 0, y: 0 },
      co2 = 0,
      cl2 = "";
    if (sid === 2) {
      if (t < 0.42) {
        const p = ptOn(XP.x, XP.y, cr, -90, 10, s2xf);
        ct2 = p;
        cp2 = XP;
        co2 = t >= 0.03 ? 1 : easeOutCubic(t / 0.03);
        cl2 = "Compass at X";
      } else if (t < 0.52) {
        const f = s2travel;
        ct2 = {
          x: XP.x + (YP.x - XP.x) * f,
          y: XP.y - 25 * Math.sin(f * Math.PI),
        };
        cp2 = ct2;
        co2 = 0.5;
        cl2 = "";
      } else if (t < 0.82) {
        const p = ptOn(YP.x, YP.y, cr, 170, 270, s2yf);
        ct2 = p;
        cp2 = YP;
        co2 = 1;
        cl2 = "Compass at Y";
      } else {
        co2 = Math.max(0, 1 - (t - 0.82) / 0.08);
        ct2 = pA;
        cp2 = YP;
        cl2 = "";
      }
    }
    let ct3 = { x: 0, y: 0 },
      cp3 = { x: 0, y: 0 },
      co3 = 0,
      cl3 = "";
    if (sid === 3) {
      if (t < 0.42) {
        const p = ptOn(XP.x, XP.y, cr, -10, 90, s3xf);
        ct3 = p;
        cp3 = XP;
        co3 = t >= 0.03 ? 1 : easeOutCubic(t / 0.03);
        cl3 = "Compass at X";
      } else if (t < 0.52) {
        const f = s3travel;
        ct3 = {
          x: XP.x + (YP.x - XP.x) * f,
          y: XP.y + 25 * Math.sin(f * Math.PI),
        };
        cp3 = ct3;
        co3 = 0.5;
        cl3 = "";
      } else if (t < 0.82) {
        const p = ptOn(YP.x, YP.y, cr, 90, 190, s3yf);
        ct3 = p;
        cp3 = YP;
        co3 = 1;
        cl3 = "Compass at Y";
      } else {
        co3 = Math.max(0, 1 - (t - 0.82) / 0.08);
        ct3 = pB;
        cp3 = YP;
        cl3 = "";
      }
    }
    let ct4 = { x: 0, y: 0 },
      cp4 = { x: 0, y: 0 },
      co4 = 0,
      cl4 = "";
    if (sid === 4) {
      if (t < 0.4) {
        const r = dist(pA, XP),
          aY = Math.atan2(YP.y - pA.y, YP.x - pA.x),
          aX = Math.atan2(XP.y - pA.y, XP.x - pA.x),
          a = aY + (aX - aY) * s4uf;
        ct4 = { x: pA.x + r * Math.cos(a), y: pA.y + r * Math.sin(a) };
        cp4 = pA;
        co4 = 1;
        cl4 = "Centre = A";
      } else if (t < 0.48) {
        const f = s4travel;
        ct4 = { x: pA.x + (pB.x - pA.x) * f, y: pA.y + (pB.y - pA.y) * f };
        cp4 = ct4;
        co4 = 0.4;
        cl4 = "";
      } else if (t < 0.88) {
        const r = dist(pB, XP),
          aX = Math.atan2(XP.y - pB.y, XP.x - pB.x),
          aY = Math.atan2(YP.y - pB.y, YP.x - pB.x),
          a = aX + (aY - aX) * s4lf;
        ct4 = { x: pB.x + r * Math.cos(a), y: pB.y + r * Math.sin(a) };
        cp4 = pB;
        co4 = 1;
        cl4 = "Centre = B";
      } else {
        co4 = Math.max(0, 1 - (t - 0.88) / 0.06);
        ct4 = YP;
        cp4 = pB;
        cl4 = "";
      }
    }

    /* Touch-enabled SVG: onTouchMove + onTouchEnd for mobile drag */
    return (
      <svg
        ref={svgRef}
        viewBox="0 0 680 460"
        preserveAspectRatio="xMidYMid meet"
        style={{
          width: "100%",
          height: "100%",
          touchAction: "none",
          cursor: drA || drB ? "grabbing" : "default",
        }}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        onTouchCancel={handlePointerUp}
      >
        <defs>
          <filter id="gl">
            <feGaussianBlur stdDeviation="3" result="cb" />
            <feMerge>
              <feMergeNode in="cb" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="ss">
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="3"
              floodColor="#00000015"
            />
          </filter>
          <linearGradient id="bisGr" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={DS.primary} />
            <stop offset="100%" stopColor={DS.primaryDark} />
          </linearGradient>
          <linearGradient id="eyeGr" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={DS.primaryDark} />
            <stop offset="50%" stopColor={DS.primary} />
            <stop offset="100%" stopColor={DS.primaryDark} />
          </linearGradient>
          <radialGradient id="pg">
            <stop offset="0%" stopColor={DS.primary} stopOpacity="0.4" />
            <stop offset="100%" stopColor={DS.primary} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="680" height="460" fill={DS.white} />
        <pattern id="g2" width="24" height="24" patternUnits="userSpaceOnUse">
          <path
            d="M 24 0 L 0 0 0 24"
            fill="none"
            stroke={DS.gray200}
            strokeWidth="0.4"
          />
        </pattern>
        <rect width="680" height="460" fill="url(#g2)" opacity="0.5" />

        {showBis && (
          <line
            x1={CX}
            y1={CY - 215 * easeOutCubic(s4bf)}
            x2={CX}
            y2={CY + 215 * easeOutCubic(s4bf)}
            stroke="url(#bisGr)"
            strokeWidth={2.5}
            strokeDasharray={isS5 ? "none" : "8 4"}
            filter="url(#gl)"
            opacity={sid === 4 ? easeOutCubic(s4bf) : 1}
          />
        )}

        {sid === 1 && (
          <g style={{ animation: "fadeInUp .7s ease-out both" }}>
            <path
              d={arcP(XP.x, XP.y, cr, -60, 60, easeOutCubic(animT))}
              fill="none"
              stroke={rv ? DS.primary : DS.danger}
              strokeWidth={2}
              strokeDasharray="6 4"
              opacity={0.55}
            />
            {animT > 0.05 &&
              (() => {
                const ta = -60 + 120 * easeOutCubic(animT);
                const tip = ptOn(XP.x, XP.y, cr, ta, ta, 1);
                return (
                  <>
                    <line
                      x1={XP.x}
                      y1={XP.y}
                      x2={tip.x}
                      y2={tip.y}
                      stroke={rv ? DS.primary : DS.danger}
                      strokeWidth={1.2}
                      strokeDasharray="4 3"
                      opacity={0.45}
                    />
                    <circle
                      cx={XP.x}
                      cy={XP.y}
                      r={8}
                      fill="none"
                      stroke={rv ? DS.primary : DS.danger}
                      strokeWidth={2}
                      style={{ animation: "pivotPulseSmall 1.2s infinite" }}
                    />
                    <circle
                      cx={tip.x}
                      cy={tip.y}
                      r={4}
                      fill={rv ? DS.primary : DS.danger}
                      opacity={0.7}
                    />
                    <circle cx={tip.x} cy={tip.y} r={12} fill="url(#pg)" />
                  </>
                );
              })()}
            <text
              x={XP.x + 12}
              y={XP.y - cr * 0.35}
              style={{
                fontSize: "12px",
                fontWeight: 600,
                fill: rv ? DS.primary : DS.danger,
                fontFamily: DS.font,
              }}
            >
              r = {Math.round(cr)}
            </text>
            <text
              x={CX}
              y={CY + 44}
              textAnchor="middle"
              style={{
                fontSize: "11px",
                fill: DS.gray900,
                fontFamily: DS.font,
              }}
            >
              ½XY = {Math.round(SEG / 2)} {rv ? " ✓ OK" : " ✗ too small"}
            </text>
          </g>
        )}

        {sid === 2 && (
          <g>
            {placeBurst(XP.x, XP.y, DS.primary, s2place1)}
            {s2xf > 0 && (
              <path
                d={arcP(XP.x, XP.y, cr, -90, 10, s2xf)}
                fill="none"
                stroke={DS.primary}
                strokeWidth={2.2}
                strokeDasharray="7 3.5"
                strokeLinecap="round"
              />
            )}
            {s2xf > 0 &&
              s2xf < 1 &&
              (() => {
                const p = ptOn(XP.x, XP.y, cr, -90, 10, s2xf);
                return <circle cx={p.x} cy={p.y} r={12} fill="url(#pg)" />;
              })()}
            {placeBurst(YP.x, YP.y, DS.primary, s2place2)}
            {s2yf > 0 && (
              <path
                d={arcP(YP.x, YP.y, cr, 170, 270, s2yf)}
                fill="none"
                stroke={DS.primary}
                strokeWidth={2.2}
                strokeDasharray="7 3.5"
                strokeLinecap="round"
              />
            )}
            {s2yf > 0 &&
              s2yf < 1 &&
              (() => {
                const p = ptOn(YP.x, YP.y, cr, 170, 270, s2yf);
                return <circle cx={p.x} cy={p.y} r={12} fill="url(#pg)" />;
              })()}
            {s2r > 0 && (
              <g>
                {sparkle(pA.x, pA.y, DS.accent, "0s")}
                {sparkle(pA.x, pA.y, DS.primary, ".2s")}
                <circle
                  cx={pA.x}
                  cy={pA.y}
                  r={8 * easeOutElastic(s2r)}
                  fill={DS.accent}
                  stroke={DS.white}
                  strokeWidth={2.5}
                  style={{
                    animation: s2r >= 1 ? "pulseGlow 1.5s infinite" : "none",
                  }}
                />
                <text
                  x={pA.x + 15}
                  y={pA.y + 5}
                  opacity={easeOutCubic(s2r)}
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    fill: DS.accent,
                    fontFamily: DS.font,
                  }}
                >
                  A
                </text>
              </g>
            )}
            {s2r > 0.3 && (
              <g opacity={0.3 * easeOutCubic(s2r)}>
                <line
                  x1={XP.x}
                  y1={XP.y}
                  x2={pA.x}
                  y2={pA.y}
                  stroke={DS.primary}
                  strokeWidth={1}
                  strokeDasharray="4 3"
                />
                <line
                  x1={YP.x}
                  y1={YP.y}
                  x2={pA.x}
                  y2={pA.y}
                  stroke={DS.primary}
                  strokeWidth={1}
                  strokeDasharray="4 3"
                />
              </g>
            )}
            {renderSvgCompass(ct2.x, ct2.y, cp2.x, cp2.y, DS.primary, co2, cl2)}
            {s2r > 0.5 && (
              <text
                x={CX}
                y={18}
                textAnchor="middle"
                opacity={easeOutCubic(s2r)}
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  fill: DS.primary,
                  fontFamily: DS.font,
                }}
              >
                XA = YA = {Math.round(cr)}
              </text>
            )}
          </g>
        )}

        {prevA && (
          <g opacity={0.4}>
            <path
              d={arcF(XP.x, XP.y, cr, -90, 10)}
              fill="none"
              stroke={DS.primary}
              strokeWidth={1.5}
              strokeDasharray="6 3"
            />
            <path
              d={arcF(YP.x, YP.y, cr, 170, 270)}
              fill="none"
              stroke={DS.primary}
              strokeWidth={1.5}
              strokeDasharray="6 3"
            />
            <circle
              cx={pA.x}
              cy={pA.y}
              r={6}
              fill={DS.accent}
              stroke={DS.white}
              strokeWidth={1.5}
            />
            <text
              x={pA.x + 12}
              y={pA.y + 5}
              style={{
                fontSize: "13px",
                fontWeight: 700,
                fill: DS.accent,
                fontFamily: DS.font,
              }}
            >
              A
            </text>
          </g>
        )}

        {sid === 3 && (
          <g>
            {placeBurst(XP.x, XP.y, DS.primary, s3place1)}
            {s3xf > 0 && (
              <path
                d={arcP(XP.x, XP.y, cr, -10, 90, s3xf)}
                fill="none"
                stroke={DS.primary}
                strokeWidth={2.2}
                strokeDasharray="7 3.5"
                strokeLinecap="round"
              />
            )}
            {s3xf > 0 &&
              s3xf < 1 &&
              (() => {
                const p = ptOn(XP.x, XP.y, cr, -10, 90, s3xf);
                return <circle cx={p.x} cy={p.y} r={12} fill="url(#pg)" />;
              })()}
            {placeBurst(YP.x, YP.y, DS.primary, s3place2)}
            {s3yf > 0 && (
              <path
                d={arcP(YP.x, YP.y, cr, 90, 190, s3yf)}
                fill="none"
                stroke={DS.primary}
                strokeWidth={2.2}
                strokeDasharray="7 3.5"
                strokeLinecap="round"
              />
            )}
            {s3yf > 0 &&
              s3yf < 1 &&
              (() => {
                const p = ptOn(YP.x, YP.y, cr, 90, 190, s3yf);
                return <circle cx={p.x} cy={p.y} r={12} fill="url(#pg)" />;
              })()}
            {s3r > 0 && (
              <g>
                {sparkle(pB.x, pB.y, DS.accent, "0s")}
                {sparkle(pB.x, pB.y, DS.primary, ".2s")}
                <circle
                  cx={pB.x}
                  cy={pB.y}
                  r={8 * easeOutElastic(s3r)}
                  fill={DS.accent}
                  stroke={DS.white}
                  strokeWidth={2.5}
                  style={{
                    animation: s3r >= 1 ? "pulseGlow 1.5s infinite" : "none",
                  }}
                />
                <text
                  x={pB.x + 15}
                  y={pB.y + 5}
                  opacity={easeOutCubic(s3r)}
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    fill: DS.accent,
                    fontFamily: DS.font,
                  }}
                >
                  B
                </text>
              </g>
            )}
            {s3r > 0.3 && (
              <g opacity={0.3 * easeOutCubic(s3r)}>
                <line
                  x1={XP.x}
                  y1={XP.y}
                  x2={pB.x}
                  y2={pB.y}
                  stroke={DS.primary}
                  strokeWidth={1}
                  strokeDasharray="4 3"
                />
                <line
                  x1={YP.x}
                  y1={YP.y}
                  x2={pB.x}
                  y2={pB.y}
                  stroke={DS.primary}
                  strokeWidth={1}
                  strokeDasharray="4 3"
                />
              </g>
            )}
            {renderSvgCompass(ct3.x, ct3.y, cp3.x, cp3.y, DS.primary, co3, cl3)}
            {s3r > 0.5 && (
              <text
                x={CX}
                y={18}
                textAnchor="middle"
                opacity={easeOutCubic(s3r)}
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  fill: DS.primary,
                  fontFamily: DS.font,
                }}
              >
                XA=YA, XB=YB={Math.round(cr)}
              </text>
            )}
          </g>
        )}

        {prevB && (
          <g opacity={0.4}>
            <path
              d={arcF(XP.x, XP.y, cr, -10, 90)}
              fill="none"
              stroke={DS.primary}
              strokeWidth={1.5}
              strokeDasharray="6 3"
            />
            <path
              d={arcF(YP.x, YP.y, cr, 90, 190)}
              fill="none"
              stroke={DS.primary}
              strokeWidth={1.5}
              strokeDasharray="6 3"
            />
            <circle
              cx={pB.x}
              cy={pB.y}
              r={6}
              fill={DS.accent}
              stroke={DS.white}
              strokeWidth={1.5}
            />
            <text
              x={pB.x + 12}
              y={pB.y + 5}
              style={{
                fontSize: "13px",
                fontWeight: 700,
                fill: DS.accent,
                fontFamily: DS.font,
              }}
            >
              B
            </text>
          </g>
        )}

        {sid === 4 && (
          <g>
            {placeBurst(pA.x, pA.y, DS.primaryDark, s4place1)}
            {s4uf > 0 && (
              <path
                d={eyeP(pA, true, s4uf)}
                fill="none"
                stroke="url(#eyeGr)"
                strokeWidth={3.5}
                strokeLinecap="round"
                filter="url(#ss)"
              />
            )}
            {s4uf > 0 &&
              s4uf < 1 &&
              (() => {
                const r = dist(pA, XP),
                  aY = Math.atan2(YP.y - pA.y, YP.x - pA.x),
                  aX = Math.atan2(XP.y - pA.y, XP.x - pA.x),
                  a = aY + (aX - aY) * s4uf;
                return (
                  <circle
                    cx={pA.x + r * Math.cos(a)}
                    cy={pA.y + r * Math.sin(a)}
                    r={12}
                    fill="url(#pg)"
                  />
                );
              })()}
            {placeBurst(pB.x, pB.y, DS.primaryDark, s4place2)}
            {s4lf > 0 && (
              <path
                d={eyeP(pB, false, s4lf)}
                fill="none"
                stroke="url(#eyeGr)"
                strokeWidth={3.5}
                strokeLinecap="round"
                filter="url(#ss)"
              />
            )}
            {s4lf > 0 &&
              s4lf < 1 &&
              (() => {
                const r = dist(pB, XP),
                  aX = Math.atan2(XP.y - pB.y, XP.x - pB.x),
                  aY = Math.atan2(YP.y - pB.y, YP.x - pB.x),
                  a = aX + (aY - aX) * s4lf;
                return (
                  <circle
                    cx={pB.x + r * Math.cos(a)}
                    cy={pB.y + r * Math.sin(a)}
                    r={12}
                    fill="url(#pg)"
                  />
                );
              })()}
            {renderSvgCompass(
              ct4.x,
              ct4.y,
              cp4.x,
              cp4.y,
              DS.primaryDark,
              co4,
              cl4,
            )}
            {s4bf > 0.3 && (
              <g>
                <circle
                  cx={CX}
                  cy={CY}
                  r={5 * easeOutElastic(s4bf)}
                  fill={DS.primary}
                  stroke={DS.white}
                  strokeWidth={2}
                  style={{
                    animation:
                      s4bf >= 1 ? "pulseGlowPurple 2s infinite" : "none",
                  }}
                />
                <text
                  x={CX + 12}
                  y={CY + 4}
                  opacity={easeOutCubic(s4bf)}
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    fill: DS.primary,
                    fontFamily: DS.font,
                  }}
                >
                  O
                </text>
                <rect
                  x={CX}
                  y={CY - 14}
                  width={14}
                  height={14}
                  fill="none"
                  stroke={DS.primary}
                  strokeWidth={1.5}
                  opacity={easeOutCubic(Math.max(0, s4bf - 0.5) * 2)}
                />
              </g>
            )}
            {s4bf > 0.5 && (
              <text
                x={CX}
                y={18}
                textAnchor="middle"
                opacity={easeOutCubic(s4bf)}
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  fill: DS.primary,
                  fontFamily: DS.font,
                }}
              >
                XO=OY={Math.round(SEG / 2)} · ∠AOX=90°
              </text>
            )}
          </g>
        )}

        {isS5 && (
          <g>
            <g opacity={0.18}>
              <path
                d={arcF(XP.x, XP.y, cr, -90, 10)}
                fill="none"
                stroke={DS.primary}
                strokeWidth={1.2}
                strokeDasharray="5 3"
              />
              <path
                d={arcF(YP.x, YP.y, cr, 170, 270)}
                fill="none"
                stroke={DS.primary}
                strokeWidth={1.2}
                strokeDasharray="5 3"
              />
              <path
                d={arcF(XP.x, XP.y, cr, -10, 90)}
                fill="none"
                stroke={DS.primary}
                strokeWidth={1.2}
                strokeDasharray="5 3"
              />
              <path
                d={arcF(YP.x, YP.y, cr, 90, 190)}
                fill="none"
                stroke={DS.primary}
                strokeWidth={1.2}
                strokeDasharray="5 3"
              />
            </g>
            <path
              d={eyeF(cA, true)}
              fill="none"
              stroke="url(#eyeGr)"
              strokeWidth={3.5}
              strokeLinecap="round"
              filter="url(#ss)"
            />
            <path
              d={eyeF(cB, false)}
              fill="none"
              stroke="url(#eyeGr)"
              strokeWidth={3.5}
              strokeLinecap="round"
              filter="url(#ss)"
            />
            {/* Larger touch targets on mobile */}
            <circle
              cx={cA.x}
              cy={cA.y}
              r={isMobile ? 16 : 11}
              fill={DS.accent}
              stroke={DS.white}
              strokeWidth={2.5}
              style={{
                cursor: "grab",
                animation: "dragHint 2.5s infinite",
                filter: "url(#gl)",
              }}
              onMouseDown={handleMD("A")}
              onTouchStart={handleTouchStart("A")}
            />
            <text
              x={cA.x + 18}
              y={cA.y + 5}
              style={{
                fontSize: "15px",
                fontWeight: 700,
                fill: DS.accent,
                fontFamily: DS.font,
              }}
            >
              A
            </text>
            <circle
              cx={cB.x}
              cy={cB.y}
              r={isMobile ? 16 : 11}
              fill={DS.accent}
              stroke={DS.white}
              strokeWidth={2.5}
              style={{
                cursor: "grab",
                animation: "dragHint 2.5s .6s infinite",
                filter: "url(#gl)",
              }}
              onMouseDown={handleMD("B")}
              onTouchStart={handleTouchStart("B")}
            />
            <text
              x={cB.x + 18}
              y={cB.y + 5}
              style={{
                fontSize: "15px",
                fontWeight: 700,
                fill: DS.accent,
                fontFamily: DS.font,
              }}
            >
              B
            </text>
            <circle
              cx={CX}
              cy={CY}
              r={5}
              fill={DS.primary}
              stroke={DS.white}
              strokeWidth={2}
            />
            <text
              x={CX + 12}
              y={CY + 4}
              style={{
                fontSize: "13px",
                fontWeight: 700,
                fill: DS.primary,
                fontFamily: DS.font,
              }}
            >
              O
            </text>
            <rect
              x={CX}
              y={CY - 14}
              width={14}
              height={14}
              fill="none"
              stroke={DS.primary}
              strokeWidth={1.5}
            />
            <text
              x={CX}
              y={448}
              textAnchor="middle"
              style={{
                fontSize: "11px",
                fill: DS.gray900,
                fontFamily: DS.font,
              }}
            >
              ↕ Drag A and B to reshape
            </text>
          </g>
        )}

        <line
          x1={XP.x}
          y1={XP.y}
          x2={YP.x}
          y2={YP.y}
          stroke={DS.black}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <circle
          cx={XP.x}
          cy={XP.y}
          r={6}
          fill={DS.black}
          stroke={DS.white}
          strokeWidth={2}
        />
        <text
          x={XP.x}
          y={XP.y + 24}
          textAnchor="middle"
          style={{
            fontSize: "15px",
            fontWeight: 700,
            fill: DS.black,
            fontFamily: DS.font,
          }}
        >
          X
        </text>
        <circle
          cx={YP.x}
          cy={YP.y}
          r={6}
          fill={DS.black}
          stroke={DS.white}
          strokeWidth={2}
        />
        <text
          x={YP.x}
          y={YP.y + 24}
          textAnchor="middle"
          style={{
            fontSize: "15px",
            fontWeight: 700,
            fill: DS.black,
            fontFamily: DS.font,
          }}
        >
          Y
        </text>
      </svg>
    );
  };

  /* ═══ PRACTICE CANVAS ═══ */
  const renderPractice = () => {
    const sU = ps >= 1,
      sD = ps >= 2,
      sE = ps >= 3;
    const ppA = calcInt(pcr, true),
      ppB = calcInt(pcr, false),
      pV = pcr > SEG / 2;
    const pt = easeInOutQuad(paT);
    return (
      <svg
        viewBox="0 0 680 460"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: "100%", height: "100%", touchAction: "none" }}
      >
        <defs>
          <filter id="glP">
            <feGaussianBlur stdDeviation="3" result="cb" />
            <feMerge>
              <feMergeNode in="cb" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="egP" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={DS.primaryDark} />
            <stop offset="100%" stopColor={DS.primary} />
          </linearGradient>
          <radialGradient id="pgP">
            <stop offset="0%" stopColor={DS.primary} stopOpacity=".4" />
            <stop offset="100%" stopColor={DS.primary} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="680" height="460" fill={DS.white} />
        <pattern id="gP2" width="24" height="24" patternUnits="userSpaceOnUse">
          <path
            d="M 24 0 L 0 0 0 24"
            fill="none"
            stroke={DS.gray200}
            strokeWidth=".4"
          />
        </pattern>
        <rect width="680" height="460" fill="url(#gP2)" opacity=".5" />
        <line
          x1={XP.x}
          y1={XP.y}
          x2={YP.x}
          y2={YP.y}
          stroke={DS.black}
          strokeWidth={2.5}
        />
        <circle
          cx={XP.x}
          cy={XP.y}
          r={6}
          fill={DS.black}
          stroke={DS.white}
          strokeWidth={2}
        />
        <text
          x={XP.x}
          y={XP.y + 24}
          textAnchor="middle"
          style={{
            fontSize: "15px",
            fontWeight: 700,
            fill: DS.black,
            fontFamily: DS.font,
          }}
        >
          X
        </text>
        <circle
          cx={YP.x}
          cy={YP.y}
          r={6}
          fill={DS.black}
          stroke={DS.white}
          strokeWidth={2}
        />
        <text
          x={YP.x}
          y={YP.y + 24}
          textAnchor="middle"
          style={{
            fontSize: "15px",
            fontWeight: 700,
            fill: DS.black,
            fontFamily: DS.font,
          }}
        >
          Y
        </text>

        {sU && pV && (
          <g>
            <path
              d={arcP(
                XP.x,
                XP.y,
                pcr,
                -90,
                10,
                ps === 1 ? Math.min(1, pt / 0.45) : 1,
              )}
              fill="none"
              stroke={DS.primary}
              strokeWidth={2}
              strokeDasharray="7 3.5"
            />
            {ps === 1 &&
              pt < 0.45 &&
              (() => {
                const p = ptOn(XP.x, XP.y, pcr, -90, 10, pt / 0.45);
                return (
                  <>
                    <line
                      x1={XP.x}
                      y1={XP.y}
                      x2={p.x}
                      y2={p.y}
                      stroke={DS.primary}
                      strokeWidth={1.2}
                      strokeDasharray="4 3"
                      opacity={0.5}
                    />
                    <circle
                      cx={XP.x}
                      cy={XP.y}
                      r={7}
                      fill="none"
                      stroke={DS.primary}
                      strokeWidth={2}
                      style={{ animation: "pivotPulseSmall 1s infinite" }}
                    />
                    <circle cx={p.x} cy={p.y} r={10} fill="url(#pgP)" />
                  </>
                );
              })()}
            <path
              d={arcP(
                YP.x,
                YP.y,
                pcr,
                170,
                270,
                ps === 1 ? Math.max(0, (pt - 0.5) / 0.45) : 1,
              )}
              fill="none"
              stroke={DS.primary}
              strokeWidth={2}
              strokeDasharray="7 3.5"
            />
            {ps === 1 &&
              pt >= 0.5 &&
              pt < 0.95 &&
              (() => {
                const f = (pt - 0.5) / 0.45;
                const p = ptOn(YP.x, YP.y, pcr, 170, 270, Math.min(1, f));
                return (
                  <>
                    <line
                      x1={YP.x}
                      y1={YP.y}
                      x2={p.x}
                      y2={p.y}
                      stroke={DS.primary}
                      strokeWidth={1.2}
                      strokeDasharray="4 3"
                      opacity={0.5}
                    />
                    <circle
                      cx={YP.x}
                      cy={YP.y}
                      r={7}
                      fill="none"
                      stroke={DS.primary}
                      strokeWidth={2}
                      style={{ animation: "pivotPulseSmall 1s infinite" }}
                    />
                    <circle cx={p.x} cy={p.y} r={10} fill="url(#pgP)" />
                  </>
                );
              })()}
            {(ps > 1 || pt > 0.92) && (
              <g style={{ animation: "popIn .5s ease-out both" }}>
                <circle
                  cx={ppA.x}
                  cy={ppA.y}
                  r={7}
                  fill={DS.accent}
                  stroke={DS.white}
                  strokeWidth={2}
                />
                <text
                  x={ppA.x + 14}
                  y={ppA.y + 5}
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    fill: DS.accent,
                    fontFamily: DS.font,
                  }}
                >
                  A
                </text>
              </g>
            )}
          </g>
        )}
        {sD && pV && (
          <g>
            <path
              d={arcP(
                XP.x,
                XP.y,
                pcr,
                -10,
                90,
                ps === 2 ? Math.min(1, pt / 0.45) : 1,
              )}
              fill="none"
              stroke={DS.primary}
              strokeWidth={2}
              strokeDasharray="7 3.5"
            />
            {ps === 2 &&
              pt < 0.45 &&
              (() => {
                const p = ptOn(XP.x, XP.y, pcr, -10, 90, pt / 0.45);
                return (
                  <>
                    <line
                      x1={XP.x}
                      y1={XP.y}
                      x2={p.x}
                      y2={p.y}
                      stroke={DS.primary}
                      strokeWidth={1.2}
                      strokeDasharray="4 3"
                      opacity={0.5}
                    />
                    <circle
                      cx={XP.x}
                      cy={XP.y}
                      r={7}
                      fill="none"
                      stroke={DS.primary}
                      strokeWidth={2}
                      style={{ animation: "pivotPulseSmall 1s infinite" }}
                    />
                    <circle cx={p.x} cy={p.y} r={10} fill="url(#pgP)" />
                  </>
                );
              })()}
            <path
              d={arcP(
                YP.x,
                YP.y,
                pcr,
                90,
                190,
                ps === 2 ? Math.max(0, (pt - 0.5) / 0.45) : 1,
              )}
              fill="none"
              stroke={DS.primary}
              strokeWidth={2}
              strokeDasharray="7 3.5"
            />
            {ps === 2 &&
              pt >= 0.5 &&
              pt < 0.95 &&
              (() => {
                const f = (pt - 0.5) / 0.45;
                const p = ptOn(YP.x, YP.y, pcr, 90, 190, Math.min(1, f));
                return (
                  <>
                    <line
                      x1={YP.x}
                      y1={YP.y}
                      x2={p.x}
                      y2={p.y}
                      stroke={DS.primary}
                      strokeWidth={1.2}
                      strokeDasharray="4 3"
                      opacity={0.5}
                    />
                    <circle
                      cx={YP.x}
                      cy={YP.y}
                      r={7}
                      fill="none"
                      stroke={DS.primary}
                      strokeWidth={2}
                      style={{ animation: "pivotPulseSmall 1s infinite" }}
                    />
                    <circle cx={p.x} cy={p.y} r={10} fill="url(#pgP)" />
                  </>
                );
              })()}
            {(ps > 2 || pt > 0.92) && (
              <g style={{ animation: "popIn .5s ease-out both" }}>
                <circle
                  cx={ppB.x}
                  cy={ppB.y}
                  r={7}
                  fill={DS.accent}
                  stroke={DS.white}
                  strokeWidth={2}
                />
                <text
                  x={ppB.x + 14}
                  y={ppB.y + 5}
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    fill: DS.accent,
                    fontFamily: DS.font,
                  }}
                >
                  B
                </text>
              </g>
            )}
          </g>
        )}
        {sE && pV && (
          <g>
            <path
              d={eyeP(ppA, true, ps === 3 ? Math.min(1, pt / 0.45) : 1)}
              fill="none"
              stroke="url(#egP)"
              strokeWidth={3.5}
            />
            {ps === 3 &&
              pt < 0.45 &&
              (() => {
                const r = dist(ppA, XP),
                  aY = Math.atan2(YP.y - ppA.y, YP.x - ppA.x),
                  aX = Math.atan2(XP.y - ppA.y, XP.x - ppA.x),
                  a = aY + ((aX - aY) * pt) / 0.45;
                return (
                  <>
                    <line
                      x1={ppA.x}
                      y1={ppA.y}
                      x2={ppA.x + r * Math.cos(a)}
                      y2={ppA.y + r * Math.sin(a)}
                      stroke={DS.primaryDark}
                      strokeWidth={1.2}
                      strokeDasharray="4 3"
                      opacity={0.5}
                    />
                    <circle
                      cx={ppA.x}
                      cy={ppA.y}
                      r={7}
                      fill="none"
                      stroke={DS.primaryDark}
                      strokeWidth={2}
                      style={{ animation: "pivotPulseSmall 1s infinite" }}
                    />
                  </>
                );
              })()}
            <path
              d={eyeP(
                ppB,
                false,
                ps === 3 ? Math.max(0, (pt - 0.5) / 0.45) : 1,
              )}
              fill="none"
              stroke="url(#egP)"
              strokeWidth={3.5}
            />
            {ps === 3 &&
              pt >= 0.5 &&
              pt < 0.95 &&
              (() => {
                const f = (pt - 0.5) / 0.45;
                const r = dist(ppB, XP),
                  aX = Math.atan2(XP.y - ppB.y, XP.x - ppB.x),
                  aY = Math.atan2(YP.y - ppB.y, YP.x - ppB.x),
                  a = aX + (aY - aX) * Math.min(1, f);
                return (
                  <>
                    <line
                      x1={ppB.x}
                      y1={ppB.y}
                      x2={ppB.x + r * Math.cos(a)}
                      y2={ppB.y + r * Math.sin(a)}
                      stroke={DS.primaryDark}
                      strokeWidth={1.2}
                      strokeDasharray="4 3"
                      opacity={0.5}
                    />
                    <circle
                      cx={ppB.x}
                      cy={ppB.y}
                      r={7}
                      fill="none"
                      stroke={DS.primaryDark}
                      strokeWidth={2}
                      style={{ animation: "pivotPulseSmall 1s infinite" }}
                    />
                  </>
                );
              })()}
            {pt > 0.92 && (
              <g style={{ animation: "fadeInScale .5s ease-out both" }}>
                <line
                  x1={CX}
                  y1={30}
                  x2={CX}
                  y2={430}
                  stroke={DS.primary}
                  strokeWidth={2}
                  strokeDasharray="8 4"
                />
                <circle
                  cx={CX}
                  cy={CY}
                  r={5}
                  fill={DS.primary}
                  stroke={DS.white}
                  strokeWidth={2}
                />
                <text
                  x={CX + 12}
                  y={CY + 4}
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    fill: DS.primary,
                    fontFamily: DS.font,
                  }}
                >
                  O
                </text>
                <rect
                  x={CX}
                  y={CY - 14}
                  width={14}
                  height={14}
                  fill="none"
                  stroke={DS.primary}
                  strokeWidth={1.5}
                />
              </g>
            )}
          </g>
        )}
        <text
          x={CX}
          y={448}
          textAnchor="middle"
          style={{ fontSize: "11px", fill: DS.gray900, fontFamily: DS.font }}
        >
          {ps === 0
            ? 'Set radius → "Draw Arcs Above"'
            : ps === 1 && paT < 1
              ? "Drawing…"
              : ps === 1
                ? 'Done! → "Draw Arcs Below"'
                : ps === 2 && paT < 1
                  ? "Drawing…"
                  : ps === 2
                    ? 'Done! → "Draw Eye Shape"'
                    : ps === 3 && paT < 1
                      ? "Drawing…"
                      : "✓ Complete!"}
        </text>
      </svg>
    );
  };

  const handleMode = useCallback((m: "learn" | "practice") => {
    setSelectedMode(m);
    setSi(0);
    setPs(0);
  }, []);

  interface PillBtnProps {
    children?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: string;
    style?: React.CSSProperties;
  }

  const PillBtn = ({
    children,
    onClick,
    disabled = false,
    variant = "contained",
    style: sx = {},
  }: PillBtnProps) => {
    const base = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: isMobile ? 4 : 6,
      padding: btnPad,
      height: btnH,
      borderRadius: btnRad,
      fontSize: btnFs,
      fontWeight: 600,
      fontFamily: DS.font,
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all .25s ease",
      border: "none",
      outline: "none",
      whiteSpace: "nowrap",
      ...sx,
    };
    if (variant === "contained")
      Object.assign(base, {
        background: disabled ? DS.gray200 : DS.primary,
        color: disabled ? DS.gray400 : DS.white,
        boxShadow: disabled ? "none" : `0 4px 14px ${DS.primary}40`,
      });
    else if (variant === "outlined")
      Object.assign(base, {
        background: "transparent",
        color: disabled ? DS.gray400 : DS.primary,
        border: `2px solid ${disabled ? DS.gray200 : DS.primary}`,
      });
    else if (variant === "accent")
      Object.assign(base, {
        background: disabled ? DS.gray200 : DS.accent,
        color: DS.white,
        boxShadow: disabled ? "none" : `0 4px 14px ${DS.accent}40`,
      });
    else if (variant === "ghost")
      Object.assign(base, {
        background: "transparent",
        color: disabled ? DS.gray400 : DS.gray900,
        border: `1px solid ${DS.gray200}`,
      });
    else if (variant === "success")
      Object.assign(base, {
        background: `${DS.success}18`,
        color: DS.success,
        border: `2px solid ${DS.success}`,
      });
    return (
      <button
        onClick={disabled ? undefined : onClick}
        style={{ ...base, opacity: disabled ? 0.6 : 1 }}
      >
        {children}
      </button>
    );
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: 800,
        margin: "0 auto",
        fontFamily: DS.font,
        background: DS.white,
        borderRadius: isMobile ? DS.radiusSm : DS.radius,
        overflow: "hidden",
        boxShadow: "0 8px 40px rgba(74,77,201,0.10)",
        border: `1px solid ${DS.gray200}`,
      }}
    >
      {/* ═══ HEADER — stacks on mobile ═══ */}
      <div
        style={{
          background: `linear-gradient(135deg, ${DS.primaryDark} 0%, ${DS.primary} 100%)`,
          padding: `${isMobile ? 12 : 20}px ${hPad}px`,
          display: "flex",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "space-between",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 10 : 14,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? 10 : 14,
          }}
        >
          <div
            style={{
              width: isMobile ? 34 : 42,
              height: isMobile ? 34 : 42,
              borderRadius: isMobile ? 10 : 14,
              background: `linear-gradient(135deg, ${DS.accent}, ${DS.accentSoft})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 4px 16px ${DS.accent}50`,
              flexShrink: 0,
            }}
          >
            <Eye size={isMobile ? 18 : 22} color={DS.white} />
          </div>
          <div>
            <div style={{ color: DS.white, fontSize: fs(18), fontWeight: 700 }}>
              The 'Eyes' Construction
            </div>
            <div
              style={{ color: DS.lavender, fontSize: fs(12), fontWeight: 500 }}
            >
              Compass & Straightedge · Perpendicular Bisector
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 6,
            background: `${DS.primaryDark}80`,
            borderRadius: 20,
            padding: 3,
            alignSelf: isMobile ? "stretch" : "auto",
          }}
        >
          {["learn", "practice"].map((m) => (
            <button
              key={m}
              onClick={() => handleMode(m)}
              style={{
                flex: isMobile ? 1 : undefined,
                padding: isMobile ? "6px 0" : `8px ${isTablet ? 14 : 20}px`,
                borderRadius: 18,
                border: "none",
                cursor: "pointer",
                fontSize: fs(12),
                fontWeight: 600,
                fontFamily: DS.font,
                background: selectedMode === m ? DS.accent : "transparent",
                color: selectedMode === m ? DS.white : DS.lavender,
                transition: "all .3s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                boxShadow:
                  selectedMode === m ? `0 2px 10px ${DS.accent}50` : "none",
              }}
            >
              {m === "learn" ? (
                <BookOpen size={isMobile ? 12 : 14} />
              ) : (
                <Target size={isMobile ? 12 : 14} />
              )}
              {m === "learn" ? "Learn" : "Practice"}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ CANVAS — responsive height ═══ */}
      <div
        style={{
          background: DS.white,
          margin: `${pad}px ${pad}px 0`,
          borderRadius: DS.radiusSm,
          border: `1.5px solid ${DS.gray200}`,
          overflow: "hidden",
          height: canvasH,
          opacity: trans ? 0.3 : 1,
          transition: "opacity .2s",
        }}
      >
        {selectedMode === "learn" ? renderCanvas() : renderPractice()}
      </div>

      {/* ═══ INFO PANEL ═══ */}
      <div
        style={{
          padding: `${isMobile ? 10 : 16}px ${isMobile ? 12 : 22}px`,
          margin: `${isMobile ? 8 : 12}px ${pad}px`,
          background: DS.lavenderBg,
          borderRadius: DS.radiusSm,
          borderLeft: `4px solid ${DS.primary}`,
        }}
      >
        <div
          style={{
            fontSize: fs(15),
            fontWeight: 700,
            color: DS.black,
            marginBottom: 4,
          }}
        >
          {cs?.title}
        </div>
        <div
          style={{
            fontSize: fs(13),
            color: DS.gray900,
            lineHeight: 1.6,
            fontWeight: 400,
          }}
        >
          {cs?.desc}
        </div>
      </div>

      {/* ═══ COMPASS SLIDER ═══ */}
      {selectedMode === "learn" && sid === 1 && (
        <div
          style={{
            padding: `0 ${pad}px ${isMobile ? 6 : 10}px`,
            display: "flex",
            alignItems: "center",
            gap: isMobile ? 8 : 14,
            animation: "slideRight .5s ease-out",
          }}
        >
          <CompassIcon size={isMobile ? 14 : 18} color={DS.primary} />
          {!isMobile && (
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                fontFamily: DS.font,
                whiteSpace: "nowrap",
                color: DS.gray900,
              }}
            >
              Compass radius:
            </span>
          )}
          <input
            type="range"
            min={80}
            max={260}
            value={cr}
            onChange={(e) => setCr(+e.target.value)}
            style={{
              flex: 1,
              accentColor: rv ? DS.primary : DS.danger,
              height: 6,
            }}
          />
          <span
            style={{
              fontSize: fs(13),
              fontFamily: DS.font,
              color: rv ? DS.success : DS.danger,
              fontWeight: 700,
              minWidth: 30,
            }}
          >
            {Math.round(cr)}
          </span>
        </div>
      )}

      {/* ═══ PRACTICE CONTROLS ═══ */}
      {selectedMode === "practice" && (
        <div
          style={{
            padding: `0 ${pad}px ${isMobile ? 6 : 10}px`,
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? 8 : 12,
            animation: "slideRight .5s ease-out",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 8 : 14,
            }}
          >
            <CompassIcon size={isMobile ? 14 : 18} color={DS.primary} />
            {!isMobile && (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: DS.font,
                  whiteSpace: "nowrap",
                  color: DS.gray900,
                }}
              >
                Radius:
              </span>
            )}
            <input
              type="range"
              min={80}
              max={260}
              value={pcr}
              onChange={(e) => {
                setPcr(+e.target.value);
                setPs(0);
              }}
              style={{ flex: 1, accentColor: DS.primary, height: 6 }}
            />
            <span
              style={{
                fontSize: fs(13),
                fontFamily: DS.font,
                color: pcr > SEG / 2 ? DS.success : DS.danger,
                fontWeight: 700,
                minWidth: 30,
              }}
            >
              {Math.round(pcr)}
            </span>
          </div>
          <div
            style={{ display: "flex", gap: isMobile ? 4 : 8, flexWrap: "wrap" }}
          >
            {[
              { l: isMobile ? "Above" : "Draw Arcs Above", s: 1 },
              { l: isMobile ? "Below" : "Draw Arcs Below", s: 2 },
              { l: isMobile ? "Eye" : "Draw Eye Shape", s: 3 },
            ].map(({ l, s }) => (
              <PillBtn
                onClick={() => setPs(s)}
                disabled={
                  ps >= s || pcr <= SEG / 2 || (ps === s - 1 && paT < 1)
                }
                variant={
                  ps >= s
                    ? "success"
                    : ps === s - 1 && paT >= 1 && pcr > SEG / 2
                      ? "contained"
                      : "ghost"
                }
                style={{ flex: 1, minWidth: isMobile ? 60 : 120 }}
              >
                {ps >= s ? "✓ " : ""}
                {l}
              </PillBtn>
            ))}
            <PillBtn
              onClick={() => {
                setPs(0);
                setPcr(180);
              }}
              variant="ghost"
              style={{ padding: isMobile ? "0 10px" : "0 16px" }}
            >
              <RotateCcw size={isMobile ? 12 : 14} />
              {!isMobile && " Reset"}
            </PillBtn>
          </div>
        </div>
      )}

      {/* ═══ NAVIGATION ═══ */}
      {selectedMode === "learn" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: `${isMobile ? 8 : 12}px ${pad}px ${isMobile ? 10 : 16}px`,
            borderTop: `1px solid ${DS.gray200}`,
            marginTop: 4,
            gap: isMobile ? 4 : 0,
          }}
        >
          <PillBtn
            onClick={() => {
              if (si > 0) goTo(si - 1);
            }}
            disabled={si === 0}
            variant="outlined"
            style={{ padding: isMobile ? "0 10px" : undefined }}
          >
            <ChevronLeft size={isMobile ? 14 : 16} />
            {!isMobile && " Previous"}
          </PillBtn>
          <div style={{ display: "flex", gap: isMobile ? 5 : 8 }}>
            {ms.map((_, i) => (
              <div
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width: i === si ? (isMobile ? 18 : 28) : isMobile ? 8 : 10,
                  height: isMobile ? 8 : 10,
                  borderRadius: 5,
                  background:
                    i === si
                      ? `linear-gradient(135deg,${DS.primary},${DS.primaryDark})`
                      : i < si
                        ? DS.accent
                        : DS.gray200,
                  cursor: "pointer",
                  transition: "all .4s cubic-bezier(.4,0,.2,1)",
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", gap: isMobile ? 4 : 8 }}>
            <PillBtn
              onClick={() => {
                setSi(0);
                setAnimT(0);
                setCr(CR_DEF);
                setDA(null);
                setDB(null);
              }}
              variant="ghost"
              style={{ padding: isMobile ? "0 8px" : "0 14px" }}
            >
              <RotateCcw size={isMobile ? 12 : 14} />
            </PillBtn>
            <PillBtn
              onClick={() => {
                if (si < ms.length - 1) goTo(si + 1);
              }}
              disabled={si === ms.length - 1}
              variant="accent"
              style={{ padding: isMobile ? "0 10px" : undefined }}
            >
              {!isMobile && "Next "}
              <ChevronRight size={isMobile ? 14 : 16} />
            </PillBtn>
          </div>
        </div>
      )}
    </div>
  );
};

export default EyesConstructionTool;
