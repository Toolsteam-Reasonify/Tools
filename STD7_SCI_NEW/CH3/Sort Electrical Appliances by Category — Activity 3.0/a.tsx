import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Check, X, RotateCcw, Zap, Award, Star, ChevronDown, ChevronUp } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: electricity_categorization_tool.tsx
// Topic: Uses of Electricity in Daily Life
// Grade 7 Science — NCERT Chapter 3
// ═══════════════════════════════════════════════════════════════════════════

// ==================== TYPE DEFINITIONS ====================

type ModeType = 'learn' | 'practice' | 'real_world' | 'hands_on';

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
    type: 'intro' | 'explanation' | 'practice' | 'real_world' | 'hands_on';
    mode: ModeType;
    data?: Record<string, unknown>;
}

interface BaseDataInterface {
    themeColor?: string;
    autoPlayDuration?: number;
}

interface CategoryItem {
    id: string;
    label: string;
    color: string;
    bgLight: string;
    icon: string;
    border: string;
}

interface ApplianceItem {
    id: string;
    name: string;
    category: string;
    emoji: string;
}

interface CelebrationParticle {
    id: number;
    x: number;
    color: string;
    delay: number;
    duration: number;
    size: number;
    shape: 'circle' | 'square';
}

// ADDITIONAL PROPS - TOOL SPECIFIC
interface ElectricityCategorizationAdditionalProps {
    title?: string;
    subtitle?: string;
    categories?: CategoryItem[];
    appliances?: ApplianceItem[];
}

interface ElectricityCategorizationProps {
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
        additionalProps?: ElectricityCategorizationAdditionalProps;
    };
    setStepDetails?: (stepDetails: StepDetails) => void;
    stopAutoNext?: boolean;
    setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== DEFAULT DATA ====================

const DEFAULT_CATEGORIES: CategoryItem[] = [
    { id: 'cooking', label: 'Cooking', color: '#DC2626', bgLight: '#FEE2E2', icon: '🍳', border: '#FECACA' },
    { id: 'lighting', label: 'Lighting', color: '#D97706', bgLight: '#FEF3C7', icon: '💡', border: '#FDE68A' },
    { id: 'transportation', label: 'Transportation', color: '#2563EB', bgLight: '#DBEAFE', icon: '🚆', border: '#BFDBFE' },
    { id: 'heating_cooling', label: 'Heating & Cooling', color: '#0891B2', bgLight: '#CFFAFE', icon: '❄️', border: '#A5F3FC' },
    { id: 'entertainment', label: 'Entertainment', color: '#7C3AED', bgLight: '#EDE9FE', icon: '🎬', border: '#DDD6FE' },
    { id: 'communication', label: 'Communication', color: '#059669', bgLight: '#D1FAE5', icon: '📱', border: '#A7F3D0' },
    { id: 'others', label: 'Others', color: '#6B7280', bgLight: '#F3F4F6', icon: '⚡', border: '#E5E7EB' },
];

const DEFAULT_APPLIANCES: ApplianceItem[] = [
    { id: 'mixer_grinder', name: 'Mixer Grinder', category: 'cooking', emoji: '🫙' },
    { id: 'electric_kettle', name: 'Electric Kettle', category: 'cooking', emoji: '☕' },
    { id: 'led_bulb', name: 'LED Bulb', category: 'lighting', emoji: '💡' },
    { id: 'street_light', name: 'Street Light', category: 'lighting', emoji: '🏮' },
    { id: 'electric_train', name: 'Electric Train', category: 'transportation', emoji: '🚃' },
    { id: 'escalator', name: 'Escalator', category: 'transportation', emoji: '🪜' },
    { id: 'ceiling_fan', name: 'Ceiling Fan', category: 'heating_cooling', emoji: '🌀' },
    { id: 'air_conditioner', name: 'Air Conditioner', category: 'heating_cooling', emoji: '🧊' },
    { id: 'television', name: 'Television', category: 'entertainment', emoji: '📺' },
    { id: 'radio', name: 'Radio', category: 'entertainment', emoji: '📻' },
    { id: 'mobile_phone', name: 'Mobile Phone', category: 'communication', emoji: '📞' },
    { id: 'internet_router', name: 'Internet Router', category: 'communication', emoji: '📡' },
    { id: 'computer', name: 'Computer', category: 'others', emoji: '💻' },
    { id: 'water_pump', name: 'Water Pump', category: 'others', emoji: '🔧' },
];

