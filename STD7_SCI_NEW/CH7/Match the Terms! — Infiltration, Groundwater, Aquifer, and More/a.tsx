// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START — groundwater_matching_tool.tsx
// Singularity DS | Animated Visual Learn + Interactive Matching
// ═══════════════════════════════════════════════════════════════════════════════
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// ── INLINE SVG ICONS (no lucide dependency) ──
const Icon: React.FC<{ d: string; size?: number; color?: string; strokeWidth?: number }> = ({ d, size = 16, color = 'currentColor', strokeWidth = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d={d} /></svg>
);
const Check: React.FC<{ size?: number; color?: string; strokeWidth?: number }> = p => <Icon d="M20 6L9 17l-5-5" {...p} />;
const X_Icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }> = p => <Icon d="M18 6L6 18M6 6l12 12" {...p} />;
const RotateCcw: React.FC<{ size?: number; color?: string; strokeWidth?: number }> = ({ size = 16, color = 'currentColor', strokeWidth = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
);
const Award: React.FC<{ size?: number; color?: string; strokeWidth?: number }> = ({ size = 16, color = 'currentColor', strokeWidth = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="8" r="7" /><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" /></svg>
);
const ChevronRight: React.FC<{ size?: number; color?: string; strokeWidth?: number }> = p => <Icon d="M9 18l6-6-6-6" {...p} />;
const ChevronLeft: React.FC<{ size?: number; color?: string; strokeWidth?: number }> = p => <Icon d="M15 18l-6-6 6-6" {...p} />;
const BookOpen: React.FC<{ size?: number; color?: string; strokeWidth?: number }> = ({ size = 16, color = 'currentColor', strokeWidth = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
);
const Target: React.FC<{ size?: number; color?: string; strokeWidth?: number }> = ({ size = 16, color = 'currentColor', strokeWidth = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
);

// ── DESIGN TOKENS ──
const DS = {
    primaryIndigo: '#4A4DC9', primaryOrange: '#FF7212', gradientPurple: '#533086', gradientOrange: '#FC9145',
    lightPurple: '#C1C1EA', lightOrange: '#FFF3E4', dark: '#4E4E4E', grey: '#CACACA', lightGrey: '#EBEBEB',
    offWhite: '#F5F5F5', white: '#FFFFFF', success: '#2ECC71', error: '#E74C3C',
    shadowSm: '0 2px 8px rgba(74,77,201,0.08)', shadowMd: '0 4px 20px rgba(74,77,201,0.12)',
    shadowLg: '0 8px 40px rgba(74,77,201,0.16)', shadowXl: '0 16px 56px rgba(83,48,134,0.20)',
    r: { sm: 8, md: 12, lg: 16, xl: 24, pill: 100 },
    font: "'Poppins','Segoe UI',system-ui,sans-serif",
};

// ── TYPES ──
type ModeType = 'learn' | 'practice' | 'real_world' | 'hands_on';
interface StepDetails { currentStep: number; totalSteps: number; isPaused: boolean; currentMode: ModeType; }
interface StepDataInterface { id: number; title: string; description: string; type: string; mode: ModeType; data?: any; }
interface BaseDataInterface { themeColor?: string; autoPlayDuration?: number; }
interface TermPair { id: string; term: string; definition: string; color: string; icon: string; hint: string; crossSectionLabel: string; }
interface AdditionalProps { pairs?: TermPair[]; shuffleSeed?: number; showHints?: boolean; showCrossSectionOnComplete?: boolean; contextTheme?: string; maxAttempts?: number; }
interface Props {
    props?: { width?: number; height?: number; data?: BaseDataInterface; steps?: StepDataInterface[]; initialMode?: ModeType; showModeSelector?: boolean; enabledModes?: ModeType[]; showNavigation?: boolean; showPlayPause?: boolean; showStepIndicator?: boolean; initialStep?: number; filterSteps?: number[]; animationSpeed?: number; autoPlayDuration?: number; themeColor?: string; darkMode?: boolean; additionalProps?: AdditionalProps; };
    setStepDetails?: (s: StepDetails) => void; stopAutoNext?: boolean; setStopAutoNext?: (s: boolean) => void;
}

const PAIRS: TermPair[] = [
    { id: 'infiltration', term: 'Infiltration', definition: 'The process of surface water seeping through soil and rocks into the ground.', color: '#4A4DC9', icon: '💧', hint: 'Think about water moving DOWN from the surface into the earth.', crossSectionLabel: 'Arrows from surface downward' },
    { id: 'groundwater', term: 'Groundwater', definition: 'Water stored in the pore spaces of sediments and openings in rocks beneath the surface.', color: '#2196F3', icon: '🌊', hint: 'This is the water that fills tiny spaces between underground particles.', crossSectionLabel: 'Blue water in pore spaces' },
    { id: 'aquifer', term: 'Aquifer', definition: 'An underground layer of sediments and rocks that stores water in its pore spaces.', color: '#533086', icon: '🪨', hint: 'This describes the ROCK LAYER that holds water, not the water itself.', crossSectionLabel: 'Porous rock layer filled with water' },
    { id: 'water_table', term: 'Water Table', definition: 'The upper surface level of the zone where underground rock and soil are completely saturated with water.', color: '#FF7212', icon: '📏', hint: 'This describes the LEVEL of water, not the rock that holds it — try again.', crossSectionLabel: 'Dotted line marking water level' },
    { id: 'impermeable_rock', term: 'Impermeable Rock', definition: 'A layer of rock that does not allow water to pass through it, blocking further downward movement.', color: '#4E4E4E', icon: '🧱', hint: 'This rock acts like a floor — water CANNOT seep through it.', crossSectionLabel: 'Solid rock layer below aquifer' },
];

// ── KEYFRAMES ──
const KF = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
@keyframes fadeInUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeInLeft{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)}}
@keyframes fadeInRight{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
@keyframes popIn{0%{transform:scale(0);opacity:0}60%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
@keyframes shake{0%,100%{transform:translateX(0)}15%,45%,75%{transform:translateX(-5px)}30%,60%,90%{transform:translateX(5px)}}
@keyframes glowIndigo{0%,100%{box-shadow:0 0 8px rgba(74,77,201,0.2)}50%{box-shadow:0 0 24px rgba(74,77,201,0.45)}}
@keyframes drawLine{from{stroke-dashoffset:500}to{stroke-dashoffset:0}}
@keyframes slideDown{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)}}
@keyframes checkPop{0%{transform:scale(0) rotate(-45deg);opacity:0}60%{transform:scale(1.2)}100%{transform:scale(1);opacity:1}}
@keyframes celebrateBurst{0%{transform:scale(0) rotate(0deg);opacity:0}40%{transform:scale(1.4) rotate(180deg);opacity:1}100%{transform:scale(1) rotate(360deg);opacity:1}}
@keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes iconBounce{0%,100%{transform:translateY(0) scale(1)}25%{transform:translateY(-3px) scale(1.08)}75%{transform:translateY(1px) scale(0.98)}}
@keyframes scoreCountUp{from{transform:scale(1.4);color:#FF7212}to{transform:scale(1)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
`;
function shuffle<T>(a: T[], seed?: number): T[] { const s = [...a]; let v = seed || Math.floor(Math.random() * 1e4); for (let i = s.length - 1; i > 0; i--) { v = (v * 9301 + 49297) % 233280; const j = Math.floor((v / 233280) * (i + 1));[s[i], s[j]] = [s[j], s[i]]; } return s; }

// ══════════════════════════════════════════════════════════════════
// ANIMATED CANVAS SCENE — Raindrop Journey Visual Explanation
// ══════════════════════════════════════════════════════════════════
const AnimatedScene: React.FC<{ step: number; width: number; height: number }> = ({ step, width, height }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);
    const timeRef = useRef(0);
    const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; r: number; a: number; phase: string; life: number }[]>([]);

    // Persistent particles for water
    useEffect(() => {
        const ps: typeof particlesRef.current = [];
        // groundwater particles in aquifer
        for (let i = 0; i < 60; i++) {
            ps.push({ x: Math.random() * width, y: 240 + Math.random() * 100, vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.1, r: 2 + Math.random() * 2, a: 0.3 + Math.random() * 0.4, phase: 'ground', life: 1 });
        }
        particlesRef.current = ps;
    }, [width]);

    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d'); if (!ctx) return;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr; canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        let t = 0;

        const drawCloud = (cx: number, cy: number, s: number, dark: boolean) => {
            ctx.save(); ctx.globalAlpha = dark ? 0.85 : 0.7;
            const g = ctx.createRadialGradient(cx, cy - 5, s * 0.3, cx, cy, s);
            g.addColorStop(0, dark ? '#8899aa' : '#ffffff'); g.addColorStop(1, dark ? '#667788' : '#e8eef4');
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.ellipse(cx, cy, s * 1.4, s * 0.55, 0, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(cx - s * 0.6, cy + 3, s * 0.8, s * 0.4, 0, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(cx + s * 0.7, cy + 2, s * 0.9, s * 0.45, 0, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
        };

        const drawGround = (revealDepth: number) => {
            // Surface grass
            const grassG = ctx.createLinearGradient(0, 125, 0, 140);
            grassG.addColorStop(0, '#4CAF50'); grassG.addColorStop(1, '#388E3C');
            ctx.fillStyle = grassG;
            ctx.beginPath(); ctx.moveTo(0, 130);
            for (let x = 0; x <= width; x += 3) { ctx.lineTo(x, 128 + Math.sin(x * 0.03 + t * 0.5) * 3); }
            ctx.lineTo(width, 145); ctx.lineTo(0, 145); ctx.fill();

            // Soil layer
            if (revealDepth > 0) {
                const soilG = ctx.createLinearGradient(0, 140, 0, 200);
                soilG.addColorStop(0, '#8B6914'); soilG.addColorStop(1, '#6B4423');
                ctx.fillStyle = soilG;
                ctx.fillRect(0, 140, width, Math.min(revealDepth, 60));
                // soil dots
                ctx.fillStyle = '#5D3A1A';
                for (let i = 0; i < 40; i++) {
                    const sx = ((i * 37 + 13) % width); const sy = 145 + ((i * 19) % Math.min(revealDepth, 55));
                    ctx.beginPath(); ctx.arc(sx, sy, 1 + Math.sin(i) * 0.5, 0, Math.PI * 2); ctx.fill();
                }
            }

            // Aquifer rock layer
            if (revealDepth > 60) {
                const depth = Math.min(revealDepth - 60, 120);
                // Rock pattern
                ctx.fillStyle = '#A0764A';
                ctx.fillRect(0, 200, width, depth);
                // Pebble textures
                ctx.fillStyle = '#8B6234'; ctx.globalAlpha = 0.4;
                for (let i = 0; i < 80; i++) {
                    const px = ((i * 53 + 7) % width); const py = 205 + ((i * 31) % Math.min(depth - 5, 115));
                    if (py < 200 + depth) { ctx.beginPath(); ctx.ellipse(px, py, 3 + Math.sin(i) * 2, 2 + Math.cos(i), i * 0.5, 0, Math.PI * 2); ctx.fill(); }
                }
                ctx.globalAlpha = 1;

                // Water table line
                if (step >= 3) {
                    ctx.save();
                    ctx.strokeStyle = DS.primaryOrange; ctx.lineWidth = 2.5;
                    ctx.setLineDash([10, 6]);
                    ctx.globalAlpha = 0.5 + Math.sin(t * 2) * 0.3;
                    ctx.beginPath(); ctx.moveTo(0, 210); ctx.lineTo(width, 210); ctx.stroke();
                    ctx.restore();
                }

                // Water particles in aquifer
                if (step >= 2) {
                    particlesRef.current.forEach(p => {
                        if (p.phase === 'ground' && p.y >= 210 && p.y < 200 + depth) {
                            ctx.fillStyle = DS.primaryIndigo;
                            ctx.globalAlpha = p.a * (0.7 + Math.sin(t * 3 + p.x * 0.1) * 0.3);
                            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
                            ctx.globalAlpha = 1;
                        }
                    });
                }
            }

            // Impermeable rock
            if (revealDepth > 180) {
                const impDepth = Math.min(revealDepth - 180, 80);
                ctx.fillStyle = '#525252'; ctx.fillRect(0, 320, width, impDepth);
                // hatching
                ctx.strokeStyle = '#424242'; ctx.lineWidth = 0.8;
                for (let y = 325; y < 320 + impDepth; y += 8) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
                for (let x = 0; x < width; x += 16) { ctx.beginPath(); ctx.moveTo(x, 320); ctx.lineTo(x, 320 + impDepth); ctx.stroke(); }
            }
        };

        const drawVillage = () => {
            // Hut
            ctx.fillStyle = '#C87533'; ctx.beginPath(); ctx.moveTo(60, 118); ctx.lineTo(100, 88); ctx.lineTo(140, 118); ctx.fill();
            ctx.fillStyle = '#DEB887'; ctx.fillRect(70, 118, 60, 16);
            ctx.fillStyle = '#5D3A1A'; ctx.fillRect(90, 120, 14, 14);

            // Well
            ctx.fillStyle = '#7B5B3A'; ctx.fillRect(width / 2 - 18, 105, 36, 28);
            ctx.fillStyle = '#8B6E4E'; ctx.fillRect(width / 2 - 24, 100, 48, 7);
            ctx.strokeStyle = '#7B5B3A'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(width / 2, 100); ctx.lineTo(width / 2, 82); ctx.stroke();
            ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(width / 2 - 11, 82); ctx.lineTo(width / 2 + 11, 82); ctx.stroke();
            // bucket
            ctx.fillStyle = DS.primaryIndigo; ctx.globalAlpha = 0.6;
            ctx.fillRect(width / 2 - 4, 85, 8, 6); ctx.globalAlpha = 1;

            // Tree
            ctx.fillStyle = '#5D4037'; ctx.fillRect(width - 80, 100, 8, 30);
            ctx.fillStyle = '#388E3C'; ctx.beginPath(); ctx.arc(width - 76, 88, 20, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#43A047'; ctx.beginPath(); ctx.arc(width - 88, 95, 14, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(width - 64, 95, 14, 0, Math.PI * 2); ctx.fill();
        };

        const drawRaindrops = (count: number) => {
            ctx.fillStyle = DS.primaryIndigo;
            for (let i = 0; i < count; i++) {
                const rx = (i * 97 + t * 40 + i * i * 13) % (width + 40) - 20;
                const ry = ((t * 80 + i * 73) % 150) - 20;
                ctx.globalAlpha = 0.5 + Math.sin(i) * 0.2;
                // teardrop shape
                ctx.beginPath();
                ctx.moveTo(rx, ry); ctx.quadraticCurveTo(rx - 3, ry + 8, rx, ry + 12); ctx.quadraticCurveTo(rx + 3, ry + 8, rx, ry);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        };

        const drawInfiltrationArrows = (alpha: number) => {
            const arrows = [width * 0.2, width * 0.38, width * 0.55, width * 0.75];
            arrows.forEach((ax, i) => {
                const ay = 135 + Math.sin(t * 2 + i) * 5;
                const progress = (t * 0.5 + i * 0.3) % 1;
                ctx.save();
                ctx.globalAlpha = alpha * (1 - progress);
                ctx.strokeStyle = DS.primaryIndigo; ctx.lineWidth = 2;
                ctx.setLineDash([4, 4]);
                ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax, ay + 30 + progress * 40); ctx.stroke();
                // arrow head
                ctx.fillStyle = DS.primaryIndigo;
                const tipY = ay + 30 + progress * 40;
                ctx.beginPath(); ctx.moveTo(ax - 4, tipY - 4); ctx.lineTo(ax + 4, tipY - 4); ctx.lineTo(ax, tipY + 3); ctx.fill();
                ctx.restore();
            });
        };

        const drawLabel = (text: string, x: number, y: number, color: string, alpha: number) => {
            if (alpha <= 0) return;
            ctx.save(); ctx.globalAlpha = alpha;
            ctx.font = `bold 11px ${DS.font}`;
            const w = ctx.measureText(text).width + 20;
            ctx.fillStyle = color;
            const rr = 4;
            ctx.beginPath(); ctx.moveTo(x - w / 2 + rr, y - 10); ctx.lineTo(x + w / 2 - rr, y - 10); ctx.quadraticCurveTo(x + w / 2, y - 10, x + w / 2, y - 10 + rr); ctx.lineTo(x + w / 2, y + 6 - rr); ctx.quadraticCurveTo(x + w / 2, y + 6, x + w / 2 - rr, y + 6); ctx.lineTo(x - w / 2 + rr, y + 6); ctx.quadraticCurveTo(x - w / 2, y + 6, x - w / 2, y + 6 - rr); ctx.lineTo(x - w / 2, y - 10 + rr); ctx.quadraticCurveTo(x - w / 2, y - 10, x - w / 2 + rr, y - 10); ctx.fill();
            ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, x, y - 2);
            ctx.restore();
        };

        // Sun
        const drawSky = () => {
            const skyG = ctx.createLinearGradient(0, 0, 0, 130);
            skyG.addColorStop(0, '#87CEEB'); skyG.addColorStop(1, '#B0E0E6');
            ctx.fillStyle = skyG; ctx.fillRect(0, 0, width, 130);
            // sun
            ctx.fillStyle = '#FFC857'; ctx.globalAlpha = 0.9;
            ctx.beginPath(); ctx.arc(width - 60, 40, 22, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = 0.15; ctx.beginPath(); ctx.arc(width - 60, 40, 32, 0, Math.PI * 2); ctx.fill();
            // rays
            ctx.globalAlpha = 0.12;
            for (let i = 0; i < 8; i++) {
                const a = i * Math.PI / 4 + t * 0.3;
                ctx.beginPath(); ctx.moveTo(width - 60 + Math.cos(a) * 26, 40 + Math.sin(a) * 26);
                ctx.lineTo(width - 60 + Math.cos(a) * 42, 40 + Math.sin(a) * 42); ctx.lineWidth = 2; ctx.strokeStyle = '#FFC857'; ctx.stroke();
            }
            ctx.globalAlpha = 1;
        };

        const animate = () => {
            t += 0.016; timeRef.current = t;
            ctx.clearRect(0, 0, width, height);

            drawSky();

            // Cloud (darker if raining)
            drawCloud(150, 40, 30, step >= 1);
            drawCloud(width * 0.55, 30, 25, step >= 1);

            // Rain
            if (step >= 1) drawRaindrops(step >= 1 ? 25 : 0);

            // Ground reveal depth based on step
            const revealTarget = [0, 40, 180, 260, 260][Math.min(step, 4)];
            const revealSpeed = 2;
            const currentReveal = Math.min(revealTarget, revealTarget);// instant for simplicity
            drawGround(currentReveal);
            drawVillage();

            // Infiltration arrows
            if (step >= 1) drawInfiltrationArrows(Math.min(1, (step >= 1 ? 1 : 0)));

            // Update water particles subtle drift
            particlesRef.current.forEach(p => {
                p.x += p.vx + Math.sin(t + p.y * 0.05) * 0.05;
                p.y += p.vy + Math.cos(t + p.x * 0.03) * 0.03;
                if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
                if (p.y < 210) p.y = 310; if (p.y > 320) p.y = 215;
            });

            // Labels based on step
            if (step >= 1) drawLabel('💧 Infiltration', width * 0.75, 155, DS.primaryIndigo, 1);
            if (step >= 2) drawLabel('🌊 Groundwater', 110, 260, '#2196F3', 1);
            if (step >= 2) drawLabel('🪨 Aquifer', width / 2, 290, DS.gradientPurple, 1);
            if (step >= 3) drawLabel('📏 Water Table', width * 0.72, 218, DS.primaryOrange, 1);
            if (step >= 4) drawLabel('🧱 Impermeable Rock', width * 0.65, 350, DS.dark, 1);

            // Well water line
            if (step >= 3) {
                ctx.fillStyle = DS.primaryIndigo; ctx.globalAlpha = 0.4;
                ctx.fillRect(width / 2 - 14, 115, 28, 12); ctx.globalAlpha = 1;
            }

            animRef.current = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(animRef.current);
    }, [step, width, height]);

    return <canvas ref={canvasRef} style={{ width, height, display: 'block', borderRadius: DS.r.md }} />;
};

// ── LEARN STEP DATA ──
const LEARN_STEPS = [
    { title: 'The Water Cycle Begins', desc: 'When rain falls on the earth, something fascinating happens underground. Let\'s follow a raindrop\'s journey from the clouds into the earth!', highlight: 'Watch the rain clouds form above the Indian village...' },
    { title: 'Infiltration — Water Seeps In', desc: 'Rainwater doesn\'t just sit on the surface — it seeps through soil and rocks. This process is called INFILTRATION. The spaces between soil particles allow water to trickle downward.', highlight: 'Notice the blue arrows showing water seeping through the soil layer.' },
    { title: 'Groundwater & Aquifer', desc: 'The water that infiltrates collects in the pore spaces of underground rocks. This stored water is called GROUNDWATER. The rock layer that holds it is called an AQUIFER — think of it like a natural underground sponge!', highlight: 'See the blue water particles slowly moving through the porous rock layer (aquifer).' },
    { title: 'The Water Table', desc: 'The WATER TABLE is the top level of the saturated zone — like the water line in a swimming pool. Above it, spaces have air; below it, every space is filled with water. Wells are dug deep enough to reach below this line.', highlight: 'The orange dotted line marks where water begins — the water table. Notice the well reaches below it!' },
    { title: 'Impermeable Rock — The Floor', desc: 'Below the aquifer lies IMPERMEABLE ROCK — dense rock that water cannot pass through. It acts like the floor of a bathtub, keeping groundwater from draining further. This is why aquifers exist!', highlight: 'The dark grey layer at the bottom is impermeable rock — water stops here.' },
];

// ── PILL BADGE ──
const Pill: React.FC<{ children: React.ReactNode; v?: string; sm?: boolean; onClick?: () => void; style?: React.CSSProperties }> = ({ children, v = 'indigo', sm, onClick, style = {} }) => {
    const [h, sH] = useState(false);
    const vars: Record<string, React.CSSProperties> = { indigo: { background: DS.primaryIndigo, color: '#fff' }, orange: { background: DS.primaryOrange, color: '#fff' }, gradient: { background: `linear-gradient(135deg,${DS.gradientPurple},${DS.gradientOrange})`, color: '#fff' }, ghost: { background: 'rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(8px)' }, light: { background: DS.lightPurple, color: DS.gradientPurple } };
    return <button onClick={onClick} onMouseEnter={() => sH(true)} onMouseLeave={() => sH(false)} style={{ fontFamily: DS.font, fontWeight: 600, borderRadius: DS.r.pill, border: 'none', cursor: onClick ? 'pointer' : 'default', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'all 0.3s ease', padding: sm ? '5px 14px' : '8px 20px', fontSize: sm ? 11 : 13, transform: h && onClick ? 'scale(1.05)' : 'scale(1)', boxShadow: h ? DS.shadowMd : DS.shadowSm, ...(vars[v] || vars.indigo), ...style }}>{children}</button>;
};

// ══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════
const GroundwaterMatchingTool: React.FC<Props> = ({ props = {}, setStepDetails, stopAutoNext, setStopAutoNext }) => {
    const W = props.width ?? 800, H = props.height ?? 600;
    const ap = props.additionalProps || {};
    const pairs = ap.pairs || PAIRS;
    const showHints = ap.showHints ?? true;
    const showCross = ap.showCrossSectionOnComplete ?? true;

    // ── MODE: learn vs match ──
    const [mode, setMode] = useState<'learn' | 'match'>('learn');
    const [learnStep, setLearnStep] = useState(0);

    // ── MATCH STATE ──
    const [shuffledDefs, setShuffledDefs] = useState<TermPair[]>([]);
    const [selTerm, setSelTerm] = useState<string | null>(null);
    const [selDef, setSelDef] = useState<string | null>(null);
    const [matches, setMatches] = useState<Record<string, string>>({});
    const [incorrect, setIncorrect] = useState<string | null>(null);
    const [hint, setHint] = useState('');
    const [showHint, setShowHint] = useState(false);
    const [shakeId, setShakeId] = useState<string | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [score, setScore] = useState(0);
    const [totalAtt, setTotalAtt] = useState(0);
    const [hovT, setHovT] = useState<string | null>(null);
    const [hovD, setHovD] = useState<string | null>(null);
    const [scoreAnim, setScoreAnim] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { const id = 'gw-kf2'; if (!document.getElementById(id)) { const s = document.createElement('style'); s.id = id; s.textContent = KF; document.head.appendChild(s); } setTimeout(() => setMounted(true), 80); return () => { const e = document.getElementById(id); if (e) document.head.removeChild(e); }; }, []);
    useEffect(() => { setShuffledDefs(shuffle(pairs, ap.shuffleSeed)); }, [pairs, ap.shuffleSeed]);

    const startMatch = () => { setMode('match'); setShuffledDefs(shuffle(pairs)); };
    const backToLearn = () => { setMode('learn'); setLearnStep(0); resetMatch(); };

    const handleTerm = useCallback((id: string) => { if (matches[id]) return; setSelTerm(p => p === id ? null : id); setShowHint(false); setIncorrect(null); }, [matches]);
    const handleDef = useCallback((id: string) => { if (Object.values(matches).includes(id) || !selTerm) return; setSelDef(id); }, [matches, selTerm]);

    useEffect(() => {
        if (!selTerm || !selDef) return; setTotalAtt(p => p + 1);
        if (selTerm === selDef) { setMatches(p => ({ ...p, [selTerm]: selDef })); setScore(p => p + 1); setScoreAnim(true); setTimeout(() => setScoreAnim(false), 500); setSelTerm(null); setSelDef(null); setShowHint(false); setIncorrect(null); }
        else { setIncorrect(selDef); setShakeId(selDef); setTimeout(() => setShakeId(null), 650); if (showHints) { const p = pairs.find(x => x.id === selTerm); if (p) { setHint(p.hint); setShowHint(true); } } setTimeout(() => { setSelDef(null); setIncorrect(null); }, 1300); }
    }, [selTerm, selDef]);

    useEffect(() => { if (Object.keys(matches).length === pairs.length && pairs.length > 0) { setTimeout(() => setIsComplete(true), 400); } }, [matches, pairs]);

    const resetMatch = () => { setMatches({}); setSelTerm(null); setSelDef(null); setIncorrect(null); setShowHint(false); setHint(''); setIsComplete(false); setScore(0); setTotalAtt(0); setShuffledDefs(shuffle(pairs)); };
    const gc = (id: string) => pairs.find(p => p.id === id)?.color || DS.grey;
    const progress = mode === 'match' ? (Object.keys(matches).length / pairs.length) * 100 : ((learnStep + 1) / LEARN_STEPS.length) * 100;

    return (
        <div style={{ width: W, maxWidth: '100%', minHeight: H, fontFamily: DS.font, background: DS.offWhite, borderRadius: DS.r.xl, overflow: 'hidden', boxShadow: DS.shadowXl, display: 'flex', flexDirection: 'column', opacity: mounted ? 1 : 0, transition: 'opacity 0.5s ease' }}>

            {/* ══ HEADER ══ */}
            <div style={{ background: `linear-gradient(135deg,${DS.gradientPurple} 0%,${DS.primaryIndigo} 40%,${DS.gradientOrange} 100%)`, backgroundSize: '200% 200%', animation: 'gradientShift 8s ease infinite', padding: '18px 24px 14px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -20, right: 60, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 20 }}>🌍</span>
                            <h2 style={{ color: '#fff', fontSize: 17, fontWeight: 800, margin: 0 }}>Infiltration, Groundwater & Aquifers</h2>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10.5, margin: '3px 0 0 32px', fontWeight: 500 }}>Chapter 7 • Grade 7 Science</p>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                        <Pill v={mode === 'learn' ? 'ghost' : 'ghost'} sm onClick={() => mode === 'match' ? backToLearn() : null} style={{ background: mode === 'learn' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)' }}><BookOpen size={12} /> Learn</Pill>
                        <Pill v="ghost" sm onClick={() => mode === 'learn' ? startMatch() : null} style={{ background: mode === 'match' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)' }}><Target size={12} /> Match</Pill>
                    </div>
                </div>
                <div style={{ marginTop: 10, height: 3, borderRadius: DS.r.pill, background: 'rgba(255,255,255,0.12)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: DS.r.pill, background: `linear-gradient(90deg,${DS.lightPurple},${DS.primaryOrange})`, width: `${progress}%`, transition: 'width 0.6s ease' }} />
                </div>
            </div>

            {/* ══ LEARN MODE ══ */}
            {mode === 'learn' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Canvas scene */}
                    <div style={{ padding: '16px 24px 0', animation: 'fadeInUp 0.5s ease-out' }}>
                        <div style={{ borderRadius: DS.r.lg, overflow: 'hidden', boxShadow: DS.shadowMd, border: `2px solid ${DS.lightPurple}` }}>
                            <AnimatedScene step={learnStep} width={W - 48 > 0 ? W - 48 : 700} height={Math.min(340, H * 0.5)} />
                        </div>
                    </div>

                    {/* Step info */}
                    <div style={{ padding: '16px 24px', flex: 1, animation: 'fadeInUp 0.4s ease-out 0.2s both' }}>
                        <div style={{ background: DS.white, borderRadius: DS.r.lg, padding: '18px 20px', boxShadow: DS.shadowSm, border: `1.5px solid ${DS.lightGrey}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                <span style={{ background: DS.lightPurple, color: DS.gradientPurple, fontWeight: 800, fontSize: 10, padding: '3px 10px', borderRadius: DS.r.pill }}>STEP {learnStep + 1}/{LEARN_STEPS.length}</span>
                                <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0, color: DS.dark }}>{LEARN_STEPS[learnStep].title}</h3>
                            </div>
                            <p style={{ fontSize: 13, lineHeight: 1.65, color: DS.dark, margin: '0 0 10px', fontWeight: 500 }}>{LEARN_STEPS[learnStep].desc}</p>
                            <div style={{ background: DS.lightOrange, borderRadius: DS.r.sm, padding: '10px 14px', border: `1px solid ${DS.primaryOrange}20` }}>
                                <p style={{ fontSize: 11.5, color: '#7C4A00', margin: 0, fontWeight: 600, fontStyle: 'italic' }}>👀 {LEARN_STEPS[learnStep].highlight}</p>
                            </div>
                        </div>
                    </div>

                    {/* Nav buttons */}
                    <div style={{ padding: '0 24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Pill v="light" sm onClick={() => setLearnStep(Math.max(0, learnStep - 1))} style={{ opacity: learnStep === 0 ? 0.4 : 1, cursor: learnStep === 0 ? 'default' : 'pointer' }}>
                            <ChevronLeft size={14} /> Previous
                        </Pill>
                        <div style={{ display: 'flex', gap: 4 }}>
                            {LEARN_STEPS.map((_, i) => (
                                <div key={i} onClick={() => setLearnStep(i)} style={{ width: i === learnStep ? 20 : 8, height: 8, borderRadius: DS.r.pill, background: i <= learnStep ? DS.primaryIndigo : DS.lightGrey, transition: 'all 0.3s ease', cursor: 'pointer' }} />
                            ))}
                        </div>
                        {learnStep < LEARN_STEPS.length - 1 ? (
                            <Pill v="indigo" sm onClick={() => setLearnStep(learnStep + 1)}>Next <ChevronRight size={14} /></Pill>
                        ) : (
                            <Pill v="gradient" sm onClick={startMatch}>Start Matching! <Target size={14} /></Pill>
                        )}
                    </div>
                </div>
            )}

            {/* ══ MATCH MODE ══ */}
            {mode === 'match' && !isComplete && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Instructions */}
                    <div style={{ padding: '10px 24px', background: DS.white, borderBottom: `1px solid ${DS.lightGrey}`, fontSize: 12, color: DS.dark, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 24, height: 24, borderRadius: DS.r.sm, background: DS.lightOrange, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>💡</span>
                        <span>Click a <strong style={{ color: DS.primaryIndigo }}>term</strong>, then its <strong style={{ color: DS.gradientOrange }}>definition</strong>. <em style={{ color: DS.grey }}>Aquifer ≠ Water Table!</em>
                            {selTerm && !selDef && <span style={{ color: gc(selTerm), fontWeight: 700, animation: 'pulse 1.5s infinite', display: 'inline-block' }}> → Pick definition</span>}</span>
                        <div style={{ marginLeft: 'auto' }}><Pill v="ghost" sm style={{ background: DS.lightPurple, color: DS.gradientPurple }}><Check size={11} /> <span style={{ animation: scoreAnim ? 'scoreCountUp 0.4s ease-out' : 'none', display: 'inline-block' }}>{score}/{pairs.length}</span></Pill></div>
                    </div>

                    {/* Hint */}
                    {showHint && hint && (<div style={{ margin: '10px 20px 0', padding: '10px 14px', borderRadius: DS.r.md, background: DS.lightOrange, border: `1.5px solid ${DS.primaryOrange}40`, fontSize: 12, color: '#7C4A00', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, animation: 'slideDown 0.4s ease-out' }}>
                        <span>💡</span><span style={{ flex: 1 }}>{hint}</span><button onClick={() => setShowHint(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: DS.primaryOrange, fontWeight: 800, fontSize: 16 }}>×</button>
                    </div>)}

                    {/* Cards */}
                    <div style={{ display: 'flex', gap: 14, padding: '14px 20px 18px', flex: 1, alignItems: 'flex-start' }}>
                        {/* Terms */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
                            <div style={{ fontSize: 9.5, fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: DS.primaryIndigo, paddingLeft: 2 }}>Terms</div>
                            {pairs.map((p, i) => {
                                const m = !!matches[p.id], sel = selTerm === p.id;
                                return (<div key={p.id} onClick={() => !m && handleTerm(p.id)} onMouseEnter={() => !m && setHovT(p.id)} onMouseLeave={() => setHovT(null)}
                                    style={{
                                        padding: '10px 12px', borderRadius: DS.r.md, cursor: m ? 'default' : 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 13, position: 'relative', userSelect: 'none' as const,
                                        background: m ? DS.white : sel ? DS.white : hovT === p.id ? DS.white : `${DS.white}B3`,
                                        border: m ? `2px solid ${p.color}` : sel ? `2px solid ${p.color}` : hovT === p.id ? `2px solid ${p.color}60` : '2px solid transparent',
                                        boxShadow: sel ? `0 0 0 3px ${p.color}20, ${DS.shadowMd}` : DS.shadowSm,
                                        transform: sel ? 'scale(1.03)' : hovT === p.id ? 'scale(1.01)' : 'scale(1)', opacity: m ? 0.55 : 1,
                                        animation: sel ? 'glowIndigo 2s infinite' : `fadeInLeft 0.4s ease-out ${i * 0.07}s both`
                                    } as React.CSSProperties}>
                                    <span style={{ width: 32, height: 32, borderRadius: DS.r.sm, background: `${p.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0, animation: sel ? 'iconBounce 1.2s infinite' : 'none' }}>{p.icon}</span>
                                    <span style={{ color: m ? p.color : DS.dark, flex: 1 }}>{p.term}</span>
                                    <span style={{ width: 3, height: 20, borderRadius: DS.r.pill, background: p.color, opacity: m ? 0.3 : 0.6, flexShrink: 0 }} />
                                    {m && <span style={{ position: 'absolute', top: -5, right: -5, width: 20, height: 20, borderRadius: '50%', background: DS.success, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'checkPop 0.5s ease-out', boxShadow: '0 2px 6px rgba(46,204,113,0.3)' }}><Check size={11} color="#fff" strokeWidth={3} /></span>}
                                </div>);
                            })}
                        </div>

                        {/* Connector */}
                        <div style={{ width: 30, flexShrink: 0, marginTop: 18, position: 'relative' }}>
                            <svg width="30" height={pairs.length * 56 + 10} style={{ overflow: 'visible' }}>
                                {Object.entries(matches).map(([tid, did]) => {
                                    const ti = pairs.findIndex(x => x.id === tid), di = shuffledDefs.findIndex(x => x.id === did); if (ti < 0 || di < 0) return null; const ty = ti * 54 + 24, dy = di * 66 + 24; const c = gc(tid);
                                    return <g key={tid}><line x1="0" y1={ty} x2="30" y2={dy} stroke={c} strokeWidth="2" strokeLinecap="round" style={{ strokeDasharray: '500', strokeDashoffset: '500', animation: 'drawLine 0.7s ease-out forwards' }} /><circle cx="2" cy={ty} r="3" fill={c} style={{ animation: 'popIn 0.3s 0.4s both' }} /><circle cx="28" cy={dy} r="3" fill={c} style={{ animation: 'popIn 0.3s 0.5s both' }} /></g>;
                                })}
                            </svg>
                        </div>

                        {/* Definitions */}
                        <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: 7 }}>
                            <div style={{ fontSize: 9.5, fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: DS.gradientOrange, paddingLeft: 2 }}>Definitions</div>
                            {shuffledDefs.map((p, i) => {
                                const m = Object.values(matches).includes(p.id); const mtid = Object.entries(matches).find(([, v]) => v === p.id)?.[0]; const mc = mtid ? gc(mtid) : DS.grey; const inc = incorrect === p.id; const shk = shakeId === p.id; const sel = !!selTerm && !m;
                                return (<div key={p.id} onClick={() => handleDef(p.id)} onMouseEnter={() => !m && setHovD(p.id)} onMouseLeave={() => setHovD(null)}
                                    style={{
                                        padding: '10px 12px', borderRadius: DS.r.md, cursor: sel ? 'pointer' : 'default', transition: 'all 0.3s ease', fontSize: 12, lineHeight: 1.5, fontWeight: 500, position: 'relative', userSelect: 'none' as const,
                                        background: m ? DS.white : inc ? '#FFF5F5' : hovD === p.id && sel ? DS.white : `${DS.white}B3`,
                                        border: m ? `2px solid ${mc}` : inc ? `2px solid ${DS.error}` : hovD === p.id && sel ? `2px solid ${gc(selTerm!)}50` : '2px solid transparent',
                                        boxShadow: inc ? `0 0 0 3px ${DS.error}15` : DS.shadowSm, opacity: m ? 0.55 : 1,
                                        animation: shk ? 'shake 0.55s' : `fadeInRight 0.4s ease-out ${i * 0.07}s both`, color: m ? mc : DS.dark
                                    } as React.CSSProperties}>
                                    {m && <div style={{ position: 'absolute', left: 0, top: 6, bottom: 6, width: 3, borderRadius: DS.r.pill, background: mc, animation: 'popIn 0.3s' }} />}
                                    <span style={{ paddingLeft: m ? 6 : 0, transition: 'padding 0.3s' }}>{p.definition}</span>
                                    {m && mtid && <div style={{ marginTop: 5, animation: 'fadeInUp 0.3s' }}><span style={{ fontWeight: 600, borderRadius: DS.r.pill, display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 8px', fontSize: 9.5, background: `${mc}15`, color: mc }}><Check size={9} strokeWidth={3} />{pairs.find(x => x.id === mtid)?.term}</span></div>}
                                    {inc && <span style={{ position: 'absolute', top: 6, right: 6, width: 20, height: 20, borderRadius: '50%', background: DS.error, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'popIn 0.3s' }}><X_Icon size={11} color="#fff" strokeWidth={3} /></span>}
                                    {hovD === p.id && sel && !inc && <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: gc(selTerm!), opacity: 0.4 }}><ChevronRight size={14} /></span>}
                                </div>);
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* ══ COMPLETION ══ */}
            {mode === 'match' && isComplete && (
                <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ background: DS.white, borderRadius: DS.r.lg, padding: '24px 20px', textAlign: 'center' as const, animation: 'popIn 0.6s ease-out', boxShadow: DS.shadowMd, border: `2px solid ${DS.success}40`, position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg,${DS.lightPurple}20,${DS.lightOrange}30)`, backgroundSize: '400% 400%', animation: 'gradientShift 3s infinite' }} />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ fontSize: 48, marginBottom: 6, animation: 'celebrateBurst 0.9s ease-out' }}>🎉</div>
                            <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 4px', background: `linear-gradient(135deg,${DS.gradientPurple},${DS.gradientOrange})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Excellent Work!</h3>
                            <p style={{ fontSize: 13, color: DS.dark, margin: '0 0 12px', fontWeight: 600 }}>All {pairs.length} terms matched correctly!</p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 14 }}>
                                <Pill v="indigo" sm><Check size={11} /> {score}/{pairs.length}</Pill>
                                <Pill v="orange" sm><Award size={11} /> {totalAtt} tries</Pill>
                            </div>
                            <div style={{ background: DS.lightOrange, borderRadius: DS.r.md, padding: '12px 16px', maxWidth: 440, margin: '0 auto 14px', textAlign: 'left' as const, border: `1px solid ${DS.primaryOrange}20` }}>
                                <p style={{ fontSize: 12, color: '#7C4A00', margin: 0, fontStyle: 'italic', lineHeight: 1.6, fontWeight: 500 }}>🌧️ <strong>Challenge:</strong> Narrate a raindrop's journey using all 5 terms — from cloud to impermeable rock!</p>
                            </div>
                            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                                <Pill v="light" sm onClick={backToLearn}><BookOpen size={13} /> Review Lesson</Pill>
                                <Pill v="gradient" onClick={resetMatch} style={{ padding: '8px 22px' }}><RotateCcw size={13} /> Try Again</Pill>
                            </div>
                        </div>
                    </div>
                    {/* Mini cross section */}
                    <div style={{ background: DS.white, borderRadius: DS.r.lg, overflow: 'hidden', boxShadow: DS.shadowSm, border: `1.5px solid ${DS.lightPurple}`, animation: 'fadeInUp 0.6s ease-out 0.3s both' }}>
                        <div style={{ padding: '10px 16px', background: DS.lightPurple + '30', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 13 }}>📐</span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: DS.gradientPurple }}>Underground Cross-Section — All 5 Terms</span>
                        </div>
                        <AnimatedScene step={4} width={W - 48 > 0 ? W - 48 : 700} height={220} />
                    </div>
                </div>
            )}

            {/* ══ FOOTER ══ */}
            <div style={{ padding: '8px 24px', background: DS.white, borderTop: `1px solid ${DS.lightGrey}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{ fontSize: 10, color: DS.grey, fontWeight: 600 }}>Section 7.4 — Infiltration & Aquifers</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: `linear-gradient(135deg,${DS.primaryIndigo},${DS.primaryOrange})` }} />
                    <span style={{ fontSize: 10, color: DS.grey, fontWeight: 700 }}>Curiosity • Grade 7</span>
                </div>
            </div>
        </div>
    );
};
export default GroundwaterMatchingTool;
// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════════