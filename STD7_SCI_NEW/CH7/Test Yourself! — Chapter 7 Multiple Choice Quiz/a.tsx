import { useState, useEffect, useCallback, useMemo } from "react";

// ==================== INLINE SVG ICONS (replacing lucide-react) ====================
const IconCheck = ({ size = 16, color = "currentColor", strokeWidth = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);
const IconX = ({ size = 16, color = "currentColor", strokeWidth = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);
const IconRotateCcw = ({ size = 18, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
);
const IconChevronRight = ({ size = 18, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
);
const IconAward = ({ size = 18, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>
);
const IconBookOpen = ({ size = 32, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
);
const IconTarget = ({ size = 18, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
);

// ==================== SHUFFLE UTILITY ====================
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ==================== DEFAULT QUESTIONS ====================
const DEFAULT_QUESTIONS = [
    {
        id: 1,
        question: "Your father bought a saucepan made of two different materials, A (the pan body) and B (the handle). The materials A and B have the following properties —",
        options: [
            { id: 'a', text: 'Both A and B are good conductors of heat' },
            { id: 'b', text: 'Both A and B are poor conductors of heat' },
            { id: 'c', text: 'A is a good conductor and B is a poor conductor of heat' },
            { id: 'd', text: 'A is a poor conductor and B is a good conductor of heat' },
        ],
        correctOptionId: 'c',
        explanation: "The pan body (A) must be a good conductor to transfer heat from the flame to the food. The handle (B) must be a poor conductor (insulator) so you can hold it without burning your hand.",
        diagramType: 'saucepan',
        topic: 'Conductors & Insulators',
    },
    {
        id: 2,
        question: "Pins are stuck to a metal strip with wax and a burning candle is kept near the middle. Which of the following will happen?",
        options: [
            { id: 'a', text: 'All the pins will fall almost at the same time' },
            { id: 'b', text: 'Pins closest to the candle will fall first, then those farther away' },
            { id: 'c', text: 'Pins farthest from the candle fall first' },
            { id: 'd', text: 'Only the pin directly above the candle will fall' },
        ],
        correctOptionId: 'b',
        explanation: "Heat conducts along the metal strip from the heated point outward. The wax nearest the candle melts first. Pins fall in order of distance from the heat source — closest first.",
        diagramType: 'metal_strip',
        topic: 'Conduction – Heat Flow',
    },
    {
        id: 3,
        question: "A smoke detector detects smoke and sounds an alarm. The most suitable place for fitting it in your room will be:",
        options: [
            { id: 'a', text: 'Near the floor' },
            { id: 'b', text: 'In the middle of a wall' },
            { id: 'c', text: 'On the ceiling' },
            { id: 'd', text: 'Anywhere in the room' },
        ],
        correctOptionId: 'c',
        explanation: "Smoke is warmer than surrounding air, so it rises up by convection. The ceiling is the best place for a smoke detector because smoke reaches there first.",
        diagramType: 'none',
        topic: 'Convection',
    },
    {
        id: 4,
        question: "During the day, people near the coast feel a cool breeze blowing from the sea towards the land. This is called:",
        options: [
            { id: 'a', text: 'Land breeze' },
            { id: 'b', text: 'Sea breeze' },
            { id: 'c', text: 'Radiation wind' },
            { id: 'd', text: 'Conduction breeze' },
        ],
        correctOptionId: 'b',
        explanation: "During the day, land heats faster than sea. Warm air above the land rises, and cooler air from the sea moves in. This movement of cool air from sea to land is called sea breeze.",
        diagramType: 'none',
        topic: 'Sea Breeze & Land Breeze',
    },
    {
        id: 5,
        question: "Why do we prefer two thin blankets rather than one thick blanket during winters?",
        options: [
            { id: 'a', text: 'Two blankets are lighter in weight' },
            { id: 'b', text: 'Air trapped between the two blankets acts as an insulator' },
            { id: 'c', text: 'Two blankets look nicer on the bed' },
            { id: 'd', text: 'Thick blankets are harder to wash' },
        ],
        correctOptionId: 'b',
        explanation: "Air is a poor conductor of heat. A layer of air gets trapped between two blankets and acts as an insulator, reducing heat flow from our body to the cold surroundings.",
        diagramType: 'none',
        topic: 'Air as Insulator',
    },
    {
        id: 6,
        question: "Water was poured through bottles filled with clay, sand, and gravel. Which material allowed the fastest seepage?",
        options: [
            { id: 'a', text: 'Clay' },
            { id: 'b', text: 'Sand' },
            { id: 'c', text: 'Gravel' },
            { id: 'd', text: 'All allowed equal seepage' },
        ],
        correctOptionId: 'c',
        explanation: "Gravel has the widest spaces between particles. Wide, open, connected spaces allow water to pass through most easily. This process is called infiltration.",
        diagramType: 'none',
        topic: 'Seepage & Infiltration',
    },
    {
        id: 7,
        question: "Heat from the Sun reaches the Earth through which process?",
        options: [
            { id: 'a', text: 'Conduction' },
            { id: 'b', text: 'Convection' },
            { id: 'c', text: 'Radiation' },
            { id: 'd', text: 'Evaporation' },
        ],
        correctOptionId: 'c',
        explanation: "Heat from the Sun travels through empty space (vacuum). Radiation is the only mode of heat transfer that does not require any medium.",
        diagramType: 'none',
        topic: 'Radiation',
    },
    {
        id: 8,
        question: "The underground layers of sediments and rocks that store water in pore spaces are called:",
        options: [
            { id: 'a', text: 'Reservoirs' },
            { id: 'b', text: 'Aquifers' },
            { id: 'c', text: 'Water tables' },
            { id: 'd', text: 'Glaciers' },
        ],
        correctOptionId: 'b',
        explanation: "Aquifers are underground layers of sediments and rocks that store water in their pore spaces. We extract this groundwater by digging wells or drilling bore wells.",
        diagramType: 'none',
        topic: 'Aquifers & Groundwater',
    },
];

// ==================== DIAGRAM COMPONENTS ====================
const SaucepanDiagram = ({ animate }) => (
    <svg viewBox="0 0 280 140" style={{ width: '100%', maxWidth: 260, height: 'auto' }}>
        <ellipse cx="120" cy="100" rx="80" ry="20" fill="#b0b0b0" stroke="#888" strokeWidth="2" style={{ opacity: animate ? 1 : 0, transition: 'opacity 0.6s ease 0.2s' }} />
        <rect x="40" y="50" width="160" height="50" rx="6" fill="#c0c0c0" stroke="#888" strokeWidth="2" style={{ opacity: animate ? 1 : 0, transition: 'opacity 0.5s ease 0.1s' }} />
        <ellipse cx="120" cy="50" rx="80" ry="18" fill="#d4d4d4" stroke="#888" strokeWidth="2" style={{ opacity: animate ? 1 : 0, transition: 'opacity 0.5s ease' }} />
        <rect x="200" y="62" width="65" height="16" rx="8" fill="#8B4513" stroke="#6B3410" strokeWidth="2" style={{ opacity: animate ? 1 : 0, transition: 'opacity 0.6s ease 0.4s' }} />
        <text x="120" y="80" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#444" style={{ opacity: animate ? 1 : 0, transition: 'opacity 0.7s ease 0.5s' }}>A</text>
        <text x="232" y="58" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#fff" style={{ opacity: animate ? 1 : 0, transition: 'opacity 0.7s ease 0.6s' }}>B</text>
        <ellipse cx="100" cy="125" rx="8" ry="12" fill="#ff6b35" style={{ opacity: animate ? 1 : 0, transition: 'opacity 0.5s ease 0.3s' }} />
        <ellipse cx="120" cy="123" rx="10" ry="15" fill="#ff9500" style={{ opacity: animate ? 1 : 0, transition: 'opacity 0.5s ease 0.35s' }} />
        <ellipse cx="140" cy="125" rx="8" ry="12" fill="#ff6b35" style={{ opacity: animate ? 1 : 0, transition: 'opacity 0.5s ease 0.4s' }} />
    </svg>
);

const MetalStripDiagram = ({ animate }) => (
    <svg viewBox="0 0 300 120" style={{ width: '100%', maxWidth: 280, height: 'auto' }}>
        <rect x="10" y="20" width="8" height="80" fill="#777" style={{ opacity: animate ? 1 : 0, transition: 'opacity 0.4s ease' }} />
        <rect x="2" y="95" width="24" height="8" rx="2" fill="#888" style={{ opacity: animate ? 1 : 0, transition: 'opacity 0.4s ease 0.1s' }} />
        <rect x="18" y="44" width="240" height="6" rx="3" fill="#aaa" stroke="#888" strokeWidth="1" style={{ opacity: animate ? 1 : 0, transition: 'opacity 0.5s ease 0.2s' }} />
        {[{ x: 240, label: 'I' }, { x: 200, label: 'II' }, { x: 160, label: 'III' }, { x: 120, label: 'IV' }].map((pin, i) => (
            <g key={pin.label} style={{ opacity: animate ? 1 : 0, transition: `opacity 0.4s ease ${0.3 + i * 0.1}s` }}>
                <line x1={pin.x} y1="50" x2={pin.x} y2="75" stroke="#555" strokeWidth="2" />
                <circle cx={pin.x} cy="76" r="3" fill="#555" />
                <text x={pin.x} y="92" textAnchor="middle" fontSize="11" fill="#666">{pin.label}</text>
            </g>
        ))}
        <ellipse cx="180" cy="25" rx="6" ry="10" fill="#ff9500" style={{ opacity: animate ? 1 : 0, transition: 'opacity 0.5s ease 0.5s' }} />
        <rect x="177" y="34" width="6" height="12" fill="#f5f0dc" style={{ opacity: animate ? 1 : 0, transition: 'opacity 0.5s ease 0.5s' }} />
        <text x="180" y="115" textAnchor="middle" fontSize="9" fill="#999">Burning candle</text>
    </svg>
);

// ==================== COLOR HELPERS ====================
const themeColor = '#7c3aed';

const lightenColor = (hex, pct) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, (num >> 16) + Math.round((255 - (num >> 16)) * pct));
    const g = Math.min(255, ((num >> 8) & 0x00FF) + Math.round((255 - ((num >> 8) & 0x00FF)) * pct));
    const b = Math.min(255, (num & 0x0000FF) + Math.round((255 - (num & 0x0000FF)) * pct));
    return `rgb(${r},${g},${b})`;
};

const colors = {
    primary: themeColor,
    primaryLight: lightenColor(themeColor, 0.85),
    primaryMid: lightenColor(themeColor, 0.6),
    correct: '#16a34a',
    correctBg: '#dcfce7',
    wrong: '#dc2626',
    wrongBg: '#fee2e2',
    bg: '#faf8ff',
    card: '#ffffff',
    text: '#1e1b2e',
    textMuted: '#6b7280',
    border: '#e5e1f0',
};

// ==================== MAIN COMPONENT ====================
export default function MCQQuiz() {
    const questions = useMemo(() => DEFAULT_QUESTIONS.map(q => ({ ...q, options: shuffleArray(q.options) })), []);
    const totalQuestions = questions.length;

    const [screen, setScreen] = useState('start');
    const [currentQ, setCurrentQ] = useState(0);
    const [selectedId, setSelectedId] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [answers, setAnswers] = useState(new Array(totalQuestions).fill(null));
    const [animateIn, setAnimateIn] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [resultAnimStep, setResultAnimStep] = useState(0);
    const [hoveredOption, setHoveredOption] = useState(null);
    const [diagramAnimate, setDiagramAnimate] = useState(false);

    const score = answers.filter((a, i) => a === questions[i].correctOptionId).length;
    const currentQuestion = questions[currentQ];
    const isCorrect = selectedId === currentQuestion?.correctOptionId;
    const progressPct = ((currentQ + (answered ? 1 : 0)) / totalQuestions) * 100;

    useEffect(() => {
        const kf = `
            @keyframes fadeInUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
            @keyframes fadeInScale{from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}}
            @keyframes popIn{0%{transform:scale(0);opacity:0}70%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}
            @keyframes slideDown{from{opacity:0;max-height:0}to{opacity:1;max-height:400px}}
            @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
            @keyframes resultSlideIn{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)}}
        `;
        const s = document.createElement('style');
        s.id = 'mcq-kf';
        s.textContent = kf;
        document.head.appendChild(s);
        return () => { const e = document.getElementById('mcq-kf'); if (e) document.head.removeChild(e); };
    }, []);

    useEffect(() => {
        if (screen === 'quiz') {
            setAnimateIn(false); setDiagramAnimate(false);
            const t = setTimeout(() => { setAnimateIn(true); setDiagramAnimate(true); }, 60);
            return () => clearTimeout(t);
        }
    }, [currentQ, screen]);

    useEffect(() => {
        if (screen === 'result') {
            setResultAnimStep(0);
            const ts = [setTimeout(() => setResultAnimStep(1), 200), setTimeout(() => setResultAnimStep(2), 600), setTimeout(() => setResultAnimStep(3), 1000)];
            return () => ts.forEach(clearTimeout);
        }
    }, [screen]);

    const handleSelect = useCallback((optId) => {
        if (answered) return;
        setSelectedId(optId); setAnswered(true);
        const na = [...answers]; na[currentQ] = optId; setAnswers(na);
        setTimeout(() => setShowExplanation(true), 400);
    }, [answered, currentQ, answers]);

    const handleNext = useCallback(() => {
        if (currentQ < totalQuestions - 1) { setSelectedId(null); setAnswered(false); setShowExplanation(false); setCurrentQ(p => p + 1); }
        else setScreen('result');
    }, [currentQ, totalQuestions]);

    const handleRetake = useCallback(() => {
        setCurrentQ(0); setSelectedId(null); setAnswered(false); setShowExplanation(false);
        setAnswers(new Array(totalQuestions).fill(null)); setScreen('start');
    }, [totalQuestions]);

    const getOptionStyle = (opt, index) => {
        const base = {
            display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderRadius: 14,
            border: `2px solid ${colors.border}`, cursor: answered ? 'default' : 'pointer',
            transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)', background: colors.card,
            position: 'relative', overflow: 'hidden', fontSize: 15, lineHeight: '1.5',
            fontFamily: "'Nunito','Segoe UI',sans-serif",
            opacity: animateIn ? 1 : 0, transform: animateIn ? 'translateY(0)' : 'translateY(16px)',
            transitionDelay: `${0.15 + index * 0.08}s`,
        };
        if (answered) {
            if (opt.id === currentQuestion.correctOptionId) return { ...base, border: `2px solid ${colors.correct}`, background: colors.correctBg, cursor: 'default' };
            if (opt.id === selectedId && opt.id !== currentQuestion.correctOptionId) return { ...base, border: `2px solid ${colors.wrong}`, background: colors.wrongBg, cursor: 'default' };
            return { ...base, opacity: 0.55, cursor: 'default' };
        }
        if (hoveredOption === opt.id) return { ...base, border: `2px solid ${colors.primaryMid}`, background: colors.primaryLight, transform: animateIn ? 'translateY(-2px)' : 'translateY(16px)', boxShadow: `0 4px 16px ${lightenColor(themeColor, 0.7)}` };
        return base;
    };

    const renderDiagram = () => {
        if (!currentQuestion?.diagramType || currentQuestion.diagramType === 'none') return null;
        const ws = { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 12, margin: '8px 0 12px', background: '#f9f7ff', borderRadius: 12, border: `1px solid ${colors.border}`, opacity: diagramAnimate ? 1 : 0, transition: 'opacity 0.6s ease 0.2s' };
        if (currentQuestion.diagramType === 'saucepan') return <div style={ws}><SaucepanDiagram animate={diagramAnimate} /></div>;
        if (currentQuestion.diagramType === 'metal_strip') return <div style={ws}><MetalStripDiagram animate={diagramAnimate} /></div>;
        return null;
    };

    // ════════════ START SCREEN ════════════
    if (screen === 'start') return (
        <div style={{ width: '100%', minHeight: 600, background: `linear-gradient(160deg, ${colors.bg} 0%, ${lightenColor(themeColor, 0.92)} 100%)`, borderRadius: 24, overflow: 'hidden', fontFamily: "'Nunito','Segoe UI',sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, boxSizing: 'border-box', boxShadow: '0 8px 40px rgba(124,58,237,0.10)' }}>
            <div style={{ animation: 'fadeInScale 0.7s ease both', textAlign: 'center', background: colors.card, borderRadius: 28, padding: '40px 36px', boxShadow: '0 12px 48px rgba(124,58,237,0.10)', maxWidth: 520, width: '100%', border: `1px solid ${colors.border}` }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg, ${themeColor}, ${lightenColor(themeColor, 0.3)})`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', animation: 'popIn 0.7s ease 0.3s both', boxShadow: `0 8px 24px ${lightenColor(themeColor, 0.5)}` }}>
                    <IconBookOpen size={32} color="#fff" />
                </div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: colors.text, margin: '0 0 4px', animation: 'fadeInUp 0.6s ease 0.4s both' }}>Heat Transfer in Nature</h1>
                <p style={{ fontSize: 15, color: themeColor, fontWeight: 600, margin: '0 0 18px', animation: 'fadeInUp 0.6s ease 0.5s both' }}>Chapter 7 — Multiple Choice Quiz</p>
                <p style={{ fontSize: 14, color: colors.textMuted, lineHeight: 1.65, margin: '0 0 28px', animation: 'fadeInUp 0.6s ease 0.6s both' }}>
                    Test yourself with 8 multiple choice questions from this chapter! Read each question carefully, choose your answer, and see if you're right. Try to score 8 out of 8!
                </p>
                <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24, animation: 'fadeInUp 0.6s ease 0.7s both' }}>
                    <div style={{ background: colors.primaryLight, borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 600, color: themeColor }}>📝 8 Questions</div>
                    <div style={{ background: '#fef3c7', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 600, color: '#92400e' }}>🎯 Pass: 5/8</div>
                    <div style={{ background: '#dbeafe', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 600, color: '#1d4ed8' }}>🔄 Retake Anytime</div>
                </div>
                <button onClick={() => setScreen('quiz')} style={{ padding: '14px 48px', borderRadius: 14, border: 'none', cursor: 'pointer', background: `linear-gradient(135deg, ${themeColor}, ${lightenColor(themeColor, 0.2)})`, color: '#fff', fontSize: 17, fontWeight: 700, transition: 'all 0.3s ease', boxShadow: `0 6px 20px ${lightenColor(themeColor, 0.5)}`, animation: 'fadeInUp 0.6s ease 0.8s both' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
                    Start Quiz →
                </button>
            </div>
        </div>
    );

    // ════════════ RESULT SCREEN ════════════
    if (screen === 'result') {
        const pct = Math.round((score / totalQuestions) * 100);
        const passed = score >= 5;
        const emoji = score === totalQuestions ? '🏆' : score >= 7 ? '🌟' : passed ? '👍' : '📖';
        const message = score === totalQuestions ? 'Perfect Score! Outstanding!' : score >= 7 ? 'Excellent! Almost perfect!' : passed ? 'Good job! Review the ones you missed.' : 'Keep learning! Re-read the chapter and try again.';
        return (
            <div style={{ width: '100%', minHeight: 600, background: `linear-gradient(160deg, ${colors.bg} 0%, ${lightenColor(themeColor, 0.92)} 100%)`, borderRadius: 24, overflow: 'hidden', fontFamily: "'Nunito','Segoe UI',sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 24px', boxSizing: 'border-box', boxShadow: '0 8px 40px rgba(124,58,237,0.10)' }}>
                <div style={{ fontSize: 56, animation: resultAnimStep >= 1 ? 'popIn 0.7s ease both' : 'none', opacity: resultAnimStep >= 1 ? 1 : 0, marginBottom: 8 }}>{emoji}</div>
                <div style={{ width: 120, height: 120, borderRadius: '50%', background: `conic-gradient(${passed ? colors.correct : colors.wrong} ${pct * 3.6}deg, ${colors.border} ${pct * 3.6}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: resultAnimStep >= 1 ? 1 : 0, transition: 'opacity 0.5s ease', boxShadow: `0 8px 30px ${lightenColor(passed ? colors.correct : colors.wrong, 0.6)}`, marginBottom: 12 }}>
                    <div style={{ width: 96, height: 96, borderRadius: '50%', background: colors.card, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 32, fontWeight: 800, color: passed ? colors.correct : colors.wrong }}>{score}</span>
                        <span style={{ fontSize: 13, color: colors.textMuted, marginTop: -4 }}>/ {totalQuestions}</span>
                    </div>
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: colors.text, margin: '4px 0 0', opacity: resultAnimStep >= 2 ? 1 : 0, transition: 'opacity 0.5s ease', textAlign: 'center' }}>{message}</h2>
                <div style={{ width: '100%', maxWidth: 500, marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8, opacity: resultAnimStep >= 3 ? 1 : 0, transition: 'opacity 0.5s ease', maxHeight: 260, overflowY: 'auto', paddingRight: 4 }}>
                    {questions.map((q, i) => {
                        const wasCorrect = answers[i] === q.correctOptionId;
                        return (
                            <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: colors.card, borderRadius: 12, padding: '10px 14px', border: `1.5px solid ${wasCorrect ? '#bbf7d0' : '#fecaca'}`, animation: `resultSlideIn 0.4s ease ${i * 0.07}s both` }}>
                                <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, background: wasCorrect ? colors.correctBg : colors.wrongBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {wasCorrect ? <IconCheck size={15} color={colors.correct} strokeWidth={3} /> : <IconX size={15} color={colors.wrong} strokeWidth={3} />}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: colors.text }}>Q{i + 1}. </span>
                                    <span style={{ fontSize: 13, color: colors.textMuted }}>{q.topic}</span>
                                </div>
                                <span style={{ fontSize: 12, fontWeight: 700, color: wasCorrect ? colors.correct : colors.wrong, flexShrink: 0 }}>{wasCorrect ? 'Correct' : 'Wrong'}</span>
                            </div>
                        );
                    })}
                </div>
                <button onClick={handleRetake} style={{ marginTop: 20, padding: '13px 36px', borderRadius: 14, border: 'none', cursor: 'pointer', background: `linear-gradient(135deg, ${themeColor}, ${lightenColor(themeColor, 0.2)})`, color: '#fff', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.3s ease', boxShadow: `0 6px 20px ${lightenColor(themeColor, 0.5)}`, opacity: resultAnimStep >= 3 ? 1 : 0 }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
                    <IconRotateCcw size={18} color="#fff" /> Retake Quiz
                </button>
            </div>
        );
    }

    // ════════════ QUIZ SCREEN ════════════
    return (
        <div style={{ width: '100%', minHeight: 600, background: `linear-gradient(160deg, ${colors.bg} 0%, ${lightenColor(themeColor, 0.92)} 100%)`, borderRadius: 24, overflow: 'hidden', fontFamily: "'Nunito','Segoe UI',sans-serif", display: 'flex', flexDirection: 'column', boxShadow: '0 8px 40px rgba(124,58,237,0.10)' }}>
            <div style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${colors.border}`, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <IconTarget size={18} color={themeColor} />
                    <span style={{ fontSize: 14, fontWeight: 700, color: themeColor }}>Q{currentQ + 1} / {totalQuestions}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, background: colors.primaryLight, padding: '4px 12px', borderRadius: 20 }}>{currentQuestion.topic}</span>
            </div>
            <div style={{ height: 5, background: colors.border, position: 'relative', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: `linear-gradient(90deg, ${themeColor}, ${lightenColor(themeColor, 0.3)})`, width: `${progressPct}%`, transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)', borderRadius: '0 4px 4px 0' }} />
            </div>
            <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: colors.text, lineHeight: 1.55, margin: '0 0 6px', opacity: animateIn ? 1 : 0, transform: animateIn ? 'translateY(0)' : 'translateY(12px)', transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)' }}>{currentQuestion.question}</h2>
                {renderDiagram()}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                    {currentQuestion.options.map((opt, i) => (
                        <div key={opt.id} style={getOptionStyle(opt, i)} onClick={() => handleSelect(opt.id)}
                            onMouseEnter={() => !answered && setHoveredOption(opt.id)} onMouseLeave={() => setHoveredOption(null)}>
                            <div style={{
                                width: 32, height: 32, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14,
                                background: answered && opt.id === currentQuestion.correctOptionId ? colors.correct : answered && opt.id === selectedId ? colors.wrong : hoveredOption === opt.id ? themeColor : colors.primaryLight,
                                color: (answered && (opt.id === currentQuestion.correctOptionId || opt.id === selectedId)) || hoveredOption === opt.id ? '#fff' : themeColor, transition: 'all 0.3s ease'
                            }}>
                                {answered && opt.id === currentQuestion.correctOptionId ? <IconCheck size={16} color="#fff" strokeWidth={3} /> :
                                    answered && opt.id === selectedId && opt.id !== currentQuestion.correctOptionId ? <IconX size={16} color="#fff" strokeWidth={3} /> :
                                        String.fromCharCode(65 + i)}
                            </div>
                            <span style={{ flex: 1 }}>{opt.text}</span>
                        </div>
                    ))}
                </div>
                {answered && (
                    <div style={{ marginTop: 14, borderRadius: 14, overflow: 'hidden', border: `1.5px solid ${isCorrect ? '#bbf7d0' : '#fecaca'}`, animation: 'fadeInUp 0.45s ease both' }}>
                        <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, background: isCorrect ? colors.correctBg : colors.wrongBg }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: isCorrect ? colors.correct : colors.wrong, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'popIn 0.5s ease both' }}>
                                {isCorrect ? <IconCheck size={16} color="#fff" strokeWidth={3} /> : <IconX size={16} color="#fff" strokeWidth={3} />}
                            </div>
                            <span style={{ fontWeight: 700, fontSize: 15, color: isCorrect ? colors.correct : colors.wrong }}>{isCorrect ? 'Correct!' : 'Not quite!'}</span>
                        </div>
                        {showExplanation && (
                            <div style={{ padding: '12px 16px', background: colors.card, fontSize: 14, lineHeight: 1.65, color: colors.textMuted, animation: 'slideDown 0.5s ease both' }}>
                                <strong style={{ color: colors.text }}>Explanation: </strong>{currentQuestion.explanation}
                            </div>
                        )}
                    </div>
                )}
                <div style={{ flex: 1 }} />
                {answered && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16, animation: 'fadeInUp 0.4s ease 0.3s both' }}>
                        <button onClick={handleNext} style={{ padding: '12px 32px', borderRadius: 14, border: 'none', cursor: 'pointer', background: `linear-gradient(135deg, ${themeColor}, ${lightenColor(themeColor, 0.2)})`, color: '#fff', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.3s ease', boxShadow: `0 4px 16px ${lightenColor(themeColor, 0.5)}` }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
                            {currentQ < totalQuestions - 1 ? <>Next <IconChevronRight size={18} color="#fff" /></> : <>See Results <IconAward size={18} color="#fff" /></>}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}