// ==================== ANIMATION HELPERS ====================

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeInOutQuad = (t: number): number =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const easeOutElastic = (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1
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

const keyframes: string = `
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes popIn { 0% { transform: scale(0); opacity: 0; } 70% { transform: scale(1.12); } 100% { transform: scale(1); opacity: 1; } }
  @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); } 20%, 40%, 60%, 80% { transform: translateX(6px); } }
  @keyframes correctPulse { 0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); } 70% { box-shadow: 0 0 0 14px rgba(34,197,94,0); } 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); } }
  @keyframes wrongPulse { 0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); } 70% { box-shadow: 0 0 0 14px rgba(239,68,68,0); } 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); } }
  @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  @keyframes confettiFall { 0% { transform: translateY(-10px) rotate(0deg); opacity: 1; } 100% { transform: translateY(600px) rotate(720deg); opacity: 0; } }
  @keyframes bounceIn { 0% { transform: scale(0.3); opacity: 0; } 50% { transform: scale(1.08); } 70% { transform: scale(0.95); } 100% { transform: scale(1); opacity: 1; } }
  @keyframes slideInLeft { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes slideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes glowPulse { 0%, 100% { box-shadow: 0 0 5px rgba(217,119,6,0.3); } 50% { box-shadow: 0 0 20px rgba(217,119,6,0.6); } }
  @keyframes starSpin { from { transform: rotate(0deg) scale(1); } 50% { transform: rotate(180deg) scale(1.3); } to { transform: rotate(360deg) scale(1); } }
  @keyframes cardFloat { 0%, 100% { transform: translateY(0) rotate(0deg); } 25% { transform: translateY(-3px) rotate(0.5deg); } 75% { transform: translateY(2px) rotate(-0.5deg); } }
  @keyframes dropGlow { 0% { filter: brightness(1); } 50% { filter: brightness(1.2); } 100% { filter: brightness(1); } }
  @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes ripple { 0% { transform: scale(0); opacity: 0.5; } 100% { transform: scale(4); opacity: 0; } }
  @keyframes highlight { 0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); } 50% { box-shadow: 0 0 0 10px rgba(59,130,246,0.3); } }
  @keyframes jump { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
  @keyframes countUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes drawLine { from { stroke-dashoffset: 1000; } to { stroke-dashoffset: 0; } }
  @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
`;

// ==================== MAIN COMPONENT ====================

const ElectricityCategorization: React.FC<ElectricityCategorizationProps> = ({
    props = {},
    setStepDetails,
    stopAutoNext,
    setStopAutoNext,
}) => {
    // ─── Extract props with defaults ──────────────────────────
    const {
        width = 900,
        height = 700,
        themeColor = '#D97706',
        darkMode = false,
        additionalProps = {} as ElectricityCategorizationAdditionalProps,
    } = props;

    const {
        categories = DEFAULT_CATEGORIES,
        appliances = DEFAULT_APPLIANCES,
        title = 'Uses of Electricity in Daily Life',
        subtitle = 'Grade 7 Science — NCERT Chapter 3',
    } = additionalProps;

    // ─── State ─────────────────────────────────────────────────
    const [shuffledAppliances, setShuffledAppliances] = useState<ApplianceItem[]>([]);
    const [placements, setPlacements] = useState<Record<string, string>>({});
    const [feedback, setFeedback] = useState<Record<string, 'correct' | 'wrong'>>({});
    const [score, setScore] = useState<number>(0);
    const [attempts, setAttempts] = useState<number>(0);
    const [completed, setCompleted] = useState<boolean>(false);
    const [draggedItem, setDraggedItem] = useState<ApplianceItem | null>(null);
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const [animatingCards, setAnimatingCards] = useState<Record<string, 'correct' | 'wrong'>>({});
    const [showInstructions, setShowInstructions] = useState<boolean>(true);
    const [mounted, setMounted] = useState<boolean>(false);
    const [celebrationParticles, setCelebrationParticles] = useState<CelebrationParticle[]>([]);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // ─── Initialize ────────────────────────────────────────────
    useEffect(() => {
        setShuffledAppliances(shuffleArray(appliances));
        setTimeout(() => setMounted(true), 100);
    }, [appliances]);

    // ─── Inject Keyframes ─────────────────────────────────────
    useEffect(() => {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'electricity-tool-keyframes';
        styleSheet.textContent = keyframes;
        document.head.appendChild(styleSheet);
        return () => {
            const existing = document.getElementById('electricity-tool-keyframes');
            if (existing) document.head.removeChild(existing);
        };
    }, []);

    // ─── Remaining Appliances ─────────────────────────────────
    const remainingAppliances = useMemo<ApplianceItem[]>(() => {
        return shuffledAppliances.filter((a: ApplianceItem) => !placements[a.id]);
    }, [shuffledAppliances, placements]);

    const totalItems: number = appliances.length;
    const sortedCount: number = Object.keys(placements).length;
    const progressPercent: number = (sortedCount / totalItems) * 100;

    // ─── Check Completion ─────────────────────────────────────
    useEffect(() => {
        if (sortedCount === totalItems && totalItems > 0) {
            setCompleted(true);
            spawnCelebration();
        }
    }, [sortedCount, totalItems]);

    // ─── Celebration Particles ────────────────────────────────
    const spawnCelebration = (): void => {
        const particles: CelebrationParticle[] = [];
        const colors: string[] = ['#DC2626', '#D97706', '#2563EB', '#0891B2', '#7C3AED', '#059669', '#F59E0B', '#EC4899'];
        for (let i = 0; i < 40; i++) {
            particles.push({
                id: i,
                x: Math.random() * 100,
                color: colors[Math.floor(Math.random() * colors.length)],
                delay: Math.random() * 2,
                duration: 2 + Math.random() * 2,
                size: 6 + Math.random() * 10,
                shape: Math.random() > 0.5 ? 'circle' : 'square',
            });
        }
        setCelebrationParticles(particles);
    };

    // ─── Handle Drop ──────────────────────────────────────────
    const handleDrop = useCallback((categoryId: string): void => {
        if (!draggedItem) return;
        const isCorrect: boolean = draggedItem.category === categoryId;
        setAttempts((prev: number) => prev + 1);

        if (isCorrect) {
            setScore((prev: number) => prev + 1);
            setPlacements((prev: Record<string, string>) => ({ ...prev, [draggedItem.id]: categoryId }));
            setFeedback((prev: Record<string, 'correct' | 'wrong'>) => ({ ...prev, [draggedItem.id]: 'correct' }));
            setAnimatingCards((prev: Record<string, 'correct' | 'wrong'>) => ({ ...prev, [draggedItem.id]: 'correct' }));
        } else {
            setFeedback((prev: Record<string, 'correct' | 'wrong'>) => ({ ...prev, [draggedItem.id]: 'wrong' }));
            setAnimatingCards((prev: Record<string, 'correct' | 'wrong'>) => ({ ...prev, [draggedItem.id]: 'wrong' }));
            setTimeout(() => {
                setFeedback((prev: Record<string, 'correct' | 'wrong'>) => {
                    const n = { ...prev };
                    delete n[draggedItem.id];
                    return n;
                });
                setAnimatingCards((prev: Record<string, 'correct' | 'wrong'>) => {
                    const n = { ...prev };
                    delete n[draggedItem.id];
                    return n;
                });
            }, 800);
        }

        setDraggedItem(null);
        setHoveredCategory(null);
    }, [draggedItem]);

    // ─── Drag Handlers ────────────────────────────────────────
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, appliance: ApplianceItem): void => {
        setDraggedItem(appliance);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', appliance.id);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, categoryId: string): void => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setHoveredCategory(categoryId);
    };

    const handleDragLeave = (): void => {
        setHoveredCategory(null);
    };

    const handleDropEvent = (e: React.DragEvent<HTMLDivElement>, categoryId: string): void => {
        e.preventDefault();
        handleDrop(categoryId);
    };

    // ─── Touch Handlers (for mobile) ─────────────────────────
    const handleTouchCard = (appliance: ApplianceItem): void => {
        if (draggedItem && draggedItem.id === appliance.id) {
            setDraggedItem(null);
        } else {
            setDraggedItem(appliance);
        }
    };

    const handleTapCategory = (categoryId: string): void => {
        if (draggedItem) {
            handleDrop(categoryId);
        } else {
            setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
        }
    };

    // ─── Reset ────────────────────────────────────────────────
    const handleReset = (): void => {
        setPlacements({});
        setFeedback({});
        setScore(0);
        setAttempts(0);
        setCompleted(false);
        setDraggedItem(null);
        setAnimatingCards({});
        setCelebrationParticles([]);
        setShuffledAppliances(shuffleArray(appliances));
        setExpandedCategory(null);
    };

    // ─── Get Category Placements ──────────────────────────────
    const getCategoryPlacements = (categoryId: string): ApplianceItem[] => {
        return appliances.filter((a: ApplianceItem) => placements[a.id] === categoryId);
    };

    // ═══════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════

    const bg: string = darkMode
        ? 'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
        : 'linear-gradient(145deg, #FFFBEB 0%, #FEF3C7 30%, #FDE68A 100%)';

    const textColor: string = darkMode ? '#F9FAFB' : '#1F2937';
    const cardBg: string = darkMode ? '#1E293B' : '#FFFFFF';
    const surfaceBg: string = darkMode ? 'rgba(30,41,59,0.8)' : 'rgba(255,255,255,0.85)';

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                maxWidth: width,
                minHeight: height,
                background: bg,
                borderRadius: 24,
                overflow: 'hidden',
                fontFamily: "'Nunito', 'Segoe UI', sans-serif",
                color: textColor,
                position: 'relative',
                boxShadow: '0 25px 60px -12px rgba(0,0,0,0.2)',
                opacity: mounted ? 1 : 0,
                transition: 'opacity 0.6s ease',
            }}
        >
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Baloo+2:wght@500;600;700;800&display=swap"
                rel="stylesheet"
            />

            {/* ── Celebration Confetti ── */}
            {celebrationParticles.map((p: CelebrationParticle) => (
                <div
                    key={p.id}
                    style={{
                        position: 'absolute',
                        left: `${p.x}%`,
                        top: -10,
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        borderRadius: p.shape === 'circle' ? '50%' : '2px',
                        animation: `confettiFall ${p.duration}s ease-in ${p.delay}s both`,
                        zIndex: 100,
                        pointerEvents: 'none',
                    }}
                />
            ))}

            {/* ══════════ HEADER ══════════ */}
            <div
                style={{
                    background: darkMode
                        ? 'linear-gradient(135deg, #D97706 0%, #B45309 100%)'
                        : 'linear-gradient(135deg, #F59E0B 0%, #D97706 60%, #B45309 100%)',
                    padding: '20px 28px 16px',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: -20,
                        right: -20,
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.08)',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: -30,
                        left: 40,
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.06)',
                    }}
                />

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        marginBottom: 6,
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                    <div
                        style={{
                            width: 42,
                            height: 42,
                            borderRadius: 12,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                            fontSize: 22,
                            animation: 'float 3s ease-in-out infinite',
                        }}
                    >
                        ⚡
                    </div>
                    <div>
                        <h1
                            style={{
                                margin: 0,
                                fontSize: 22,
                                fontWeight: 800,
                                color: '#FFF',
                                fontFamily: "'Baloo 2', 'Nunito', sans-serif",
                                letterSpacing: '-0.5px',
                                lineHeight: 1.1,
                            }}
                        >
                            {title}
                        </h1>
                        <p
                            style={{
                                margin: 0,
                                fontSize: 12,
                                color: 'rgba(255,255,255,0.8)',
                                fontWeight: 600,
                            }}
                        >
                            {subtitle}
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div style={{ position: 'relative', zIndex: 1, marginTop: 10 }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 5,
                        }}
                    >
                        <span
                            style={{
                                fontSize: 12,
                                color: 'rgba(255,255,255,0.9)',
                                fontWeight: 700,
                            }}
                        >
                            {sortedCount} / {totalItems} sorted
                        </span>
                        <span
                            style={{
                                fontSize: 12,
                                color: 'rgba(255,255,255,0.9)',
                                fontWeight: 700,
                            }}
                        >
                            Score: {score} ✓{' '}
                            {attempts > 0 ? `(${Math.round((score / attempts) * 100)}%)` : ''}
                        </span>
                    </div>
                    <div
                        style={{
                            height: 10,
                            borderRadius: 10,
                            background: 'rgba(255,255,255,0.2)',
                            overflow: 'hidden',
                            position: 'relative',
                        }}
                    >
                        <div
                            style={{
                                height: '100%',
                                borderRadius: 10,
                                background: 'linear-gradient(90deg, #FDE68A, #FBBF24, #F59E0B)',
                                width: `${progressPercent}%`,
                                transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
                                boxShadow:
                                    progressPercent > 0
                                        ? '0 0 12px rgba(251,191,36,0.5)'
                                        : 'none',
                            }}
                        />
                        {progressPercent > 0 && progressPercent < 100 && (
                            <div
                                style={{
                                    position: 'absolute',
                                    right: `${100 - progressPercent}%`,
                                    top: -2,
                                    width: 14,
                                    height: 14,
                                    borderRadius: '50%',
                                    background: '#FDE68A',
                                    border: '2px solid #D97706',
                                    transform: 'translateX(50%)',
                                    transition: 'right 0.5s cubic-bezier(0.4,0,0.2,1)',
                                    animation: 'glowPulse 2s ease-in-out infinite',
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* ══════════ INSTRUCTIONS BANNER ══════════ */}
            {showInstructions && !completed && (
                <div
                    style={{
                        margin: '12px 16px 0',
                        padding: '10px 16px',
                        borderRadius: 12,
                        background: surfaceBg,
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(217,119,6,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        animation: 'fadeInUp 0.5s ease both',
                    }}
                >
                    <span style={{ fontSize: 20 }}>👆</span>
                    <p
                        style={{
                            margin: 0,
                            fontSize: 13,
                            lineHeight: 1.4,
                            flex: 1,
                            color: darkMode ? '#D1D5DB' : '#4B5563',
                        }}
                    >
                        <strong style={{ color: themeColor }}>Drag & drop</strong> each
                        appliance card into its correct category! On mobile,{' '}
                        <strong style={{ color: themeColor }}>tap a card</strong> then{' '}
                        <strong style={{ color: themeColor }}>tap a category</strong>.
                        Think about the <em>primary purpose</em> of each device.
                    </p>
                    <button
                        onClick={() => setShowInstructions(false)}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 4,
                            color: '#9CA3AF',
                            fontSize: 18,
                            lineHeight: 1,
                        }}
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* ══════════ COMPLETION SCREEN ══════════ */}
            {completed && (
                <div
                    style={{
                        margin: '16px',
                        padding: '28px',
                        borderRadius: 20,
                        background: surfaceBg,
                        backdropFilter: 'blur(10px)',
                        textAlign: 'center',
                        animation: 'bounceIn 0.6s ease both',
                        border: '2px solid rgba(34,197,94,0.3)',
                    }}
                >
                    <div style={{ fontSize: 56, marginBottom: 8, animation: 'starSpin 1s ease both' }}>
                        🏆
                    </div>
                    <h2
                        style={{
                            margin: '0 0 6px',
                            fontSize: 26,
                            fontWeight: 800,
                            fontFamily: "'Baloo 2', sans-serif",
                            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Excellent Work!
                    </h2>
                    <p
                        style={{
                            margin: '0 0 12px',
                            fontSize: 15,
                            color: darkMode ? '#D1D5DB' : '#6B7280',
                        }}
                    >
                        You sorted all {totalItems} appliances!
                    </p>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 24,
                            marginBottom: 16,
                        }}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 28, fontWeight: 800, color: '#059669' }}>
                                {score}
                            </div>
                            <div
                                style={{
                                    fontSize: 11,
                                    color: darkMode ? '#9CA3AF' : '#6B7280',
                                    fontWeight: 600,
                                }}
                            >
                                Correct
                            </div>
                        </div>
                        <div
                            style={{
                                width: 1,
                                background: darkMode ? '#374151' : '#E5E7EB',
                            }}
                        />
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 28, fontWeight: 800, color: '#D97706' }}>
                                {attempts}
                            </div>
                            <div
                                style={{
                                    fontSize: 11,
                                    color: darkMode ? '#9CA3AF' : '#6B7280',
                                    fontWeight: 600,
                                }}
                            >
                                Attempts
                            </div>
                        </div>
                        <div
                            style={{
                                width: 1,
                                background: darkMode ? '#374151' : '#E5E7EB',
                            }}
                        />
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 28, fontWeight: 800, color: '#2563EB' }}>
                                {attempts > 0 ? Math.round((score / attempts) * 100) : 0}%
                            </div>
                            <div
                                style={{
                                    fontSize: 11,
                                    color: darkMode ? '#9CA3AF' : '#6B7280',
                                    fontWeight: 600,
                                }}
                            >
                                Accuracy
                            </div>
                        </div>
                    </div>
                    {score === totalItems && attempts === totalItems && (
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '6px 16px',
                                background: 'linear-gradient(135deg, #FDE68A, #FBBF24)',
                                borderRadius: 20,
                                fontSize: 13,
                                fontWeight: 700,
                                color: '#92400E',
                                marginBottom: 12,
                            }}
                        >
                            <Star size={14} fill="#92400E" /> Perfect Score — All correct on
                            first try!
                        </div>
                    )}
                    <div>
                        <button
                            onClick={handleReset}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '12px 28px',
                                borderRadius: 14,
                                border: 'none',
                                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                                color: '#FFF',
                                fontSize: 15,
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 14px rgba(217,119,6,0.3)',
                            }}
                            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
                                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                                    '0 6px 20px rgba(217,119,6,0.4)';
                            }}
                            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                                    '0 4px 14px rgba(217,119,6,0.3)';
                            }}
                        >
                            <RotateCcw size={16} /> Play Again
                        </button>
                    </div>
                </div>
            )}

            {/* ══════════ MAIN CONTENT ══════════ */}
            {!completed && (
                <div
                    style={{
                        padding: '12px 16px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                    }}
                >
                    {/* ── CATEGORY BINS ── */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                            gap: 8,
                        }}
                    >
                        {categories.map((cat: CategoryItem, idx: number) => {
                            const items: ApplianceItem[] = getCategoryPlacements(cat.id);
                            const isHovered: boolean = hoveredCategory === cat.id;
                            const catTotal: number = appliances.filter(
                                (a: ApplianceItem) => a.category === cat.id
                            ).length;
                            return (
                                <div
                                    key={cat.id}
                                    onDragOver={(e: React.DragEvent<HTMLDivElement>) =>
                                        handleDragOver(e, cat.id)
                                    }
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e: React.DragEvent<HTMLDivElement>) =>
                                        handleDropEvent(e, cat.id)
                                    }
                                    onClick={() => handleTapCategory(cat.id)}
                                    style={{
                                        borderRadius: 14,
                                        padding: '10px 8px 8px',
                                        background: isHovered
                                            ? `linear-gradient(135deg, ${cat.bgLight}, ${cat.border})`
                                            : darkMode
                                                ? 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(30,41,59,0.7))'
                                                : cat.bgLight,
                                        border: `2px ${isHovered ? 'solid' : 'dashed'} ${isHovered ? cat.color : cat.border
                                            }`,
                                        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                                        transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                                        boxShadow: isHovered
                                            ? `0 8px 24px ${cat.color}33, inset 0 0 20px ${cat.color}11`
                                            : '0 2px 8px rgba(0,0,0,0.04)',
                                        cursor: draggedItem ? 'pointer' : 'default',
                                        animation: `fadeInUp 0.4s ease ${idx * 0.06}s both`,
                                        minHeight: 80,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        position: 'relative',
                                    }}
                                >
                                    <span style={{ fontSize: 20, marginBottom: 2 }}>
                                        {cat.icon}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: 11,
                                            fontWeight: 800,
                                            color: cat.color,
                                            textAlign: 'center',
                                            lineHeight: 1.2,
                                            letterSpacing: '0.3px',
                                        }}
                                    >
                                        {cat.label}
                                    </span>
                                    <div
                                        style={{
                                            fontSize: 10,
                                            fontWeight: 700,
                                            color: darkMode ? '#9CA3AF' : '#9CA3AF',
                                            marginTop: 3,
                                            background: darkMode
                                                ? 'rgba(255,255,255,0.06)'
                                                : 'rgba(0,0,0,0.05)',
                                            borderRadius: 8,
                                            padding: '1px 8px',
                                        }}
                                    >
                                        {items.length} / {catTotal}
                                    </div>

                                    {/* Sorted items preview */}
                                    {items.length > 0 && (
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: 3,
                                                marginTop: 5,
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {items.map((item: ApplianceItem) => (
                                                <span
                                                    key={item.id}
                                                    style={{
                                                        fontSize: 9,
                                                        padding: '2px 5px',
                                                        borderRadius: 6,
                                                        background: `${cat.color}18`,
                                                        color: cat.color,
                                                        fontWeight: 700,
                                                        border: `1px solid ${cat.color}33`,
                                                        whiteSpace: 'nowrap',
                                                        animation: 'popIn 0.3s ease both',
                                                    }}
                                                >
                                                    {item.emoji} {item.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Drop zone indicator */}
                                    {isHovered && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                inset: 0,
                                                borderRadius: 12,
                                                background: `${cat.color}0A`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                pointerEvents: 'none',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: 28,
                                                    height: 28,
                                                    borderRadius: '50%',
                                                    background: cat.color,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    animation: 'popIn 0.3s ease both',
                                                    boxShadow: `0 4px 12px ${cat.color}44`,
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        color: '#FFF',
                                                        fontSize: 16,
                                                        fontWeight: 800,
                                                    }}
                                                >
                                                    +
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* ── APPLIANCE CARDS ── */}
                    <div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 8,
                            }}
                        >
                            <h3
                                style={{
                                    margin: 0,
                                    fontSize: 14,
                                    fontWeight: 800,
                                    color: darkMode ? '#D1D5DB' : '#374151',
                                    fontFamily: "'Baloo 2', sans-serif",
                                }}
                            >
                                ⚡ Appliances to Sort ({remainingAppliances.length} remaining)
                            </h3>
                            <button
                                onClick={handleReset}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    padding: '5px 12px',
                                    borderRadius: 8,
                                    border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                                    background: darkMode ? '#1E293B' : '#FFF',
                                    color: darkMode ? '#9CA3AF' : '#6B7280',
                                    fontSize: 11,
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                                    (e.currentTarget as HTMLButtonElement).style.borderColor = themeColor;
                                    (e.currentTarget as HTMLButtonElement).style.color = themeColor;
                                }}
                                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                                    (e.currentTarget as HTMLButtonElement).style.borderColor = darkMode
                                        ? '#374151'
                                        : '#E5E7EB';
                                    (e.currentTarget as HTMLButtonElement).style.color = darkMode
                                        ? '#9CA3AF'
                                        : '#6B7280';
                                }}
                            >
                                <RotateCcw size={12} /> Reset
                            </button>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 8,
                                justifyContent: 'center',
                                minHeight: 60,
                            }}
                        >
                            {remainingAppliances.length === 0 && !completed ? (
                                <div
                                    style={{
                                        padding: '16px',
                                        textAlign: 'center',
                                        color: darkMode ? '#6B7280' : '#9CA3AF',
                                        fontSize: 14,
                                        fontWeight: 600,
                                    }}
                                >
                                    All appliances sorted! 🎉
                                </div>
                            ) : (
                                remainingAppliances.map(
                                    (appliance: ApplianceItem, idx: number) => {
                                        const feedbackState = feedback[appliance.id];
                                        const animState = animatingCards[appliance.id];
                                        const isSelected: boolean =
                                            draggedItem?.id === appliance.id;

                                        return (
                                            <div
                                                key={appliance.id}
                                                draggable
                                                onDragStart={(e: React.DragEvent<HTMLDivElement>) =>
                                                    handleDragStart(e, appliance)
                                                }
                                                onDragEnd={() => {
                                                    setDraggedItem(null);
                                                    setHoveredCategory(null);
                                                }}
                                                onClick={() => handleTouchCard(appliance)}
                                                style={{
                                                    padding: '10px 14px',
                                                    borderRadius: 12,
                                                    background: isSelected
                                                        ? `linear-gradient(135deg, ${themeColor}22, ${themeColor}11)`
                                                        : darkMode
                                                            ? 'linear-gradient(135deg, #1E293B, #334155)'
                                                            : 'linear-gradient(135deg, #FFFFFF, #FEFCE8)',
                                                    border: isSelected
                                                        ? `2px solid ${themeColor}`
                                                        : animState === 'wrong'
                                                            ? '2px solid #EF4444'
                                                            : `2px solid ${darkMode ? '#374151' : '#FDE68A'}`,
                                                    cursor: 'grab',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 8,
                                                    transition:
                                                        'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                                                    animation:
                                                        animState === 'wrong'
                                                            ? 'shake 0.5s ease'
                                                            : animState === 'correct'
                                                                ? 'correctPulse 0.5s ease'
                                                                : `fadeInUp 0.4s ease ${idx * 0.05}s both`,
                                                    boxShadow: isSelected
                                                        ? `0 6px 20px ${themeColor}33`
                                                        : '0 2px 8px rgba(0,0,0,0.06)',
                                                    transform: isSelected
                                                        ? 'scale(1.05)'
                                                        : 'scale(1)',
                                                    userSelect: 'none',
                                                    WebkitUserSelect: 'none',
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                }}
                                                onMouseEnter={(
                                                    e: React.MouseEvent<HTMLDivElement>
                                                ) => {
                                                    if (!isSelected) {
                                                        (e.currentTarget as HTMLDivElement).style.transform =
                                                            'scale(1.04) translateY(-2px)';
                                                        (e.currentTarget as HTMLDivElement).style.boxShadow =
                                                            '0 8px 24px rgba(0,0,0,0.1)';
                                                    }
                                                }}
                                                onMouseLeave={(
                                                    e: React.MouseEvent<HTMLDivElement>
                                                ) => {
                                                    if (!isSelected) {
                                                        (e.currentTarget as HTMLDivElement).style.transform =
                                                            'scale(1)';
                                                        (e.currentTarget as HTMLDivElement).style.boxShadow =
                                                            '0 2px 8px rgba(0,0,0,0.06)';
                                                    }
                                                }}
                                            >
                                                {/* Shimmer effect on selected */}
                                                {isSelected && (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            inset: 0,
                                                            background: `linear-gradient(90deg, transparent 0%, ${themeColor}11 50%, transparent 100%)`,
                                                            backgroundSize: '200% 100%',
                                                            animation:
                                                                'shimmer 1.5s linear infinite',
                                                            pointerEvents: 'none',
                                                        }}
                                                    />
                                                )}

                                                <span
                                                    style={{
                                                        fontSize: 20,
                                                        position: 'relative',
                                                        zIndex: 1,
                                                    }}
                                                >
                                                    {appliance.emoji}
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: 13,
                                                        fontWeight: 700,
                                                        color: darkMode ? '#E5E7EB' : '#1F2937',
                                                        position: 'relative',
                                                        zIndex: 1,
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {appliance.name}
                                                </span>

                                                {/* Feedback icons */}
                                                {feedbackState === 'wrong' && (
                                                    <span
                                                        style={{
                                                            position: 'relative',
                                                            zIndex: 1,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            animation: 'popIn 0.3s ease both',
                                                        }}
                                                    >
                                                        <X
                                                            size={16}
                                                            color="#EF4444"
                                                            strokeWidth={3}
                                                        />
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    }
                                )
                            )}
                        </div>
                    </div>

                    {/* ── Hint text when card selected ── */}
                    {draggedItem && (
                        <div
                            style={{
                                textAlign: 'center',
                                padding: '8px',
                                animation: 'fadeInUp 0.3s ease both',
                                fontSize: 13,
                                fontWeight: 600,
                                color: themeColor,
                            }}
                        >
                            👆 Now tap or drop{' '}
                            <strong>{draggedItem.name}</strong> {draggedItem.emoji} into its
                            category!
                        </div>
                    )}
                </div>
            )}

            {/* ══════════ FOOTER ══════════ */}
            <div
                style={{
                    padding: '8px 16px 12px',
                    textAlign: 'center',
                    borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                        }`,
                }}
            >
                <p
                    style={{
                        margin: 0,
                        fontSize: 10,
                        color: darkMode ? '#6B7280' : '#9CA3AF',
                        fontWeight: 600,
                    }}
                >
                    NCERT Curiosity — Textbook of Science — Grade 7 — Chapter 3:
                    Electricity: Circuits and their Components
                </p>
            </div>
        </div>
    );
};

export default ElectricityCategorization;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════