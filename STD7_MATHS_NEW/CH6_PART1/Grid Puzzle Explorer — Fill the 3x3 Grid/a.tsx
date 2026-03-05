// @ts-nocheck
// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: grid_puzzle_explorer.tsx
// ═══════════════════════════════════════════════════════════════════════════

// @ts-ignore - React module is provided by the host environment
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
// @ts-ignore - Icon library resolved at runtime
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Check,
  X,
  BookOpen,
  Target,
  Zap,
  Star,
  Award,
  Lightbulb,
  Eye,
  EyeOff,
  HelpCircle,
  Plus,
  Sparkles,
} from "lucide-react";

// ==================== TYPE DEFINITIONS ====================

type ModeType = "learn" | "practice";

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
  type: "intro" | "explanation" | "practice";
  mode: ModeType;
  data?: any;
}

interface BaseDataInterface {
  themeColor?: string;
  autoPlayDuration?: number;
}

interface PuzzleData {
  grid: (number | null)[][];
  rowSums: number[];
  colSums: number[];
}

interface GridPuzzleAdditionalProps {
  puzzles?: PuzzleData[];
  guidedPuzzle?: PuzzleData;
  showStepNumbers?: boolean;
  enableHints?: boolean;
  difficulty?: "easy" | "medium" | "hard";
}

interface GridPuzzleExplorerProps {
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
    additionalProps?: GridPuzzleAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== SINGULARITY DESIGN SYSTEM TOKENS ====================

const DS = {
  // Primary
  purple: "#4A4DC9",
  purpleDark: "#533086",
  purpleLight: "#C1C1EA",
  purpleBg: "#EEEDF7",
  purpleGhost: "#F4F3FB",

  // Accent
  orange: "#FF7212",
  orangeSecondary: "#FC9145",
  orangeLight: "#FFF3E4",
  orangeBg: "#FFF9F2",

  // Greyscale
  dark: "#4E4E4E",
  grey: "#CACACA",
  greyLight: "#EBEBEB",
  greyBg: "#F5F5F5",
  white: "#FFFFFF",
  black: "#1A1A2E",

  // Semantic
  green: "#2ECC71",
  greenDark: "#1FA855",
  greenLight: "#E8F8EF",
  red: "#E74C3C",
  redLight: "#FDECEB",
  gold: "#F0A500",
  goldLight: "#FDF5E0",

  // Font
  fontFamily: "'Poppins', sans-serif",

  // Radii
  radiusPill: 40,
  radiusLg: 20,
  radiusMd: 14,
  radiusSm: 10,
  radiusXs: 8,

  // Shadows
  shadowSm: "0 2px 8px rgba(74,77,201,0.08)",
  shadowMd: "0 4px 20px rgba(74,77,201,0.12)",
  shadowLg: "0 8px 40px rgba(74,77,201,0.15)",
  shadowOrange: "0 4px 16px rgba(255,114,18,0.25)",
  shadowPurple: "0 4px 16px rgba(74,77,201,0.25)",

  // Button height
  btnHeight: 40,
  btnPadX: 24,
  btnIconGap: 4,
};

// ==================== PUZZLE DATA ====================

const GUIDED_PUZZLE: PuzzleData = {
  grid: [
    [4, 7, 5],
    [6, 1, 2],
    [3, 9, 8],
  ],
  rowSums: [16, 9, 20],
  colSums: [13, 17, 15],
};

function generateRandomPuzzle(): PuzzleData {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  const grid: number[][] = [
    [nums[0], nums[1], nums[2]],
    [nums[3], nums[4], nums[5]],
    [nums[6], nums[7], nums[8]],
  ];
  return {
    grid,
    rowSums: grid.map((row) => row.reduce((a, b) => a + b, 0)),
    colSums: [0, 1, 2].map((c) => grid.reduce((a, row) => a + row[c], 0)),
  };
}

// ==================== EASING HELPERS ====================

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeOutElastic = (t: number): number => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0
    ? 0
    : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};
const easeOutBounce = (t: number): number => {
  const n1 = 7.5625,
    d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  return n1 * (t -= 2.625 / d1) * t + 0.984375;
};

// ==================== KEYFRAMES ====================

const keyframes = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes popIn {
    0% { transform: scale(0); opacity: 0; }
    60% { transform: scale(1.12); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  @keyframes glowGreen {
    0%, 100% { box-shadow: 0 0 0 0 rgba(46,204,113,0); }
    50% { box-shadow: 0 0 20px 5px rgba(46,204,113,0.35); }
  }
  @keyframes glowRed {
    0%, 100% { box-shadow: 0 0 0 0 rgba(231,76,60,0); }
    50% { box-shadow: 0 0 20px 5px rgba(231,76,60,0.35); }
  }
  @keyframes glowPurple {
    0%, 100% { box-shadow: 0 0 0 0 rgba(74,77,201,0); }
    50% { box-shadow: 0 0 20px 5px rgba(74,77,201,0.3); }
  }
  @keyframes glowOrange {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255,114,18,0); }
    50% { box-shadow: 0 0 20px 5px rgba(255,114,18,0.3); }
  }
  @keyframes cellReveal {
    0% { transform: scale(0) rotateY(90deg); opacity: 0; }
    50% { transform: scale(1.08) rotateY(0deg); }
    100% { transform: scale(1) rotateY(0deg); opacity: 1; }
  }
  @keyframes confettiBurst {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(-100px) rotate(720deg); opacity: 0; }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
  @keyframes ripple {
    0% { transform: scale(0); opacity: 0.5; }
    100% { transform: scale(3.5); opacity: 0; }
  }
  @keyframes floatChip {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
  }
  @keyframes stepDotPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(74,77,201,0.3); }
    50% { box-shadow: 0 0 0 6px rgba(74,77,201,0); }
  }
  @keyframes headerGradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes spinSlow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// ==================== DEFAULT STEPS ====================

