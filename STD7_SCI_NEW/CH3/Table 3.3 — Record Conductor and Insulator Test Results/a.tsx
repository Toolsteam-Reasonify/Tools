// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: conduction_tester_tool.tsx
// Singularity Design System: #4A4DC9, #FF7212, #533086→#FC9145, Poppins
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Check, X, RotateCcw, Zap, Award, ChevronRight } from "lucide-react";

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

interface MaterialItem {
    sNo: number;
    object: string;
    material: string;
    correctGlows: boolean;
}

interface ConductionTesterAdditionalProps {
    materials?: MaterialItem[];
    tableTitle?: string;
    insightMessage?: string;
    teachingNote?: string;
    showTeachingNote?: boolean;
}

interface ConductionTesterToolProps {
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
        additionalProps?: ConductionTesterAdditionalProps;
    };
    setStepDetails?: (s: StepDetails) => void;
    stopAutoNext?: boolean;
    setStopAutoNext?: (s: boolean) => void;
}

interface RowAnswer {
    glows: boolean | null;
    classification: string | null;
}

interface ConfettiItem {
    id: number;
    x: number;
    y: number;
    color: string;
    delay: number;
    shape: string;
}

interface ScoreData {
    correct: number;
    total: number;
}

// ==================== DEFAULT DATA ====================

const DEFAULT_MATERIALS: MaterialItem[] = [
    { sNo: 1, object: "Stick", material: "Wood", correctGlows: false },
    { sNo: 2, object: "Scale", material: "Plastic", correctGlows: false },
    { sNo: 3, object: "Bangle", material: "Glass", correctGlows: false },
    { sNo: 4, object: "Paper strip", material: "Paper", correctGlows: false },
    { sNo: 5, object: "Candle", material: "Wax", correctGlows: false },
    { sNo: 6, object: "Key", material: "Metal (Iron)", correctGlows: true },
    { sNo: 7, object: "Eraser", material: "Rubber", correctGlows: false },
];

// ==================== ANIMATION HELPERS ====================

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeOutElastic = (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};
const easeInOutQuad = (t: number): number =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

// ==================== EMOJI MAP ====================

const EMOJI_MAP: Record<string, string> = {
    Stick: "\u{1FAB5}",
    Scale: "\uD83D\uDCCF",
    Bangle: "\uD83D\uDC8D",
    "Paper strip": "\uD83D\uDCC4",
    Candle: "\uD83D\uDD6F\uFE0F",
    Key: "\uD83D\uDD11",
    Eraser: "\uD83E\uDDF9",
};

// ==================== SINGULARITY DESIGN TOKENS ====================

const DS = {
    primary: "#4A4DC9",
    primaryDark: "#3638A0",
    accent: "#FF7212",
    accentDark: "#E5650F",
    gradientPO: "linear-gradient(135deg,#533086 0%,#FC9145 100%)",
    gradientP: "linear-gradient(135deg,#4A4DC9 0%,#533086 100%)",
    tintPurple: "#C1C1EA",
    tintPurpleUL: "#F3F2FB",
    tintOrange: "#FFF3E4",
    tintOrangeL: "#FFF9F2",
    dark: "#4E4E4E",
    gray: "#CACACA",
    grayLight: "#EBEBEB",
    grayUL: "#F5F5F5",
    white: "#FFFFFF",
    purple: "#533086",
    orange: "#FC9145",
    correct: "#34B233",
    correctBg: "#EAFBE9",
    incorrect: "#E53935",
    incorrectBg: "#FEECEB",
    font: "'Poppins','Segoe UI',system-ui,sans-serif" as const,
    radiusPill: 100,
    radiusLg: 16,
    radiusMd: 12,
    radiusSm: 8,
};

// ==================== SUB-COMPONENTS ====================

const ConfettiPiece: React.FC<{ shape: string; color: string; size: number }> = ({ shape, color, size }) => {
    if (shape === "triangle") {
        return (
            <svg width={size} height={size} viewBox="0 0 12 12">
                <polygon points="6,1 11,11 1,11" fill={color} />
            </svg>
        );
    }
    if (shape === "square") {
        return <div style={{ width: size, height: size, background: color, borderRadius: 2 }} />;
    }
    return <div style={{ width: size, height: size, background: color, borderRadius: "50%" }} />;
};

