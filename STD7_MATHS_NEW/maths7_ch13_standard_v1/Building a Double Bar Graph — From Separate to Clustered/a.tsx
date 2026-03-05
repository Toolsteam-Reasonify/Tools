import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  // @ts-expect-error React types resolved by project/bundler
} from "react";

// ==================== INLINE SVG ICONS (no external dependency) ====================

const Icons = {
  Play: ({ size = 20, color = "currentColor" }) => (
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
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  Pause: ({ size = 20, color = "currentColor" }) => (
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
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  ),
  ChevronLeft: ({ size = 20, color = "currentColor" }) => (
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
  ),
  ChevronRight: ({ size = 20, color = "currentColor" }) => (
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
  ),
  RotateCcw: ({ size = 16, color = "currentColor" }) => (
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
  ),
  Eye: ({ size = 14, color = "currentColor" }) => (
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
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Lightbulb: ({ size = 14, color = "currentColor" }) => (
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
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  ),
  BarChart: ({ size = 22, color = "currentColor" }) => (
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
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  ),
  Layers: ({ size = 22, color = "currentColor" }) => (
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
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  Tag: ({ size = 22, color = "currentColor" }) => (
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
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  Search: ({ size = 22, color = "currentColor" }) => (
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
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Sparkle: ({ size = 22, color = "currentColor" }) => (
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
      <path d="M12 3v1m0 16v1m-7.07-2.93l.7-.7M4.93 5.63l.7.7M3 12h1m16 0h1m-2.93 7.07l-.7-.7M19.07 5.63l-.7.7" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
};

// ==================== SINGULARITY DESIGN TOKENS ====================

const DS = {
  indigo: "#4A4DC9",
  orange: "#FF7212",
  gradientDark: "#533086",
  gradientLight: "#FC9145",
  lavender: "#C1C1EA",
  peach: "#FFF3E4",
  lavenderLight: "#EDEDF7",
  grey900: "#4E4E4E",
  grey400: "#CACACA",
  grey200: "#EBEBEB",
  grey100: "#F5F5F5",
  white: "#FFFFFF",
  fontFamily: "'Poppins', sans-serif",
  radiusPill: 40,
  radiusCard: 16,
  radiusSmall: 10,
};

// ==================== DATA ====================

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const YAHAPUR = [25, 24, 26, 28, 30, 35, 39, 43, 49, 56, 59, 44];
const WAHAPUR = [19, 17, 23, 30, 38, 35, 42, 39, 53, 60, 52, 42];

const DEFAULT_STEPS = [
  {
    id: 1,
    title: "Yahapur's Onion Prices",
    description:
      "Here is a bar graph showing the monthly onion prices (₹/kg) in Yahapur. Notice how the prices rise from January (₹25) to November (₹59), then drop in December.",
    teachingNote:
      "Ask the student to describe the trend — prices rise through the year. Why might this happen?",
  },
  {
    id: 2,
    title: "Wahapur's Onion Prices",
    description:
      "Now here is Wahapur's bar graph alongside. Can you easily compare month by month with two separate graphs? It's quite difficult!",
    teachingNote:
      "Ask: 'Can you easily compare with two separate graphs?' — It is difficult. This motivates the combined graph.",
  },
  {
    id: 3,
    title: "Clubbing the Columns!",
    description:
      "Watch the magic! The two separate graphs merge into one. For each month, Yahapur's bar sits beside Wahapur's bar. This is a Clustered Column Graph.",
    teachingNote:
      "KEY moment. Pause and ask: 'What changed? Why is this better?' Side-by-side bars make comparison instant.",
  },
  {
    id: 4,
    title: "Reading the Graph",
    description:
      "Every good graph needs: a Title, Axis Labels, a Scale (1 unit = ₹10), and a Legend showing which colour is which.",
    teachingNote:
      "Emphasise that every graph MUST have a title, axis labels, scale, and legend.",
  },
  {
    id: 5,
    title: "Explore the Data",
    description:
      "Hover over (or tap) any bar to see its exact value. In which months is Yahapur costlier? They are equal in one month!",
    teachingNote:
      "Let students explore. Yahapur costlier in 6 months, Wahapur in 5, equal in June (₹35).",
  },
  {
    id: 6,
    title: "Insights & Patterns",
    description:
      "Biggest gap in May (₹8 diff). Yahapur total ₹458, Wahapur ₹450. Both show a rising trend. Wahapur more spread out (range 43) vs Yahapur (range 35).",
    teachingNote:
      "Discuss: Which town is costlier overall? Which has more price variation?",
  },
];

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

// ==================== MAIN COMPONENT ====================

const DoubleBarGraphTool = ({ props = {} as any }) => {
  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      showNavigation: props.showNavigation ?? true,
      showPlayPause: props.showPlayPause ?? true,
      showStepIndicator: props.showStepIndicator ?? true,
      filterSteps: props.filterSteps ?? null,
      autoPlayDuration: props.autoPlayDuration ?? 0,
    }),
    [props],
  );

  const ap = props.additionalProps || {};
  const dataset1 = ap.dataset1 || {
    label: "Yahapur",
    values: YAHAPUR,
    color: DS.indigo,
    patternType: "slanted",
  };
  const dataset2 = ap.dataset2 || {
    label: "Wahapur",
    values: WAHAPUR,
    color: DS.orange,
    patternType: "dotted",
  };
  const categories = ap.categories || MONTHS;
  const yAxisLabel = ap.yAxisLabel || "Price (in ₹)";
  const chartTitle =
    ap.chartTitle || "Monthly Onion Prices in Yahapur and Wahapur";
  const yMax = ap.yMax || 60;
  const yStep = ap.yStep || 10;
  const scaleNote = ap.scaleNote || "Scale: 1 unit = ₹10";

  const allSteps = props.steps || DEFAULT_STEPS;
  const availableSteps = useMemo(() => {
    if (config.filterSteps && config.filterSteps.length > 0)
      return allSteps.filter((s) => config.filterSteps.includes(s.id));
    return allSteps;
  }, [allSteps, config.filterSteps]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [showLabels, setShowLabels] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [mergeProgress, setMergeProgress] = useState(0);
  const [barsGrown, setBarsGrown] = useState(false);
  const [bars2Grown, setBars2Grown] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [pressedBtn, setPressedBtn] = useState(null);
  const animFrameRef = useRef(0);

  const currentStep = availableSteps[currentStepIndex];
  const stepId = currentStep?.id || 1;

  // Inject Poppins + keyframes
  useEffect(() => {
    const s = document.createElement("style");
    s.id = "singularity-dbg-kf";
    s.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
            @keyframes s_fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
            @keyframes s_fadeIn { from { opacity:0; } to { opacity:1; } }
            @keyframes s_slideInLeft { from { opacity:0; transform:translateX(-30px); } to { opacity:1; transform:translateX(0); } }
            @keyframes s_slideInRight { from { opacity:0; transform:translateX(30px); } to { opacity:1; transform:translateX(0); } }
            @keyframes s_tooltipPop { from { opacity:0; transform:translateY(5px) scale(0.95); } to { opacity:1; transform:translateY(0) scale(1); } }
        `;
    document.head.appendChild(s);
    return () => {
      const e = document.getElementById("singularity-dbg-kf");
      if (e) document.head.removeChild(e);
    };
  }, []);

  // Step transitions
  useEffect(() => {
    setBarsGrown(false);
    setBars2Grown(false);
    setShowLabels(false);
    setShowInsights(false);
    setMergeProgress(0);
    const t1 = setTimeout(() => setBarsGrown(true), 300);
    let t2, t3, t4, t5;
    if (stepId >= 2) t2 = setTimeout(() => setBars2Grown(true), 600);
    if (stepId >= 3)
      t3 = setTimeout(() => {
        let start = 0;
        const dur = 1200;
        const anim = (ts: number) => {
          if (start === 0) start = ts;
          const p = Math.min((ts - start) / dur, 1);
          setMergeProgress(easeOutCubic(p));
          if (p < 1) animFrameRef.current = requestAnimationFrame(anim);
        };
        animFrameRef.current = requestAnimationFrame(anim);
      }, 900);
    if (stepId >= 4) t4 = setTimeout(() => setShowLabels(true), 1400);
    if (stepId >= 6) t5 = setTimeout(() => setShowInsights(true), 1600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [currentStepIndex, stepId]);

  // Auto-play
  useEffect(() => {
    if (!isPlaying || config.autoPlayDuration <= 0) return;
    const t = setTimeout(() => {
      if (currentStepIndex < availableSteps.length - 1)
        setCurrentStepIndex((p) => p + 1);
      else setIsPlaying(false);
    }, config.autoPlayDuration);
    return () => clearTimeout(t);
  }, [
    isPlaying,
    currentStepIndex,
    config.autoPlayDuration,
    availableSteps.length,
  ]);

  const goNext = useCallback(() => {
    if (currentStepIndex < availableSteps.length - 1)
      setCurrentStepIndex((p) => p + 1);
  }, [currentStepIndex, availableSteps.length]);
  const goPrev = useCallback(() => {
    if (currentStepIndex > 0) setCurrentStepIndex((p) => p - 1);
  }, [currentStepIndex]);
  const reset = useCallback(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, []);

  // Chart geometry
  const cm = { top: 50, right: 30, bottom: 60, left: 60 };
  const cw = 680,
    ch = 300;
  const bgw = cw / categories.length;
  const bw = stepId >= 3 ? bgw * 0.32 : bgw * 0.6;
  const gapPx = 3;
  const bH = (v) => (v / yMax) * ch;

  // ─── RENDER BAR ───
  const renderBar = (value, monthIdx, dsIdx, color, patternType, grown) => {
    const h = grown ? bH(value) : 0;
    let x;
    if (stepId < 3 || mergeProgress === 0) {
      x = cm.left + monthIdx * bgw + (bgw - bw) / 2;
    } else {
      const mw = bgw * 0.32,
        tw = mw * 2 + gapPx;
      const sx = cm.left + monthIdx * bgw + (bgw - tw) / 2;
      const sepX = cm.left + monthIdx * bgw + (bgw - bw) / 2;
      x =
        dsIdx === 0
          ? sepX + (sx - sepX) * mergeProgress
          : sepX + (sx + mw + gapPx - sepX) * mergeProgress;
    }
    const y = cm.top + ch - h;
    const aw =
      stepId >= 3 && mergeProgress > 0
        ? bw + (bgw * 0.32 - bw) * mergeProgress
        : bw;
    const isHov =
      hoveredBar?.month === monthIdx && hoveredBar?.dataset === dsIdx;
    const pid = `sp${dsIdx}${monthIdx}`;

    return (
      <g key={`b${dsIdx}${monthIdx}`}>
        <defs>
          {patternType === "slanted" && (
            <pattern
              id={pid}
              width="6"
              height="6"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <rect width="6" height="6" fill={color} />
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="6"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="2"
              />
            </pattern>
          )}
          {patternType === "dotted" && (
            <pattern
              id={pid}
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
            >
              <rect width="8" height="8" fill={color} />
              <circle cx="4" cy="4" r="1.5" fill="rgba(255,255,255,0.35)" />
            </pattern>
          )}
        </defs>
        <rect
          x={x}
          y={y}
          width={aw}
          height={h}
          fill={patternType === "solid" ? color : `url(#${pid})`}
          rx={4}
          style={{
            transition:
              "height 0.6s cubic-bezier(0.4,0,0.2,1), y 0.6s cubic-bezier(0.4,0,0.2,1), x 0.8s ease, width 0.8s ease",
            filter: isHov
              ? `brightness(1.15) drop-shadow(0 3px 8px ${color}55)`
              : "none",
            stroke: isHov ? DS.grey900 : "rgba(0,0,0,0.06)",
            strokeWidth: isHov ? 2 : 0.5,
            cursor: stepId >= 5 ? "pointer" : "default",
          }}
          onMouseEnter={() =>
            stepId >= 5 && setHoveredBar({ month: monthIdx, dataset: dsIdx })
          }
          onMouseLeave={() => setHoveredBar(null)}
          onClick={() =>
            stepId >= 5 &&
            setHoveredBar(
              hoveredBar?.month === monthIdx && hoveredBar?.dataset === dsIdx
                ? null
                : { month: monthIdx, dataset: dsIdx },
            )
          }
        />
        {isHov && stepId >= 5 && (
          <g style={{ animation: "s_tooltipPop 0.2s ease-out" }}>
            <rect
              x={x + aw / 2 - 38}
              y={y - 44}
              width={76}
              height={34}
              rx={10}
              fill={DS.gradientDark}
              opacity={0.96}
            />
            <polygon
              points={`${x + aw / 2 - 7},${y - 10} ${x + aw / 2 + 7},${y - 10} ${x + aw / 2},${y - 2}`}
              fill={DS.gradientDark}
              opacity={0.96}
            />
            <text
              x={x + aw / 2}
              y={y - 22}
              textAnchor="middle"
              fill={DS.white}
              fontSize={13}
              fontWeight={600}
              fontFamily={DS.fontFamily}
            >
              ₹{value}/kg
            </text>
          </g>
        )}
      </g>
    );
  };

  // ─── SEPARATE CHART ───
  const renderSepChart = (vals, color, pat, label, side, grown) => {
    const w = 360,
      h = 220,
      m = { top: 32, right: 15, bottom: 35, left: 40 };
    const iW = w - m.left - m.right,
      iH = h - m.top - m.bottom;
    const bWidth = (iW / categories.length) * 0.65;
    const gH = (v) => (v / yMax) * iH;
    return (
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        style={{
          animation:
            side === "left"
              ? "s_slideInLeft 0.5s ease-out"
              : "s_slideInRight 0.5s ease-out",
        }}
      >
        <text
          x={w / 2}
          y={20}
          textAnchor="middle"
          fontSize={13}
          fontFamily={DS.fontFamily}
          fontWeight={700}
          fill={DS.grey900}
        >
          Onion Prices — {label}
        </text>
        {[0, 10, 20, 30, 40, 50, 60].map((v) => {
          const y = m.top + iH - gH(v);
          return (
            <g key={v}>
              <line
                x1={m.left}
                y1={y}
                x2={m.left + iW}
                y2={y}
                stroke={DS.grey200}
                strokeWidth={0.5}
                strokeDasharray="3,3"
              />
              <text
                x={m.left - 6}
                y={y + 4}
                textAnchor="end"
                fontSize={9}
                fill={DS.grey400}
                fontFamily={DS.fontFamily}
                fontWeight={500}
              >
                {v}
              </text>
            </g>
          );
        })}
        {vals.map((v, i) => {
          const barH = grown ? gH(v) : 0;
          const x =
            m.left +
            i * (iW / categories.length) +
            (iW / categories.length - bWidth) / 2;
          const y = m.top + iH - barH;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={bWidth}
                height={barH}
                fill={color}
                rx={3}
                style={{
                  transition: `height 0.5s cubic-bezier(0.4,0,0.2,1) ${i * 0.04}s, y 0.5s cubic-bezier(0.4,0,0.2,1) ${i * 0.04}s`,
                }}
              />
              <text
                x={x + bWidth / 2}
                y={m.top + iH + 14}
                textAnchor="middle"
                fontSize={8}
                fontFamily={DS.fontFamily}
                fontWeight={600}
                fill={DS.grey900}
              >
                {categories[i]}
              </text>
            </g>
          );
        })}
        <line
          x1={m.left}
          y1={m.top}
          x2={m.left}
          y2={m.top + iH}
          stroke={DS.grey400}
          strokeWidth={1.5}
        />
        <line
          x1={m.left}
          y1={m.top + iH}
          x2={m.left + iW}
          y2={m.top + iH}
          stroke={DS.grey400}
          strokeWidth={1.5}
        />
      </svg>
    );
  };

  // ─── COMBINED CHART ───
  const renderCombinedChart = () => {
    const svgW = cm.left + cw + cm.right,
      svgH = cm.top + ch + cm.bottom;
    const ticks: number[] = [];
    for (let v = 0; v <= yMax; v += yStep) ticks.push(v);

    return (
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${svgW} ${svgH}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ maxWidth: "100%", overflow: "visible" }}
      >
        {/* Title */}
        {(showLabels || stepId >= 4) && (
          <text
            x={svgW / 2}
            y={22}
            textAnchor="middle"
            fontSize={14}
            fontFamily={DS.fontFamily}
            fontWeight={700}
            fill={DS.gradientDark}
            style={{ animation: "s_fadeIn 0.6s ease-out" }}
          >
            {chartTitle}
          </text>
        )}
        {/* Y-axis label */}
        {(showLabels || stepId >= 4) && (
          <text
            x={16}
            y={cm.top + ch / 2}
            textAnchor="middle"
            fontSize={11}
            fontFamily={DS.fontFamily}
            fontWeight={600}
            fill={DS.grey900}
            transform={`rotate(-90,16,${cm.top + ch / 2})`}
            style={{ animation: "s_fadeIn 0.6s ease-out" }}
          >
            {yAxisLabel}
          </text>
        )}
        {/* Grid */}
        {ticks.map((v) => {
          const y = ch - bH(v);
          return (
            <g key={v}>
              <line
                x1={cm.left}
                y1={cm.top + y}
                x2={cm.left + cw}
                y2={cm.top + y}
                stroke={DS.grey200}
                strokeWidth={1}
                strokeDasharray={v === 0 ? "0" : "4,4"}
              />
              <text
                x={cm.left - 10}
                y={cm.top + y + 4}
                textAnchor="end"
                fill={DS.grey900}
                fontSize={11}
                fontFamily={DS.fontFamily}
                fontWeight={500}
              >
                {v}
              </text>
            </g>
          );
        })}
        {/* Axes */}
        <line
          x1={cm.left}
          y1={cm.top + ch}
          x2={cm.left + cw}
          y2={cm.top + ch}
          stroke={DS.grey400}
          strokeWidth={2}
        />
        <line
          x1={cm.left}
          y1={cm.top}
          x2={cm.left}
          y2={cm.top + ch}
          stroke={DS.grey400}
          strokeWidth={2}
        />
        {/* Bars */}
        {dataset1.values.map((v, i) =>
          renderBar(
            v,
            i,
            0,
            dataset1.color,
            dataset1.patternType || "slanted",
            barsGrown,
          ),
        )}
        {stepId >= 2 &&
          dataset2.values.map((v, i) =>
            renderBar(
              v,
              i,
              1,
              dataset2.color,
              dataset2.patternType || "dotted",
              bars2Grown,
            ),
          )}
        {/* X labels */}
        {categories.map((c, i) => (
          <text
            key={c}
            x={cm.left + i * bgw + bgw / 2}
            y={cm.top + ch + 20}
            textAnchor="middle"
            fill={DS.grey900}
            fontSize={10}
            fontFamily={DS.fontFamily}
            fontWeight={600}
          >
            {c}
          </text>
        ))}
        {/* Legend */}
        {(showLabels || stepId >= 4) && (
          <g style={{ animation: "s_fadeIn 0.6s ease-out" }}>
            <rect
              x={cm.left + cw - 220}
              y={6}
              width={220}
              height={38}
              rx={10}
              fill="rgba(255,255,255,0.95)"
              stroke={DS.grey200}
              strokeWidth={1}
            />
            <rect
              x={cm.left + cw - 210}
              y={14}
              width={18}
              height={18}
              rx={4}
              fill={dataset1.color}
            />
            <text
              x={cm.left + cw - 186}
              y={28}
              fontSize={12}
              fontFamily={DS.fontFamily}
              fontWeight={600}
              fill={DS.grey900}
            >
              {dataset1.label}
            </text>
            <rect
              x={cm.left + cw - 100}
              y={14}
              width={18}
              height={18}
              rx={4}
              fill={dataset2.color}
            />
            <text
              x={cm.left + cw - 76}
              y={28}
              fontSize={12}
              fontFamily={DS.fontFamily}
              fontWeight={600}
              fill={DS.grey900}
            >
              {dataset2.label}
            </text>
          </g>
        )}
        {/* Scale note */}
        {(showLabels || stepId >= 4) && (
          <text
            x={cm.left + cw / 2}
            y={cm.top + ch + 50}
            textAnchor="middle"
            fontSize={10}
            fontFamily={DS.fontFamily}
            fontWeight={500}
            fill={DS.grey400}
            style={{ animation: "s_fadeIn 0.6s ease-out" }}
          >
            {scaleNote}
          </text>
        )}
        {/* Insight annotations */}
        {showInsights &&
          stepId >= 6 &&
          (() => {
            const gx = cm.left + 4 * bgw + bgw / 2,
              gy = cm.top + ch - bH(38) - 20;
            const ex = cm.left + 5 * bgw + bgw / 2,
              ey = cm.top + ch - bH(35) - 20;
            return (
              <g style={{ animation: "s_fadeInUp 0.8s ease-out" }}>
                <line
                  x1={gx}
                  y1={gy + 10}
                  x2={gx}
                  y2={gy - 15}
                  stroke={DS.orange}
                  strokeWidth={2}
                  strokeDasharray="3,3"
                />
                <rect
                  x={gx - 52}
                  y={gy - 42}
                  width={104}
                  height={26}
                  rx={8}
                  fill={DS.peach}
                  stroke={DS.orange}
                  strokeWidth={1.5}
                />
                <text
                  x={gx}
                  y={gy - 25}
                  textAnchor="middle"
                  fontSize={10}
                  fontFamily={DS.fontFamily}
                  fontWeight={700}
                  fill={DS.orange}
                >
                  Biggest Gap!
                </text>
                <line
                  x1={ex}
                  y1={ey + 10}
                  x2={ex}
                  y2={ey - 15}
                  stroke={DS.indigo}
                  strokeWidth={2}
                  strokeDasharray="3,3"
                />
                <rect
                  x={ex - 44}
                  y={ey - 42}
                  width={88}
                  height={26}
                  rx={8}
                  fill={DS.lavenderLight}
                  stroke={DS.indigo}
                  strokeWidth={1.5}
                />
                <text
                  x={ex}
                  y={ey - 25}
                  textAnchor="middle"
                  fontSize={10}
                  fontFamily={DS.fontFamily}
                  fontWeight={700}
                  fill={DS.indigo}
                >
                  Equal! ₹35
                </text>
                <defs>
                  <marker
                    id="sAh"
                    markerWidth="8"
                    markerHeight="6"
                    refX="8"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0,8 3,0 6" fill={DS.gradientLight} />
                  </marker>
                </defs>
                <line
                  x1={cm.left + 20}
                  y1={cm.top + ch + 42}
                  x2={cm.left + cw - 40}
                  y2={cm.top + ch + 24}
                  stroke={DS.gradientLight}
                  strokeWidth={2}
                  markerEnd="url(#sAh)"
                />
              </g>
            );
          })()}
      </svg>
    );
  };

  interface SBtnProps {
    id: string;
    onClick: () => void;
    disabled?: boolean;
    children?: React.ReactNode;
    variant?: "contained" | "outlined";
    size?: "sm" | "md" | "lg";
  }

  // ─── SINGULARITY BUTTON ───
  const SBtn: React.FC<SBtnProps> = ({
    id,
    onClick,
    disabled = false,
    children,
    variant = "contained",
    size = "md",
  }) => {
    const isHov = hoveredBtn === id && !disabled;
    const isPress = pressedBtn === id && !disabled;
    const d =
      size === "sm"
        ? { w: 40, h: 40, r: 12 }
        : size === "lg"
          ? { w: 52, h: 52, r: 16 }
          : { w: 44, h: 44, r: 14 };

    const base = {
      width: d.w,
      height: d.h,
      borderRadius: d.r,
      border: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
      transform: isPress ? "scale(0.93)" : isHov ? "scale(1.06)" : "scale(1)",
      opacity: disabled ? 0.45 : 1,
      outline: "none",
      fontFamily: DS.fontFamily,
    };

    if (variant === "contained") {
      Object.assign(base, {
        background: disabled
          ? DS.grey200
          : `linear-gradient(135deg, ${DS.indigo}, ${DS.gradientDark})`,
        color: disabled ? DS.grey400 : DS.white,
        boxShadow:
          isHov && !disabled
            ? `0 6px 20px ${DS.indigo}44`
            : disabled
              ? "none"
              : `0 2px 8px ${DS.indigo}22`,
      });
    } else {
      Object.assign(base, {
        background: isHov ? DS.lavenderLight : DS.white,
        color: disabled ? DS.grey400 : DS.indigo,
        border: `2px solid ${disabled ? DS.grey200 : DS.indigo}`,
        boxShadow: isHov ? `0 4px 12px ${DS.indigo}18` : "none",
      });
    }

    return (
      <button
        onClick={disabled ? undefined : onClick}
        onMouseEnter={() => setHoveredBtn(id)}
        onMouseLeave={() => {
          setHoveredBtn(null);
          setPressedBtn(null);
        }}
        onMouseDown={() => setPressedBtn(id)}
        onMouseUp={() => setPressedBtn(null)}
        style={base}
      >
        {children}
      </button>
    );
  };

  // Step icons
  const stepIconMap = [
    Icons.BarChart,
    Icons.Layers,
    Icons.Layers,
    Icons.Tag,
    Icons.Search,
    Icons.Sparkle,
  ];
  const StepIcon = stepIconMap[currentStepIndex] || Icons.BarChart;

  // ═══════════ RENDER ═══════════
  return (
    <div
      style={{
        width: "100%",
        maxWidth: config.width,
        margin: "0 auto",
        fontFamily: DS.fontFamily,
        background: DS.white,
        borderRadius: DS.radiusCard + 4,
        overflow: "hidden",
        boxShadow:
          "0 8px 40px rgba(74,77,201,0.08), 0 2px 12px rgba(0,0,0,0.04)",
        border: `1px solid ${DS.grey200}`,
      }}
    >
      {/* ═══ HEADER ═══ */}
      <div
        style={{
          background: `linear-gradient(135deg, ${DS.gradientDark} 0%, ${DS.indigo} 45%, ${DS.gradientLight} 100%)`,
          padding: "18px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: DS.radiusSmall,
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <StepIcon size={22} color="white" />
          </div>
          <div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: DS.white,
                lineHeight: 1.2,
                letterSpacing: "-0.3px",
              }}
            >
              Clubbing the Columns
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.75)",
                fontWeight: 500,
                marginTop: 2,
              }}
            >
              Double Bar Graphs — Sabzi Mandi Onion Prices
            </div>
          </div>
        </div>
        {config.showStepIndicator && (
          <div
            style={{
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(4px)",
              borderRadius: DS.radiusPill,
              padding: "6px 18px",
              fontSize: 12,
              fontWeight: 600,
              color: DS.white,
            }}
          >
            Step {currentStepIndex + 1} / {availableSteps.length}
          </div>
        )}
      </div>

      {/* ═══ PROGRESS ═══ */}
      <div
        style={{ display: "flex", gap: 5, padding: "0 24px", marginTop: 12 }}
      >
        {availableSteps.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrentStepIndex(i)}
            style={{
              flex: 1,
              height: 6,
              borderRadius: DS.radiusPill,
              background:
                i <= currentStepIndex
                  ? `linear-gradient(90deg, ${DS.indigo}, ${DS.gradientLight})`
                  : DS.grey200,
              transition: "all 0.4s ease",
              cursor: "pointer",
              boxShadow:
                i <= currentStepIndex ? `0 2px 6px ${DS.indigo}30` : "none",
            }}
          />
        ))}
      </div>

      {/* ═══ STEP INFO ═══ */}
      <div
        key={currentStepIndex}
        style={{
          padding: "16px 24px 10px",
          animation: "s_fadeInUp 0.5s ease-out",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 17,
            fontWeight: 700,
            color: DS.gradientDark,
            letterSpacing: "-0.2px",
            fontFamily: DS.fontFamily,
          }}
        >
          {currentStep?.title}
        </h3>
        <p
          style={{
            margin: "8px 0 0",
            fontSize: 13,
            color: DS.grey900,
            lineHeight: 1.65,
            fontWeight: 400,
          }}
        >
          {currentStep?.description}
        </p>
      </div>

      {/* ═══ CHART ═══ */}
      <div style={{ padding: "4px 16px 10px", minHeight: 340 }}>
        {stepId <= 2 ? (
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                background: DS.white,
                borderRadius: DS.radiusCard,
                padding: 8,
                boxShadow: "0 2px 14px rgba(74,77,201,0.08)",
                border: `2px solid ${stepId === 1 ? DS.indigo : DS.grey200}`,
                transition: "border-color 0.4s ease",
              }}
            >
              {renderSepChart(
                dataset1.values,
                dataset1.color,
                "slanted",
                dataset1.label,
                "left",
                barsGrown,
              )}
            </div>
            {stepId >= 2 && (
              <div
                style={{
                  background: DS.white,
                  borderRadius: DS.radiusCard,
                  padding: 8,
                  boxShadow: "0 2px 14px rgba(255,114,18,0.08)",
                  border: `2px solid ${DS.orange}`,
                  animation: "s_slideInRight 0.5s ease-out",
                }}
              >
                {renderSepChart(
                  dataset2.values,
                  dataset2.color,
                  "dotted",
                  dataset2.label,
                  "right",
                  bars2Grown,
                )}
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              background: DS.white,
              borderRadius: DS.radiusCard,
              padding: "10px 10px 6px",
              boxShadow: "0 2px 16px rgba(74,77,201,0.06)",
              border: `1.5px solid ${DS.grey200}`,
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              animation: "s_fadeIn 0.5s ease-out",
            }}
          >
            <div style={{ minWidth: 700 }}>{renderCombinedChart()}</div>
          </div>
        )}
      </div>

      {/* ═══ TEACHING NOTE (peach) ═══ */}
      {currentStep?.teachingNote && (
        <div
          style={{
            margin: "0 24px 10px",
            background: DS.peach,
            borderRadius: DS.radiusSmall,
            padding: "12px 16px",
            borderLeft: `4px solid ${DS.orange}`,
            animation: "s_fadeIn 0.6s ease-out 0.3s both",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: DS.orange,
              marginBottom: 4,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Icons.Lightbulb size={14} color={DS.orange} /> Teaching Note
          </div>
          <div
            style={{
              fontSize: 12,
              color: DS.grey900,
              lineHeight: 1.6,
              fontWeight: 400,
            }}
          >
            {currentStep.teachingNote}
          </div>
        </div>
      )}

      {/* ═══ NAVIGATION ═══ */}
      {config.showNavigation && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            padding: "6px 24px 14px",
          }}
        >
          <SBtn
            id="prev"
            onClick={goPrev}
            disabled={currentStepIndex === 0}
            variant="outlined"
            size="sm"
          >
            <Icons.ChevronLeft
              size={20}
              color={currentStepIndex === 0 ? DS.grey400 : DS.indigo}
            />
          </SBtn>
          {config.showPlayPause && (
            <SBtn
              id="play"
              onClick={() => setIsPlaying(!isPlaying)}
              variant="contained"
              size="lg"
            >
              {isPlaying ? (
                <Icons.Pause size={22} color={DS.white} />
              ) : (
                <Icons.Play size={22} color={DS.white} />
              )}
            </SBtn>
          )}
          <SBtn
            id="next"
            onClick={goNext}
            disabled={currentStepIndex === availableSteps.length - 1}
            variant="outlined"
            size="sm"
          >
            <Icons.ChevronRight
              size={20}
              color={
                currentStepIndex === availableSteps.length - 1
                  ? DS.grey400
                  : DS.indigo
              }
            />
          </SBtn>
          <SBtn id="reset" onClick={reset} variant="outlined" size="sm">
            <Icons.RotateCcw size={16} color={DS.indigo} />
          </SBtn>
        </div>
      )}

      {/* ═══ INSTRUCTIONS (lavender) ═══ */}
      <div
        style={{
          margin: "0 24px 20px",
          background: DS.lavenderLight,
          borderRadius: DS.radiusSmall,
          padding: "12px 16px",
          borderLeft: `4px solid ${DS.indigo}`,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: DS.indigo,
            marginBottom: 4,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Icons.Eye size={14} color={DS.indigo} /> Instructions for You
        </div>
        <div
          style={{
            fontSize: 12,
            color: DS.grey900,
            lineHeight: 1.6,
            fontWeight: 400,
          }}
        >
          Watch how two separate bar graphs transform into one powerful double
          bar graph. At each step, look at how the paired bars make comparison
          easier. Try to spot: which month has the biggest price difference? In
          how many months is Yahapur more expensive?
        </div>
      </div>
    </div>
  );
};

export default DoubleBarGraphTool;