const DEFAULT_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "🕵️ The Detective's Challenge",
    description:
      "Welcome, Detective! You have a 3×3 grid and numbers 1–9 to place, each exactly once. The row sums and column sums are your only clues. There are 3,62,880 ways to fill this grid — but only ONE matches all the clues!",
    type: "intro",
    mode: "learn",
  },
  {
    id: 2,
    title: "🔍 Read the Clues",
    description:
      "Look at the target sums along the edges. Row 1 must sum to 16, Row 2 to 9, and Row 3 to 20. Columns must sum to 13, 17, and 15. These are our constraints!",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 3,
    title: "📋 List Valid Triplets for Row 1",
    description:
      "Row 1 must add to 16. Which triplets from {1,2,...,9} sum to 16? Let's list them: {1,6,9}, {2,5,9}, {2,6,8}, {3,4,9}, {3,5,8}, {3,6,7}, {4,5,7}. That's 7 possibilities — much less than 3,62,880!",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 4,
    title: "🎯 Cross-check with Column Sums",
    description:
      "Column 1 must be 13, Column 2 must be 17, Column 3 must be 15. After testing each Row 1 triplet against column constraints, we find Row 1 = {4, 7, 5} works perfectly!",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 5,
    title: "✏️ Fill Row 2 by Elimination",
    description:
      "Remaining numbers: {1, 2, 3, 6, 8, 9}. Row 2 must sum to 9. Valid triplets from remaining: {1,2,6}. Column constraints fix the order: 6, 1, 2.",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 6,
    title: "✅ Complete Row 3 & Verify",
    description:
      "Only {3, 8, 9} remain. Row 3: 3+9+8 = 20 ✓. Columns: 4+6+3 = 13 ✓, 7+1+9 = 17 ✓, 5+2+8 = 15 ✓. Case solved, Detective!",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 10,
    title: "🧩 Your Turn, Detective!",
    description:
      "Solve a new grid puzzle on your own! Select a number chip, then tap a cell to place it. Use the row and column sums as your guide. Green = correct, Red = try again.",
    type: "practice",
    mode: "practice",
  },
];

// ==================== MAIN COMPONENT ====================

