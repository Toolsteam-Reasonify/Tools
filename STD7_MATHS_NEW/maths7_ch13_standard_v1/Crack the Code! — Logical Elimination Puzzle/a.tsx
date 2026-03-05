// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: number_lock_puzzle_tool.tsx
// Redesigned with Singularity Design System
// ═══════════════════════════════════════════════════════════════════════════

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  // @ts-expect-error React types resolved by project/bundler
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Lock,
  Unlock,
  Star,
  // @ts-expect-error lucide-react types resolved by project/bundler
} from "lucide-react";

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

interface NumberLockAdditionalProps {
  clues?: {
    digits: [number, number, number];
    hint: string;
    hintType:
      | "correct_well_placed"
      | "correct_wrong_place"
      | "nothing_correct"
      | "two_correct_wrong_place";
  }[];
  answer?: [number, number, number];
  puzzleTitle?: string;
}

interface NumberLockPuzzleToolProps {
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
    additionalProps?: NumberLockAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== ANIMATION HELPERS ====================

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeInOutQuad = (t: number): number =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const easeOutElastic = (t: number): number => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0
    ? 0
    : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};
const easeOutBounce = (t: number): number => {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  return n1 * (t -= 2.625 / d1) * t + 0.984375;
};

// ==================== SINGULARITY DESIGN TOKENS ====================

const DS = {
  indigo: "#4A4DC9",
  orange: "#FF7212",
  gradientDark: "#533086",
  gradientLight: "#FC9145",
  indigoLight: "#C1C1EA",
  orangeLight: "#FFF3E4",
  gray900: "#4E4E4E",
  gray400: "#CACACA",
  gray200: "#EBEBEB",
  gray100: "#F5F5F5",
  white: "#FFFFFF",
  confirmed: "#22A65A",
  confirmedLight: "#E8F8EF",
  eliminated: "#E14B4B",
  eliminatedLight: "#FDECEC",
  fontFamily: "'Poppins', sans-serif",
  radiusPill: 100,
  radiusCard: 16,
  radiusSmall: 8,
  btnHeight: 40,
};

// ==================== CLUE & STEP DATA ====================

interface ClueData {
  digits: [number, number, number];
  hint: string;
  colorTag: string;
}

const DEFAULT_CLUES: ClueData[] = [
  {
    digits: [2, 6, 5],
    hint: "One digit is correct and well placed.",
    colorTag: DS.indigo,
  },
  {
    digits: [2, 7, 1],
    hint: "One digit is correct but wrongly placed.",
    colorTag: DS.gradientDark,
  },
  { digits: [0, 3, 6], hint: "Nothing is correct.", colorTag: DS.gray900 },
  {
    digits: [0, 6, 4],
    hint: "One digit is correct but wrongly placed.",
    colorTag: DS.gradientDark,
  },
  {
    digits: [5, 4, 2],
    hint: "Two digits are correct but wrongly placed.",
    colorTag: DS.orange,
  },
];

interface PuzzleStep {
  id: number;
  title: string;
  description: string;
  clueIndex: number | null;
  eliminatedDigits: Set<number>;
  confirmedPositions: Map<number, number>;
  possibleDigits: Set<number>;
  highlightClue: number | null;
  revealAnswer: boolean;
  reasoning: string;
}