const FeedbackIcon: React.FC<{ correct: boolean }> = ({ correct }) => {
    if (correct) {
        return <Check size={15} color={DS.correct} strokeWidth={3} />;
    }
    return <X size={15} color={DS.incorrect} strokeWidth={3} />;
};

interface GlowButtonProps {
    label: string;
    isYes: boolean;
    isSelected: boolean;
    isHovered: boolean;
    isDisabled: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onClick: () => void;
}

const GlowButton: React.FC<GlowButtonProps> = ({
    label,
    isYes,
    isSelected,
    isHovered,
    isDisabled,
    onMouseEnter,
    onMouseLeave,
    onClick,
}) => {
    let bg: string = DS.white;
    let bc: string = DS.gray;
    let tc: string = DS.gray;

    if (isSelected && isYes) {
        bg = DS.accent;
        bc = DS.accent;
        tc = DS.white;
    } else if (isSelected && !isYes) {
        bg = DS.grayUL;
        bc = DS.dark;
        tc = DS.dark;
    } else if (isHovered && !isDisabled) {
        bg = isYes ? DS.tintOrange : DS.grayUL;
        bc = isYes ? DS.accent : DS.dark;
        tc = isYes ? DS.accentDark : DS.dark;
    }

    if (isDisabled) {
        bg = isSelected ? (isYes ? "#FF721218" : "#4E4E4E10") : DS.white;
        bc = DS.grayLight;
        tc = DS.gray;
    }

    const icon: string = isYes ? "\uD83D\uDCA1" : "\u26AB";

    return (
        <button
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            disabled={isDisabled}
            style={{
                height: 32,
                padding: "0 14px",
                borderRadius: DS.radiusPill,
                border: "1.5px solid " + bc,
                background: bg,
                color: tc,
                fontSize: 11.5,
                fontWeight: 600,
                fontFamily: DS.font,
                cursor: isDisabled ? "default" : "pointer",
                transition: "all .2s ease",
                transform: isSelected && !isDisabled ? "scale(1.04)" : "scale(1)",
                display: "flex",
                alignItems: "center",
                gap: 4,
                whiteSpace: "nowrap" as const,
            }}
        >
            {icon + " " + label}
        </button>
    );
};

// ==================== MAIN COMPONENT ====================

