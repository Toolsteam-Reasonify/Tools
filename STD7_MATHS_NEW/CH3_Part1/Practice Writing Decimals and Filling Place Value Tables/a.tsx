// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: decimal_place_value_tool.tsx
// ═══════════════════════════════════════════════════════════════════════════════

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Check, X, RotateCcw, BookOpen, Zap, Star } from "lucide-react";

// ==================== TYPE DEFINITIONS ====================

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
  type: "intro" | "explanation" | "practice" | "real_world" | "hands_on";
  mode: ModeType;
  data?: any;
}

interface BaseDataInterface {
  themeColor?: string;
  autoPlayDuration?: number;
}

interface PlaceValueAnswer {
  hundreds: string;
  tens: string;
  units: string;
  tenths: string;
  hundredths: string;
  thousandths: string;
}

interface PlaceValueRow {
  id: string;
  label: string;
  description: string;
  answer: PlaceValueAnswer;
  isWorkedExample: boolean;
  explanation?: string;
  hasOverflow?: boolean;
  overflowFrom?: string;
}

interface PlaceValueAdditionalProps {
  rows?: PlaceValueRow[];
  showOverflowAnimation?: boolean;
  overflowRowId?: string;
  title?: string;
  subtitle?: string;
}

interface DecimalPlaceValueToolProps {
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
    additionalProps?: PlaceValueAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== DEFAULT DATA ====================

const DEFAULT_ROWS: PlaceValueRow[] = [
  {
    id: "a",
    label: "(a)",
    description: "2 ones, 3 tenths and 5 hundredths",
    answer: {
      hundreds: "",
      tens: "",
      units: "2",
      tenths: "3",
      hundredths: "5",
      thousandths: "",
    },
    isWorkedExample: true,
    explanation: "2.35 → 2 in Units, 3 in Tenths, 5 in Hundredths",
  },
  {
    id: "b",
    label: "(b)",
    description: "1 ten and 5 tenths",
    answer: {
      hundreds: "",
      tens: "1",
      units: "0",
      tenths: "5",
      hundredths: "",
      thousandths: "",
    },
    isWorkedExample: true,
    explanation: "10.5 → 1 in Tens, 0 in Units, 5 in Tenths",
  },
  {
    id: "c",
    label: "(c)",
    description: "4 ones and 6 hundredths",
    answer: {
      hundreds: "",
      tens: "",
      units: "4",
      tenths: "0",
      hundredths: "6",
      thousandths: "",
    },
    isWorkedExample: false,
    explanation: "4.06 → 4 in Units, 0 in Tenths, 6 in Hundredths",
  },
  {
    id: "d",
    label: "(d)",
    description: "1 hundred, 1 one and 1 hundredth",
    answer: {
      hundreds: "1",
      tens: "0",
      units: "1",
      tenths: "0",
      hundredths: "1",
      thousandths: "",
    },
    isWorkedExample: false,
    explanation:
      "101.01 → 1 in Hundreds, 0 in Tens, 1 in Units, 0 in Tenths, 1 in Hundredths",
  },
  {
    id: "e",
    label: "(e)",
    description: "8/100 and 9/10",
    answer: {
      hundreds: "",
      tens: "",
      units: "0",
      tenths: "9",
      hundredths: "8",
      thousandths: "",
    },
    isWorkedExample: false,
    explanation: "0.98 → 9/10 = 9 Tenths, 8/100 = 8 Hundredths",
  },
  {
    id: "f",
    label: "(f)",
    description: "5/100",
    answer: {
      hundreds: "",
      tens: "",
      units: "0",
      tenths: "0",
      hundredths: "5",
      thousandths: "",
    },
    isWorkedExample: false,
    explanation: "0.05 → 0 in Units, 0 in Tenths, 5 in Hundredths",
  },
  {
    id: "g",
    label: "(g)",
    description: "234 hundredths",
    answer: {
      hundreds: "",
      tens: "",
      units: "2",
      tenths: "3",
      hundredths: "4",
      thousandths: "",
    },
    isWorkedExample: false,
    explanation:
      "234 hundredths = 234/100 = 2.34 → 2 in Units, 3 in Tenths, 4 in Hundredths",
    hasOverflow: true,
    overflowFrom:
      "234 in Hundredths → carry 23 Tenths, keep 4 Hundredths → carry 2 Units, keep 3 Tenths",
  },
  {
    id: "h",
    label: "(h)",
    description: "105 tenths",
    answer: {
      hundreds: "",
      tens: "1",
      units: "0",
      tenths: "5",
      hundredths: "",
      thousandths: "",
    },
    isWorkedExample: false,
    explanation:
      "105 tenths = 105/10 = 10.5 → 1 in Tens, 0 in Units, 5 in Tenths",
    hasOverflow: true,
    overflowFrom:
      "105 in Tenths → carry 10 Units, keep 5 Tenths → carry 1 Ten, keep 0 Units",
  },
];

// ==================== CONSTANTS ====================

const COLUMNS = [
  "hundreds",
  "tens",
  "units",
  "tenths",
  "hundredths",
  "thousandths",
] as const;
type ColumnKey = (typeof COLUMNS)[number];

const COLUMN_HEADERS: {
  key: ColumnKey;
  label: string;
  color: string;
  multiplier: string;
}[] = [
  {
    key: "hundreds",
    label: "Hundreds",
    color: "#7c3aed",
    multiplier: "\u00d7100",
  },
  { key: "tens", label: "Tens", color: "#6366f1", multiplier: "\u00d710" },
  { key: "units", label: "Units", color: "#2563eb", multiplier: "\u00d71" },
  {
    key: "tenths",
    label: "Tenths",
    color: "#0891b2",
    multiplier: "\u00d71/10",
  },
  {
    key: "hundredths",
    label: "Hundredths",
    color: "#059669",
    multiplier: "\u00d71/100",
  },
  {
    key: "thousandths",
    label: "Thousandths",
    color: "#16a34a",
    multiplier: "\u00d71/1000",
  },
];

const OVERFLOW_STEPS = [
  {
    step: 0,
    text: "Start: 234 in Hundredths column",
    emoji: "\uD83D\uDCE5",
    detail: "234/100",
  },
  {
    step: 1,
    text: "234 \u00f7 10 = 23 remainder 4",
    emoji: "\u27A1\uFE0F",
    detail: "Keep 4 in Hundredths",
  },
  {
    step: 2,
    text: "Carry 23 to Tenths column",
    emoji: "\u2B06\uFE0F",
    detail: "23 Tenths",
  },
  {
    step: 3,
    text: "23 \u00f7 10 = 2 remainder 3",
    emoji: "\u27A1\uFE0F",
    detail: "Keep 3 in Tenths",
  },
  {
    step: 4,
    text: "Carry 2 to Units column",
    emoji: "\u2B06\uFE0F",
    detail: "2 Units",
  },
  {
    step: 5,
    text: "Result: 2.34",
    emoji: "\u2705",
    detail: "Units=2, Tenths=3, Hundredths=4",
  },
];

// ==================== KEYFRAMES CSS ====================

const KEYFRAMES_CSS = `
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes popIn {
    0% { transform: scale(0); opacity: 0; }
    70% { transform: scale(1.15); }
    100% { transform: scale(1); opacity: 1; }
}
@keyframes slideInRight {
    from { opacity: 0; transform: translateX(50px); }
    to { opacity: 1; transform: translateX(0); }
}
@keyframes correctPop {
    0% { transform: scale(1); background-color: #dcfce7; }
    50% { transform: scale(1.15); background-color: #86efac; }
    100% { transform: scale(1); background-color: #dcfce7; }
}
@keyframes incorrectShake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
}
@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
}
@keyframes overflowGlow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
    50% { box-shadow: 0 0 20px 5px rgba(245, 158, 11, 0.4); }
}
@keyframes starBurst {
    0% { transform: scale(0) rotate(0deg); opacity: 0; }
    50% { transform: scale(1.3) rotate(180deg); opacity: 1; }
    100% { transform: scale(1) rotate(360deg); opacity: 1; }
}
@keyframes decimalDot {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.5); box-shadow: 0 0 10px rgba(37, 99, 235, 0.5); }
}
@keyframes digitFlow {
    0% { opacity: 0; transform: scale(2) translateY(-20px); }
    60% { opacity: 1; transform: scale(1.1) translateY(0); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
}
`;

// ==================== HELPERS ====================

function computeDecimalString(input: Record<string, string>): string {
  const h = input.hundreds || "";
  const t = input.tens || "";
  const u = input.units || "0";
  const th = input.tenths || "";
  const hh = input.hundredths || "";
  const thh = input.thousandths || "";
  const whole = `${h}${t}${u}`.replace(/^0+(?=\d)/, "") || "0";
  const frac = `${th}${hh}${thh}`.replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : whole;
}

function isRowAllCorrect(
  rowAnswer: PlaceValueAnswer,
  rowValidation: Record<string, string> | undefined,
): boolean {
  if (!rowValidation) return false;
  return COLUMNS.every((col) => {
    const expected = rowAnswer[col];
    if (expected === "" || expected === undefined) return true;
    return rowValidation[col] === "correct";
  });
}

// ==================== MAIN COMPONENT ====================

const DecimalPlaceValueTool: React.FC<DecimalPlaceValueToolProps> = ({
  props = {},
}) => {
  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 600,
      themeColor: props.themeColor ?? "#2563eb",
    }),
    [props.width, props.height, props.themeColor],
  );

  const additionalProps = props.additionalProps || {};
  const rows: PlaceValueRow[] = additionalProps.rows || DEFAULT_ROWS;
  const title =
    additionalProps.title || "Practice: Decimal Form and Place Value Tables";
  const subtitle =
    additionalProps.subtitle ||
    "For each description, type each digit into the correct place value column.";

  // ─── STATE ──────────────────────────────────────────────
  const [userInputs, setUserInputs] = useState<
    Record<string, Record<string, string>>
  >({});
  const [validations, setValidations] = useState<
    Record<string, Record<string, string>>
  >({});
  const [checkedRows, setCheckedRows] = useState<Set<string>>(new Set());
  const [showOverflow, setShowOverflow] = useState(false);
  const [overflowStep, setOverflowStep] = useState(0);
  const [activeRow, setActiveRow] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [focusedCell, setFocusedCell] = useState<string | null>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const overflowTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // ─── INITIALIZE ─────────────────────────────────────────
  useEffect(() => {
    const initial: Record<string, Record<string, string>> = {};
    rows.forEach((row) => {
      if (row.isWorkedExample) {
        initial[row.id] = { ...row.answer };
      } else {
        initial[row.id] = {
          hundreds: "",
          tens: "",
          units: "",
          tenths: "",
          hundredths: "",
          thousandths: "",
        };
      }
    });
    setUserInputs(initial);
    const timer = setTimeout(() => setAnimateIn(true), 100);
    return () => clearTimeout(timer);
  }, [rows]);

  // ─── INJECT KEYFRAMES ───────────────────────────────────
  useEffect(() => {
    const id = "placevalue-keyframes";
    if (document.getElementById(id)) return;
    const styleSheet = document.createElement("style");
    styleSheet.id = id;
    styleSheet.textContent = KEYFRAMES_CSS;
    document.head.appendChild(styleSheet);
    return () => {
      const existing = document.getElementById(id);
      if (existing) document.head.removeChild(existing);
    };
  }, []);

  // ─── CLEANUP OVERFLOW TIMERS ────────────────────────────
  useEffect(() => {
    return () => {
      overflowTimers.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  // ─── HANDLERS ───────────────────────────────────────────
  const handleInput = useCallback(
    (rowId: string, column: ColumnKey, value: string) => {
      const row = rows.find((r) => r.id === rowId);
      if (!row || row.isWorkedExample) return;

      const sanitized = value.replace(/[^0-9]/g, "").slice(0, 1);

      setUserInputs((prev) => ({
        ...prev,
        [rowId]: { ...(prev[rowId] || {}), [column]: sanitized },
      }));

      setValidations((prev) => {
        if (!prev[rowId]) return prev;
        return { ...prev, [rowId]: { ...prev[rowId], [column]: "empty" } };
      });

      if (sanitized.length === 1) {
        const colIdx = COLUMNS.indexOf(column);
        for (let i = colIdx + 1; i < COLUMNS.length; i++) {
          const nextCol = COLUMNS[i];
          if (row.answer[nextCol] !== "") {
            const key = `${rowId}-${nextCol}`;
            setTimeout(() => {
              const el = inputRefs.current[key];
              if (el) el.focus();
            }, 50);
            break;
          }
        }
      }
    },
    [rows],
  );

  const checkRow = useCallback(
    (rowId: string) => {
      const row = rows.find((r) => r.id === rowId);
      if (!row || row.isWorkedExample) return;

      const input = userInputs[rowId] || {};
      const validation: Record<string, string> = {};
      let allCorrect = true;
      let hasInput = false;

      COLUMNS.forEach((col) => {
        const expected = row.answer[col];
        const actual = input[col] || "";
        if (expected === "" || expected === undefined) {
          validation[col] = "empty";
        } else if (actual === expected) {
          validation[col] = "correct";
          hasInput = true;
        } else if (actual === "") {
          validation[col] = "empty";
          allCorrect = false;
        } else {
          validation[col] = "incorrect";
          allCorrect = false;
          hasInput = true;
        }
      });

      setValidations((prev) => ({ ...prev, [rowId]: validation }));
      setCheckedRows((prev) => {
        const next = new Set(prev);
        next.add(rowId);
        return next;
      });

      if (allCorrect && hasInput) {
        const allPracticeDone = rows
          .filter((r) => !r.isWorkedExample)
          .every((r) => {
            if (r.id === rowId) {
              return COLUMNS.every((col) => {
                const exp = r.answer[col];
                if (exp === "" || exp === undefined) return true;
                return validation[col] === "correct";
              });
            }
            return isRowAllCorrect(r.answer, validations[r.id]);
          });
        if (allPracticeDone) {
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 4000);
        }
      }
    },
    [rows, userInputs, validations],
  );

  const checkAll = useCallback(() => {
    rows.filter((r) => !r.isWorkedExample).forEach((r) => checkRow(r.id));
  }, [rows, checkRow]);

  const resetAll = useCallback(() => {
    const initial: Record<string, Record<string, string>> = {};
    rows.forEach((row) => {
      if (row.isWorkedExample) {
        initial[row.id] = { ...row.answer };
      } else {
        initial[row.id] = {
          hundreds: "",
          tens: "",
          units: "",
          tenths: "",
          hundredths: "",
          thousandths: "",
        };
      }
    });
    setUserInputs(initial);
    setValidations({});
    setCheckedRows(new Set());
    setShowCelebration(false);
    setShowOverflow(false);
    setOverflowStep(0);
  }, [rows]);

  const startOverflowAnimation = useCallback(() => {
    overflowTimers.current.forEach((t) => clearTimeout(t));
    overflowTimers.current = [];
    setShowOverflow(true);
    setOverflowStep(0);
    [0, 1, 2, 3, 4, 5].forEach((step, i) => {
      const timer = setTimeout(() => setOverflowStep(step), i * 1200);
      overflowTimers.current.push(timer);
    });
  }, []);

  // ─── COMPUTED VALUES ────────────────────────────────────
  const practiceRows = useMemo(
    () => rows.filter((r) => !r.isWorkedExample),
    [rows],
  );
  const correctCount = useMemo(
    () =>
      practiceRows.filter((r) => isRowAllCorrect(r.answer, validations[r.id]))
        .length,
    [practiceRows, validations],
  );

  // ─── CELL STYLE HELPERS ─────────────────────────────────
  const getCellBg = useCallback(
    (rowId: string, col: ColumnKey): string => {
      const v = validations[rowId]?.[col];
      if (v === "correct") return "#dcfce7";
      if (v === "incorrect") return "#fee2e2";
      if (focusedCell === `${rowId}-${col}`) return "#eff6ff";
      return "#fff";
    },
    [validations, focusedCell],
  );

  const getCellBorder = useCallback(
    (rowId: string, col: ColumnKey): string => {
      const v = validations[rowId]?.[col];
      if (v === "correct") return "2px solid #22c55e";
      if (v === "incorrect") return "2px solid #ef4444";
      if (focusedCell === `${rowId}-${col}`) return "2px solid #2563eb";
      return "2px solid #e2e8f0";
    },
    [validations, focusedCell],
  );

  const getCellAnimation = useCallback(
    (rowId: string, col: ColumnKey): string => {
      const v = validations[rowId]?.[col];
      if (v === "correct") return "correctPop 0.5s ease-out";
      if (v === "incorrect") return "incorrectShake 0.5s ease-out";
      return "none";
    },
    [validations],
  );

  // ─── RENDER ─────────────────────────────────────────────
  return (
    <div
      style={{
        width: config.width,
        maxWidth: "100%",
        minHeight: config.height,
        fontFamily: "'Nunito', 'Segoe UI', sans-serif",
        background:
          "linear-gradient(145deg, #f0f4ff 0%, #e8f0fe 30%, #fdf4ff 70%, #f0f4ff 100%)",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 20px 60px -15px rgba(0,0,0,0.15)",
        position: "relative" as const,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: `linear-gradient(135deg, ${config.themeColor} 0%, #7c3aed 100%)`,
          padding: "20px 28px",
          color: "#fff",
          position: "relative" as const,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute" as const,
            top: -30,
            right: -30,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
          }}
        />
        <div
          style={{
            position: "absolute" as const,
            bottom: -20,
            left: "40%",
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />
        <h1
          style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: "-0.3px",
            animation: animateIn ? "fadeInUp 0.6s ease-out" : "none",
            textShadow: "0 2px 10px rgba(0,0,0,0.15)",
          }}
        >
          {title}
        </h1>
        <p
          style={{
            margin: "6px 0 0",
            fontSize: 13,
            opacity: 0.9,
            fontWeight: 500,
            animation: animateIn ? "fadeInUp 0.6s ease-out 0.15s both" : "none",
          }}
        >
          {subtitle}
        </p>
        <div
          style={{
            position: "absolute" as const,
            top: 16,
            right: 24,
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(255,255,255,0.2)",
            borderRadius: 30,
            padding: "6px 14px",
            backdropFilter: "blur(10px)",
            animation: animateIn ? "popIn 0.5s ease-out 0.3s both" : "none",
          }}
        >
          <Star size={16} fill="#fbbf24" color="#fbbf24" />
          <span style={{ fontSize: 14, fontWeight: 700 }}>
            {correctCount}/{practiceRows.length}
          </span>
        </div>
      </div>

      {/* TEACHING NOTE */}
      <div
        style={{
          margin: "12px 20px 6px",
          padding: "10px 16px",
          background: "linear-gradient(90deg, #fffbeb, #fef3c7)",
          borderRadius: 12,
          border: "1px solid #fde68a",
          fontSize: 12,
          color: "#92400e",
          display: "flex",
          alignItems: "center",
          gap: 8,
          animation: animateIn
            ? "slideInRight 0.5s ease-out 0.2s both"
            : "none",
        }}
      >
        <BookOpen size={16} color="#f59e0b" style={{ flexShrink: 0 }} />
        <span>
          <strong>Teaching Note:</strong> Items (a)-(b) are worked examples.
          Items (c)-(h) are for independent practice. Items (g)-(h) involve
          overflow/carry.
        </span>
      </div>

      {/* ACTION BUTTONS */}
      <div
        style={{
          padding: "4px 20px 0",
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap" as const,
        }}
      >
        <button
          onClick={startOverflowAnimation}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.04)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          style={{
            padding: "7px 14px",
            borderRadius: 10,
            border: "2px solid #f59e0b",
            background: showOverflow ? "#fffbeb" : "#fff",
            color: "#b45309",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "all 0.3s ease",
            boxShadow: showOverflow ? "0 0 15px rgba(245,158,11,0.3)" : "none",
          }}
        >
          <Zap size={14} /> Show Overflow Animation (234 hundredths)
        </button>
        <button
          onClick={checkAll}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.04)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          style={{
            padding: "7px 14px",
            borderRadius: 10,
            border: "none",
            background: `linear-gradient(135deg, ${config.themeColor}, #7c3aed)`,
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "all 0.3s ease",
          }}
        >
          <Check size={14} /> Check All
        </button>
        <button
          onClick={resetAll}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.04)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          style={{
            padding: "7px 14px",
            borderRadius: 10,
            border: "2px solid #e2e8f0",
            background: "#fff",
            color: "#64748b",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "all 0.3s ease",
          }}
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* OVERFLOW ANIMATION PANEL */}
      {showOverflow && (
        <div
          style={{
            margin: "10px 20px",
            padding: 16,
            background: "linear-gradient(135deg, #fffbeb 0%, #fef9c3 100%)",
            borderRadius: 16,
            border: "2px solid #fde68a",
            animation: "fadeInUp 0.4s ease-out",
            position: "relative" as const,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute" as const, top: 8, right: 12 }}>
            <button
              onClick={() => setShowOverflow(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#92400e",
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              {"\u00d7"}
            </button>
          </div>
          <h3
            style={{
              margin: "0 0 12px",
              fontSize: 15,
              color: "#92400e",
              fontWeight: 800,
            }}
          >
            {"\uD83D\uDD04"} How 234 Hundredths Overflows to 2.34
          </h3>
          <div
            style={{
              display: "flex",
              gap: 16,
              alignItems: "flex-start",
              flexWrap: "wrap" as const,
            }}
          >
            {OVERFLOW_STEPS.map((s, i) => (
              <div
                key={i}
                style={{
                  padding: "8px 12px",
                  borderRadius: 10,
                  background:
                    overflowStep >= s.step
                      ? overflowStep === s.step
                        ? "#fbbf24"
                        : "#fef3c7"
                      : "#fff",
                  border: `2px solid ${overflowStep >= s.step ? "#f59e0b" : "#fde68a"}`,
                  minWidth: 100,
                  flex: "1 1 140px",
                  transition: "all 0.5s ease",
                  animation:
                    overflowStep === s.step
                      ? "overflowGlow 1s ease-in-out"
                      : "none",
                  transform:
                    overflowStep === s.step ? "scale(1.05)" : "scale(1)",
                }}
              >
                <div style={{ fontSize: 18 }}>{s.emoji}</div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#92400e",
                    marginTop: 4,
                  }}
                >
                  {s.text}
                </div>
                <div style={{ fontSize: 10, color: "#b45309", marginTop: 2 }}>
                  {s.detail}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 12,
              display: "flex",
              justifyContent: "center",
              gap: 4,
              alignItems: "center",
            }}
          >
            {["Units", "dot", "Tenths", "Hundredths"].map((label, i) => (
              <div key={i} style={{ textAlign: "center" as const }}>
                {label === "dot" ? (
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "#1e293b",
                      margin: "0 2px",
                      animation:
                        overflowStep >= 5
                          ? "decimalDot 1s ease-in-out infinite"
                          : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 22,
                    }}
                  >
                    <span
                      style={{ color: "#fff", fontSize: 12, fontWeight: 900 }}
                    >
                      .
                    </span>
                  </div>
                ) : (
                  <React.Fragment>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#64748b",
                        marginBottom: 4,
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        border: "2px solid #f59e0b",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22,
                        fontWeight: 800,
                        color: "#1e293b",
                        background: "#fff",
                        animation:
                          overflowStep >= 5
                            ? "digitFlow 0.6s ease-out"
                            : "none",
                        transition: "all 0.4s ease",
                      }}
                    >
                      {label === "Hundredths" && overflowStep >= 1 ? "4" : ""}
                      {label === "Tenths" && overflowStep >= 3 ? "3" : ""}
                      {label === "Units" && overflowStep >= 5 ? "2" : ""}
                    </div>
                  </React.Fragment>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TABLE */}
      <div style={{ padding: "8px 20px 20px", overflowX: "auto" as const }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "separate" as const,
            borderSpacing: 0,
            background: "#fff",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            animation: animateIn ? "fadeInUp 0.6s ease-out 0.3s both" : "none",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  padding: "10px 8px",
                  fontSize: 11,
                  fontWeight: 800,
                  color: "#64748b",
                  background: "#f8fafc",
                  borderBottom: "2px solid #e2e8f0",
                  textAlign: "left" as const,
                  minWidth: 140,
                  position: "sticky" as const,
                  left: 0,
                  zIndex: 2,
                }}
              >
                Description
              </th>
              {COLUMN_HEADERS.map((col, idx) => (
                <th
                  key={col.key}
                  onMouseEnter={() => setHoveredColumn(col.key)}
                  onMouseLeave={() => setHoveredColumn(null)}
                  style={{
                    padding: "10px 6px",
                    fontSize: 10,
                    fontWeight: 800,
                    color: "#fff",
                    background: col.color,
                    borderBottom: "2px solid #e2e8f0",
                    textAlign: "center" as const,
                    minWidth: 52,
                    transition: "all 0.3s ease",
                    transform:
                      hoveredColumn === col.key ? "scale(1.05)" : "scale(1)",
                    position: "relative" as const,
                    animation: animateIn
                      ? `popIn 0.4s ease-out ${0.1 * idx}s both`
                      : "none",
                    borderRight: idx === 2 ? "4px solid #1e293b" : undefined,
                  }}
                >
                  {col.label}
                  <div
                    style={{
                      fontSize: 8,
                      fontWeight: 600,
                      opacity: 0.8,
                      marginTop: 2,
                    }}
                  >
                    {col.multiplier}
                  </div>
                </th>
              ))}
              <th
                style={{
                  padding: "10px 6px",
                  fontSize: 10,
                  fontWeight: 800,
                  color: "#64748b",
                  background: "#f8fafc",
                  borderBottom: "2px solid #e2e8f0",
                  textAlign: "center" as const,
                  minWidth: 60,
                }}
              >
                Decimal
              </th>
              <th
                style={{
                  padding: "10px 6px",
                  fontSize: 10,
                  fontWeight: 800,
                  color: "#64748b",
                  background: "#f8fafc",
                  borderBottom: "2px solid #e2e8f0",
                  textAlign: "center" as const,
                  minWidth: 50,
                }}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => {
              const isChecked = checkedRows.has(row.id);
              const rowCorrect =
                isChecked && isRowAllCorrect(row.answer, validations[row.id]);
              const input = userInputs[row.id] || {};
              const decStr = computeDecimalString(input);

              return (
                <tr
                  key={row.id}
                  onMouseEnter={() => setActiveRow(row.id)}
                  onMouseLeave={() => setActiveRow(null)}
                  style={{
                    background: row.isWorkedExample
                      ? "linear-gradient(90deg, #f0f9ff, #eff6ff)"
                      : activeRow === row.id
                        ? "rgba(37,99,235,0.03)"
                        : "#fff",
                    transition: "all 0.3s ease",
                    animation: animateIn
                      ? `fadeInUp 0.5s ease-out ${0.08 * rowIdx + 0.4}s both`
                      : "none",
                  }}
                >
                  <td
                    style={{
                      padding: "8px 10px",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#334155",
                      borderBottom: "1px solid #f1f5f9",
                      position: "sticky" as const,
                      left: 0,
                      background: row.isWorkedExample ? "#f0f9ff" : "#fff",
                      zIndex: 1,
                      maxWidth: 180,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 6,
                      }}
                    >
                      <span
                        style={{
                          background: row.isWorkedExample
                            ? "#dbeafe"
                            : rowCorrect
                              ? "#dcfce7"
                              : row.hasOverflow
                                ? "#fef3c7"
                                : "#f1f5f9",
                          color: row.isWorkedExample
                            ? "#2563eb"
                            : rowCorrect
                              ? "#16a34a"
                              : row.hasOverflow
                                ? "#b45309"
                                : "#64748b",
                          padding: "2px 6px",
                          borderRadius: 6,
                          fontSize: 10,
                          fontWeight: 800,
                          flexShrink: 0,
                        }}
                      >
                        {row.label}
                      </span>
                      <span style={{ lineHeight: 1.4 }}>
                        {row.description}
                        {row.isWorkedExample && (
                          <span
                            style={{
                              display: "inline-block",
                              marginLeft: 6,
                              background: "#dbeafe",
                              color: "#2563eb",
                              padding: "1px 6px",
                              borderRadius: 4,
                              fontSize: 9,
                              fontWeight: 700,
                            }}
                          >
                            EXAMPLE
                          </span>
                        )}
                        {row.hasOverflow && (
                          <span
                            style={{
                              display: "inline-block",
                              marginLeft: 4,
                              background: "#fef3c7",
                              color: "#b45309",
                              padding: "1px 6px",
                              borderRadius: 4,
                              fontSize: 9,
                              fontWeight: 700,
                            }}
                          >
                            OVERFLOW
                          </span>
                        )}
                      </span>
                    </div>
                  </td>

                  {COLUMNS.map((col, colIdx) => {
                    const expected = row.answer[col];
                    const hasValue = expected !== "" && expected !== undefined;
                    const cellKey = `${row.id}-${col}`;
                    const val = (userInputs[row.id] || {})[col] || "";

                    return (
                      <td
                        key={col}
                        style={{
                          padding: "4px 3px",
                          textAlign: "center" as const,
                          borderBottom: "1px solid #f1f5f9",
                          borderRight:
                            colIdx === 2 ? "4px solid #1e293b" : undefined,
                        }}
                      >
                        {hasValue ? (
                          <input
                            ref={(el) => {
                              inputRefs.current[cellKey] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={val}
                            readOnly={row.isWorkedExample}
                            onChange={(e) =>
                              handleInput(row.id, col, e.target.value)
                            }
                            onFocus={() => setFocusedCell(cellKey)}
                            onBlur={() => setFocusedCell(null)}
                            style={{
                              width: 36,
                              height: 36,
                              textAlign: "center" as const,
                              fontSize: 18,
                              fontWeight: 800,
                              borderRadius: 8,
                              border: getCellBorder(row.id, col),
                              background: row.isWorkedExample
                                ? "#e0f2fe"
                                : getCellBg(row.id, col),
                              color: row.isWorkedExample
                                ? "#2563eb"
                                : "#1e293b",
                              outline: "none",
                              transition: "all 0.3s ease",
                              animation: getCellAnimation(row.id, col),
                              cursor: row.isWorkedExample ? "default" : "text",
                              fontFamily: "'Courier New', monospace",
                              boxShadow:
                                focusedCell === cellKey
                                  ? "0 0 0 3px rgba(37,99,235,0.2)"
                                  : "none",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 8,
                              background: "#f8fafc",
                              border: "2px dashed #e2e8f0",
                              margin: "0 auto",
                            }}
                          />
                        )}
                      </td>
                    );
                  })}

                  <td
                    style={{
                      padding: "4px 6px",
                      textAlign: "center" as const,
                      borderBottom: "1px solid #f1f5f9",
                      fontSize: 14,
                      fontWeight: 800,
                      fontFamily: "'Courier New', monospace",
                      color: rowCorrect ? "#16a34a" : "#2563eb",
                    }}
                  >
                    {row.isWorkedExample || isChecked ? decStr : "\u2014"}
                  </td>

                  <td
                    style={{
                      padding: "4px 6px",
                      textAlign: "center" as const,
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    {row.isWorkedExample ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 3,
                          color: "#2563eb",
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                      >
                        <BookOpen size={12} /> Worked
                      </div>
                    ) : rowCorrect ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 3,
                          color: "#16a34a",
                          fontSize: 10,
                          fontWeight: 700,
                          animation: "bounce 0.6s ease-in-out",
                        }}
                      >
                        <Check size={14} color="#16a34a" /> {"\u2713"}
                      </div>
                    ) : (
                      <button
                        onClick={() => checkRow(row.id)}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = "scale(1.1)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 6,
                          border: "none",
                          background: config.themeColor,
                          color: "#fff",
                          fontSize: 10,
                          fontWeight: 700,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        Check
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* EXPLANATION PANEL */}
        {rows.some((r) => checkedRows.has(r.id) && !r.isWorkedExample) && (
          <div
            style={{
              marginTop: 12,
              padding: 14,
              background: "#f8fafc",
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              animation: "fadeInUp 0.4s ease-out",
            }}
          >
            <h4
              style={{
                margin: "0 0 8px",
                fontSize: 13,
                fontWeight: 800,
                color: "#334155",
              }}
            >
              {"\uD83D\uDCA1"} Explanations
            </h4>
            {rows
              .filter((r) => checkedRows.has(r.id) && !r.isWorkedExample)
              .map((row) => {
                const isCorrect = isRowAllCorrect(
                  row.answer,
                  validations[row.id],
                );
                return (
                  <div
                    key={row.id}
                    style={{
                      padding: "6px 10px",
                      marginBottom: 4,
                      borderRadius: 8,
                      background: isCorrect ? "#f0fdf4" : "#fef2f2",
                      border: `1px solid ${isCorrect ? "#bbf7d0" : "#fecaca"}`,
                      fontSize: 11,
                      color: isCorrect ? "#166534" : "#991b1b",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {isCorrect ? (
                      <Check size={14} color="#16a34a" />
                    ) : (
                      <X size={14} color="#ef4444" />
                    )}
                    <span>
                      <strong>{row.label}</strong> {row.explanation}
                    </span>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* CELEBRATION OVERLAY */}
      {showCelebration && (
        <div
          style={{
            position: "absolute" as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(4px)",
            zIndex: 100,
            animation: "fadeInUp 0.4s ease-out",
          }}
        >
          <div
            style={{
              textAlign: "center" as const,
              animation: "popIn 0.6s ease-out",
            }}
          >
            <div
              style={{
                fontSize: 60,
                animation: "bounce 1s ease-in-out infinite",
              }}
            >
              {"\uD83C\uDF89"}
            </div>
            <h2
              style={{
                fontSize: 28,
                fontWeight: 900,
                background: `linear-gradient(135deg, ${config.themeColor}, #7c3aed, #ec4899)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                margin: "10px 0",
              }}
            >
              All Correct!
            </h2>
            <p style={{ color: "#64748b", fontSize: 14, fontWeight: 600 }}>
              You have mastered decimal place values!
            </p>
            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "center",
                marginTop: 12,
              }}
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <Star
                  key={i}
                  size={24}
                  fill="#fbbf24"
                  color="#fbbf24"
                  style={{
                    animation: `starBurst 0.5s ease-out ${0.1 * i}s both`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div
        style={{
          padding: "8px 20px 14px",
          textAlign: "center" as const,
          fontSize: 10,
          color: "#94a3b8",
          fontWeight: 600,
        }}
      >
        Ganita Prakash | Grade 7 | Chapter 3 {"\u2014"} A Peek Beyond the Point
      </div>
    </div>
  );
};

export default DecimalPlaceValueTool;

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════════