const buildSteps = (): PuzzleStep[] => [
  {
    id: 0,
    title: "The Puzzle",
    description:
      "A number lock has a 3-digit code. We have 5 clues to crack it. Read each clue carefully before we start eliminating!",
    clueIndex: null,
    eliminatedDigits: new Set(),
    confirmedPositions: new Map(),
    possibleDigits: new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
    highlightClue: null,
    revealAnswer: false,
    reasoning:
      "Take 30 seconds to read all 5 clues. Think about which clue gives you the most information to start with.",
  },
  {
    id: 1,
    title: 'Start with "Nothing Correct"',
    description:
      "Clue 3 says [0, 3, 6] — Nothing is correct. This is the most powerful clue!",
    clueIndex: 2,
    eliminatedDigits: new Set([0, 3, 6]),
    confirmedPositions: new Map(),
    possibleDigits: new Set([1, 2, 4, 5, 7, 8, 9]),
    highlightClue: 2,
    revealAnswer: false,
    reasoning:
      "Since 0, 3, and 6 are not in the code at all, we can eliminate them from every position. This removes 3 digits instantly!",
  },
  {
    id: 2,
    title: "Analyse Clue 1: [2, 6, 5]",
    description:
      "One digit is correct and well placed. We already know 6 is eliminated. So the correct digit is either 2 (position 1) or 5 (position 3).",
    clueIndex: 0,
    eliminatedDigits: new Set([0, 3, 6]),
    confirmedPositions: new Map(),
    possibleDigits: new Set([1, 2, 4, 5, 7, 8, 9]),
    highlightClue: 0,
    revealAnswer: false,
    reasoning:
      "6 was eliminated in Step 1. So between 2 and 5, exactly one is correct AND in the right position.",
  },
  {
    id: 3,
    title: "Analyse Clue 2: [2, 7, 1]",
    description:
      "One digit is correct but wrongly placed. Since 0,3,6 are out, the correct digit is 2, 7, or 1 — but NOT in its shown position.",
    clueIndex: 1,
    eliminatedDigits: new Set([0, 3, 6]),
    confirmedPositions: new Map(),
    possibleDigits: new Set([1, 2, 4, 5, 7, 8, 9]),
    highlightClue: 1,
    revealAnswer: false,
    reasoning:
      "The correct digit from {2, 7, 1} is in the code but NOT at the position shown here.",
  },
  {
    id: 4,
    title: "Analyse Clue 4: [0, 6, 4]",
    description:
      "One digit is correct but wrongly placed. 0 and 6 are eliminated, so 4 must be the correct digit! And it is NOT in position 3.",
    clueIndex: 3,
    eliminatedDigits: new Set([0, 3, 6]),
    confirmedPositions: new Map(),
    possibleDigits: new Set([1, 2, 4, 5, 7, 8, 9]),
    highlightClue: 3,
    revealAnswer: false,
    reasoning:
      "0 and 6 are already eliminated. So 4 is definitely in the code, but NOT at position 3. So 4 is at position 1 or 2.",
  },
  {
    id: 5,
    title: "Analyse Clue 5: [5, 4, 2]",
    description:
      "Two digits are correct but wrongly placed. We know 4 is one of them. The other must be 5 or 2 (but not in the shown position).",
    clueIndex: 4,
    eliminatedDigits: new Set([0, 3, 6]),
    confirmedPositions: new Map(),
    possibleDigits: new Set([1, 2, 4, 5]),
    highlightClue: 4,
    revealAnswer: false,
    reasoning:
      "4 is at position 2 here (wrong place). 5 is at position 1 and 2 is at position 3 — both wrongly placed. Combined with Clue 1, we can narrow things down.",
  },
  {
    id: 6,
    title: "Deduce Position of 4",
    description:
      "From Clue 4: 4 ≠ position 3. From Clue 5: 4 is at pos 2 and wrongly placed, so 4 ≠ position 2. Combined: 4 must be at position 1!",
    clueIndex: null,
    eliminatedDigits: new Set([0, 3, 6, 2, 7]),
    confirmedPositions: new Map([[1, 4]]),
    possibleDigits: new Set([1, 4, 5]),
    highlightClue: null,
    revealAnswer: false,
    reasoning:
      "4 cannot be at position 2 (Clue 5) or position 3 (Clue 4). So 4 is at position 1! Since position 1 belongs to 4 (not 2), from Clue 1 the well-placed digit must be 5 at position 3!",
  },
  {
    id: 7,
    title: "Find the Middle Digit",
    description:
      'We have 4 _ 5. From Clue 2 [2,7,1]: 2 is eliminated. If 7 were correct at position 2, the clue says "wrongly placed" — contradiction! So 1 is the correct digit, moved from position 3 to position 2.',
    clueIndex: 1,
    eliminatedDigits: new Set([0, 2, 3, 6, 7]),
    confirmedPositions: new Map([
      [1, 4],
      [2, 1],
      [3, 5],
    ]),
    possibleDigits: new Set([1, 4, 5]),
    highlightClue: 1,
    revealAnswer: false,
    reasoning:
      'If 7 were the answer at position 2, the clue says "wrongly placed" — contradiction! So 1 is the correct digit. The code is 4-1-5!',
  },
  {
    id: 8,
    title: "The Code is 4 – 1 – 5 !",
    description:
      "Let's verify against ALL 5 clues to make sure our answer is correct.",
    clueIndex: null,
    eliminatedDigits: new Set([0, 2, 3, 6, 7, 8, 9]),
    confirmedPositions: new Map([
      [1, 4],
      [2, 1],
      [3, 5],
    ]),
    possibleDigits: new Set([1, 4, 5]),
    highlightClue: null,
    revealAnswer: true,
    reasoning:
      "Verify all 5 clues against 4-1-5. Each clue checks out perfectly!",
  },
];

