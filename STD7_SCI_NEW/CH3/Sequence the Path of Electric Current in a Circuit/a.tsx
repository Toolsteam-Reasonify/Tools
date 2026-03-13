// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: circuit_current_flow_sequencer.tsx
// Redesigned with Singularity Design System
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
  Check,
  X,
  Zap,
  HelpCircle,
  Award,
  ChevronRight,
  ChevronDown,
  Info,
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

interface SequencerAdditionalProps {
  steps?: {
    id: number;
    label: string;
    description?: string;
    icon?: string;
    hint?: string;
  }[];
  correctOrder?: number[];
  title?: string;
  subtitle?: string;
  instructionText?: string;
  completionMessage?: string;
  hintText?: string;
  showHintButton?: boolean;
  showStepNumbers?: boolean;
  showDescriptions?: boolean;
  cardColor?: string;
  correctColor?: string;
  incorrectColor?: string;
  celebrationEmoji?: string;
}

interface CircuitCurrentFlowSequencerProps {
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
    additionalProps?: SequencerAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== DESIGN SYSTEM TOKENS ====================

const DS = {
  // Primary
  indigo: "#4A4DC9",
  orange: "#FF7212",
  // Gradient endpoints
  purple: "#533086",
  tangerine: "#FC9145",
  // Light variants
  lightIndigo: "#C1C1EA",
  lightOrange: "#FFF3E4",
  // Neutrals
  dark: "#4E4E4E",
  grey: "#CACACA",
  lightGrey: "#EBEBEB",
  offWhite: "#F5F5F5",
  white: "#FFFFFF",
  // Semantic
  correct: "#2DB564",
  correctLight: "#E8F8EF",
  incorrect: "#E84D4D",
  incorrectLight: "#FDECEC",
  // Radius
  radiusPill: 40,
  radiusCard: 16,
  radiusSmall: 10,
  // Shadows
  shadowSm: "0 2px 8px rgba(74, 77, 201, 0.08)",
  shadowMd: "0 4px 16px rgba(74, 77, 201, 0.12)",
  shadowLg: "0 8px 32px rgba(74, 77, 201, 0.16)",
  shadowGlow: "0 0 20px rgba(74, 77, 201, 0.25)",
  // Font
  fontFamily: "'Poppins', 'Segoe UI', system-ui, sans-serif",
};

// ==================== DEFAULT SEQUENCE STEPS ====================

interface SequenceCard {
  id: number;
  label: string;
  description: string;
  icon: string;
  hint: string;
}

const DEFAULT_SEQUENCE_CARDS: SequenceCard[] = [
  {
    id: 1,
    label: "Current starts at the positive terminal (+) of the cell",
    description:
      "Electric current begins its journey from the metal cap (positive terminal) of the cell.",
    icon: "🔋",
    hint: "Where does current START? Think about the positive terminal of the cell!",
  },
  {
    id: 2,
    label: "Current flows through the connecting wire towards the lamp",
    description:
      "The current travels along the copper wire, which is a good conductor of electricity.",
    icon: "〰️",
    hint: "After leaving the cell, what does the current travel through to reach the lamp?",
  },
  {
    id: 3,
    label: "Current enters the lamp through the metal case terminal",
    description:
      "The current enters the incandescent lamp via one of its terminals — the metal case at the base.",
    icon: "🔌",
    hint: "The current has reached the lamp! Through which part does it enter — think about the base of the bulb.",
  },
  {
    id: 4,
    label: "Current passes through the filament — it glows!",
    description:
      "The thin filament inside the glass bulb heats up and glows brightly, producing light.",
    icon: "💡",
    hint: "Inside the lamp, what thin wire heats up and produces light?",
  },
  {
    id: 5,
    label: "Current exits through the metal tip terminal of the lamp",
    description:
      "After passing through the filament, current exits via the second terminal — the metal tip.",
    icon: "🔌",
    hint: "After glowing through the filament, the current must exit the lamp. Which terminal does it leave from?",
  },
  {
    id: 6,
    label: "Current flows back through the return wire",
    description:
      "The current travels back through another connecting wire towards the cell.",
    icon: "〰️",
    hint: "The current has left the lamp. How does it travel back towards the cell?",
  },
  {
    id: 7,
    label: "Current returns to the negative terminal (−) — loop complete!",
    description:
      "The current arrives at the flat metal disc (negative terminal), completing the circuit loop.",
    icon: "🔄",
    hint: "Almost done! Where does the current end up to complete the full circuit loop? Think about the opposite terminal.",
  },
];

// ==================== ANIMATION HELPERS ====================

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
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  return n1 * (t -= 2.625 / d1) * t + 0.984375;
};
const easeInOutQuad = (t: number): number =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