const GridPuzzleExplorer: React.FC<GridPuzzleExplorerProps> = (
  componentProps,
) => {
  const { setStepDetails, stopAutoNext, setStopAutoNext } = componentProps;
  const props = (componentProps.props ||
    {}) as GridPuzzleExplorerProps["props"];
  const additionalProps = (props.additionalProps ||
    {}) as GridPuzzleAdditionalProps;
  const width = props.width || 800;
  const height = props.height || 600;
  const showNav = props.showNavigation !== false;
  const showStepInd = props.showStepIndicator !== false;
  const animSpeed = props.animationSpeed || 1;
  const showModeSelector = props.showModeSelector !== false;
  const guidedPuzzle = additionalProps.guidedPuzzle || GUIDED_PUZZLE;
  const enableHints = additionalProps.enableHints !== false;

  // State
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [mode, setMode] = useState<ModeType>(props.initialMode || "learn");
  const [animKey, setAnimKey] = useState(0);
  const [revealedCells, setRevealedCells] = useState<Set<string>>(new Set());
  const [highlightRow, setHighlightRow] = useState<number | null>(null);
  const [highlightCol, setHighlightCol] = useState<number | null>(null);

  // Practice state
  const [practiceGrid, setPracticeGrid] = useState<(number | null)[][]>([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);
  const [practicePuzzle, setPracticePuzzle] = useState<PuzzleData>(() =>
    generateRandomPuzzle(),
  );
  const [draggedNumber, setDraggedNumber] = useState<number | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const [wrongCells, setWrongCells] = useState<Set<string>>(new Set());
  const [correctCells, setCorrectCells] = useState<Set<string>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);
  const [hintText, setHintText] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(true);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [pressedBtn, setPressedBtn] = useState<string | null>(null);

  const steps = useMemo(() => {
    const allSteps = props.steps || DEFAULT_STEPS;
    const filtered = allSteps.filter((s) => s.mode === mode);
    if (props.filterSteps && props.filterSteps.length > 0) {
      return filtered.filter((s) => props.filterSteps!.includes(s.id));
    }
    return filtered;
  }, [mode, props.steps, props.filterSteps]);

  const currentStep = steps[currentStepIndex] || steps[0];

  // Inject keyframes
  useEffect(() => {
    const id = "grid-puzzle-keyframes-v2";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = keyframes;
      document.head.appendChild(style);
    }
    return () => {
      const el = document.getElementById(id);
      if (el) document.head.removeChild(el);
    };
  }, []);

  // Report step details
  useEffect(() => {
    if (setStepDetails) {
      setStepDetails({
        currentStep: currentStepIndex,
        totalSteps: steps.length,
        isPaused,
        currentMode: mode,
      });
    }
  }, [currentStepIndex, steps.length, isPaused, mode]);

  // Auto-play
  useEffect(() => {
    if (isPaused || stopAutoNext || mode === "practice") return;
    const dur = props.autoPlayDuration || 8000;
    if (dur <= 0) return;
    const timer = setTimeout(() => {
      if (currentStepIndex < steps.length - 1) goNext();
      else setIsPaused(true);
    }, dur / animSpeed);
    return () => clearTimeout(timer);
  }, [currentStepIndex, isPaused, stopAutoNext, mode, animSpeed]);

  // Animate cells for guided steps
  useEffect(() => {
    if (mode !== "learn") return;
    setRevealedCells(new Set());
    setHighlightRow(null);
    setHighlightCol(null);
    const step = currentStep;
    if (!step) return;

    if (step.id === 2) {
      setHighlightRow(0);
      setTimeout(() => setHighlightRow(1), 1200);
      setTimeout(() => setHighlightRow(2), 2400);
      setTimeout(() => setHighlightRow(null), 3600);
    } else if (step.id === 3) {
      setHighlightRow(0);
    } else if (step.id === 4) {
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ].forEach(([r, c], i) => {
        setTimeout(
          () => setRevealedCells((prev) => new Set(prev).add(`${r}-${c}`)),
          400 + i * 300,
        );
      });
      setHighlightRow(0);
    } else if (step.id === 5) {
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ].forEach(([r, c]) =>
        setRevealedCells((prev) => new Set(prev).add(`${r}-${c}`)),
      );
      [
        [1, 0],
        [1, 1],
        [1, 2],
      ].forEach(([r, c], i) => {
        setTimeout(
          () => setRevealedCells((prev) => new Set(prev).add(`${r}-${c}`)),
          500 + i * 300,
        );
      });
      setHighlightRow(1);
    } else if (step.id === 6) {
      const all = [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 0],
        [1, 1],
        [1, 2],
        [2, 0],
        [2, 1],
        [2, 2],
      ];
      all.forEach(([r, c], i) => {
        setTimeout(
          () => setRevealedCells((prev) => new Set(prev).add(`${r}-${c}`)),
          i < 6 ? 0 : 350 + (i - 6) * 300,
        );
      });
      setHighlightRow(2);
    }
  }, [currentStepIndex, mode, currentStep]);

  const goNext = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((p) => p + 1);
      setAnimKey((p) => p + 1);
    }
  }, [currentStepIndex, steps.length]);

  const goPrev = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((p) => p - 1);
      setAnimKey((p) => p + 1);
    }
  }, [currentStepIndex]);

  // Practice functions
  const usedNumbers = useMemo(() => {
    const used = new Set<number>();
    practiceGrid.forEach((row) =>
      row.forEach((c) => {
        if (c !== null) used.add(c);
      }),
    );
    return used;
  }, [practiceGrid]);

  const availableNumbers = useMemo(
    () => [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !usedNumbers.has(n)),
    [usedNumbers],
  );

  const placeNumber = (r: number, c: number, num: number) => {
    if (isSolved) return;
    const newGrid = practiceGrid.map((row) => [...row]);
    newGrid[r][c] = num;
    setPracticeGrid(newGrid);
    setSelectedNumber(null);
    setDraggedNumber(null);
    setHintText(null);
    if (num === practicePuzzle.grid[r][c]) {
      setCorrectCells((prev) => new Set(prev).add(`${r}-${c}`));
      setWrongCells((prev) => {
        const n = new Set(prev);
        n.delete(`${r}-${c}`);
        return n;
      });
    } else {
      setWrongCells((prev) => new Set(prev).add(`${r}-${c}`));
      setCorrectCells((prev) => {
        const n = new Set(prev);
        n.delete(`${r}-${c}`);
        return n;
      });
    }
    const allFilled = newGrid.every((row) =>
      row.every((cell) => cell !== null),
    );
    if (
      allFilled &&
      newGrid.every((row, ri) =>
        row.every((cell, ci) => cell === practicePuzzle.grid[ri][ci]),
      )
    ) {
      setIsSolved(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3500);
    }
  };

  const handleCellClick = (r: number, c: number) => {
    if (isSolved) return;
    if (practiceGrid[r][c] !== null) {
      const newGrid = practiceGrid.map((row) => [...row]);
      newGrid[r][c] = null;
      setPracticeGrid(newGrid);
      setWrongCells((prev) => {
        const n = new Set(prev);
        n.delete(`${r}-${c}`);
        return n;
      });
      setCorrectCells((prev) => {
        const n = new Set(prev);
        n.delete(`${r}-${c}`);
        return n;
      });
    } else if (selectedNumber !== null) {
      placeNumber(r, c, selectedNumber);
    }
  };

  const resetPractice = () => {
    setPracticePuzzle(generateRandomPuzzle());
    setPracticeGrid([
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]);
    setSelectedNumber(null);
    setDraggedNumber(null);
    setIsSolved(false);
    setShowConfetti(false);
    setWrongCells(new Set());
    setCorrectCells(new Set());
    setHintText(null);
  };

  const giveHint = () => {
    const grid = practiceGrid;
    const target = practicePuzzle;
    const rowLabels = ["Row 1 (top)", "Row 2 (middle)", "Row 3 (bottom)"];
    const colLabels = [
      "Column 1 (left)",
      "Column 2 (middle)",
      "Column 3 (right)",
    ];

    // Strategy 1: Find a row with 2 filled cells — student can deduce the 3rd
    for (let r = 0; r < 3; r++) {
      const filled = grid[r].filter((v) => v !== null) as number[];
      const empty = grid[r].filter((v) => v === null).length;
      if (empty === 1 && filled.length === 2) {
        const partialSum = filled.reduce((a, b) => a + b, 0);
        setHintText(
          `🔎 ${rowLabels[r]} already has ${filled.join(" and ")} (sum = ${partialSum}). The row target is ${target.rowSums[r]}. What number makes up the difference?`,
        );
        setTimeout(() => setHintText(null), 8000);
        return;
      }
    }

    // Strategy 2: Find a column with 2 filled cells
    for (let c = 0; c < 3; c++) {
      const colVals = [0, 1, 2].map((r) => grid[r][c]);
      const filled = colVals.filter((v) => v !== null) as number[];
      const empty = colVals.filter((v) => v === null).length;
      if (empty === 1 && filled.length === 2) {
        const partialSum = filled.reduce((a, b) => a + b, 0);
        setHintText(
          `🔎 ${colLabels[c]} already has ${filled.join(" and ")} (sum = ${partialSum}). The column target is ${target.colSums[c]}. Can you figure out the missing number?`,
        );
        setTimeout(() => setHintText(null), 8000);
        return;
      }
    }

    // Strategy 3: Find a row that is completely empty — suggest starting there
    for (let r = 0; r < 3; r++) {
      const empty = grid[r].filter((v) => v === null).length;
      if (empty === 3) {
        const availNums = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
          (n) => !usedNumbers.has(n),
        );
        setHintText(
          `💡 Try working on ${rowLabels[r]} — it needs to add up to ${target.rowSums[r]}. Which 3 numbers from {${availNums.join(", ")}} make that sum?`,
        );
        setTimeout(() => setHintText(null), 8000);
        return;
      }
    }

    // Strategy 4: If a wrong cell exists — guide them to reconsider
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (grid[r][c] !== null && grid[r][c] !== target.grid[r][c]) {
          const filledInRow = grid[r].filter((v) => v !== null) as number[];
          const rowTotal = filledInRow.reduce((a, b) => a + b, 0);
          if (filledInRow.length === 3 && rowTotal !== target.rowSums[r]) {
            setHintText(
              `⚠️ ${rowLabels[r]} currently adds to ${rowTotal}, but the target is ${target.rowSums[r]}. Try tapping a number in that row to remove it and rethink.`,
            );
          } else {
            const filledInCol = [0, 1, 2]
              .map((row) => grid[row][c])
              .filter((v) => v !== null) as number[];
            const colTotal = filledInCol.reduce((a, b) => a + b, 0);
            if (filledInCol.length === 3 && colTotal !== target.colSums[c]) {
              setHintText(
                `⚠️ ${colLabels[c]} currently adds to ${colTotal}, but the target is ${target.colSums[c]}. Something in that column needs to change.`,
              );
            } else {
              setHintText(
                `🤔 Check the numbers in ${rowLabels[r]}. Does each number also work with its column target?`,
              );
            }
          }
          setTimeout(() => setHintText(null), 8000);
          return;
        }
      }
    }

    // Strategy 5: Completely empty grid — general starting advice
    const availNums = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
      (n) => !usedNumbers.has(n),
    );
    if (availNums.length === 9) {
      // Find the row with the smallest or most constrained sum
      const sortedRows = [0, 1, 2].sort(
        (a, b) => target.rowSums[a] - target.rowSums[b],
      );
      const easiest = sortedRows[0];
      setHintText(
        `💡 Start with ${rowLabels[easiest]} — its target is ${target.rowSums[easiest]}, which is the smallest. Think: which three numbers from 1–9 add up to ${target.rowSums[easiest]}?`,
      );
    } else {
      setHintText(
        `💡 You have {${availNums.join(", ")}} left to place. Check which row or column is closest to being complete and try to fill it first.`,
      );
    }
    setTimeout(() => setHintText(null), 8000);
  };

  const switchMode = (newMode: ModeType) => {
    setMode(newMode);
    setCurrentStepIndex(0);
    setAnimKey((p) => p + 1);
    if (newMode === "practice") resetPractice();
  };

  const practiceRowSums = useMemo(
    () =>
      practiceGrid.map((row) => {
        const f = row.filter((c) => c !== null) as number[];
        return f.length === 3 ? f.reduce((a, b) => a + b, 0) : null;
      }),
    [practiceGrid],
  );

  const practiceColSums = useMemo(
    () =>
      [0, 1, 2].map((c) => {
        const f = [0, 1, 2]
          .map((r) => practiceGrid[r][c])
          .filter((v) => v !== null) as number[];
        return f.length === 3 ? f.reduce((a, b) => a + b, 0) : null;
      }),
    [practiceGrid],
  );

  // ==================== BUTTON COMPONENT (DS-compliant) ====================

  const DSButton = ({
    label,
    icon,
    variant = "contained",
    disabled = false,
    onClick,
    id,
    size = "md",
  }: {
    label: string;
    icon?: React.ReactNode;
    variant?: "contained" | "outlined" | "text" | "highlight";
    disabled?: boolean;
    onClick: () => void;
    id: string;
    size?: "sm" | "md";
  }) => {
    const isHovered = hoveredBtn === id && !disabled;
    const isPressed = pressedBtn === id && !disabled;
    const h = size === "sm" ? 34 : DS.btnHeight;
    const px = size === "sm" ? 16 : DS.btnPadX;
    const fs = size === "sm" ? 13 : 14;

    const getStyles = (): React.CSSProperties => {
      const base: React.CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: icon ? 6 : 0,
        height: h,
        padding: `0 ${px}px`,
        borderRadius: DS.radiusPill,
        fontFamily: DS.fontFamily,
        fontWeight: 600,
        fontSize: fs,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        outline: "none",
        userSelect: "none" as any,
        transform: isPressed
          ? "scale(0.96)"
          : isHovered
            ? "scale(1.03)"
            : "scale(1)",
        border: "none",
      };

      if (variant === "contained") {
        return {
          ...base,
          background: disabled
            ? DS.greyLight
            : isHovered
              ? DS.purpleDark
              : DS.purple,
          color: disabled ? DS.grey : DS.white,
          boxShadow: disabled
            ? "none"
            : isHovered
              ? DS.shadowPurple
              : DS.shadowSm,
        };
      } else if (variant === "highlight") {
        return {
          ...base,
          background: disabled
            ? DS.greyLight
            : isHovered
              ? "#E5600F"
              : DS.orange,
          color: disabled ? DS.grey : DS.white,
          boxShadow: disabled
            ? "none"
            : isHovered
              ? DS.shadowOrange
              : DS.shadowSm,
        };
      } else if (variant === "outlined") {
        return {
          ...base,
          background: disabled
            ? DS.greyBg
            : isHovered
              ? DS.purpleGhost
              : "transparent",
          color: disabled ? DS.grey : DS.purple,
          border: `2px solid ${disabled ? DS.greyLight : isHovered ? DS.purple : DS.purpleLight}`,
        };
      } else {
        // text
        return {
          ...base,
          background: isHovered ? DS.purpleGhost : "transparent",
          color: disabled ? DS.grey : DS.purple,
          border: "none",
        };
      }
    };

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
        style={getStyles()}
      >
        {icon}
        {label}
      </button>
    );
  };

  // ==================== GRID RENDERER ====================

  const renderGrid = (
    puzzle: PuzzleData,
    displayGrid: (number | null)[][],
    isInteractive: boolean,
  ) => {
    const cellSize = Math.min(72, (width - 220) / 5);
    const fontSize = Math.max(20, cellSize * 0.38);
    const sumSize = fontSize * 0.85;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 5,
          animation: "fadeIn 0.5s ease-out",
        }}
      >
        {/* Column sums (top) */}
        <div style={{ display: "flex", gap: 5, marginLeft: cellSize + 12 }}>
          {puzzle.colSums.map((sum, c) => {
            const actual = isInteractive ? practiceColSums[c] : null;
            const ok = actual !== null && actual === sum;
            const bad = actual !== null && actual !== sum;
            return (
              <div
                key={`cs-${c}`}
                style={{
                  width: cellSize,
                  height: cellSize * 0.58,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: DS.fontFamily,
                  fontWeight: 700,
                  fontSize: sumSize,
                  color:
                    highlightCol === c
                      ? DS.purple
                      : ok
                        ? DS.greenDark
                        : bad
                          ? DS.red
                          : DS.dark,
                  borderRadius: DS.radiusXs,
                  background:
                    highlightCol === c
                      ? DS.purpleBg
                      : ok
                        ? DS.greenLight
                        : bad
                          ? DS.redLight
                          : "transparent",
                  transition: "all 0.35s ease",
                  animation:
                    highlightCol === c ? "pulse 1.4s infinite" : "none",
                }}
              >
                {sum}
              </div>
            );
          })}
        </div>

        {/* Rows */}
        {[0, 1, 2].map((r) => (
          <div
            key={`r-${r}`}
            style={{ display: "flex", gap: 5, alignItems: "center" }}
          >
            <div style={{ width: 6 }} />
            {[0, 1, 2].map((c) => {
              const isRevealed = revealedCells.has(`${r}-${c}`);
              const cellVal = isInteractive
                ? displayGrid[r][c]
                : isRevealed
                  ? puzzle.grid[r][c]
                  : null;
              const isCorrect = isInteractive && correctCells.has(`${r}-${c}`);
              const isWrong = isInteractive && wrongCells.has(`${r}-${c}`);
              const isHighlighted = highlightRow === r || highlightCol === c;
              const isSelectable =
                isInteractive && selectedNumber !== null && cellVal === null;

              let borderColor = DS.greyLight;
              if (isCorrect) borderColor = DS.green;
              else if (isWrong) borderColor = DS.red;
              else if (isSelectable) borderColor = DS.purpleLight;
              else if (isHighlighted) borderColor = DS.purple;

              let bgColor = DS.white;
              if (cellVal !== null && isCorrect) bgColor = DS.greenLight;
              else if (cellVal !== null && isWrong) bgColor = DS.redLight;
              else if (isSelectable) bgColor = DS.purpleGhost;
              else if (isHighlighted && cellVal === null) bgColor = DS.purpleBg;

              return (
                <div
                  key={`c-${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  onDragOver={(e) => {
                    if (isInteractive) e.preventDefault();
                  }}
                  onDrop={() => {
                    if (isInteractive && draggedNumber !== null)
                      placeNumber(r, c, draggedNumber);
                  }}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: DS.radiusMd,
                    border: `2.5px solid ${borderColor}`,
                    background: bgColor,
                    fontFamily: DS.fontFamily,
                    fontWeight: 700,
                    fontSize,
                    color: isCorrect
                      ? DS.greenDark
                      : isWrong
                        ? DS.red
                        : DS.black,
                    cursor: isInteractive ? "pointer" : "default",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    animation:
                      cellVal !== null && !isInteractive
                        ? "cellReveal 0.45s ease-out"
                        : isCorrect
                          ? "glowGreen 1.5s ease-in-out"
                          : isWrong
                            ? "glowRed 0.7s ease-in-out"
                            : "none",
                    boxShadow:
                      cellVal !== null
                        ? "0 2px 10px rgba(74,77,201,0.08)"
                        : "inset 0 1px 3px rgba(0,0,0,0.04)",
                    position: "relative",
                    userSelect: "none",
                  }}
                >
                  {cellVal !== null ? cellVal : null}
                </div>
              );
            })}

            {/* Row sum */}
            <div
              style={{
                width: cellSize,
                height: cellSize,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: DS.fontFamily,
                fontWeight: 700,
                fontSize: sumSize,
                marginLeft: 6,
                borderRadius: DS.radiusXs,
                color: (() => {
                  if (!isInteractive)
                    return highlightRow === r ? DS.purple : DS.dark;
                  const a = practiceRowSums[r];
                  return a === null
                    ? DS.dark
                    : a === puzzle.rowSums[r]
                      ? DS.greenDark
                      : DS.red;
                })(),
                background: (() => {
                  if (!isInteractive)
                    return highlightRow === r ? DS.purpleBg : "transparent";
                  const a = practiceRowSums[r];
                  return a === null
                    ? "transparent"
                    : a === puzzle.rowSums[r]
                      ? DS.greenLight
                      : DS.redLight;
                })(),
                transition: "all 0.35s ease",
                animation: highlightRow === r ? "pulse 1.4s infinite" : "none",
              }}
            >
              {puzzle.rowSums[r]}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ==================== NUMBER CHIPS ====================

  const renderNumberChips = () => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        justifyContent: "center",
        padding: "14px 12px",
        background: DS.greyBg,
        borderRadius: DS.radiusMd,
        marginTop: 12,
        minHeight: 54,
      }}
    >
      {availableNumbers.length === 0 && !isSolved ? (
        <span
          style={{
            fontFamily: DS.fontFamily,
            color: DS.dark,
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          All numbers placed! Tap a cell to remove it.
        </span>
      ) : isSolved ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Sparkles size={20} color={DS.orange} />
          <span
            style={{
              fontFamily: DS.fontFamily,
              color: DS.purple,
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            Puzzle Solved! Amazing detective work!
          </span>
          <Sparkles size={20} color={DS.orange} />
        </div>
      ) : (
        availableNumbers.map((num, i) => {
          const isSelected = selectedNumber === num;
          return (
            <div
              key={num}
              draggable
              onDragStart={() => setDraggedNumber(num)}
              onClick={() =>
                setSelectedNumber((prev) => (prev === num ? null : num))
              }
              style={{
                width: 46,
                height: 46,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: DS.radiusSm,
                background: isSelected
                  ? `linear-gradient(135deg, ${DS.purple}, ${DS.purpleDark})`
                  : DS.white,
                color: isSelected ? DS.white : DS.black,
                fontFamily: DS.fontFamily,
                fontWeight: 700,
                fontSize: 19,
                cursor: "grab",
                boxShadow: isSelected
                  ? DS.shadowPurple
                  : "0 2px 8px rgba(0,0,0,0.07)",
                border: `2px solid ${isSelected ? DS.purple : DS.greyLight}`,
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                animation: `popIn 0.35s ease-out ${i * 0.04}s both`,
                userSelect: "none",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLElement).style.transform =
                    "scale(1.1) translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 6px 20px rgba(74,77,201,0.15)";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    DS.purpleLight;
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLElement).style.boxShadow = isSelected
                  ? DS.shadowPurple
                  : "0 2px 8px rgba(0,0,0,0.07)";
                (e.currentTarget as HTMLElement).style.borderColor = isSelected
                  ? DS.purple
                  : DS.greyLight;
              }}
            >
              {num}
            </div>
          );
        })
      )}
    </div>
  );

  // ==================== TRIPLET LIST ====================

  const renderTripletList = () => {
    const triplets = [
      [1, 6, 9],
      [2, 5, 9],
      [2, 6, 8],
      [3, 4, 9],
      [3, 5, 8],
      [3, 6, 7],
      [4, 5, 7],
    ];
    const correct = [4, 5, 7];
    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          justifyContent: "center",
          marginTop: 8,
        }}
      >
        {triplets.map((trip, i) => {
          const sorted = [...trip].sort();
          const isAnswer =
            sorted[0] === correct[0] &&
            sorted[1] === correct[1] &&
            sorted[2] === correct[2];
          return (
            <div
              key={i}
              style={{
                padding: "6px 14px",
                borderRadius: DS.radiusPill,
                background: isAnswer ? DS.greenLight : DS.white,
                border: `2px solid ${isAnswer ? DS.green : DS.greyLight}`,
                fontFamily: DS.fontFamily,
                fontWeight: 600,
                fontSize: 13,
                color: isAnswer ? DS.greenDark : DS.dark,
                animation: `fadeInUp 0.35s ease-out ${i * 0.08}s both`,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              {`{${trip.join(", ")}}`}
              {isAnswer && <Check size={13} color={DS.green} strokeWidth={3} />}
            </div>
          );
        })}
      </div>
    );
  };

  // ==================== CONFETTI ====================

  const renderConfetti = () => {
    if (!showConfetti) return null;
    const colors = [
      DS.purple,
      DS.orange,
      DS.green,
      DS.gold,
      DS.purpleLight,
      DS.orangeSecondary,
    ];
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: 100,
        }}
      >
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${Math.random() * 100}%`,
              top: `${30 + Math.random() * 50}%`,
              width: 7 + Math.random() * 9,
              height: 7 + Math.random() * 9,
              borderRadius: Math.random() > 0.5 ? "50%" : 3,
              background: colors[i % colors.length],
              animation: `confettiBurst ${1.2 + Math.random() * 2}s ease-out ${Math.random() * 0.5}s forwards`,
            }}
          />
        ))}
      </div>
    );
  };

  // ==================== MAIN RENDER ====================

  const isSmall = width < 500;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: width,
        minHeight: height,
        margin: "0 auto",
        fontFamily: DS.fontFamily,
        background: DS.white,
        borderRadius: DS.radiusLg,
        overflow: "hidden",
        boxShadow: DS.shadowLg,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${DS.greyLight}`,
      }}
    >
      {renderConfetti()}

      {/* ═══ HEADER ═══ */}
      <div
        style={{
          background: `linear-gradient(135deg, ${DS.purple} 0%, ${DS.purpleDark} 60%, ${DS.orange} 100%)`,
          backgroundSize: "200% 200%",
          animation: "headerGradient 8s ease infinite",
          padding: isSmall ? "14px 16px" : "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: DS.radiusSm,
              padding: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(4px)",
            }}
          >
            <Target size={20} color={DS.white} strokeWidth={2.5} />
          </div>
          <div>
            <div
              style={{
                fontFamily: DS.fontFamily,
                fontWeight: 800,
                fontSize: isSmall ? 17 : 20,
                color: DS.white,
                letterSpacing: -0.3,
              }}
            >
              Grid Detective
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.75)",
                fontWeight: 500,
                letterSpacing: 0.2,
              }}
            >
              Chapter 6 · Number Play · Grade 7
            </div>
          </div>
        </div>

        {showModeSelector && (
          <div
            style={{
              display: "flex",
              gap: 6,
              background: "rgba(255,255,255,0.1)",
              borderRadius: DS.radiusPill,
              padding: 3,
            }}
          >
            {[
              {
                m: "learn" as ModeType,
                icon: <BookOpen size={14} />,
                label: "Learn",
              },
              {
                m: "practice" as ModeType,
                icon: <Zap size={14} />,
                label: "Solve",
              },
            ].map(({ m, icon, label }) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "6px 16px",
                  borderRadius: DS.radiusPill,
                  border: "none",
                  background: mode === m ? DS.white : "transparent",
                  color: mode === m ? DS.purple : "rgba(255,255,255,0.85)",
                  fontFamily: DS.fontFamily,
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: mode === m ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
                }}
              >
                {icon} {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ═══ CONTENT ═══ */}
      <div
        style={{
          flex: 1,
          padding: isSmall ? 14 : 24,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          overflowY: "auto",
          background: DS.greyBg,
        }}
      >
        {/* Step dots */}
        {showStepInd && mode === "learn" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              justifyContent: "center",
              animation: "fadeIn 0.4s ease-out",
            }}
          >
            {steps.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === currentStepIndex ? 26 : 8,
                  height: 8,
                  borderRadius: 4,
                  background:
                    i === currentStepIndex
                      ? DS.purple
                      : i < currentStepIndex
                        ? DS.green
                        : DS.greyLight,
                  transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
                  animation:
                    i === currentStepIndex
                      ? "stepDotPulse 2s infinite"
                      : "none",
                }}
              />
            ))}
          </div>
        )}

        {/* Step card */}
        <div
          key={animKey}
          style={{
            background: DS.white,
            borderRadius: DS.radiusMd,
            padding: isSmall ? "16px 14px" : "20px 24px",
            boxShadow: DS.shadowSm,
            animation: "fadeInUp 0.45s ease-out",
            border: `1px solid ${DS.greyLight}`,
          }}
        >
          <h2
            style={{
              fontFamily: DS.fontFamily,
              fontWeight: 700,
              fontSize: isSmall ? 17 : 20,
              color: DS.black,
              margin: 0,
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            {currentStep?.title}
          </h2>
          <p
            style={{
              fontSize: isSmall ? 13 : 14,
              color: DS.dark,
              margin: 0,
              lineHeight: 1.65,
              textAlign: "center",
              maxWidth: 580,
              marginLeft: "auto",
              marginRight: "auto",
              fontWeight: 500,
            }}
          >
            {currentStep?.description}
          </p>
        </div>

        {/* Grid area */}
        <div
          key={`grid-${animKey}`}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            animation: "fadeIn 0.5s ease-out",
            background: DS.white,
            borderRadius: DS.radiusMd,
            padding: isSmall ? 14 : 20,
            boxShadow: DS.shadowSm,
            border: `1px solid ${DS.greyLight}`,
          }}
        >
          {mode === "learn" ? (
            <>
              {renderGrid(guidedPuzzle, guidedPuzzle.grid, false)}
              {currentStep?.id === 3 && (
                <div
                  style={{
                    marginTop: 10,
                    animation: "fadeInUp 0.5s ease-out 0.3s both",
                  }}
                >
                  <div
                    style={{
                      fontFamily: DS.fontFamily,
                      fontWeight: 600,
                      fontSize: 13,
                      color: DS.dark,
                      textAlign: "center",
                      marginBottom: 6,
                    }}
                  >
                    Triplets that sum to 16:
                  </div>
                  {renderTripletList()}
                </div>
              )}
              {currentStep?.id === 1 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 10,
                    padding: "10px 20px",
                    background: DS.orangeLight,
                    borderRadius: DS.radiusPill,
                    border: `1.5px solid ${DS.orangeSecondary}30`,
                    animation: "fadeInUp 0.5s ease-out 0.4s both",
                  }}
                >
                  <Star size={17} color={DS.orange} fill={DS.orange} />
                  <span
                    style={{
                      fontFamily: DS.fontFamily,
                      fontWeight: 700,
                      fontSize: 14,
                      color: DS.purpleDark,
                    }}
                  >
                    3,62,880 ways → only 1 answer!
                  </span>
                </div>
              )}
            </>
          ) : (
            <>
              {renderGrid(practicePuzzle, practiceGrid, true)}
              {selectedNumber !== null && (
                <div
                  style={{
                    fontSize: 13,
                    color: DS.purple,
                    fontWeight: 600,
                    textAlign: "center",
                    animation: "fadeIn 0.3s ease-out",
                    marginTop: 4,
                  }}
                >
                  Tap a cell to place <strong>{selectedNumber}</strong>
                </div>
              )}
              {renderNumberChips()}

              {/* Text hint banner */}
              {hintText && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "12px 16px",
                    background: `linear-gradient(135deg, ${DS.orangeLight}, ${DS.goldLight})`,
                    borderRadius: DS.radiusMd,
                    border: `1.5px solid ${DS.orangeSecondary}30`,
                    marginTop: 8,
                    animation: "fadeInUp 0.4s ease-out",
                    maxWidth: 480,
                    alignSelf: "center",
                    width: "100%",
                  }}
                >
                  <Lightbulb
                    size={18}
                    color={DS.orange}
                    style={{ marginTop: 1, flexShrink: 0 }}
                  />
                  <span
                    style={{
                      fontFamily: DS.fontFamily,
                      fontSize: 13,
                      fontWeight: 500,
                      color: DS.dark,
                      lineHeight: 1.55,
                    }}
                  >
                    {hintText}
                  </span>
                  <button
                    onClick={() => setHintText(null)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 2,
                      marginLeft: "auto",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <X size={14} color={DS.dark} />
                  </button>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  justifyContent: "center",
                  marginTop: 6,
                }}
              >
                {enableHints && !isSolved && (
                  <DSButton
                    id="hint"
                    label="Hint"
                    variant="outlined"
                    size="sm"
                    icon={<Lightbulb size={14} />}
                    onClick={giveHint}
                  />
                )}
                <DSButton
                  id="new-puzzle"
                  label="New Puzzle"
                  variant="highlight"
                  size="sm"
                  icon={<RotateCcw size={14} />}
                  onClick={resetPractice}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* ═══ FOOTER NAV ═══ */}
      {showNav && mode === "learn" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: isSmall ? "10px 14px" : "12px 24px",
            borderTop: `1px solid ${DS.greyLight}`,
            background: DS.white,
          }}
        >
          <DSButton
            id="back"
            label="Back"
            variant="outlined"
            icon={<ChevronLeft size={16} />}
            disabled={currentStepIndex === 0}
            onClick={goPrev}
          />
          <div
            style={{
              fontFamily: DS.fontFamily,
              fontWeight: 600,
              fontSize: 13,
              color: DS.dark,
            }}
          >
            Step {currentStepIndex + 1} of {steps.length}
          </div>
          <DSButton
            id="next"
            label={currentStepIndex === steps.length - 1 ? "Try It!" : "Next"}
            variant={
              currentStepIndex === steps.length - 1 ? "highlight" : "contained"
            }
            icon={
              currentStepIndex === steps.length - 1 ? (
                <Zap size={16} />
              ) : (
                <ChevronRight size={16} />
              )
            }
            onClick={() => {
              if (currentStepIndex === steps.length - 1) switchMode("practice");
              else goNext();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default GridPuzzleExplorer;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