// ==================== MAIN COMPONENT ====================

const NumberLockPuzzleTool: React.FC<NumberLockPuzzleToolProps> = ({
  props = {} as NonNullable<NumberLockPuzzleToolProps["props"]>,
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const {
    width = 800,
    height = 600,
    showNavigation = true,
    showStepIndicator = true,
    additionalProps = {},
  } = props;

  const puzzleSteps = useMemo(() => buildSteps(), []);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lockOpen, setLockOpen] = useState(false);
  const [wheelDigits, setWheelDigits] = useState<[string, string, string]>([
    "?",
    "?",
    "?",
  ]);
  const [wheelSpinning, setWheelSpinning] = useState<
    [boolean, boolean, boolean]
  >([false, false, false]);
  const [verifyChecks, setVerifyChecks] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
  ]);
  const [hoveredClue, setHoveredClue] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [stepAnimKey, setStepAnimKey] = useState(0);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentStep = puzzleSteps[currentStepIndex];

  // Inject styles
  useEffect(() => {
    const s = document.createElement("style");
    s.id = "singularity-lock-kf";
    s.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
            @keyframes fadeInUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
            @keyframes fadeInDown { from{opacity:0;transform:translateY(-18px)} to{opacity:1;transform:translateY(0)} }
            @keyframes fadeInLeft { from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:translateX(0)} }
            @keyframes fadeInRight { from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:translateX(0)} }
            @keyframes popIn { 0%{transform:scale(0);opacity:0} 60%{transform:scale(1.12)} 100%{transform:scale(1);opacity:1} }
            @keyframes pulseGlow { 0%,100%{box-shadow:0 0 0 0 rgba(74,77,201,0)} 50%{box-shadow:0 0 24px 6px rgba(74,77,201,0.25)} }
            @keyframes spinWheel { 0%{transform:rotateX(0deg)} 100%{transform:rotateX(720deg)} }
            @keyframes confettiFall { 0%{transform:translateY(-80px) rotate(0deg);opacity:1} 100%{transform:translateY(650px) rotate(720deg);opacity:0} }
            @keyframes lockOpen { 0%{transform:translateY(0) rotate(0deg)} 30%{transform:translateY(-6px) rotate(-4deg)} 60%{transform:translateY(-14px) rotate(8deg)} 100%{transform:translateY(-18px) rotate(14deg)} }
            @keyframes slideInScale { 0%{transform:scale(0.85) translateY(16px);opacity:0} 100%{transform:scale(1) translateY(0);opacity:1} }
            @keyframes bounceIn { 0%{transform:scale(0)} 50%{transform:scale(1.15)} 70%{transform:scale(0.92)} 100%{transform:scale(1)} }
            @keyframes glowRing { 0%,100%{box-shadow:0 0 0 0 rgba(255,114,18,0)} 50%{box-shadow:0 0 0 8px rgba(255,114,18,0.18)} }
        `;
    document.head.appendChild(s);
    return () => {
      const el = document.getElementById("singularity-lock-kf");
      if (el) document.head.removeChild(el);
    };
  }, []);

  useEffect(() => {
    if (setStepDetails)
      setStepDetails({
        currentStep: currentStepIndex,
        totalSteps: puzzleSteps.length,
        isPaused: true,
        currentMode: "learn",
      });
  }, [currentStepIndex, puzzleSteps.length, setStepDetails]);

  useEffect(() => {
    if (currentStep.revealAnswer && !lockOpen) {
      setWheelSpinning([true, true, true]);
      const rv = (i: number, d: number, dl: number) => {
        setTimeout(() => {
          setWheelDigits((p) => {
            const n = [...p] as [string, string, string];
            n[i] = String(d);
            return n;
          });
          setWheelSpinning((p) => {
            const n = [...p] as [boolean, boolean, boolean];
            n[i] = false;
            return n;
          });
        }, dl);
      };
      rv(0, 4, 600);
      rv(1, 1, 1100);
      rv(2, 5, 1600);
      setTimeout(() => setLockOpen(true), 2100);
      setTimeout(() => setShowConfetti(true), 2200);
      setTimeout(() => {
        [0, 1, 2, 3, 4].forEach((_, i) => {
          setTimeout(
            () =>
              setVerifyChecks((p) => {
                const n = [...p];
                n[i] = true;
                return n;
              }),
            i * 350,
          );
        });
      }, 2600);
    }
  }, [currentStep.revealAnswer]);

  useEffect(() => {
    if (!currentStep.revealAnswer) {
      const nd: [string, string, string] = ["?", "?", "?"];
      currentStep.confirmedPositions.forEach((d, p) => {
        nd[p - 1] = String(d);
      });
      setWheelDigits(nd);
      setLockOpen(false);
      setShowConfetti(false);
      setVerifyChecks([false, false, false, false, false]);
    }
  }, [currentStepIndex]);

  const goToStep = useCallback(
    (i: number) => {
      if (i >= 0 && i < puzzleSteps.length && !isAnimating) {
        setIsAnimating(true);
        setStepAnimKey((p) => p + 1);
        setCurrentStepIndex(i);
        setTimeout(() => setIsAnimating(false), 450);
      }
    },
    [puzzleSteps.length, isAnimating],
  );
  const nextStep = useCallback(
    () => goToStep(currentStepIndex + 1),
    [currentStepIndex, goToStep],
  );
  const prevStep = useCallback(
    () => goToStep(currentStepIndex - 1),
    [currentStepIndex, goToStep],
  );

  // ==================== RENDER: LOCK ====================
  const renderLock = () => {
    const lw = Math.min(width * 0.32, 190);
    const ww = lw * 0.26;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          animation: "fadeInDown 0.5s ease-out",
        }}
      >
        <div
          style={{
            width: lw * 0.52,
            height: lw * 0.32,
            borderTop: `5px solid ${lockOpen ? DS.confirmed : DS.gray400}`,
            borderLeft: `5px solid ${lockOpen ? DS.confirmed : DS.gray400}`,
            borderRight: `5px solid ${lockOpen ? DS.confirmed : DS.gray400}`,
            borderBottom: "none",
            borderRadius: "28px 28px 0 0",
            transformOrigin: "right bottom",
            animation: lockOpen ? "lockOpen 0.6s ease-out forwards" : "none",
            transition: "border-color 0.4s ease",
          }}
        />
        <div
          style={{
            width: lw,
            height: lw * 0.58,
            background: lockOpen
              ? `linear-gradient(135deg, ${DS.confirmed}, #1a9a4a)`
              : `linear-gradient(135deg, ${DS.gradientDark}, ${DS.gradientLight})`,
            borderRadius: DS.radiusCard,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            boxShadow: lockOpen
              ? "0 10px 32px rgba(34,166,90,0.35)"
              : "0 10px 32px rgba(83,48,134,0.30)",
            transition: "all 0.5s ease",
            animation: lockOpen
              ? "none"
              : "pulseGlow 2.5s ease-in-out infinite",
            padding: "0 10px",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: ww,
                height: ww * 1.35,
                background: lockOpen
                  ? "rgba(255,255,255,0.25)"
                  : "rgba(0,0,0,0.30)",
                borderRadius: DS.radiusSmall,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: DS.fontFamily,
                fontWeight: 800,
                fontSize: ww * 0.6,
                color:
                  wheelDigits[i] === "?" ? "rgba(255,255,255,0.45)" : DS.white,
                animation: wheelSpinning[i]
                  ? "spinWheel 0.5s ease-in-out"
                  : wheelDigits[i] !== "?"
                    ? "bounceIn 0.35s ease-out"
                    : "none",
                border:
                  wheelDigits[i] !== "?"
                    ? `2px solid ${DS.confirmed}`
                    : "2px solid rgba(255,255,255,0.15)",
                textShadow:
                  wheelDigits[i] !== "?"
                    ? "0 0 8px rgba(34,166,90,0.5)"
                    : "none",
                transition: "all 0.35s ease",
              }}
            >
              {wheelDigits[i]}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ==================== RENDER: CLUE CARD ====================
  const renderClueCard = (clue: ClueData, index: number) => {
    const isHL = currentStep.highlightClue === index;
    const elim = currentStep.eliminatedDigits;
    return (
      <div
        key={index}
        onMouseEnter={() => setHoveredClue(index)}
        onMouseLeave={() => setHoveredClue(null)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 12px",
          borderRadius: 12,
          background: isHL
            ? `linear-gradient(135deg, ${DS.indigoLight}40, ${DS.orangeLight})`
            : hoveredClue === index
              ? DS.gray100
              : DS.white,
          border: isHL ? `2px solid ${DS.indigo}` : `1.5px solid ${DS.gray200}`,
          transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
          animation: `fadeInLeft 0.45s ease-out ${index * 0.08}s both`,
          transform:
            hoveredClue === index ? "translateX(4px)" : "translateX(0)",
          boxShadow: isHL
            ? "0 4px 16px rgba(74,77,201,0.18)"
            : "0 1px 4px rgba(0,0,0,0.04)",
          cursor: "default",
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: DS.radiusPill,
            background: isHL
              ? `linear-gradient(135deg, ${DS.gradientDark}, ${DS.gradientLight})`
              : clue.colorTag,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: DS.white,
            fontFamily: DS.fontFamily,
            fontWeight: 700,
            fontSize: 11,
            flexShrink: 0,
            animation: isHL ? "glowRing 1.5s ease-in-out infinite" : "none",
          }}
        >
          {index + 1}
        </div>
        <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
          {clue.digits.map((d, di) => {
            const isE = elim.has(d) && currentStepIndex >= 1;
            const isC = currentStep.confirmedPositions.get(di + 1) === d;
            return (
              <div
                key={di}
                style={{
                  width: 28,
                  height: 32,
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: DS.fontFamily,
                  fontWeight: 700,
                  fontSize: 14,
                  position: "relative",
                  background: isC
                    ? DS.confirmedLight
                    : isE
                      ? DS.eliminatedLight
                      : DS.gray100,
                  color: isE ? DS.gray400 : DS.gray900,
                  border: isC
                    ? `2px solid ${DS.confirmed}`
                    : isE
                      ? `1.5px solid ${DS.eliminated}40`
                      : `1.5px solid ${DS.gray200}`,
                  textDecoration: isE ? "line-through" : "none",
                  textDecorationColor: DS.eliminated,
                  textDecorationThickness: "2px",
                  transition: "all 0.35s ease",
                }}
              >
                {d}
                {isE && (
                  <div
                    style={{
                      position: "absolute",
                      top: -5,
                      right: -5,
                      width: 13,
                      height: 13,
                      borderRadius: "50%",
                      background: DS.eliminated,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      animation: "popIn 0.3s ease-out",
                    }}
                  >
                    <X size={8} color={DS.white} strokeWidth={3} />
                  </div>
                )}
                {isC && (
                  <div
                    style={{
                      position: "absolute",
                      top: -5,
                      right: -5,
                      width: 13,
                      height: 13,
                      borderRadius: "50%",
                      background: DS.confirmed,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      animation: "popIn 0.3s ease-out",
                    }}
                  >
                    <Check size={8} color={DS.white} strokeWidth={3} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div
          style={{
            fontFamily: DS.fontFamily,
            fontSize: 11,
            color: DS.gray900,
            fontWeight: 500,
            lineHeight: 1.35,
            flex: 1,
            minWidth: 0,
          }}
        >
          {clue.hint}
        </div>
      </div>
    );
  };

  // ==================== RENDER: GRID ====================
  const renderGrid = () => {
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    return (
      <div
        style={{
          background: DS.white,
          borderRadius: 12,
          padding: "10px 12px",
          animation: "fadeInUp 0.45s ease-out 0.15s both",
          border: `1.5px solid ${DS.gray200}`,
        }}
      >
        <div
          style={{
            fontFamily: DS.fontFamily,
            fontSize: 12,
            color: DS.indigo,
            fontWeight: 700,
            marginBottom: 6,
            textAlign: "center",
            letterSpacing: 0.3,
          }}
        >
          Elimination Grid
        </div>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              borderCollapse: "separate",
              borderSpacing: 2,
              width: "100%",
              minWidth: 260,
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    fontFamily: DS.fontFamily,
                    fontSize: 9,
                    color: DS.gray400,
                    padding: "2px 3px",
                    fontWeight: 600,
                  }}
                >
                  Pos
                </th>
                {digits.map((d) => (
                  <th
                    key={d}
                    style={{
                      fontFamily: DS.fontFamily,
                      fontSize: 11,
                      fontWeight: 700,
                      color: currentStep.eliminatedDigits.has(d)
                        ? DS.eliminated
                        : DS.gray900,
                      padding: "2px 0",
                      textDecoration: currentStep.eliminatedDigits.has(d)
                        ? "line-through"
                        : "none",
                      textDecorationColor: DS.eliminated,
                      transition: "all 0.3s ease",
                    }}
                  >
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((pos) => (
                <tr key={pos}>
                  <td
                    style={{
                      fontFamily: DS.fontFamily,
                      fontSize: 9,
                      fontWeight: 600,
                      color: DS.gray400,
                      textAlign: "center",
                      padding: "2px 3px",
                    }}
                  >
                    P{pos}
                  </td>
                  {digits.map((d) => {
                    const isE = currentStep.eliminatedDigits.has(d);
                    const isC = currentStep.confirmedPositions.get(pos) === d;
                    return (
                      <td
                        key={d}
                        style={{
                          width: 20,
                          height: 20,
                          textAlign: "center",
                          borderRadius: 4,
                          background: isC
                            ? DS.confirmedLight
                            : isE
                              ? DS.eliminatedLight
                              : DS.gray100,
                          border: isC
                            ? `2px solid ${DS.confirmed}`
                            : isE
                              ? `1px solid ${DS.eliminated}30`
                              : `1px solid ${DS.gray200}`,
                          transition: "all 0.4s ease",
                          padding: 0,
                        }}
                      >
                        {isC && (
                          <Check
                            size={11}
                            color={DS.confirmed}
                            strokeWidth={3}
                          />
                        )}
                        {isE && !isC && (
                          <X size={9} color={DS.eliminated} strokeWidth={2} />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ==================== RENDER: VERIFY ====================
  const renderVerify = () => {
    if (!currentStep.revealAnswer) return null;
    const checks = [
      "[2,6,5] → 5 at pos 3 ✓ correct & well placed",
      "[2,7,1] → 1 correct but at pos 2, not 3 ✓",
      "[0,3,6] → none of 0,3,6 in code ✓",
      "[0,6,4] → 4 correct but at pos 1, not 3 ✓",
      "[5,4,2] → 5 & 4 correct but wrong places ✓",
    ];
    return (
      <div
        style={{
          background: DS.confirmedLight,
          borderRadius: 12,
          padding: 14,
          animation: "fadeInUp 0.5s ease-out 0.25s both",
          border: `2px solid ${DS.confirmed}40`,
        }}
      >
        <div
          style={{
            fontFamily: DS.fontFamily,
            fontSize: 13,
            color: DS.confirmed,
            fontWeight: 700,
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          ✅ Verification Checklist
        </div>
        {checks.map((c, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 0",
              opacity: verifyChecks[i] ? 1 : 0.25,
              transition: "opacity 0.35s ease",
              animation: verifyChecks[i] ? "fadeInLeft 0.35s ease-out" : "none",
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: verifyChecks[i] ? DS.confirmed : DS.gray200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                animation: verifyChecks[i] ? "bounceIn 0.35s ease-out" : "none",
                flexShrink: 0,
              }}
            >
              {verifyChecks[i] && (
                <Check size={10} color={DS.white} strokeWidth={3} />
              )}
            </div>
            <span
              style={{
                fontFamily: DS.fontFamily,
                fontSize: 10.5,
                color: DS.gray900,
                fontWeight: 500,
              }}
            >
              {c}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // ==================== RENDER: CONFETTI ====================
  const renderConfetti = () => {
    if (!showConfetti) return null;
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: 50,
        }}
      >
        {Array.from({ length: 28 }, (_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${Math.random() * 100}%`,
              top: -15,
              width: 5 + Math.random() * 7,
              height: 5 + Math.random() * 7,
              background: [
                DS.indigo,
                DS.orange,
                DS.confirmed,
                DS.gradientDark,
                DS.gradientLight,
                DS.indigoLight,
              ][i % 6],
              borderRadius: i % 3 === 0 ? "50%" : i % 3 === 1 ? 2 : 0,
              animation: `confettiFall ${2.2 + Math.random() * 1.8}s ease-in ${Math.random() * 1.8}s forwards`,
            }}
          />
        ))}
      </div>
    );
  };

  // ==================== SINGULARITY BUTTON ====================
  const SBtn = ({
    onClick,
    disabled,
    variant,
    children,
    id,
  }: {
    onClick: () => void;
    disabled?: boolean;
    variant: "contained" | "outlined" | "highlight";
    children?: React.ReactNode;
    id: string;
  }) => {
    const isH = hoveredBtn === id && !disabled;
    const base: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      gap: 6,
      height: DS.btnHeight,
      padding: "0 24px",
      borderRadius: DS.radiusPill,
      fontFamily: DS.fontFamily,
      fontSize: 13,
      fontWeight: 600,
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
      letterSpacing: 0.2,
      whiteSpace: "nowrap",
    };
    let vs: React.CSSProperties = {};
    if (variant === "contained")
      vs = {
        background: disabled ? DS.gray200 : isH ? DS.gradientDark : DS.indigo,
        color: disabled ? DS.gray400 : DS.white,
        border: "none",
        boxShadow: disabled
          ? "none"
          : isH
            ? "0 6px 20px rgba(74,77,201,0.35)"
            : "0 2px 8px rgba(74,77,201,0.2)",
        transform: isH ? "translateY(-1px)" : "translateY(0)",
      };
    else if (variant === "outlined")
      vs = {
        background: disabled ? DS.white : isH ? `${DS.indigo}08` : DS.white,
        color: disabled ? DS.gray400 : DS.indigo,
        border: `2px solid ${disabled ? DS.gray200 : DS.indigo}`,
        boxShadow: "none",
        transform: isH ? "translateY(-1px)" : "translateY(0)",
      };
    else if (variant === "highlight")
      vs = {
        background: disabled ? DS.gray200 : isH ? "#e5600f" : DS.orange,
        color: disabled ? DS.gray400 : DS.white,
        border: "none",
        boxShadow: disabled
          ? "none"
          : isH
            ? "0 6px 20px rgba(255,114,18,0.35)"
            : "0 2px 8px rgba(255,114,18,0.2)",
        transform: isH ? "translateY(-1px)" : "translateY(0)",
      };
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setHoveredBtn(id)}
        onMouseLeave={() => setHoveredBtn(null)}
        style={{ ...base, ...vs }}
      >
        {children}
      </button>
    );
  };

  // ==================== MAIN RENDER ====================
  const isSmall = width < 520;

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: width,
        minHeight: height,
        margin: "0 auto",
        fontFamily: DS.fontFamily,
        background: DS.white,
        borderRadius: 20,
        overflow: "hidden",
        position: "relative",
        boxShadow:
          "0 16px 48px rgba(74,77,201,0.10), 0 1px 3px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${DS.gray200}`,
      }}
    >
      {renderConfetti()}

      {/* HEADER */}
      <div
        style={{
          background: `linear-gradient(135deg, ${DS.gradientDark}, ${DS.gradientLight})`,
          padding: isSmall ? "14px 16px" : "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -18,
            right: 30,
            width: 60,
            height: 60,
            border: "3px solid rgba(255,255,255,0.12)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -12,
            left: 60,
            width: 40,
            height: 40,
            border: "2px solid rgba(255,255,255,0.08)",
            borderRadius: 4,
            transform: "rotate(15deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 120,
            width: 0,
            height: 0,
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderBottom: "20px solid rgba(255,255,255,0.06)",
          }}
        />

        <div
          style={{ display: "flex", alignItems: "center", gap: 10, zIndex: 1 }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: DS.radiusSmall,
              background: "rgba(255,255,255,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {lockOpen ? (
              <Unlock size={18} color={DS.white} />
            ) : (
              <Lock size={18} color={DS.white} />
            )}
          </div>
          <span
            style={{
              fontFamily: DS.fontFamily,
              fontSize: isSmall ? 15 : 18,
              fontWeight: 700,
              color: DS.white,
              letterSpacing: 0.3,
            }}
          >
            Puzzle Time — Crack the Code!
          </span>
        </div>
        {showStepIndicator && (
          <div
            style={{
              fontFamily: DS.fontFamily,
              fontSize: 12,
              color: "rgba(255,255,255,0.85)",
              fontWeight: 600,
              background: "rgba(255,255,255,0.15)",
              padding: "4px 14px",
              borderRadius: DS.radiusPill,
              zIndex: 1,
              whiteSpace: "nowrap",
            }}
          >
            Step {currentStepIndex + 1} / {puzzleSteps.length}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div
        style={{
          display: "flex",
          flexDirection: isSmall ? "column" : "row",
          flex: 1,
          padding: isSmall ? 12 : 16,
          gap: isSmall ? 12 : 16,
          overflow: "auto",
          background: DS.gray100,
        }}
      >
        {/* LEFT */}
        <div
          style={{
            flex: isSmall ? "none" : "0 0 44%",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            minWidth: 0,
          }}
        >
          <div
            style={{
              background: DS.white,
              borderRadius: DS.radiusCard,
              padding: isSmall ? "14px 0" : "18px 0",
              display: "flex",
              justifyContent: "center",
              border: `1.5px solid ${DS.gray200}`,
            }}
          >
            {renderLock()}
          </div>
          <div
            style={{
              background: DS.white,
              borderRadius: DS.radiusCard,
              padding: 10,
              display: "flex",
              flexDirection: "column",
              gap: 5,
              border: `1.5px solid ${DS.gray200}`,
            }}
          >
            <div
              style={{
                fontFamily: DS.fontFamily,
                fontSize: 11,
                fontWeight: 700,
                color: DS.indigo,
                textTransform: "uppercase" as const,
                letterSpacing: 1,
                marginBottom: 2,
                paddingLeft: 4,
              }}
            >
              Clues
            </div>
            {DEFAULT_CLUES.map((c, i) => renderClueCard(c, i))}
          </div>
        </div>

        {/* RIGHT */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            minWidth: 0,
          }}
        >
          <div
            key={stepAnimKey}
            style={{
              background: DS.white,
              borderRadius: DS.radiusCard,
              padding: isSmall ? 14 : 18,
              animation: "slideInScale 0.45s ease-out",
              border: `1.5px solid ${DS.gray200}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: DS.radiusPill,
                  background: `linear-gradient(135deg, ${DS.gradientDark}, ${DS.gradientLight})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: DS.white,
                  fontFamily: DS.fontFamily,
                  fontWeight: 700,
                  fontSize: 13,
                  animation: "popIn 0.4s ease-out 0.08s both",
                  flexShrink: 0,
                }}
              >
                {currentStepIndex + 1}
              </div>
              <h3
                style={{
                  fontFamily: DS.fontFamily,
                  fontSize: isSmall ? 15 : 17,
                  fontWeight: 700,
                  color: DS.gradientDark,
                  margin: 0,
                  animation: "fadeInRight 0.45s ease-out 0.12s both",
                }}
              >
                {currentStep.title}
              </h3>
            </div>
            <p
              style={{
                fontFamily: DS.fontFamily,
                fontSize: 12.5,
                fontWeight: 500,
                color: DS.gray900,
                lineHeight: 1.65,
                margin: 0,
                animation: "fadeInUp 0.45s ease-out 0.18s both",
              }}
            >
              {currentStep.description}
            </p>
          </div>

          <div
            style={{
              background: DS.orangeLight,
              borderRadius: 12,
              padding: "10px 14px",
              borderLeft: `4px solid ${DS.orange}`,
              animation: "fadeInUp 0.45s ease-out 0.24s both",
            }}
          >
            <div
              style={{
                fontFamily: DS.fontFamily,
                fontSize: 11,
                fontWeight: 700,
                color: DS.orange,
                marginBottom: 3,
                display: "flex",
                alignItems: "center",
                gap: 5,
                textTransform: "uppercase" as const,
                letterSpacing: 0.5,
              }}
            >
              <Star size={12} color={DS.orange} fill={DS.orange} /> Think About
              It
            </div>
            <p
              style={{
                fontFamily: DS.fontFamily,
                fontSize: 11.5,
                fontWeight: 500,
                color: "#7a4a00",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {currentStep.reasoning}
            </p>
          </div>

          {currentStepIndex >= 1 && renderGrid()}
          {renderVerify()}
        </div>
      </div>

      {/* NAV */}
      {showNavigation && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: isSmall ? "10px 12px" : "12px 20px",
            borderTop: `1px solid ${DS.gray200}`,
            background: DS.white,
            gap: 8,
          }}
        >
          <SBtn
            onClick={prevStep}
            disabled={currentStepIndex === 0 || isAnimating}
            variant="outlined"
            id="prev"
          >
            <ChevronLeft size={15} /> Previous
          </SBtn>
          <div
            style={{
              display: "flex",
              gap: 5,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {puzzleSteps.map((_, i) => (
              <button
                key={i}
                onClick={() => goToStep(i)}
                style={{
                  width: i === currentStepIndex ? 22 : 8,
                  height: 8,
                  borderRadius: DS.radiusPill,
                  border: "none",
                  background:
                    i === currentStepIndex
                      ? `linear-gradient(90deg, ${DS.gradientDark}, ${DS.gradientLight})`
                      : i < currentStepIndex
                        ? DS.indigoLight
                        : DS.gray200,
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                  padding: 0,
                }}
              />
            ))}
          </div>
          <SBtn
            onClick={nextStep}
            disabled={
              currentStepIndex === puzzleSteps.length - 1 || isAnimating
            }
            variant={
              currentStepIndex < puzzleSteps.length - 1
                ? "highlight"
                : "contained"
            }
            id="next"
          >
            Next <ChevronRight size={15} />
          </SBtn>
        </div>
      )}

      {/* FOOTER */}
      <div
        style={{
          background: `linear-gradient(90deg, ${DS.gradientDark}, ${DS.indigo})`,
          padding: "7px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: DS.fontFamily,
            fontSize: 10.5,
            color: "rgba(255,255,255,0.75)",
            fontWeight: 500,
            textAlign: "center",
            letterSpacing: 0.2,
          }}
        >
          This is a logic puzzle, not maths! Eliminate impossible digits step by
          step. Try to figure out each digit before clicking Next!
        </span>
      </div>
    </div>
  );
};

export default NumberLockPuzzleTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