// ==================== SHUFFLE HELPER ====================

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

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
    @keyframes popIn {
        0% { transform: scale(0.6); opacity: 0; }
        60% { transform: scale(1.06); }
        100% { transform: scale(1); opacity: 1; }
    }
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.03); }
    }
    @keyframes shakeX {
        0%, 100% { transform: translateX(0); }
        15% { transform: translateX(-7px); }
        30% { transform: translateX(7px); }
        45% { transform: translateX(-5px); }
        60% { transform: translateX(5px); }
        75% { transform: translateX(-2px); }
        90% { transform: translateX(2px); }
    }
    @keyframes correctPop {
        0% { transform: scale(1); }
        25% { transform: scale(1.06); }
        50% { transform: scale(0.98); }
        100% { transform: scale(1); }
    }
    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }
    @keyframes confettiFall {
        0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(80px) rotate(540deg); opacity: 0; }
    }
    @keyframes glowPulse {
        0%, 100% { box-shadow: 0 0 8px rgba(74, 77, 201, 0.2); }
        50% { box-shadow: 0 0 24px rgba(74, 77, 201, 0.45); }
    }
    @keyframes flowDash {
        0% { stroke-dashoffset: 40; }
        100% { stroke-dashoffset: 0; }
    }
    @keyframes celebrate {
        0% { transform: scale(0) rotate(-8deg); opacity: 0; }
        50% { transform: scale(1.1) rotate(2deg); }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    @keyframes starBurst {
        0% { transform: scale(0) rotate(0deg); opacity: 0; }
        50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
        100% { transform: scale(1) rotate(360deg); opacity: 1; }
    }
    @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-30px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes dragPulse {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
    }
    @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    @keyframes rippleOut {
        0% { transform: scale(1); opacity: 0.4; }
        100% { transform: scale(2.5); opacity: 0; }
    }
    @keyframes floatEmoji {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(-40px) scale(1.3); opacity: 0; }
    }
    @keyframes slotReveal {
        0% { opacity: 0; transform: translateX(-20px) scale(0.95); }
        100% { opacity: 1; transform: translateX(0) scale(1); }
    }
    @keyframes borderPulse {
        0%, 100% { border-color: #C1C1EA; }
        50% { border-color: #4A4DC9; }
    }
    @keyframes insertIndicator {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
    }
`;

// ==================== MAIN COMPONENT ====================

const CircuitCurrentFlowSequencer: React.FC<
  CircuitCurrentFlowSequencerProps
> = ({ props = {}, setStepDetails, stopAutoNext, setStopAutoNext }) => {
  // ─── CONFIG ───
  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 600,
      themeColor: props.themeColor ?? DS.indigo,
      darkMode: props.darkMode ?? false,
      animationSpeed: props.animationSpeed ?? 1,
    }),
    [props],
  );

  // ─── ADDITIONAL PROPS ───
  const additionalProps = props.additionalProps || {};

  const seqConfig = useMemo(
    () => ({
      title: additionalProps.title ?? "Trace the Path of Electric Current",
      subtitle:
        additionalProps.subtitle ??
        "NCERT Grade 7 · Chapter 3 — Electricity: Circuits and their Components",
      instructionText:
        additionalProps.instructionText ??
        "Arrange these 7 steps in the correct order to trace the path of electric current! Start from where current begins and follow the complete loop. Drag to rearrange!",
      completionMessage:
        additionalProps.completionMessage ??
        "Excellent! You traced the complete loop of electric current! Remember — any break in this loop stops all current flow!",
      hintText:
        additionalProps.hintText ??
        "Where does current START? Think about the positive terminal of the cell!",
      showHintButton: additionalProps.showHintButton ?? true,
      showStepNumbers: additionalProps.showStepNumbers ?? true,
      showDescriptions: additionalProps.showDescriptions ?? true,
      correctColor: additionalProps.correctColor ?? DS.correct,
      incorrectColor: additionalProps.incorrectColor ?? DS.incorrect,
      celebrationEmoji: additionalProps.celebrationEmoji ?? "⚡",
    }),
    [additionalProps],
  );

  const sequenceCards: SequenceCard[] = useMemo(() => {
    if (additionalProps.steps && additionalProps.steps.length > 0) {
      return additionalProps.steps.map((s, idx) => ({
        id: s.id,
        label: s.label,
        description: s.description || "",
        icon: s.icon || "⚡",
        hint: s.hint || `Think about what happens at step ${idx + 1}...`,
      }));
    }
    return DEFAULT_SEQUENCE_CARDS;
  }, [additionalProps.steps]);

  const correctOrder = useMemo(() => {
    if (
      additionalProps.correctOrder &&
      additionalProps.correctOrder.length > 0
    ) {
      return additionalProps.correctOrder;
    }
    return sequenceCards.map((c) => c.id);
  }, [additionalProps.correctOrder, sequenceCards]);

  // ─── STATE ───
  const [slots, setSlots] = useState<(SequenceCard | null)[]>(() =>
    Array(sequenceCards.length).fill(null),
  );
  const [availableCards, setAvailableCards] = useState<SequenceCard[]>(() =>
    shuffleArray(sequenceCards),
  );
  const [draggedCard, setDraggedCard] = useState<SequenceCard | null>(null);
  const [dragSource, setDragSource] = useState<{
    type: "pool" | "slot";
    index: number;
  } | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);
  const [hoveredPoolIndex, setHoveredPoolIndex] = useState<number | null>(null);
  const [correctSlots, setCorrectSlots] = useState<Set<number>>(new Set());
  const [incorrectSlots, setIncorrectSlots] = useState<Set<number>>(new Set());
  const [shakeSlots, setShakeSlots] = useState<Set<number>>(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [touchDragCard, setTouchDragCard] = useState<SequenceCard | null>(null);
  const [touchPos, setTouchPos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [pressedBtn, setPressedBtn] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const poolCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ─── INJECT KEYFRAMES + FONT ───
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.id = "circuit-sequencer-keyframes-v2";
    styleSheet.textContent = keyframes;
    document.head.appendChild(styleSheet);
    setMounted(true);
    return () => {
      const existing = document.getElementById(
        "circuit-sequencer-keyframes-v2",
      );
      if (existing) document.head.removeChild(existing);
    };
  }, []);

  // ─── DYNAMIC HINT ───
  const currentHintText = useMemo(() => {
    for (let i = 0; i < slots.length; i++) {
      if (!correctSlots.has(i)) {
        const neededCardId = correctOrder[i];
        const neededCard = sequenceCards.find((c) => c.id === neededCardId);
        if (neededCard && neededCard.hint) {
          return neededCard.hint;
        }
        return seqConfig.hintText;
      }
    }
    return seqConfig.hintText;
  }, [slots, correctSlots, correctOrder, sequenceCards, seqConfig.hintText]);

  // ─── SLOT CHECK ───
  const checkSlot = useCallback(
    (slotIndex: number, card: SequenceCard) => {
      if (card.id === correctOrder[slotIndex]) {
        setCorrectSlots((prev) => new Set(prev).add(slotIndex));
        setIncorrectSlots((prev) => {
          const next = new Set(prev);
          next.delete(slotIndex);
          return next;
        });
      } else {
        setIncorrectSlots((prev) => new Set(prev).add(slotIndex));
        setShakeSlots((prev) => new Set(prev).add(slotIndex));
        setTimeout(
          () =>
            setShakeSlots((prev) => {
              const next = new Set(prev);
              next.delete(slotIndex);
              return next;
            }),
          600,
        );
        setCorrectSlots((prev) => {
          const next = new Set(prev);
          next.delete(slotIndex);
          return next;
        });
      }
    },
    [correctOrder],
  );

  // ─── Recheck all filled slots (needed after swaps) ───
  const recheckAllSlots = useCallback(
    (newSlots: (SequenceCard | null)[]) => {
      const newCorrect = new Set<number>();
      const newIncorrect = new Set<number>();
      newSlots.forEach((card, idx) => {
        if (card) {
          if (card.id === correctOrder[idx]) {
            newCorrect.add(idx);
          } else {
            newIncorrect.add(idx);
          }
        }
      });
      setCorrectSlots(newCorrect);
      setIncorrectSlots(newIncorrect);
    },
    [correctOrder],
  );

  // ─── DRAG HANDLERS ───
  const handleDragStart = useCallback(
    (card: SequenceCard, source: { type: "pool" | "slot"; index: number }) => {
      setDraggedCard(card);
      setDragSource(source);
    },
    [],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, slotIndex: number) => {
      e.preventDefault();
      setHoveredSlot(slotIndex);
      setHoveredPoolIndex(null);
    },
    [],
  );

  const handleDragLeave = useCallback(() => {
    setHoveredSlot(null);
  }, []);

  // ─── DROP ON SLOT ───
  const handleDropOnSlot = useCallback(
    (slotIndex: number) => {
      if (!draggedCard || !dragSource) return;
      setHoveredSlot(null);
      setHoveredPoolIndex(null);
      const newSlots = [...slots];
      const newAvailable = [...availableCards];

      if (dragSource.type === "pool") {
        // If slot already has a card, send it back to pool
        if (newSlots[slotIndex]) {
          newAvailable.push(newSlots[slotIndex]!);
        }
        const poolIdx = newAvailable.findIndex((c) => c.id === draggedCard.id);
        if (poolIdx !== -1) newAvailable.splice(poolIdx, 1);
        newSlots[slotIndex] = draggedCard;
      } else if (dragSource.type === "slot") {
        const sourceSlotIdx = dragSource.index;
        const targetCard = newSlots[slotIndex];
        newSlots[slotIndex] = draggedCard;
        newSlots[sourceSlotIdx] = targetCard;
      }

      setSlots(newSlots);
      setAvailableCards(newAvailable);
      setDraggedCard(null);
      setDragSource(null);

      // Recheck all slots after any drop (handles swaps correctly)
      recheckAllSlots(newSlots);

      const allFilled = newSlots.every((s) => s !== null);
      if (allFilled) {
        setTimeout(() => {
          const allCorrect = newSlots.every(
            (card, idx) => card && card.id === correctOrder[idx],
          );
          setAttempts((prev) => prev + 1);
          if (allCorrect) {
            setIsComplete(true);
            setShowConfetti(true);
            setIncorrectSlots(new Set());
            setTimeout(() => setShowConfetti(false), 4500);
          }
        }, 100);
      }
    },
    [
      draggedCard,
      dragSource,
      slots,
      availableCards,
      correctOrder,
      recheckAllSlots,
    ],
  );

  // ─── DROP ON POOL (general area — returns card to pool) ───
  const handleDropOnPool = useCallback(() => {
    if (!draggedCard || !dragSource) return;
    if (dragSource.type === "slot") {
      const newSlots = [...slots];
      newSlots[dragSource.index] = null;
      setSlots(newSlots);
      setAvailableCards((prev) => [...prev, draggedCard]);
      setCorrectSlots((prev) => {
        const n = new Set(prev);
        n.delete(dragSource.index);
        return n;
      });
      setIncorrectSlots((prev) => {
        const n = new Set(prev);
        n.delete(dragSource.index);
        return n;
      });
    }
    setDraggedCard(null);
    setDragSource(null);
    setHoveredSlot(null);
    setHoveredPoolIndex(null);
  }, [draggedCard, dragSource, slots]);

  // ─── DROP ON A SPECIFIC POOL CARD (reorder within pool, or return from slot to specific position) ───
  const handleDropOnPoolCard = useCallback(
    (targetPoolIndex: number) => {
      if (!draggedCard || !dragSource) return;
      setHoveredSlot(null);
      setHoveredPoolIndex(null);

      if (dragSource.type === "pool") {
        // Reorder within pool
        const newAvailable = [...availableCards];
        const sourceIdx = newAvailable.findIndex(
          (c) => c.id === draggedCard.id,
        );
        if (sourceIdx !== -1 && sourceIdx !== targetPoolIndex) {
          newAvailable.splice(sourceIdx, 1);
          // Adjust target index if source was before target
          const adjustedTarget =
            sourceIdx < targetPoolIndex ? targetPoolIndex - 1 : targetPoolIndex;
          newAvailable.splice(adjustedTarget, 0, draggedCard);
          setAvailableCards(newAvailable);
        }
      } else if (dragSource.type === "slot") {
        // Move from slot back to pool at specific position
        const newSlots = [...slots];
        newSlots[dragSource.index] = null;
        setSlots(newSlots);
        const newAvailable = [...availableCards];
        newAvailable.splice(targetPoolIndex, 0, draggedCard);
        setAvailableCards(newAvailable);
        setCorrectSlots((prev) => {
          const n = new Set(prev);
          n.delete(dragSource.index);
          return n;
        });
        setIncorrectSlots((prev) => {
          const n = new Set(prev);
          n.delete(dragSource.index);
          return n;
        });
      }

      setDraggedCard(null);
      setDragSource(null);
    },
    [draggedCard, dragSource, slots, availableCards],
  );

  // ─── POOL CARD DRAG OVER ───
  const handlePoolCardDragOver = useCallback(
    (e: React.DragEvent, poolIndex: number) => {
      e.preventDefault();
      e.stopPropagation();
      setHoveredPoolIndex(poolIndex);
      setHoveredSlot(null);
    },
    [],
  );

  const handlePoolCardDragLeave = useCallback((e: React.DragEvent) => {
    // Only clear if we're actually leaving (not entering a child)
    const relatedTarget = e.relatedTarget as Node;
    if (e.currentTarget && !e.currentTarget.contains(relatedTarget)) {
      setHoveredPoolIndex(null);
    }
  }, []);

  // ─── TOUCH HANDLERS ───
  const handleTouchStart = useCallback(
    (
      card: SequenceCard,
      source: { type: "pool" | "slot"; index: number },
      e: React.TouchEvent,
    ) => {
      e.preventDefault();
      const touch = e.touches[0];
      setTouchDragCard(card);
      setDraggedCard(card);
      setDragSource(source);
      setTouchPos({ x: touch.clientX, y: touch.clientY });
    },
    [],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!touchDragCard) return;
      e.preventDefault();
      const touch = e.touches[0];
      setTouchPos({ x: touch.clientX, y: touch.clientY });

      let foundSlot = false;
      let foundPool = false;

      // Check slots
      slotRefs.current.forEach((slotEl, idx) => {
        if (!slotEl) return;
        const rect = slotEl.getBoundingClientRect();
        if (
          touch.clientX >= rect.left &&
          touch.clientX <= rect.right &&
          touch.clientY >= rect.top &&
          touch.clientY <= rect.bottom
        ) {
          setHoveredSlot(idx);
          foundSlot = true;
        }
      });

      // Check pool cards
      poolCardRefs.current.forEach((cardEl, idx) => {
        if (!cardEl) return;
        const rect = cardEl.getBoundingClientRect();
        if (
          touch.clientX >= rect.left &&
          touch.clientX <= rect.right &&
          touch.clientY >= rect.top &&
          touch.clientY <= rect.bottom
        ) {
          setHoveredPoolIndex(idx);
          foundPool = true;
        }
      });

      if (!foundSlot) setHoveredSlot(null);
      if (!foundPool) setHoveredPoolIndex(null);
    },
    [touchDragCard],
  );

  const handleTouchEnd = useCallback(() => {
    if (!touchDragCard) {
      setTouchDragCard(null);
      setDraggedCard(null);
      setDragSource(null);
      setTouchPos(null);
      setHoveredSlot(null);
      setHoveredPoolIndex(null);
      return;
    }

    if (hoveredSlot !== null) {
      handleDropOnSlot(hoveredSlot);
    } else if (hoveredPoolIndex !== null) {
      handleDropOnPoolCard(hoveredPoolIndex);
    } else if (dragSource?.type === "slot") {
      // Dropped outside any target — return to pool
      handleDropOnPool();
    }

    setTouchDragCard(null);
    setTouchPos(null);
    setHoveredPoolIndex(null);
  }, [
    touchDragCard,
    hoveredSlot,
    hoveredPoolIndex,
    dragSource,
    handleDropOnSlot,
    handleDropOnPoolCard,
    handleDropOnPool,
  ]);

  // ─── RESET ───
  const handleReset = useCallback(() => {
    setSlots(Array(sequenceCards.length).fill(null));
    setAvailableCards(shuffleArray(sequenceCards));
    setCorrectSlots(new Set());
    setIncorrectSlots(new Set());
    setShakeSlots(new Set());
    setIsComplete(false);
    setShowHint(false);
    setShowConfetti(false);
    setAttempts(0);
    setDraggedCard(null);
    setDragSource(null);
    setHoveredPoolIndex(null);
  }, [sequenceCards]);

  // ─── REPORT ───
  useEffect(() => {
    if (setStepDetails) {
      setStepDetails({
        currentStep: correctSlots.size,
        totalSteps: sequenceCards.length,
        isPaused: true,
        currentMode: "practice",
      });
    }
  }, [correctSlots.size, sequenceCards.length, setStepDetails]);

  // ─── THEME ───
  const dm = config.darkMode;
  const bgBase = dm ? "#1A1A2E" : DS.white;
  const bgSurface = dm ? "#16213E" : DS.offWhite;
  const bgCard = dm ? "#1A1A2E" : DS.white;
  const textPrimary = dm ? "#E8E8F0" : DS.dark;
  const textSecondary = dm ? "#8888A8" : "#7A7A8E";
  const borderColor = dm ? "#2A2A4A" : DS.lightGrey;

  // ─── CONFETTI ───
  const confettiParticles = useMemo(() => {
    return Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2.5,
      duration: 1.8 + Math.random() * 2,
      color: [
        DS.indigo,
        DS.orange,
        DS.purple,
        DS.tangerine,
        DS.lightIndigo,
        DS.correct,
      ][i % 6],
      size: 5 + Math.random() * 9,
      shape: i % 4,
    }));
  }, []);

  const progressPercent = (correctSlots.size / sequenceCards.length) * 100;

  // ─── BUTTON HELPER ───
  const getButtonStyle = (
    variant: "contained" | "outlined" | "text",
    id: string,
    customColor?: string,
  ): React.CSSProperties => {
    const isHovered = hoveredBtn === id;
    const isPressed = pressedBtn === id;
    const color = customColor || DS.indigo;

    const base: React.CSSProperties = {
      fontFamily: DS.fontFamily,
      fontSize: 13,
      fontWeight: 600,
      borderRadius: DS.radiusPill,
      padding: "8px 24px",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      border: "none",
      outline: "none",
      whiteSpace: "nowrap" as const,
    };

    if (variant === "contained") {
      return {
        ...base,
        background: isPressed
          ? DS.purple
          : isHovered
            ? `linear-gradient(135deg, ${DS.purple}, ${DS.tangerine})`
            : color,
        color: DS.white,
        boxShadow: isHovered ? DS.shadowMd : DS.shadowSm,
        transform: isPressed
          ? "scale(0.96)"
          : isHovered
            ? "translateY(-1px)"
            : "none",
      };
    }
    if (variant === "outlined") {
      return {
        ...base,
        background: isHovered ? `${color}10` : "transparent",
        color: isHovered ? DS.orange : color,
        border: `1.5px solid ${isHovered ? DS.orange : color}`,
        transform: isPressed ? "scale(0.96)" : "none",
      };
    }
    return {
      ...base,
      background: isHovered ? `${color}08` : "transparent",
      color: isHovered ? DS.orange : color,
      border: "none",
      transform: isPressed ? "scale(0.96)" : "none",
    };
  };

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════

  return (
    <div
      ref={containerRef}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        width: config.width,
        maxWidth: "100%",
        minHeight: config.height,
        background: bgBase,
        borderRadius: 20,
        overflow: "hidden",
        fontFamily: DS.fontFamily,
        color: textPrimary,
        position: "relative",
        boxShadow:
          "0 4px 40px rgba(74, 77, 201, 0.08), 0 1px 3px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        userSelect: "none",
        border: `1px solid ${dm ? "#2A2A4A" : "#E8E8F2"}`,
      }}
    >
      {/* ═══ CONFETTI ═══ */}
      {showConfetti && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 100,
            overflow: "hidden",
          }}
        >
          {confettiParticles.map((p) => (
            <div
              key={p.id}
              style={{
                position: "absolute",
                left: `${p.left}%`,
                top: "-15px",
                width: p.size,
                height: p.size,
                backgroundColor: p.shape === 3 ? "transparent" : p.color,
                border: p.shape === 3 ? `2px solid ${p.color}` : "none",
                borderRadius:
                  p.shape === 0 || p.shape === 3
                    ? "50%"
                    : p.shape === 1
                      ? "0"
                      : "2px",
                clipPath:
                  p.shape === 1
                    ? "polygon(50% 0%, 0% 100%, 100% 100%)"
                    : "none",
                animation: `confettiFall ${p.duration}s ease-in ${p.delay}s both`,
              }}
            />
          ))}
        </div>
      )}

      {/* ═══ HEADER ═══ */}
      <div
        style={{
          background: `linear-gradient(135deg, ${DS.purple} 0%, ${DS.indigo} 40%, ${DS.tangerine} 100%)`,
          backgroundSize: "200% 200%",
          animation: "gradientShift 8s ease infinite",
          padding: "22px 28px 18px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg
          style={{
            position: "absolute",
            top: -10,
            right: -10,
            width: 180,
            height: 180,
            opacity: 0.08,
          }}
          viewBox="0 0 180 180"
        >
          <circle
            cx="90"
            cy="90"
            r="70"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <polygon
            points="90,20 160,160 20,160"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <rect
            x="50"
            y="50"
            width="80"
            height="80"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
        <svg
          style={{
            position: "absolute",
            bottom: -5,
            left: 20,
            width: 120,
            height: 40,
            opacity: 0.12,
          }}
          viewBox="0 0 120 40"
        >
          <path
            d="M0 20 H30 V8 H90 V32 H120"
            stroke="white"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="30" cy="20" r="3" fill="white" />
          <circle cx="90" cy="8" r="3" fill="white" />
        </svg>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            animation: mounted ? "fadeInDown 0.5s ease-out" : "none",
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            ⚡
          </div>
          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: DS.white,
                margin: 0,
                letterSpacing: "-0.01em",
                lineHeight: 1.3,
              }}
            >
              {seqConfig.title}
            </h1>
            <p
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.7)",
                margin: "3px 0 0",
                fontWeight: 500,
                letterSpacing: "0.02em",
              }}
            >
              {seqConfig.subtitle}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div
          style={{
            marginTop: 16,
            height: 5,
            borderRadius: 3,
            background: "rgba(255,255,255,0.15)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: 3,
              background: `linear-gradient(90deg, ${DS.lightOrange}, ${DS.orange})`,
              width: `${progressPercent}%`,
              transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow:
                progressPercent > 0 ? `0 0 12px ${DS.orange}50` : "none",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 7,
            fontSize: 11,
            color: "rgba(255,255,255,0.6)",
            fontWeight: 500,
          }}
        >
          <span>
            {correctSlots.size} of {sequenceCards.length} correct
          </span>
          {attempts > 0 && <span>Attempts: {attempts}</span>}
        </div>
      </div>

      {/* ═══ INSTRUCTION BAR ═══ */}
      {!isComplete && (
        <div
          style={{
            padding: "12px 24px",
            background: dm ? "rgba(74,77,201,0.08)" : DS.lightOrange,
            borderBottom: `1px solid ${dm ? "rgba(74,77,201,0.15)" : "#F5E6D3"}`,
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            animation: mounted ? "fadeInUp 0.4s ease-out 0.15s both" : "none",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: `linear-gradient(135deg, ${DS.orange}20, ${DS.tangerine}20)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: 1,
            }}
          >
            <Info size={15} color={DS.orange} />
          </div>
          <p
            style={{
              fontSize: 12.5,
              color: dm ? "#B8B8D0" : "#6A5A4E",
              margin: 0,
              lineHeight: 1.55,
              flex: 1,
              fontWeight: 500,
            }}
          >
            {seqConfig.instructionText}
          </p>
        </div>
      )}

      {/* ═══ MAIN CONTENT ═══ */}
      <div
        style={{
          flex: 1,
          padding: "18px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          overflowY: "auto",
          background: bgSurface,
        }}
      >
        {isComplete ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              gap: 18,
              padding: "20px 0",
              animation: "celebrate 0.7s ease-out both",
            }}
          >
            <div
              style={{
                width: 84,
                height: 84,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${DS.correct}, #1A9A4A)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 42,
                boxShadow: `0 12px 40px ${DS.correct}40`,
                animation: "starBurst 0.8s ease-out both",
              }}
            >
              🏆
            </div>
            <h2
              style={{
                fontSize: 24,
                fontWeight: 800,
                textAlign: "center",
                background: `linear-gradient(135deg, ${DS.indigo}, ${DS.purple})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                margin: 0,
              }}
            >
              Circuit Complete!
            </h2>
            <p
              style={{
                fontSize: 13.5,
                textAlign: "center",
                color: textSecondary,
                maxWidth: 420,
                lineHeight: 1.65,
                margin: 0,
                fontWeight: 500,
              }}
            >
              {seqConfig.completionMessage}
            </p>

            {/* Animated circuit flow */}
            <div
              style={{
                width: "100%",
                maxWidth: 480,
                height: 72,
                margin: "6px 0",
                animation: "fadeInUp 0.5s ease-out 0.4s both",
              }}
            >
              <svg
                viewBox="0 0 480 72"
                style={{ width: "100%", height: "100%" }}
              >
                <rect
                  x="15"
                  y="18"
                  width="450"
                  height="36"
                  rx="18"
                  fill="none"
                  stroke={DS.lightIndigo}
                  strokeWidth="2.5"
                />
                <rect
                  x="15"
                  y="18"
                  width="450"
                  height="36"
                  rx="18"
                  fill="none"
                  stroke={DS.indigo}
                  strokeWidth="2.5"
                  strokeDasharray="20 10"
                  style={{ animation: "flowDash 1s linear infinite" }}
                />
                <rect
                  x="25"
                  y="24"
                  width="55"
                  height="24"
                  rx="12"
                  fill={DS.indigo}
                />
                <text
                  x="52"
                  y="40"
                  textAnchor="middle"
                  fill="white"
                  fontSize="9"
                  fontWeight="600"
                  fontFamily="Poppins"
                >
                  Cell
                </text>
                {[150, 260, 380].map((x, i) => (
                  <polygon
                    key={i}
                    points={`${x},36 ${x - 8},30 ${x - 8},42`}
                    fill={DS.orange}
                    opacity="0.8"
                  />
                ))}
                <circle
                  cx="240"
                  cy="36"
                  r="15"
                  fill={DS.orange}
                  opacity="0.85"
                />
                <text
                  x="240"
                  y="40"
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                >
                  💡
                </text>
                <text
                  x="28"
                  y="15"
                  fill={DS.indigo}
                  fontSize="11"
                  fontWeight="700"
                  fontFamily="Poppins"
                >
                  +
                </text>
                <text
                  x="452"
                  y="15"
                  fill={DS.incorrect}
                  fontSize="11"
                  fontWeight="700"
                  fontFamily="Poppins"
                >
                  −
                </text>
              </svg>
            </div>

            {/* Ordered steps recap */}
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 5,
                animation: "fadeInUp 0.5s ease-out 0.6s both",
              }}
            >
              {sequenceCards.map((card, idx) => (
                <div
                  key={card.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "7px 14px",
                    borderRadius: DS.radiusSmall,
                    background: dm ? "rgba(45,181,100,0.08)" : DS.correctLight,
                    border: `1px solid ${DS.correct}25`,
                    animation: `slideInLeft 0.35s ease-out ${0.7 + idx * 0.07}s both`,
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: DS.correct,
                      color: DS.white,
                      fontSize: 11,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      lineHeight: 1.4,
                      color: textPrimary,
                    }}
                  >
                    {card.label}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={handleReset}
              onMouseEnter={() => setHoveredBtn("tryAgain")}
              onMouseLeave={() => {
                setHoveredBtn(null);
                setPressedBtn(null);
              }}
              onMouseDown={() => setPressedBtn("tryAgain")}
              onMouseUp={() => setPressedBtn(null)}
              style={{
                ...getButtonStyle("contained", "tryAgain"),
                marginTop: 8,
                padding: "10px 32px",
                fontSize: 14,
              }}
            >
              <RotateCcw size={16} /> Try Again
            </button>
          </div>
        ) : (
          <>
            {/* ═══ SLOTS AREA ═══ */}
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: DS.indigo,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  marginBottom: 2,
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    background: `${DS.indigo}12`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ChevronRight size={12} color={DS.indigo} />
                </div>
                Drop cards in order (1 → {sequenceCards.length})
              </div>

              {slots.map((card, idx) => {
                const isCorrect = correctSlots.has(idx);
                const isIncorrect = incorrectSlots.has(idx);
                const isShaking = shakeSlots.has(idx);
                const isHovered = hoveredSlot === idx && draggedCard !== null;
                const isDraggedFromHere =
                  dragSource?.type === "slot" && dragSource.index === idx;

                return (
                  <div
                    key={idx}
                    ref={(el) => (slotRefs.current[idx] = el)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDragLeave={handleDragLeave}
                    onDrop={() => handleDropOnSlot(idx)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      minHeight: 50,
                      padding: "5px 12px",
                      borderRadius: DS.radiusSmall + 2,
                      border: `2px ${card ? "solid" : "dashed"} ${
                        isCorrect
                          ? DS.correct
                          : isIncorrect
                            ? DS.incorrect
                            : isHovered
                              ? DS.indigo
                              : borderColor
                      }`,
                      background: isCorrect
                        ? dm
                          ? "rgba(45,181,100,0.08)"
                          : DS.correctLight
                        : isIncorrect
                          ? dm
                            ? "rgba(232,77,77,0.08)"
                            : DS.incorrectLight
                          : isHovered
                            ? dm
                              ? "rgba(74,77,201,0.1)"
                              : `${DS.indigo}06`
                            : bgCard,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      animation: isShaking
                        ? "shakeX 0.5s ease-in-out"
                        : isCorrect
                          ? "correctPop 0.4s ease-out"
                          : mounted
                            ? `slotReveal 0.35s ease-out ${0.08 + idx * 0.05}s both`
                            : "none",
                      boxShadow: isCorrect
                        ? `0 2px 12px ${DS.correct}18`
                        : isHovered
                          ? DS.shadowMd
                          : DS.shadowSm,
                      opacity: isDraggedFromHere ? 0.4 : 1,
                    }}
                  >
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        background: isCorrect
                          ? DS.correct
                          : isIncorrect
                            ? DS.incorrect
                            : DS.lightIndigo,
                        color: isCorrect || isIncorrect ? DS.white : DS.indigo,
                        fontSize: 12,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "all 0.3s ease",
                      }}
                    >
                      {isCorrect ? (
                        <Check size={15} strokeWidth={3} />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    {card ? (
                      <div
                        draggable={!isComplete}
                        onDragStart={() =>
                          handleDragStart(card, { type: "slot", index: idx })
                        }
                        onTouchStart={(e) =>
                          handleTouchStart(
                            card,
                            { type: "slot", index: idx },
                            e,
                          )
                        }
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 9,
                          cursor: isComplete ? "default" : "grab",
                          padding: "3px 0",
                        }}
                      >
                        <span style={{ fontSize: 18, flexShrink: 0 }}>
                          {card.icon}
                        </span>
                        <span
                          style={{
                            fontSize: 12.5,
                            fontWeight: 600,
                            lineHeight: 1.4,
                            color: isCorrect ? DS.correct : textPrimary,
                          }}
                        >
                          {card.label}
                        </span>
                      </div>
                    ) : (
                      <div
                        style={{
                          flex: 1,
                          fontSize: 12,
                          color: isHovered ? DS.indigo : textSecondary,
                          fontStyle: "italic",
                          fontWeight: 500,
                          opacity: 0.55,
                          transition: "all 0.3s ease",
                        }}
                      >
                        {isHovered
                          ? "Release to place here"
                          : `Drop step ${idx + 1} here...`}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ═══ AVAILABLE CARDS POOL ═══ */}
            {availableCards.length > 0 && (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={handleDropOnPool}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 7,
                  marginTop: 6,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: DS.orange,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    marginBottom: 2,
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 6,
                      background: `${DS.orange}14`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Zap size={12} color={DS.orange} />
                  </div>
                  Available Steps — Drag to a slot above
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                  {availableCards.map((card, idx) => {
                    const isBeingDragged =
                      draggedCard?.id === card.id &&
                      dragSource?.type === "pool";
                    const isDropTarget =
                      hoveredPoolIndex === idx &&
                      draggedCard !== null &&
                      draggedCard.id !== card.id;

                    return (
                      <div
                        key={card.id}
                        ref={(el) => (poolCardRefs.current[idx] = el)}
                        style={{ position: "relative" }}
                      >
                        {/* Drop indicator line above this card */}
                        {isDropTarget && (
                          <div
                            style={{
                              position: "absolute",
                              top: -4,
                              left: 8,
                              right: 8,
                              height: 3,
                              borderRadius: 2,
                              background: `linear-gradient(90deg, ${DS.indigo}, ${DS.orange})`,
                              animation:
                                "insertIndicator 1s ease-in-out infinite",
                              zIndex: 5,
                              boxShadow: `0 0 8px ${DS.indigo}50`,
                            }}
                          />
                        )}
                        <div
                          draggable
                          onDragStart={() =>
                            handleDragStart(card, { type: "pool", index: idx })
                          }
                          onDragOver={(e) => handlePoolCardDragOver(e, idx)}
                          onDragLeave={handlePoolCardDragLeave}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDropOnPoolCard(idx);
                          }}
                          onTouchStart={(e) =>
                            handleTouchStart(
                              card,
                              { type: "pool", index: idx },
                              e,
                            )
                          }
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "10px 16px",
                            borderRadius: DS.radiusCard,
                            background: bgCard,
                            border: `1.5px solid ${isDropTarget ? DS.indigo : borderColor}`,
                            cursor: "grab",
                            transition:
                              "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                            boxShadow: isDropTarget ? DS.shadowMd : DS.shadowSm,
                            animation: mounted
                              ? `popIn 0.4s ease-out ${0.25 + idx * 0.06}s both`
                              : "none",
                            opacity: isBeingDragged ? 0.35 : 1,
                            transform: isDropTarget
                              ? "translateY(3px)"
                              : "none",
                          }}
                          onMouseEnter={(e) => {
                            if (!isBeingDragged) {
                              const el = e.currentTarget;
                              el.style.transform =
                                "translateY(-2px) scale(1.015)";
                              el.style.boxShadow = DS.shadowMd;
                              el.style.borderColor = DS.indigo;
                            }
                          }}
                          onMouseLeave={(e) => {
                            const el = e.currentTarget;
                            el.style.transform = "none";
                            el.style.boxShadow = DS.shadowSm;
                            el.style.borderColor = borderColor;
                          }}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            style={{ flexShrink: 0 }}
                          >
                            <circle
                              cx="5"
                              cy="3"
                              r="1.5"
                              fill={textSecondary}
                            />
                            <circle
                              cx="11"
                              cy="3"
                              r="1.5"
                              fill={textSecondary}
                            />
                            <circle
                              cx="5"
                              cy="8"
                              r="1.5"
                              fill={textSecondary}
                            />
                            <circle
                              cx="11"
                              cy="8"
                              r="1.5"
                              fill={textSecondary}
                            />
                            <circle
                              cx="5"
                              cy="13"
                              r="1.5"
                              fill={textSecondary}
                            />
                            <circle
                              cx="11"
                              cy="13"
                              r="1.5"
                              fill={textSecondary}
                            />
                          </svg>
                          <span style={{ fontSize: 20, flexShrink: 0 }}>
                            {card.icon}
                          </span>
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                lineHeight: 1.4,
                                color: textPrimary,
                              }}
                            >
                              {card.label}
                            </div>
                            {seqConfig.showDescriptions && card.description && (
                              <div
                                style={{
                                  fontSize: 11,
                                  color: textSecondary,
                                  marginTop: 3,
                                  lineHeight: 1.45,
                                  fontWeight: 400,
                                }}
                              >
                                {card.description}
                              </div>
                            )}
                          </div>
                          <div
                            style={{
                              padding: "3px 10px",
                              borderRadius: DS.radiusPill,
                              background: DS.lightIndigo,
                              fontSize: 9,
                              fontWeight: 700,
                              color: DS.indigo,
                              letterSpacing: "0.08em",
                              animation: "dragPulse 2.5s ease-in-out infinite",
                              flexShrink: 0,
                            }}
                          >
                            DRAG
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ═══ BOTTOM BAR ═══ */}
      {!isComplete && (
        <div
          style={{
            padding: "12px 24px 16px",
            background: bgCard,
            borderTop: `1px solid ${borderColor}`,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          {seqConfig.showHintButton && (
            <button
              onClick={() => setShowHint((prev) => !prev)}
              onMouseEnter={() => setHoveredBtn("hint")}
              onMouseLeave={() => {
                setHoveredBtn(null);
                setPressedBtn(null);
              }}
              onMouseDown={() => setPressedBtn("hint")}
              onMouseUp={() => setPressedBtn(null)}
              style={{
                ...getButtonStyle(
                  showHint ? "contained" : "outlined",
                  "hint",
                  showHint ? DS.orange : DS.indigo,
                ),
                padding: "7px 18px",
                fontSize: 12,
                ...(showHint ? { background: DS.orange, color: DS.white } : {}),
              }}
            >
              <HelpCircle size={14} /> {showHint ? "Hide Hint" : "Show Hint"}
            </button>
          )}
          {showHint && (
            <div
              style={{
                flex: 1,
                fontSize: 12,
                color: DS.orange,
                fontWeight: 500,
                lineHeight: 1.5,
                animation: "fadeInUp 0.3s ease-out",
                padding: "6px 14px",
                background: DS.lightOrange,
                borderRadius: DS.radiusSmall,
                border: `1px solid ${DS.tangerine}25`,
              }}
            >
              💡 {currentHintText}
            </div>
          )}
          <div style={{ flex: showHint ? 0 : 1 }} />
          <button
            onClick={handleReset}
            onMouseEnter={() => setHoveredBtn("reset")}
            onMouseLeave={() => {
              setHoveredBtn(null);
              setPressedBtn(null);
            }}
            onMouseDown={() => setPressedBtn("reset")}
            onMouseUp={() => setPressedBtn(null)}
            style={{
              ...getButtonStyle("outlined", "reset", DS.dark),
              padding: "7px 18px",
              fontSize: 12,
            }}
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      )}

      {/* ═══ TOUCH DRAG GHOST ═══ */}
      {touchDragCard && touchPos && (
        <div
          style={{
            position: "fixed",
            left: touchPos.x - 110,
            top: touchPos.y - 28,
            width: 220,
            padding: "9px 14px",
            borderRadius: DS.radiusCard,
            background: `linear-gradient(135deg, ${DS.purple}, ${DS.indigo})`,
            color: DS.white,
            fontSize: 12,
            fontWeight: 600,
            fontFamily: DS.fontFamily,
            pointerEvents: "none",
            zIndex: 9999,
            boxShadow: "0 16px 40px rgba(74, 77, 201, 0.4)",
            display: "flex",
            alignItems: "center",
            gap: 9,
            opacity: 0.92,
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <span>{touchDragCard.icon}</span>
          <span style={{ lineHeight: 1.3 }}>{touchDragCard.label}</span>
        </div>
      )}
    </div>
  );
};

export default CircuitCurrentFlowSequencer;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