const ConductionTesterTool: React.FC<ConductionTesterToolProps> = ({
    props = {},
    setStepDetails,
    stopAutoNext,
    setStopAutoNext,
}) => {
    // ─── CONFIG ───
    const config = useMemo(
        () => ({
            width: props.width ?? 800,
            height: props.height ?? 700,
            themeColor: props.themeColor ?? props.data?.themeColor ?? DS.primary,
            darkMode: props.darkMode ?? false,
            animationSpeed: props.animationSpeed ?? 1,
        }),
        [props]
    );

    const additionalProps = props.additionalProps || {};
    const materials: MaterialItem[] = additionalProps.materials ?? DEFAULT_MATERIALS;
    const tableTitle: string =
        additionalProps.tableTitle ?? "Table 3.3: Identifying Conductors and Insulators";
    const insightMessage: string =
        additionalProps.insightMessage ??
        "The iron key is the ONLY conductor \u2014 because it is the ONLY metal! All metals are conductors of electricity.";
    const teachingNote: string =
        additionalProps.teachingNote ??
        'Activate AFTER the student has built the conduction tester. Let student fill in independently. After submission, highlight: "The key is the ONLY conductor \u2014 because it\'s the ONLY metal!" This leads to the generalization about metals vs non-metals.';

    // ─── STATE (using arrays instead of Set to avoid React serialization issues) ───
    const [answers, setAnswers] = useState<Record<number, RowAnswer>>(() => {
        const init: Record<number, RowAnswer> = {};
        materials.forEach((m) => {
            init[m.sNo] = { glows: null, classification: null };
        });
        return init;
    });
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [showInsight, setShowInsight] = useState<boolean>(false);
    const [showTeachNote, setShowTeachNote] = useState<boolean>(false);
    const [animatedRowIds, setAnimatedRowIds] = useState<number[]>([]);
    const [confetti, setConfetti] = useState<ConfettiItem[]>([]);
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);
    const [bulbGlow, setBulbGlow] = useState<boolean>(false);
    const [scoreData, setScoreData] = useState<ScoreData | null>(null);
    const [hoveredBtnId, setHoveredBtnId] = useState<string | null>(null);

    // ─── INJECT KEYFRAMES ───
    useEffect(() => {
        const el = document.createElement("style");
        el.id = "ct-singularity-styles";
        el.textContent = [
            "@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');",
            "@keyframes ctFIU{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}",
            "@keyframes ctPI{0%{transform:scale(0);opacity:0}60%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}",
            "@keyframes ctPu{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(74,77,201,.35)}50%{transform:scale(1.02);box-shadow:0 0 0 10px rgba(74,77,201,0)}}",
            "@keyframes ctGl{0%,100%{filter:drop-shadow(0 0 6px #FC9145)}50%{filter:drop-shadow(0 0 20px #FC9145) drop-shadow(0 0 40px #FF7212)}}",
            "@keyframes ctSD{from{opacity:0;max-height:0}to{opacity:1;max-height:300px}}",
            "@keyframes ctCf{0%{transform:translateY(0) rotate(0deg) scale(1);opacity:1}100%{transform:translateY(-140px) rotate(720deg) scale(0);opacity:0}}",
            "@keyframes ctBI{0%{transform:scale(.3);opacity:0}50%{transform:scale(1.06)}70%{transform:scale(.96)}100%{transform:scale(1);opacity:1}}",
            "@keyframes ctFl{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}",
            "@keyframes ctOF{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(8px,-6px) scale(1.05)}66%{transform:translate(-5px,4px) scale(.97)}}",
        ].join("\n");
        document.head.appendChild(el);
        return () => {
            const existing = document.getElementById("ct-singularity-styles");
            if (existing && existing.parentNode) {
                existing.parentNode.removeChild(existing);
            }
        };
    }, []);

    // ─── DERIVED ───
    const allDone: boolean = useMemo(() => {
        return materials.every((m) => {
            const a = answers[m.sNo];
            return a !== undefined && a.glows !== null && a.classification !== null;
        });
    }, [answers, materials]);

    const doneCount: number = useMemo(() => {
        return materials.filter((m) => {
            const a = answers[m.sNo];
            return a !== undefined && a.glows !== null && a.classification !== null;
        }).length;
    }, [answers, materials]);

    const checkRowCorrect = useCallback(
        (m: MaterialItem): boolean => {
            const a = answers[m.sNo];
            if (!a) return false;
            const glowOk = a.glows === m.correctGlows;
            const classOk = m.correctGlows
                ? a.classification === "Conductor"
                : a.classification === "Insulator";
            return glowOk && classOk;
        },
        [answers]
    );

    const isRowAnimated = useCallback(
        (sNo: number): boolean => {
            return animatedRowIds.indexOf(sNo) !== -1;
        },
        [animatedRowIds]
    );

    // ─── HANDLERS ───
    const handleGlowToggle = useCallback(
        (sNo: number, value: boolean): void => {
            if (submitted) return;
            setAnswers((prev) => ({
                ...prev,
                [sNo]: { ...prev[sNo], glows: value },
            }));
            if (value) {
                setBulbGlow(true);
                setTimeout(() => setBulbGlow(false), 700);
            }
        },
        [submitted]
    );

    const handleClassChange = useCallback(
        (sNo: number, value: string): void => {
            if (submitted) return;
            setAnswers((prev) => ({
                ...prev,
                [sNo]: { ...prev[sNo], classification: value },
            }));
        },
        [submitted]
    );

    const handleSubmit = useCallback((): void => {
        if (!allDone) return;
        setSubmitted(true);

        let correctCount = 0;
        materials.forEach((m) => {
            if (checkRowCorrect(m)) correctCount++;
        });
        setScoreData({ correct: correctCount, total: materials.length });

        materials.forEach((m, idx) => {
            setTimeout(() => {
                setAnimatedRowIds((prev) => [...prev, m.sNo]);
            }, idx * 220);
        });

        setTimeout(() => {
            setShowInsight(true);
            if (correctCount === materials.length) {
                const shapes = ["circle", "triangle", "square"];
                const colors = [DS.primary, DS.accent, DS.purple, DS.orange, DS.tintPurple, "#FF7212"];
                const particles: ConfettiItem[] = [];
                for (let i = 0; i < 24; i++) {
                    particles.push({
                        id: i,
                        x: 15 + Math.random() * 70,
                        y: 30 + Math.random() * 40,
                        color: colors[Math.floor(Math.random() * colors.length)],
                        delay: Math.random() * 1.2,
                        shape: shapes[Math.floor(Math.random() * shapes.length)],
                    });
                }
                setConfetti(particles);
            }
        }, materials.length * 220 + 500);
    }, [allDone, materials, checkRowCorrect]);

    const handleReset = useCallback((): void => {
        const init: Record<number, RowAnswer> = {};
        materials.forEach((m) => {
            init[m.sNo] = { glows: null, classification: null };
        });
        setAnswers(init);
        setSubmitted(false);
        setShowInsight(false);
        setShowTeachNote(false);
        setAnimatedRowIds([]);
        setConfetti([]);
        setScoreData(null);
    }, [materials]);

    // ─── HEADER COLUMNS ───
    const headerCols: string[] = ["S.No.", "Object", "Material", "Lamp Glows?", "Classification"];

    // ─── RENDER ───
    return (
        <div
            style={{
                width: config.width,
                maxWidth: "100%",
                minHeight: config.height,
                fontFamily: DS.font,
                background: DS.white,
                borderRadius: DS.radiusLg,
                overflow: "hidden",
                boxShadow: "0 4px 24px rgba(74,77,201,.08),0 1px 4px rgba(0,0,0,.04)",
                position: "relative",
                animation: "ctFIU .5s ease-out",
                border: "1px solid " + DS.grayLight,
            }}
        >
            {/* ═══ CONFETTI ═══ */}
            {confetti.map((p) => (
                <div
                    key={"conf-" + String(p.id)}
                    style={{
                        position: "absolute",
                        left: String(p.x) + "%",
                        top: String(p.y) + "%",
                        animation: "ctCf 1.6s ease-out " + String(p.delay) + "s forwards",
                        zIndex: 100,
                        pointerEvents: "none",
                    }}
                >
                    <ConfettiPiece shape={p.shape} color={p.color} size={10} />
                </div>
            ))}

            {/* ═══ HEADER ═══ */}
            <div
                style={{
                    background: DS.gradientPO,
                    padding: "22px 28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Decorative orbs */}
                <div
                    style={{
                        position: "absolute",
                        top: -20,
                        right: -20,
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,.06)",
                        animation: "ctOF 6s ease-in-out infinite",
                        pointerEvents: "none",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: -15,
                        left: "40%",
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,.04)",
                        animation: "ctOF 8s ease-in-out infinite 2s",
                        pointerEvents: "none",
                    }}
                />

                <div style={{ display: "flex", alignItems: "center", gap: 14, zIndex: 1 }}>
                    <div
                        style={{
                            width: 46,
                            height: 46,
                            borderRadius: DS.radiusMd,
                            background: "rgba(255,255,255,.15)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1.5px solid rgba(255,255,255,.2)",
                            animation: bulbGlow ? "ctGl .7s ease-out" : "none",
                            transition: "all .3s ease",
                        }}
                    >
                        <Zap
                            size={22}
                            color={bulbGlow ? "#FFD54F" : DS.tintOrange}
                            fill={bulbGlow ? "#FFD54F" : "none"}
                        />
                    </div>
                    <div>
                        <div
                            style={{
                                color: DS.white,
                                fontSize: 17,
                                fontWeight: 700,
                                letterSpacing: "-.01em",
                                lineHeight: 1.25,
                            }}
                        >
                            {"Activity 3.11: Conduction Tester"}
                        </div>
                        <div
                            style={{
                                color: DS.tintOrange,
                                fontSize: 11.5,
                                fontWeight: 500,
                                marginTop: 3,
                                letterSpacing: ".06em",
                                textTransform: "uppercase",
                            }}
                        >
                            {"Grade 7 Science \u2022 Chapter 3"}
                        </div>
                    </div>
                </div>

                {/* Progress pill */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        background: "rgba(255,255,255,.14)",
                        borderRadius: DS.radiusPill,
                        padding: "8px 18px",
                        zIndex: 1,
                        border: "1px solid rgba(255,255,255,.12)",
                    }}
                >
                    <div
                        style={{
                            width: 80,
                            height: 5,
                            borderRadius: DS.radiusPill,
                            background: "rgba(255,255,255,.2)",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                width: String((doneCount / materials.length) * 100) + "%",
                                height: "100%",
                                borderRadius: DS.radiusPill,
                                background: "linear-gradient(90deg," + DS.tintOrange + "," + DS.accent + ")",
                                transition: "width .5s cubic-bezier(.4,0,.2,1)",
                            }}
                        />
                    </div>
                    <span style={{ color: DS.white, fontSize: 12, fontWeight: 600, opacity: 0.9 }}>
                        {String(doneCount) + "/" + String(materials.length)}
                    </span>
                </div>
            </div>

            {/* ═══ INFO STRIP ═══ */}
            <div
                style={{
                    padding: "14px 28px",
                    background: DS.tintPurpleUL,
                    borderBottom: "1px solid " + DS.grayLight,
                    animation: "ctFIU .5s ease-out .1s both",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        fontSize: 13,
                        color: DS.dark,
                        lineHeight: 1.65,
                    }}
                >
                    <span
                        style={{
                            fontSize: 11,
                            background: DS.tintPurple,
                            color: DS.purple,
                            fontWeight: 700,
                            padding: "2px 10px",
                            borderRadius: DS.radiusPill,
                            flexShrink: 0,
                            marginTop: 2,
                            letterSpacing: ".04em",
                        }}
                    >
                        {"INFO"}
                    </span>
                    <div style={{ fontWeight: 400 }}>
                        {"For each object, select whether the lamp glows "}
                        <strong style={{ color: DS.primary, fontWeight: 600 }}>{"(Yes/No)"}</strong>
                        {" and classify it as a "}
                        <strong style={{ color: DS.purple, fontWeight: 600 }}>{"Conductor"}</strong>
                        {" or "}
                        <strong style={{ color: DS.accent, fontWeight: 600 }}>{"Insulator"}</strong>
                        {". Fill in all 7 rows, then check!"}
                    </div>
                </div>
            </div>

            {/* ═══ TABLE ═══ */}
            <div style={{ padding: "20px 28px 14px" }}>
                <div
                    style={{
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: DS.purple,
                        marginBottom: 14,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        animation: "ctFIU .5s ease-out .2s both",
                    }}
                >
                    <div style={{ width: 5, height: 22, borderRadius: 3, background: DS.gradientPO }} />
                    {tableTitle}
                </div>

                <div
                    style={{
                        borderRadius: DS.radiusMd,
                        overflow: "hidden",
                        border: "1.5px solid " + DS.grayLight,
                        boxShadow: "0 2px 12px rgba(74,77,201,.05)",
                        animation: "ctFIU .5s ease-out .3s both",
                    }}
                >
                    {/* Table Header */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "50px 1fr 1fr 150px 170px",
                            background: DS.gradientP,
                            color: DS.white,
                            fontSize: 11,
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: ".07em",
                        }}
                    >
                        {headerCols.map((h, i) => (
                            <div
                                key={"hdr-" + String(i)}
                                style={{
                                    padding: "13px 12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    borderRight: i < 4 ? "1px solid rgba(255,255,255,.1)" : "none",
                                }}
                            >
                                {h}
                            </div>
                        ))}
                    </div>

                    {/* Table Rows */}
                    {materials.map((m, ri) => {
                        const a: RowAnswer | undefined = answers[m.sNo];
                        const aGlows: boolean | null = a ? a.glows : null;
                        const aClass: string | null = a ? a.classification : null;
                        const animated: boolean = isRowAnimated(m.sNo);
                        const rowOk: boolean = submitted && animated && checkRowCorrect(m);
                        const rowBad: boolean = submitted && animated && !checkRowCorrect(m);
                        const isHov: boolean = hoveredRow === m.sNo && !submitted;
                        const emoji: string = EMOJI_MAP[m.object] || "";

                        let rowBg: string = ri % 2 === 0 ? DS.white : DS.grayUL;
                        if (isHov) rowBg = DS.tintPurpleUL;
                        if (rowOk) rowBg = DS.correctBg;
                        if (rowBad) rowBg = DS.incorrectBg;

                        const glowIsCorrect: boolean = aGlows === m.correctGlows;
                        const classIsCorrect: boolean = m.correctGlows
                            ? aClass === "Conductor"
                            : aClass === "Insulator";

                        const selectBorderColor: string = aClass
                            ? aClass === "Conductor"
                                ? DS.primary
                                : DS.accent
                            : DS.gray;
                        const selectBg: string = aClass
                            ? aClass === "Conductor"
                                ? DS.tintPurpleUL
                                : DS.tintOrangeL
                            : DS.white;
                        const selectColor: string = aClass
                            ? aClass === "Conductor"
                                ? DS.primary
                                : DS.accentDark
                            : DS.gray;

                        return (
                            <div
                                key={"row-" + String(m.sNo)}
                                onMouseEnter={() => setHoveredRow(m.sNo)}
                                onMouseLeave={() => setHoveredRow(null)}
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "50px 1fr 1fr 150px 170px",
                                    background: rowBg,
                                    borderTop: "1px solid " + DS.grayLight,
                                    transition: "all .3s ease",
                                    animation:
                                        "ctFIU .45s ease-out " + String(0.35 + ri * 0.06) + "s both",
                                    position: "relative",
                                    overflow: "hidden",
                                }}
                            >
                                {/* Side feedback stripe */}
                                {animated && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            bottom: 0,
                                            width: 4,
                                            background: rowOk ? DS.correct : DS.incorrect,
                                            animation: "ctPI .35s ease-out",
                                            zIndex: 2,
                                        }}
                                    />
                                )}

                                {/* S.No. */}
                                <div
                                    style={{
                                        padding: "14px 12px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: 700,
                                        color: DS.primary,
                                        fontSize: 13,
                                        borderRight: "1px solid " + DS.grayLight,
                                        zIndex: 1,
                                    }}
                                >
                                    {String(m.sNo)}
                                </div>

                                {/* Object */}
                                <div
                                    style={{
                                        padding: "14px 12px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        fontWeight: 500,
                                        color: DS.dark,
                                        fontSize: 13,
                                        borderRight: "1px solid " + DS.grayLight,
                                        zIndex: 1,
                                    }}
                                >
                                    <span style={{ fontSize: 17 }}>{emoji}</span>
                                    {m.object}
                                </div>

                                {/* Material */}
                                <div
                                    style={{
                                        padding: "14px 12px",
                                        display: "flex",
                                        alignItems: "center",
                                        color: "#6B6B6B",
                                        fontSize: 12.5,
                                        fontWeight: 400,
                                        borderRight: "1px solid " + DS.grayLight,
                                        zIndex: 1,
                                    }}
                                >
                                    {m.material}
                                </div>

                                {/* Glow Toggle */}
                                <div
                                    style={{
                                        padding: "8px 8px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 6,
                                        borderRight: "1px solid " + DS.grayLight,
                                        zIndex: 1,
                                    }}
                                >
                                    <GlowButton
                                        label="Yes"
                                        isYes={true}
                                        isSelected={aGlows === true}
                                        isHovered={hoveredBtnId === "g-" + String(m.sNo) + "-yes"}
                                        isDisabled={submitted}
                                        onMouseEnter={() =>
                                            setHoveredBtnId("g-" + String(m.sNo) + "-yes")
                                        }
                                        onMouseLeave={() => setHoveredBtnId(null)}
                                        onClick={() => handleGlowToggle(m.sNo, true)}
                                    />
                                    <GlowButton
                                        label="No"
                                        isYes={false}
                                        isSelected={aGlows === false}
                                        isHovered={hoveredBtnId === "g-" + String(m.sNo) + "-no"}
                                        isDisabled={submitted}
                                        onMouseEnter={() =>
                                            setHoveredBtnId("g-" + String(m.sNo) + "-no")
                                        }
                                        onMouseLeave={() => setHoveredBtnId(null)}
                                        onClick={() => handleGlowToggle(m.sNo, false)}
                                    />
                                    {animated && (
                                        <span
                                            style={{
                                                animation: "ctPI .35s ease-out",
                                                display: "flex",
                                                flexShrink: 0,
                                            }}
                                        >
                                            <FeedbackIcon correct={glowIsCorrect} />
                                        </span>
                                    )}
                                </div>

                                {/* Classification */}
                                <div
                                    style={{
                                        padding: "8px 10px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 5,
                                        zIndex: 1,
                                    }}
                                >
                                    <select
                                        value={aClass || ""}
                                        onChange={(e) => handleClassChange(m.sNo, e.target.value)}
                                        disabled={submitted}
                                        style={{
                                            height: 32,
                                            padding: "0 10px",
                                            borderRadius: DS.radiusPill,
                                            border: "1.5px solid " + selectBorderColor,
                                            background: selectBg,
                                            color: selectColor,
                                            fontSize: 11.5,
                                            fontWeight: 500,
                                            fontFamily: DS.font,
                                            cursor: submitted ? "default" : "pointer",
                                            outline: "none",
                                            transition: "all .2s ease",
                                            width: "100%",
                                            maxWidth: 135,
                                            opacity: submitted ? 0.65 : 1,
                                        }}
                                    >
                                        <option value="">{"-- Select --"}</option>
                                        <option value="Conductor">{"Conductor"}</option>
                                        <option value="Insulator">{"Insulator"}</option>
                                    </select>
                                    {animated && (
                                        <span
                                            style={{
                                                animation: "ctPI .35s ease-out .12s both",
                                                display: "flex",
                                                flexShrink: 0,
                                            }}
                                        >
                                            <FeedbackIcon correct={classIsCorrect} />
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ═══ ACTION BAR ═══ */}
            <div
                style={{
                    padding: "18px 28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 14,
                    flexWrap: "wrap",
                }}
            >
                {!submitted ? (
                    <button
                        onClick={handleSubmit}
                        disabled={!allDone}
                        onMouseEnter={() => setHoveredBtnId("submit")}
                        onMouseLeave={() => setHoveredBtnId(null)}
                        style={{
                            height: 44,
                            padding: "0 28px",
                            borderRadius: DS.radiusPill,
                            border: "none",
                            background: allDone
                                ? hoveredBtnId === "submit"
                                    ? DS.gradientPO
                                    : DS.primary
                                : DS.grayLight,
                            color: allDone ? DS.white : DS.gray,
                            fontSize: 14,
                            fontWeight: 600,
                            fontFamily: DS.font,
                            cursor: allDone ? "pointer" : "not-allowed",
                            transition: "all .25s ease",
                            boxShadow: allDone
                                ? hoveredBtnId === "submit"
                                    ? "0 6px 20px rgba(83,48,134,.35)"
                                    : "0 4px 14px rgba(74,77,201,.25)"
                                : "none",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            animation: allDone ? "ctPu 2.5s ease-in-out infinite" : "none",
                        }}
                    >
                        <Check size={17} />
                        {"Check My Answers"}
                    </button>
                ) : (
                    <button
                        onClick={handleReset}
                        onMouseEnter={() => setHoveredBtnId("reset")}
                        onMouseLeave={() => setHoveredBtnId(null)}
                        style={{
                            height: 44,
                            padding: "0 24px",
                            borderRadius: DS.radiusPill,
                            border:
                                "1.5px solid " +
                                (hoveredBtnId === "reset" ? DS.primary : DS.gray),
                            background: hoveredBtnId === "reset" ? DS.tintPurpleUL : DS.white,
                            color: hoveredBtnId === "reset" ? DS.primary : DS.dark,
                            fontSize: 14,
                            fontWeight: 600,
                            fontFamily: DS.font,
                            cursor: "pointer",
                            transition: "all .25s ease",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        <RotateCcw size={15} />
                        {"Try Again"}
                    </button>
                )}

                {scoreData !== null && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            background:
                                scoreData.correct === scoreData.total ? DS.gradientPO : DS.grayUL,
                            borderRadius: DS.radiusPill,
                            padding: "10px 22px",
                            animation: "ctBI .55s ease-out",
                            boxShadow:
                                scoreData.correct === scoreData.total
                                    ? "0 6px 20px rgba(83,48,134,.3)"
                                    : "0 2px 8px rgba(0,0,0,.04)",
                        }}
                    >
                        {scoreData.correct === scoreData.total && (
                            <Award size={20} color={DS.white} />
                        )}
                        <div>
                            <div
                                style={{
                                    fontSize: 18,
                                    fontWeight: 800,
                                    color:
                                        scoreData.correct === scoreData.total ? DS.white : DS.dark,
                                    lineHeight: 1,
                                }}
                            >
                                {String(scoreData.correct) + "/" + String(scoreData.total)}
                            </div>
                            <div
                                style={{
                                    fontSize: 10,
                                    fontWeight: 600,
                                    color:
                                        scoreData.correct === scoreData.total
                                            ? DS.tintOrange
                                            : DS.gray,
                                    textTransform: "uppercase",
                                    letterSpacing: ".06em",
                                    marginTop: 2,
                                }}
                            >
                                {scoreData.correct === scoreData.total ? "Perfect!" : "Score"}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ═══ KEY INSIGHT ═══ */}
            {showInsight && (
                <div
                    style={{
                        margin: "0 28px 20px",
                        padding: "18px 22px",
                        borderRadius: DS.radiusMd,
                        background: DS.tintPurpleUL,
                        border: "1.5px solid " + DS.tintPurple,
                        animation: "ctBI .55s ease-out",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 14,
                    }}
                >
                    <div
                        style={{
                            width: 42,
                            height: 42,
                            borderRadius: DS.radiusSm,
                            background: DS.gradientPO,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            animation: "ctFl 2.5s ease-in-out infinite",
                            boxShadow: "0 4px 12px rgba(83,48,134,.25)",
                        }}
                    >
                        <Zap size={20} color={DS.white} fill={DS.white} />
                    </div>
                    <div>
                        <div
                            style={{
                                fontSize: 13.5,
                                fontWeight: 700,
                                color: DS.purple,
                                marginBottom: 4,
                            }}
                        >
                            {"\uD83D\uDD0D Key Insight"}
                        </div>
                        <div
                            style={{
                                fontSize: 13,
                                color: DS.dark,
                                lineHeight: 1.7,
                                fontWeight: 400,
                            }}
                        >
                            {insightMessage}
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ TEACHING NOTE ═══ */}
            {submitted && (
                <div style={{ padding: "0 28px 20px" }}>
                    <button
                        onClick={() => setShowTeachNote((p) => !p)}
                        onMouseEnter={() => setHoveredBtnId("tn")}
                        onMouseLeave={() => setHoveredBtnId(null)}
                        style={{
                            height: 36,
                            padding: "0 12px",
                            borderRadius: DS.radiusPill,
                            border: "none",
                            background: hoveredBtnId === "tn" ? DS.tintPurpleUL : "transparent",
                            color: DS.primary,
                            fontSize: 12.5,
                            fontWeight: 600,
                            fontFamily: DS.font,
                            cursor: "pointer",
                            transition: "all .2s ease",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                        }}
                    >
                        {"\uD83D\uDCDD Teaching Notes"}
                        <span
                            style={{
                                transform: showTeachNote ? "rotate(90deg)" : "rotate(0deg)",
                                transition: "transform .25s ease",
                                display: "inline-flex",
                            }}
                        >
                            <ChevronRight size={14} />
                        </span>
                    </button>
                    {showTeachNote && (
                        <div
                            style={{
                                marginTop: 10,
                                padding: "14px 18px",
                                borderRadius: DS.radiusSm,
                                background: DS.tintOrange,
                                border: "1px solid rgba(252,145,69,0.2)",
                                fontSize: 12,
                                color: "#7A5200",
                                lineHeight: 1.7,
                                animation: "ctSD .35s ease-out",
                                fontStyle: "italic",
                            }}
                        >
                            <strong style={{ fontWeight: 600 }}>{"For Teachers: "}</strong>
                            {teachingNote}
                        </div>
                    )}
                </div>
            )}

            {/* ═══ FOOTER ═══ */}
            <div
                style={{
                    padding: "14px 28px",
                    background: DS.grayUL,
                    borderTop: "1px solid " + DS.grayLight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                }}
            >
                <Zap size={11} color={DS.primary} />
                <span
                    style={{
                        fontSize: 10.5,
                        color: DS.gray,
                        fontWeight: 500,
                        letterSpacing: ".04em",
                    }}
                >
                    {"NCERT Curiosity \u2022 Textbook of Science \u2022 "}
                    <span style={{ color: DS.primary, fontWeight: 600 }}>{"Grade 7"}</span>
                </span>
            </div>
        </div>
    );
};

export default ConductionTesterTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════