// @ts-ignore - React types may be provided by the host project
import React, { useState, useEffect, useRef, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS FROM SINGULARITY DESIGN SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

const DS = {
  colors: {
    primary: "#4A4DC9",
    accent: "#FF7212",
    gradientStart: "#533086",
    gradientEnd: "#FC9145",
    primaryLight: "#C1C1EA",
    accentLight: "#FFF3E4",
    text: "#4E4E4E",
    textMuted: "#CACACA",
    border: "#EBEBEB",
    surface: "#F5F5F5",
    white: "#FFFFFF",
    success: "#2ECC71",
    error: "#E74C3C",
    dark: "#1A1A2E",
    darkSurface: "#16213E",
  },
  font: "'Poppins', sans-serif",
  radius: {
    sm: "8px",
    md: "12px",
    lg: "20px",
    pill: "999px",
    xl: "24px",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },
  button: {
    height: "40px",
    paddingX: "24px",
    paddingY: "8px",
    iconGap: "4px",
  },
  shadow: {
    sm: "0 2px 8px rgba(74, 77, 201, 0.08)",
    md: "0 8px 32px rgba(74, 77, 201, 0.12)",
    lg: "0 16px 48px rgba(74, 77, 201, 0.16)",
    glow: "0 0 24px rgba(74, 77, 201, 0.25)",
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT DATA
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_STEPS = [
  {
    id: 1,
    title: "Does Light Travel in a Straight Line?",
    description:
      "Let us do an activity to try to find out if light travels in a straight line. We will perform two different experiments to investigate this question.",
    activity: "matchbox",
  },
  {
    id: 2,
    title: "Activity 11.1: Matchbox Experiment Setup",
    description:
      "Take three matchboxes and make a hole in the inner tray of each matchbox, exactly at the same position. Arrange these three matchboxes in a straight line.",
    activity: "matchbox",
  },
  {
    id: 3,
    title: "Aligned Matchboxes — Light Passes Through",
    description:
      "Make sure that all three holes are exactly at the same height and are in a line. Place a torch light on one side and a screen on the other side. You can see a bright spot on the screen!",
    activity: "matchbox",
  },
  {
    id: 4,
    title: "Misaligned Matchboxes — Light is Blocked",
    description:
      "Move one of the matchboxes slightly to a side or up and down. When all three holes are not in the same line, we cannot obtain the light spot on the screen. This suggests that light travels in a straight line.",
    activity: "matchbox",
  },
  {
    id: 5,
    title: "Activity 11.2: Pipe Experiment",
    description:
      "Can we check this in some other way? Let us try to see the candle flame through a bent pipe! Take a long hollow pipe of some flexible material.",
    activity: "pipe",
  },
  {
    id: 6,
    title: "Straight Pipe — Candle Visible",
    description:
      "Align the pipe so that you can see the candle flame through the straight pipe. Light travels through the pipe and reaches your eyes.",
    activity: "pipe",
  },
  {
    id: 7,
    title: "Bent Pipe — Candle Not Visible",
    description:
      "Now, bend the pipe and try to see the candle flame again. Can you still see it? You cannot see the candle flame through a bent pipe. This shows that light travels in a straight line.",
    activity: "pipe",
  },
];

const DEFAULT_QUESTIONS = [
  {
    id: 1,
    question:
      "What happens when you place three matchboxes with holes in a straight line and shine light through them?",
    options: [
      "Light bends around the holes",
      "Light passes through all holes and creates a spot on the screen",
      "Light stops at the first matchbox",
      "Light spreads in all directions",
    ],
    correctAnswer: 1,
    explanation:
      "When the holes are aligned in a straight line, light passes through all of them and creates a bright spot on the screen.",
  },
  {
    id: 2,
    question:
      "In the matchbox experiment, what happens when one matchbox is moved slightly up or down?",
    options: [
      "Light still passes through normally",
      "Light becomes brighter",
      "The light spot on the screen disappears",
      "Light changes color",
    ],
    correctAnswer: 2,
    explanation:
      "When the matchboxes are not aligned, the holes are not in the same straight line. Since light travels in a straight line, it cannot pass through misaligned holes.",
  },
  {
    id: 3,
    question: "Can you see a candle flame through a straight pipe?",
    options: [
      "No, never",
      "Yes, if the pipe is aligned properly",
      "Only if the pipe is very short",
      "Only if there is a mirror inside",
    ],
    correctAnswer: 1,
    explanation:
      "You can see the candle flame through a straight pipe when it is properly aligned.",
  },
  {
    id: 4,
    question:
      "What happens when you try to see a candle flame through a bent pipe?",
    options: [
      "You can see it more clearly",
      "You cannot see the flame",
      "The flame appears upside down",
      "The flame appears larger",
    ],
    correctAnswer: 1,
    explanation:
      "You cannot see the candle flame through a bent pipe because light travels in a straight line and cannot follow the curve.",
  },
  {
    id: 5,
    question: "Why does light not travel through a bent pipe?",
    options: [
      "The pipe is too long",
      "Light is absorbed by the pipe material",
      "Light travels in a straight line and cannot follow the curve",
      "There is not enough light",
    ],
    correctAnswer: 2,
    explanation:
      "Light travels in a straight line and cannot change direction to follow a curved path.",
  },
  {
    id: 6,
    question: "What do both the matchbox and pipe experiments prove?",
    options: [
      "Light can bend around corners",
      "Light needs air to travel",
      "Light travels in a straight line",
      "Light travels in circles",
    ],
    correctAnswer: 2,
    explanation:
      "Both experiments demonstrate that light travels in a straight line.",
  },
  {
    id: 7,
    question:
      "If you want to see around a corner, what property of light prevents you from doing so directly?",
    options: [
      "Light is too slow",
      "Light travels in a straight line",
      "Light is too bright",
      "Light has no color",
    ],
    correctAnswer: 1,
    explanation:
      "You cannot see directly around a corner because light travels in a straight line.",
  },
  {
    id: 8,
    question: "In which situation would light NOT be able to pass through?",
    options: [
      "Three holes arranged in a perfect line",
      "A completely straight tunnel",
      "Three holes where the middle one is offset",
      "A straight glass tube",
    ],
    correctAnswer: 2,
    explanation:
      "Light cannot pass through when the middle hole is offset because the three holes are not in a straight line.",
  },
];

const DEFAULT_APPLICATIONS = [
  {
    id: 1,
    title: "Periscopes in Submarines",
    description:
      "Submarines use periscopes to see above water while staying submerged. Periscopes use mirrors to redirect light in straight paths.",
    icon: "🔭",
    category: "Military & Navigation",
    example:
      "Two mirrors at 45° angles reflect light in straight lines to see over obstacles.",
  },
  {
    id: 2,
    title: "Laser Pointers & Alignment",
    description:
      "Laser pointers create perfectly straight reference lines in construction and surveying.",
    icon: "📐",
    category: "Construction",
    example:
      "Construction workers use laser levels to ensure walls are perfectly vertical.",
  },
  {
    id: 3,
    title: "Fiber Optic Cables",
    description:
      "Fiber optic cables use the principle that light travels in straight lines within glass fiber to transmit data.",
    icon: "🌐",
    category: "Communication",
    example:
      "Your internet uses fiber optics where light travels through thin glass fibers.",
  },
  {
    id: 4,
    title: "Flashlights & Spotlights",
    description:
      "Flashlights create focused beams of light that travel in straight lines. Reflectors direct the beam.",
    icon: "🔦",
    category: "Lighting",
    example:
      "Emergency responders use spotlights that send straight beams to search in darkness.",
  },
  {
    id: 5,
    title: "Cameras & Photography",
    description:
      "Cameras work because light travels in straight lines from the subject through the lens to the sensor.",
    icon: "📷",
    category: "Imaging",
    example:
      "When you take a photo, light travels in straight lines through the camera lens.",
  },
  {
    id: 6,
    title: "Solar Cookers",
    description:
      "Solar cookers use curved mirrors to redirect sunlight to a single point for cooking.",
    icon: "☀️",
    category: "Energy",
    example:
      "Solar cookers provide a free, clean way to cook food using focused sunlight.",
  },
  {
    id: 7,
    title: "Shadows & Sundials",
    description:
      "Shadows form because light travels in straight lines and cannot bend around opaque objects.",
    icon: "🌤️",
    category: "Astronomy",
    example:
      "Sundials have been used for thousands of years using shadow positions.",
  },
  {
    id: 8,
    title: "Traffic Signals",
    description:
      "Traffic lights are positioned so drivers have a clear straight-line view from safe distances.",
    icon: "🚦",
    category: "Transport",
    example:
      "Traffic lights are placed high at intersections for clear straight-path visibility.",
  },
  {
    id: 9,
    title: "Optical Instruments",
    description:
      "Microscopes, telescopes, and binoculars rely on light traveling in straight lines through lenses.",
    icon: "🔬",
    category: "Science",
    example:
      "Astronomers use telescopes that collect light traveling from distant stars.",
  },
  {
    id: 10,
    title: "Barcode Scanners",
    description:
      "Barcode scanners use laser light that travels in straight lines to read patterns on products.",
    icon: "🏪",
    category: "Retail",
    example:
      "Checkout scanners send straight beams across barcodes to read product codes.",
  },
  {
    id: 11,
    title: "Medical Endoscopes",
    description:
      "Doctors use endoscopes with fiber optic cables that guide light in straight paths through flexible tubes.",
    icon: "🏥",
    category: "Medical",
    example:
      "Doctors examine internal organs using light guided through thin tubes.",
  },
  {
    id: 12,
    title: "Stage Lighting",
    description:
      "Theater spotlights create dramatic effects by directing bright beams in straight lines onto performers.",
    icon: "🎭",
    category: "Entertainment",
    example:
      "Follow-spots track performers with straight beams creating dramatic effects.",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// CANVAS DRAWING (kept functionally identical, restyled colors)
// ═══════════════════════════════════════════════════════════════════════════

function drawBg(ctx, w, h) {
  const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
  g.addColorStop(0, "#1A1A2E");
  g.addColorStop(1, "#0F0F23");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function drawIntro(ctx, w, h, p) {
  drawBg(ctx, w, h);
  const cx = w / 2,
    cy = h / 2;
  ctx.fillStyle = DS.colors.primaryLight;
  ctx.font = "bold 120px Poppins, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(74,77,201,0.5)";
  ctx.shadowBlur = 20;
  ctx.fillText("?", cx, cy);
  ctx.shadowBlur = 0;
  const numRays = 8;
  for (let i = 0; i < numRays; i++) {
    const angle = (i * 45 + p * 180) * (Math.PI / 180);
    const len = 100 + Math.sin(p * Math.PI + i) * 20;
    ctx.strokeStyle = `rgba(255,114,18,${0.3 + Math.sin(p * Math.PI + i) * 0.3})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * 80, cy + Math.sin(angle) * 80);
    ctx.lineTo(
      cx + Math.cos(angle) * (80 + len),
      cy + Math.sin(angle) * (80 + len),
    );
    ctx.stroke();
  }
  ctx.fillStyle = "#FFF";
  ctx.font = "bold 22px Poppins, sans-serif";
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText("Does Light Travel in a Straight Line?", cx, h - 50);
  ctx.shadowBlur = 0;
}

function drawMatchboxSetup(ctx, w, h, p) {
  drawBg(ctx, w, h);
  const cy = h / 2,
    bw = 80,
    bh = 50,
    sp = 150,
    sx = w / 2 - sp;
  for (let i = 0; i < 3; i++) {
    const x = sx + i * sp,
      y = cy - bh / 2;
    ctx.fillStyle = "#6B4E3D";
    ctx.strokeStyle = "#4A3628";
    ctx.lineWidth = 2;
    roundRect(ctx, x, y, bw, bh, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#8B6F5E";
    roundRect(ctx, x + 10, y + 10, bw - 20, bh - 20, 4);
    ctx.fill();
    const hs = Math.min(p * 15, 15);
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(x + bw / 2, cy, hs, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = DS.colors.primaryLight;
    ctx.font = "600 13px Poppins, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`Box ${i + 1}`, x + bw / 2, y + bh + 22);
  }
  ctx.fillStyle = DS.colors.primaryLight;
  ctx.font = "600 18px Poppins, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Make holes in the same position on each matchbox", w / 2, 70);
}

function drawMatchboxAligned(ctx, w, h, p) {
  drawBg(ctx, w, h);
  const cy = h / 2,
    bw = 80,
    bh = 50,
    sp = 150,
    sx = w / 2 - sp;
  const tX = 50,
    beamEnd = sx + 3 * sp + 100;
  const bp = Math.min(p, 1);
  // Torch
  ctx.fillStyle = DS.colors.accent;
  ctx.beginPath();
  ctx.arc(tX, cy, 20, 0, Math.PI * 2);
  ctx.fill();
  // Beam
  ctx.strokeStyle = `rgba(255,114,18,${0.5})`;
  ctx.lineWidth = 40;
  ctx.beginPath();
  ctx.moveTo(tX + 20, cy);
  ctx.lineTo(tX + 20 + (beamEnd - tX - 20) * bp, cy);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,200,100,0.8)";
  ctx.lineWidth = 15;
  ctx.beginPath();
  ctx.moveTo(tX + 20, cy);
  ctx.lineTo(tX + 20 + (beamEnd - tX - 20) * bp, cy);
  ctx.stroke();
  // Boxes
  for (let i = 0; i < 3; i++) {
    const x = sx + i * sp,
      y = cy - bh / 2;
    ctx.fillStyle = "#6B4E3D";
    ctx.strokeStyle = "#4A3628";
    ctx.lineWidth = 2;
    roundRect(ctx, x, y, bw, bh, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#8B6F5E";
    roundRect(ctx, x + 10, y + 10, bw - 20, bh - 20, 4);
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(x + bw / 2, cy, 15, 0, Math.PI * 2);
    ctx.fill();
  }
  // Screen
  ctx.fillStyle = "#FFF";
  ctx.fillRect(beamEnd, cy - 100, 10, 200);
  if (bp > 0.8) {
    const sp2 = (bp - 0.8) * 5,
      ss = 30 * sp2;
    const g = ctx.createRadialGradient(beamEnd, cy, 0, beamEnd, cy, ss);
    g.addColorStop(0, "rgba(255,200,100,0.9)");
    g.addColorStop(1, "rgba(255,200,100,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(beamEnd, cy, ss, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = DS.colors.success;
  ctx.font = "600 18px Poppins, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Aligned holes — Light passes through!", w / 2, 70);
}

function drawMatchboxMisaligned(ctx, w, h, p) {
  drawBg(ctx, w, h);
  const cy = h / 2,
    bw = 80,
    bh = 50,
    sp = 150,
    sx = w / 2 - sp;
  const tX = 50;
  const bp = Math.min(p, 1);
  const blockX = sx + sp + bw / 2 - 30;
  ctx.fillStyle = DS.colors.accent;
  ctx.beginPath();
  ctx.arc(tX, cy, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = `rgba(255,114,18,0.5)`;
  ctx.lineWidth = 40;
  ctx.beginPath();
  ctx.moveTo(tX + 20, cy);
  ctx.lineTo(Math.min(tX + 20 + (blockX - tX - 20) * bp, blockX), cy);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,200,100,0.8)";
  ctx.lineWidth = 15;
  ctx.beginPath();
  ctx.moveTo(tX + 20, cy);
  ctx.lineTo(Math.min(tX + 20 + (blockX - tX - 20) * bp, blockX), cy);
  ctx.stroke();
  for (let i = 0; i < 3; i++) {
    const x = sx + i * sp;
    let y = cy - bh / 2;
    const offset = i === 1 ? 30 * Math.sin(p * Math.PI * 0.5) : 0;
    y += offset;
    ctx.fillStyle = i === 1 ? "#7B5E4D" : "#6B4E3D";
    ctx.strokeStyle = i === 1 ? "#5A3E2D" : "#4A3628";
    ctx.lineWidth = 2;
    roundRect(ctx, x, y, bw, bh, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#8B6F5E";
    roundRect(ctx, x + 10, y + 10, bw - 20, bh - 20, 4);
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(x + bw / 2, y + bh / 2, 15, 0, Math.PI * 2);
    ctx.fill();
    if (i === 1 && offset > 5) {
      ctx.strokeStyle = DS.colors.error;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + bw / 2, y - 28);
      ctx.lineTo(x + bw / 2, y - 10);
      ctx.stroke();
      ctx.fillStyle = DS.colors.error;
      ctx.beginPath();
      ctx.moveTo(x + bw / 2, y - 10);
      ctx.lineTo(x + bw / 2 - 5, y - 18);
      ctx.lineTo(x + bw / 2 + 5, y - 18);
      ctx.closePath();
      ctx.fill();
    }
  }
  const screenX = sx + 3 * sp + 100;
  ctx.fillStyle = "#FFF";
  ctx.fillRect(screenX, cy - 100, 10, 200);
  if (bp > 0.8) {
    ctx.strokeStyle = DS.colors.error;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(screenX - 20, cy - 20);
    ctx.lineTo(screenX + 20, cy + 20);
    ctx.moveTo(screenX + 20, cy - 20);
    ctx.lineTo(screenX - 20, cy + 20);
    ctx.stroke();
  }
  ctx.fillStyle = DS.colors.error;
  ctx.font = "600 18px Poppins, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Misaligned holes — Light is blocked!", w / 2, 70);
}

function drawPipeIntro(ctx, w, h, p) {
  drawBg(ctx, w, h);
  const cx = w / 2,
    cy = h / 2;
  const pipeLen = 300 * Math.min(p, 1);
  ctx.strokeStyle = "#64748B";
  ctx.lineWidth = 40;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx - 150, cy);
  ctx.lineTo(cx - 150 + pipeLen, cy);
  ctx.stroke();
  ctx.strokeStyle = "#94A3B8";
  ctx.lineWidth = 30;
  ctx.beginPath();
  ctx.moveTo(cx - 150, cy);
  ctx.lineTo(cx - 150 + pipeLen, cy);
  ctx.stroke();
  if (p > 0.3) drawCandle(ctx, cx - 180, cy + 50, p);
  if (p > 0.6) drawEye(ctx, cx + 180, cy);
  ctx.fillStyle = DS.colors.primaryLight;
  ctx.font = "600 18px Poppins, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Can we see through a pipe?", cx, 70);
}

function drawPipeStraight(ctx, w, h, p) {
  drawBg(ctx, w, h);
  const cx = w / 2,
    cy = h / 2,
    ps = cx - 200,
    pe = cx + 200;
  ctx.strokeStyle = "#64748B";
  ctx.lineWidth = 40;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(ps, cy);
  ctx.lineTo(pe, cy);
  ctx.stroke();
  ctx.strokeStyle = "#94A3B8";
  ctx.lineWidth = 30;
  ctx.beginPath();
  ctx.moveTo(ps, cy);
  ctx.lineTo(pe, cy);
  ctx.stroke();
  const rp = Math.min(p, 1),
    re = ps + (pe - ps) * rp;
  ctx.strokeStyle = "rgba(255,114,18,0.6)";
  ctx.lineWidth = 20;
  ctx.beginPath();
  ctx.moveTo(ps, cy);
  ctx.lineTo(re, cy);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,200,100,0.9)";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(ps, cy);
  ctx.lineTo(re, cy);
  ctx.stroke();
  drawCandle(ctx, ps - 50, cy + 80, p);
  drawEye(ctx, pe + 50, cy);
  if (rp > 0.9) {
    ctx.fillStyle = DS.colors.accent;
    ctx.beginPath();
    ctx.arc(pe + 47, cy - 3, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = DS.colors.success;
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(pe + 80, cy - 80);
    ctx.lineTo(pe + 100, cy - 60);
    ctx.lineTo(pe + 140, cy - 100);
    ctx.stroke();
  }
  ctx.fillStyle = DS.colors.success;
  ctx.font = "600 18px Poppins, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Straight pipe — You can see the flame!", cx, 70);
}

function drawPipeBent(ctx, w, h, p) {
  drawBg(ctx, w, h);
  const cx = w / 2,
    cy = h / 2,
    bend = Math.min(p, 1) * 100;
  ctx.strokeStyle = "#64748B";
  ctx.lineWidth = 40;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - 200, cy);
  ctx.lineTo(cx - 50, cy);
  ctx.quadraticCurveTo(cx, cy - bend, cx + 50, cy);
  ctx.lineTo(cx + 200, cy);
  ctx.stroke();
  ctx.strokeStyle = "#94A3B8";
  ctx.lineWidth = 30;
  ctx.beginPath();
  ctx.moveTo(cx - 200, cy);
  ctx.lineTo(cx - 50, cy);
  ctx.quadraticCurveTo(cx, cy - bend, cx + 50, cy);
  ctx.lineTo(cx + 200, cy);
  ctx.stroke();
  if (p > 0.3) {
    const rp = Math.min(p - 0.3, 1),
      rl = 150 * rp;
    ctx.strokeStyle = "rgba(255,114,18,0.6)";
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.moveTo(cx - 200, cy);
    ctx.lineTo(cx - 200 + rl, cy);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,200,100,0.9)";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(cx - 200, cy);
    ctx.lineTo(cx - 200 + rl, cy);
    ctx.stroke();
    if (rp > 0.9) {
      ctx.strokeStyle = DS.colors.error;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(cx - 60, cy - 10);
      ctx.lineTo(cx - 40, cy + 10);
      ctx.moveTo(cx - 40, cy - 10);
      ctx.lineTo(cx - 60, cy + 10);
      ctx.stroke();
    }
  }
  drawCandle(ctx, cx - 250, cy + 80, p);
  drawEye(ctx, cx + 250, cy);
  if (p > 0.8) {
    ctx.strokeStyle = DS.colors.error;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx + 220, cy - 30);
    ctx.lineTo(cx + 280, cy + 30);
    ctx.moveTo(cx + 280, cy - 30);
    ctx.lineTo(cx + 220, cy + 30);
    ctx.stroke();
  }
  ctx.fillStyle = DS.colors.error;
  ctx.font = "600 18px Poppins, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Bent pipe — Cannot see the flame!", cx, 70);
}

function drawCandle(ctx, x, y, p) {
  ctx.fillStyle = "#F3E5AB";
  ctx.fillRect(x - 10, y, 20, 60);
  const fs = 20 + Math.sin(p * Math.PI * 8) * 3;
  const g = ctx.createRadialGradient(x, y - 10, 0, x, y - 10, fs);
  g.addColorStop(0, "#FFF");
  g.addColorStop(0.4, "#FFD700");
  g.addColorStop(1, "#FF4500");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(x, y - 10, 12, fs, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawEye(ctx, x, y) {
  ctx.fillStyle = "#FFF";
  ctx.beginPath();
  ctx.ellipse(x, y, 25, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(x - 5, y, 8, 0, Math.PI * 2);
  ctx.fill();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

const STAGE_KEYS = [
  "intro",
  "matchbox_setup",
  "matchbox_aligned",
  "matchbox_misaligned",
  "pipe_intro",
  "pipe_straight",
  "pipe_bent",
];
const DRAW_FNS = {
  intro: drawIntro,
  matchbox_setup: drawMatchboxSetup,
  matchbox_aligned: drawMatchboxAligned,
  matchbox_misaligned: drawMatchboxMisaligned,
  pipe_intro: drawPipeIntro,
  pipe_straight: drawPipeStraight,
  pipe_bent: drawPipeBent,
};

// ═══════════════════════════════════════════════════════════════════════════
// SVG ICONS
// ═══════════════════════════════════════════════════════════════════════════

const Icon = ({
  d,
  size = 20,
  stroke = true,
  fill = false,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill ? color : "none"}
    stroke={stroke ? color : "none"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <path d={d} />
  </svg>
);

const Icons = {
  play: (p) => (
    <svg
      width={p.size || 20}
      height={p.size || 20}
      viewBox="0 0 24 24"
      fill={p.color || "currentColor"}
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  pause: (p) => (
    <svg
      width={p.size || 20}
      height={p.size || 20}
      viewBox="0 0 24 24"
      fill={p.color || "currentColor"}
    >
      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
    </svg>
  ),
  chevLeft: (p) => <Icon d="M15 18l-6-6 6-6" {...p} />,
  chevRight: (p) => <Icon d="M9 18l6-6-6-6" {...p} />,
  reset: (p) => <Icon d="M1 4v6h6M3.51 15a9 9 0 1 0 2.13-9.36L1 10" {...p} />,
  check: (p) => (
    <svg
      width={p.size || 20}
      height={p.size || 20}
      viewBox="0 0 24 24"
      fill={p.color || DS.colors.success}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  ),
  x: (p) => (
    <svg
      width={p.size || 20}
      height={p.size || 20}
      viewBox="0 0 24 24"
      fill={p.color || DS.colors.error}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
    </svg>
  ),
  bulb: (p) => (
    <Icon
      d="M9 18h6M10 22h4M15 8a5 5 0 1 0-6 0c0 2 1 3 1 5h4c0-2 1-3 1-5z"
      {...p}
    />
  ),
  book: (p) => (
    <Icon
      d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
      {...p}
    />
  ),
  clipboard: (p) => (
    <Icon
      d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4"
      {...p}
    />
  ),
  globe: (p) => (
    <svg
      width={p.size || 20}
      height={p.size || 20}
      viewBox="0 0 24 24"
      fill="none"
      stroke={p.color || "currentColor"}
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
};

// ═══════════════════════════════════════════════════════════════════════════
// SINGULARITY BUTTON COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface SButtonProps {
  children?: React.ReactNode;
  variant?: string;
  disabled?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  highlight?: boolean;
  style?: React.CSSProperties;
}

const SButton = ({
  children,
  variant = "contained",
  disabled = false,
  onClick,
  icon,
  highlight = false,
  style: customStyle = {},
}: SButtonProps) => {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: DS.button.iconGap,
    height: DS.button.height,
    padding: `0 ${DS.button.paddingX}`,
    borderRadius: DS.radius.pill,
    fontFamily: DS.font,
    fontSize: "14px",
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    border: "none",
    outline: "none",
    transition: "all 0.25s ease",
    opacity: disabled ? 0.45 : 1,
    whiteSpace: "nowrap",
    letterSpacing: "0.01em",
  };

  const variants = {
    contained: {
      background: highlight
        ? DS.colors.accent
        : hovered
          ? `linear-gradient(135deg, ${DS.colors.gradientStart}, ${DS.colors.gradientEnd})`
          : DS.colors.primary,
      color: DS.colors.white,
      boxShadow: hovered && !disabled ? DS.shadow.glow : "none",
      transform: pressed
        ? "scale(0.96)"
        : hovered
          ? "translateY(-1px)"
          : "none",
    },
    outlined: {
      background: hovered ? DS.colors.primaryLight + "33" : "transparent",
      color: DS.colors.primary,
      border: `2px solid ${hovered ? DS.colors.primary : DS.colors.primaryLight}`,
      transform: pressed ? "scale(0.96)" : "none",
    },
    text: {
      background: hovered ? DS.colors.primaryLight + "22" : "transparent",
      color: hovered ? DS.colors.primary : DS.colors.text,
      transform: pressed ? "scale(0.96)" : "none",
    },
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{ ...base, ...variants[variant], ...customStyle }}
    >
      {icon && (
        <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>
      )}
      {children}
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// LEARN MODE
// ═══════════════════════════════════════════════════════════════════════════

const LearnMode = ({
  steps,
  canvasWidth,
  canvasHeight,
  animationSpeed,
  autoPlayDuration,
  setStepDetails,
}) => {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (setStepDetails)
      setStepDetails({
        currentStep: idx + 1,
        totalSteps: steps.length,
        stepTitle: steps[idx].title,
        stepDescription: steps[idx].description,
      });
  }, [idx, steps, setStepDetails]);

  useEffect(() => {
    if (!playing || autoPlayDuration === 0) return;
    const t = setTimeout(() => {
      if (idx < steps.length - 1) {
        setTransitioning(true);
        setTimeout(() => {
          setIdx((i) => i + 1);
          setTransitioning(false);
        }, 400);
      } else setPlaying(false);
    }, autoPlayDuration);
    return () => clearTimeout(t);
  }, [playing, idx, steps.length, autoPlayDuration]);

  useEffect(() => {
    const run = () => {
      setProgress((p) => (p + 0.01 * animationSpeed) % 1);
      animRef.current = requestAnimationFrame(run);
    };
    animRef.current = requestAnimationFrame(run);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [animationSpeed]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    const key = STAGE_KEYS[idx] || "intro";
    if (DRAW_FNS[key]) DRAW_FNS[key](ctx, canvasWidth, canvasHeight, progress);
  }, [idx, progress, canvasWidth, canvasHeight]);

  const go = (dir) => {
    setTransitioning(true);
    setTimeout(() => {
      setIdx((i) => i + dir);
      setTransitioning(false);
    }, 400);
  };

  const step = steps[idx];
  const pct = ((idx + 1) / steps.length) * 100;

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: `${DS.spacing.xl} ${DS.spacing.lg}`,
      }}
    >
      {/* Step Card */}
      <div
        style={{
          background: DS.colors.white,
          borderRadius: DS.radius.xl,
          boxShadow: DS.shadow.lg,
          overflow: "hidden",
          border: `1px solid ${DS.colors.border}`,
        }}
      >
        {/* Header */}
        <div
          style={{
            background: `linear-gradient(135deg, ${DS.colors.gradientStart} 0%, ${DS.colors.gradientEnd} 100%)`,
            padding: `${DS.spacing.xl} ${DS.spacing.xl}`,
            color: DS.colors.white,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: DS.spacing.sm,
          }}
        >
          <h2
            style={{
              fontFamily: DS.font,
              fontSize: 24,
              fontWeight: 700,
              margin: 0,
              opacity: transitioning ? 0 : 1,
              transform: transitioning ? "translateX(-12px)" : "none",
              transition: "all 0.4s ease",
            }}
          >
            {step.title}
          </h2>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              background: "rgba(255,255,255,0.2)",
              padding: "6px 16px",
              borderRadius: DS.radius.pill,
              fontFamily: DS.font,
              backdropFilter: "blur(8px)",
            }}
          >
            Step {idx + 1} / {steps.length}
          </span>
        </div>

        <div style={{ padding: DS.spacing.xl }}>
          {/* Canvas */}
          <div
            style={{
              background: "linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)",
              borderRadius: DS.radius.md,
              padding: DS.spacing.lg,
              marginBottom: DS.spacing.lg,
              opacity: transitioning ? 0 : 1,
              transform: transitioning ? "scale(0.97)" : "scale(1)",
              transition: "all 0.4s ease",
              border: `1px solid ${DS.colors.primary}33`,
            }}
          >
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: DS.radius.sm,
              }}
            />
          </div>

          {/* Description */}
          <div
            style={{
              background: `linear-gradient(135deg, ${DS.colors.primaryLight}22 0%, ${DS.colors.accentLight} 100%)`,
              borderRadius: DS.radius.md,
              padding: DS.spacing.lg,
              marginBottom: DS.spacing.lg,
              borderLeft: `4px solid ${DS.colors.primary}`,
              opacity: transitioning ? 0 : 1,
              transform: transitioning ? "translateY(8px)" : "none",
              transition: "all 0.4s ease",
            }}
          >
            <p
              style={{
                fontFamily: DS.font,
                color: DS.colors.text,
                fontSize: 16,
                lineHeight: 1.75,
                margin: 0,
              }}
            >
              {step.description}
            </p>
          </div>

          {/* Controls */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: DS.spacing.md,
            }}
          >
            <SButton
              variant="outlined"
              disabled={idx === 0}
              onClick={() => go(-1)}
              icon={Icons.chevLeft({ size: 18 })}
            >
              Previous
            </SButton>
            <div style={{ display: "flex", gap: DS.spacing.sm }}>
              <SButton
                onClick={() => setPlaying(!playing)}
                icon={
                  playing
                    ? Icons.pause({ size: 18, color: "#fff" })
                    : Icons.play({ size: 18, color: "#fff" })
                }
              >
                {playing ? "Pause" : "Play"}
              </SButton>
              <SButton
                variant="outlined"
                onClick={() => {
                  setTransitioning(true);
                  setTimeout(() => {
                    setIdx(0);
                    setTransitioning(false);
                  }, 400);
                }}
                icon={Icons.reset({ size: 18, color: DS.colors.primary })}
              >
                Reset
              </SButton>
            </div>
            <SButton
              disabled={idx === steps.length - 1}
              onClick={() => go(1)}
              highlight
              icon={Icons.chevRight({ size: 18, color: "#fff" })}
            >
              Next
            </SButton>
          </div>

          {/* Progress */}
          <div
            style={{
              width: "100%",
              background: DS.colors.border,
              borderRadius: DS.radius.pill,
              height: 10,
              overflow: "hidden",
              marginTop: DS.spacing.lg,
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: DS.radius.pill,
                transition: "width 0.6s ease",
                background: `linear-gradient(135deg, ${DS.colors.gradientStart}, ${DS.colors.gradientEnd})`,
                width: `${pct}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// PRACTICE MODE
// ═══════════════════════════════════════════════════════════════════════════

const PracticeMode = ({ questions }) => {
  const [cur, setCur] = useState(0);
  const [sel, setSel] = useState(null);
  const [show, setShow] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState([]);

  const handleCheck = () => {
    if (sel === null) return;
    setShow(true);
    if (sel === questions[cur].correctAnswer && !answered.includes(cur))
      setScore((s) => s + 1);
    if (!answered.includes(cur)) setAnswered((a) => [...a, cur]);
  };

  const handleNext = () => {
    setCur((c) => c + 1);
    setSel(null);
    setShow(false);
  };
  const handleRestart = () => {
    setCur(0);
    setSel(null);
    setShow(false);
    setScore(0);
    setAnswered([]);
  };

  const done = answered.length === questions.length;

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: DS.spacing.lg,
        }}
      >
        <div
          style={{
            background: DS.colors.white,
            borderRadius: DS.radius.xl,
            boxShadow: DS.shadow.lg,
            padding: DS.spacing.xxl,
            maxWidth: 520,
            width: "100%",
            textAlign: "center",
            border: `1px solid ${DS.colors.border}`,
          }}
        >
          {Icons.check({ size: 80, color: DS.colors.success })}
          <h2
            style={{
              fontFamily: DS.font,
              fontSize: 32,
              fontWeight: 700,
              color: DS.colors.text,
              margin: "16px 0 8px",
            }}
          >
            Quiz Complete!
          </h2>
          <p
            style={{
              fontFamily: DS.font,
              fontSize: 18,
              color: DS.colors.textMuted,
              margin: "0 0 8px",
            }}
          >
            Your Final Score
          </p>
          <p
            style={{
              fontFamily: DS.font,
              fontSize: 64,
              fontWeight: 700,
              margin: "8px 0 24px",
              background: `linear-gradient(135deg, ${DS.colors.gradientStart}, ${DS.colors.gradientEnd})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {score} / {questions.length}
          </p>
          <p
            style={{
              fontFamily: DS.font,
              fontSize: 16,
              color: DS.colors.text,
              margin: "0 0 32px",
            }}
          >
            {pct === 100
              ? "Perfect score! You're a light expert! 🌟"
              : pct >= 75
                ? "Great job! You understand the concepts well! 👏"
                : pct >= 50
                  ? "Good effort! Keep practicing! 💪"
                  : "Keep learning! Review and try again! 📚"}
          </p>
          <SButton onClick={handleRestart} highlight>
            Restart Quiz
          </SButton>
        </div>
      </div>
    );
  }

  const q = questions[cur];
  const correct = show && sel === q.correctAnswer;

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: `${DS.spacing.xl} ${DS.spacing.lg}`,
      }}
    >
      <div
        style={{
          background: DS.colors.white,
          borderRadius: DS.radius.xl,
          boxShadow: DS.shadow.lg,
          overflow: "hidden",
          border: `1px solid ${DS.colors.border}`,
        }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${DS.colors.gradientStart}, ${DS.colors.gradientEnd})`,
            padding: DS.spacing.xl,
            color: DS.colors.white,
          }}
        >
          <h2
            style={{
              fontFamily: DS.font,
              fontSize: 28,
              fontWeight: 700,
              margin: "0 0 4px",
            }}
          >
            Practice Questions
          </h2>
          <p
            style={{
              fontFamily: DS.font,
              fontSize: 15,
              opacity: 0.9,
              margin: 0,
            }}
          >
            Test your understanding of how light travels
          </p>
          <div
            style={{
              marginTop: DS.spacing.md,
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: DS.spacing.sm,
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                background: "rgba(255,255,255,0.2)",
                padding: "6px 16px",
                borderRadius: DS.radius.pill,
                fontFamily: DS.font,
              }}
            >
              Question {cur + 1} / {questions.length}
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                background: "rgba(255,255,255,0.2)",
                padding: "6px 16px",
                borderRadius: DS.radius.pill,
                fontFamily: DS.font,
              }}
            >
              Score: {score}
            </span>
          </div>
        </div>

        <div style={{ padding: DS.spacing.xl }}>
          <h3
            style={{
              fontFamily: DS.font,
              fontSize: 20,
              fontWeight: 600,
              color: DS.colors.text,
              marginBottom: DS.spacing.lg,
            }}
          >
            {q.question}
          </h3>

          <div style={{ marginBottom: DS.spacing.lg }}>
            {q.options.map((opt, i) => {
              const isSel = sel === i;
              const isCorrectOpt = show && i === q.correctAnswer;
              const isWrong = show && isSel && !isCorrectOpt;
              return (
                <button
                  key={i}
                  onClick={() => !show && setSel(i)}
                  disabled={show}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "16px 20px",
                    borderRadius: DS.radius.md,
                    border: `2px solid ${isCorrectOpt ? DS.colors.success : isWrong ? DS.colors.error : isSel ? DS.colors.primary : DS.colors.border}`,
                    background: isCorrectOpt
                      ? "#E8F8EF"
                      : isWrong
                        ? "#FDECEC"
                        : isSel
                          ? DS.colors.primaryLight + "22"
                          : DS.colors.white,
                    cursor: show ? "default" : "pointer",
                    transition: "all 0.25s ease",
                    marginBottom: DS.spacing.sm,
                    display: "flex",
                    alignItems: "center",
                    fontFamily: DS.font,
                    transform: isSel && !show ? "scale(1.01)" : "none",
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 15,
                      marginRight: DS.spacing.md,
                      background: isCorrectOpt
                        ? DS.colors.success
                        : isWrong
                          ? DS.colors.error
                          : isSel
                            ? DS.colors.primary
                            : DS.colors.border,
                      color:
                        isCorrectOpt || isWrong || isSel
                          ? DS.colors.white
                          : DS.colors.text,
                      transition: "all 0.25s ease",
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span
                    style={{
                      fontWeight: 500,
                      color: DS.colors.text,
                      fontSize: 15,
                      flex: 1,
                    }}
                  >
                    {opt}
                  </span>
                  {show &&
                    (isCorrectOpt
                      ? Icons.check({ size: 28 })
                      : isSel
                        ? Icons.x({ size: 28 })
                        : null)}
                </button>
              );
            })}
          </div>

          {show && (
            <div
              style={{
                padding: DS.spacing.lg,
                borderRadius: DS.radius.md,
                marginBottom: DS.spacing.lg,
                border: `2px solid ${correct ? "#A3E4B8" : "#FDE68A"}`,
                background: correct ? "#E8F8EF" : "#FFF9E6",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: DS.spacing.sm,
                  alignItems: "flex-start",
                }}
              >
                {correct
                  ? Icons.check({ size: 24 })
                  : Icons.bulb({ size: 24, color: "#F59E0B" })}
                <div>
                  <p
                    style={{
                      fontFamily: DS.font,
                      fontWeight: 700,
                      fontSize: 17,
                      margin: "0 0 4px",
                    }}
                  >
                    {correct
                      ? "Correct! Well done! 🎉"
                      : "Not quite right. Let's learn!"}
                  </p>
                  <p
                    style={{
                      fontFamily: DS.font,
                      color: DS.colors.text,
                      lineHeight: 1.7,
                      margin: 0,
                      fontSize: 14,
                    }}
                  >
                    <strong>Explanation:</strong> {q.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: DS.spacing.md }}>
            {!show ? (
              <SButton
                onClick={handleCheck}
                disabled={sel === null}
                style={{ flex: 1, justifyContent: "center" }}
              >
                Check Answer
              </SButton>
            ) : (
              <SButton
                onClick={handleNext}
                disabled={cur === questions.length - 1}
                highlight
                style={{ flex: 1, justifyContent: "center" }}
              >
                Next Question
              </SButton>
            )}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div
        style={{
          width: "100%",
          background: DS.colors.border,
          borderRadius: DS.radius.pill,
          height: 8,
          overflow: "hidden",
          marginTop: DS.spacing.lg,
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: DS.radius.pill,
            transition: "width 0.5s ease",
            background: `linear-gradient(135deg, ${DS.colors.gradientStart}, ${DS.colors.gradientEnd})`,
            width: `${(answered.length / questions.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// REAL WORLD MODE
// ═══════════════════════════════════════════════════════════════════════════

const RealWorldMode = ({ applications }) => {
  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: `${DS.spacing.xl} ${DS.spacing.lg}`,
      }}
    >
      <div
        style={{
          background: DS.colors.white,
          borderRadius: DS.radius.xl,
          boxShadow: DS.shadow.lg,
          overflow: "hidden",
          marginBottom: DS.spacing.xl,
          border: `1px solid ${DS.colors.border}`,
        }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${DS.colors.gradientStart}, ${DS.colors.gradientEnd})`,
            padding: DS.spacing.xxl,
            color: DS.colors.white,
          }}
        >
          <h2
            style={{
              fontFamily: DS.font,
              fontSize: 36,
              fontWeight: 700,
              margin: "0 0 8px",
            }}
          >
            Real World Applications
          </h2>
          <p
            style={{
              fontFamily: DS.font,
              fontSize: 17,
              opacity: 0.95,
              margin: 0,
            }}
          >
            Discover how the straight-line property of light is used in everyday
            life
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: DS.spacing.lg,
        }}
      >
        {applications.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
};

const AppCard = ({ app }: { app: typeof DEFAULT_APPLICATIONS[0]; key?: React.Key }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: DS.colors.white,
        borderRadius: DS.radius.lg,
        padding: DS.spacing.lg,
        border: `2px solid ${hovered ? DS.colors.primary : DS.colors.border}`,
        boxShadow: hovered ? DS.shadow.lg : DS.shadow.sm,
        transform: hovered ? "translateY(-6px)" : "none",
        transition: "all 0.35s ease",
        cursor: "default",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: DS.spacing.md,
        }}
      >
        <span style={{ fontSize: 48 }}>{app.icon}</span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: "4px 12px",
            borderRadius: DS.radius.pill,
            fontFamily: DS.font,
            background: DS.colors.primaryLight + "44",
            color: DS.colors.primary,
          }}
        >
          {app.category}
        </span>
      </div>
      <h3
        style={{
          fontFamily: DS.font,
          fontSize: 20,
          fontWeight: 700,
          color: DS.colors.text,
          margin: "0 0 8px",
        }}
      >
        {app.title}
      </h3>
      <p
        style={{
          fontFamily: DS.font,
          color: DS.colors.textMuted,
          fontSize: 14,
          lineHeight: 1.7,
          margin: "0 0 16px",
        }}
      >
        {app.description}
      </p>
      <div
        style={{
          background: `linear-gradient(135deg, ${DS.colors.primaryLight}22, ${DS.colors.accentLight})`,
          borderRadius: DS.radius.sm,
          padding: DS.spacing.md,
          borderLeft: `3px solid ${DS.colors.accent}`,
        }}
      >
        <p
          style={{
            fontFamily: DS.font,
            fontSize: 13,
            color: DS.colors.text,
            margin: 0,
          }}
        >
          <strong style={{ color: DS.colors.primary }}>Example:</strong>{" "}
          {app.example}
        </p>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface LightTravelToolPropsConfig {
  width?: number;
  height?: number;
  initialMode?: string;
  showModeSelector?: boolean;
  enabledModes?: string[];
  animationSpeed?: number;
  autoPlayDuration?: number;
  additionalProps?: Record<string, unknown>;
}

const LightTravelTool = ({
  props = {} as LightTravelToolPropsConfig,
  setStepDetails,
}: {
  props?: LightTravelToolPropsConfig;
  setStepDetails?: (details: unknown) => void;
}) => {
  const {
    width = 800,
    height = 600,
    initialMode = "learn",
    showModeSelector = true,
    enabledModes = ["learn", "practice", "realWorld"],
    animationSpeed = 1,
    autoPlayDuration = 12000,
    additionalProps = {},
  } = props;

  const {
    customSteps,
    customQuestions,
    customApplications,
    canvasWidth = width,
    canvasHeight = height,
  } = additionalProps;

  const [tab, setTab] = useState(initialMode);

  const steps = useMemo(() => customSteps || DEFAULT_STEPS, [customSteps]);
  const questions = useMemo(
    () => customQuestions || DEFAULT_QUESTIONS,
    [customQuestions],
  );
  const applications = useMemo(
    () => customApplications || DEFAULT_APPLICATIONS,
    [customApplications],
  );

  // Inject font + keyframes
  useEffect(() => {
    const id = "singularity-ds-styles";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @keyframes singFadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      * { box-sizing: border-box; }
    `;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, []);

  const tabs = [
    { key: "learn", label: "Learn", icon: Icons.book },
    { key: "practice", label: "Practice", icon: Icons.clipboard },
    { key: "realWorld", label: "Real World", icon: Icons.globe },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: DS.font,
        background: `linear-gradient(160deg, ${DS.colors.surface} 0%, ${DS.colors.primaryLight}15 40%, ${DS.colors.accentLight} 100%)`,
      }}
    >
      {/* Nav */}
      {showModeSelector && (
        <nav
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            background: DS.colors.white + "E6",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderBottom: `1px solid ${DS.colors.border}`,
            boxShadow: DS.shadow.sm,
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: `0 ${DS.spacing.lg}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: 60,
            }}
          >
            {/* Logo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: DS.spacing.sm,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: DS.radius.sm,
                  background: `linear-gradient(135deg, ${DS.colors.gradientStart}, ${DS.colors.gradientEnd})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {Icons.bulb({ size: 18, color: "#fff" })}
              </div>
              <span
                style={{
                  fontFamily: DS.font,
                  fontSize: 17,
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${DS.colors.gradientStart}, ${DS.colors.gradientEnd})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Light Travel
              </span>
            </div>

            {/* Tab Buttons */}
            <div
              style={{
                display: "flex",
                gap: DS.spacing.xs,
                background: DS.colors.surface,
                borderRadius: DS.radius.pill,
                padding: 3,
              }}
            >
              {tabs
                .filter((t) => enabledModes.includes(t.key))
                .map((t) => (
                  <TabButton
                    key={t.key}
                    active={tab === t.key}
                    onClick={() => setTab(t.key)}
                    icon={t.icon}
                    label={t.label}
                  />
                ))}
            </div>
          </div>
        </nav>
      )}

      {/* Content */}
      <div style={{ animation: "singFadeIn 0.5s ease" }}>
        {tab === "learn" && (
          <LearnMode
            steps={steps}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            animationSpeed={animationSpeed}
            autoPlayDuration={autoPlayDuration}
            setStepDetails={setStepDetails}
          />
        )}
        {tab === "practice" && <PracticeMode questions={questions} />}
        {tab === "realWorld" && <RealWorldMode applications={applications} />}
      </div>
    </div>
  );
};

// Tab Button sub-component
const TabButton = ({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: (p: { size: number; color: string }) => React.ReactNode;
  label: string;
  key?: React.Key;
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 16px",
        borderRadius: DS.radius.pill,
        border: "none",
        outline: "none",
        cursor: "pointer",
        fontFamily: DS.font,
        fontSize: 13,
        fontWeight: 600,
        background: active
          ? `linear-gradient(135deg, ${DS.colors.gradientStart}, ${DS.colors.gradientEnd})`
          : hovered
            ? DS.colors.border
            : "transparent",
        color: active ? DS.colors.white : DS.colors.text,
        transition: "all 0.25s ease",
        transform: active ? "none" : hovered ? "scale(1.02)" : "none",
      }}
    >
      <span style={{ display: "flex" }}>
        {icon({ size: 16, color: active ? "#fff" : DS.colors.text })}
      </span>
      {label}
    </button>
  );
};

export default LightTravelTool;
