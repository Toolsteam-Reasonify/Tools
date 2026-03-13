// @ts-ignore - React provided by parent/bundler when this file is used in a project
import React, { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 1: INLINE SVG ICONS
// ═══════════════════════════════════════════════════════════════════════════

function IcoLeft({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function IcoRight({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function IcoReset({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <path d="M1 4v6h6" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}

function IcoBook({ size = 16, color }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || "currentColor"}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function IcoScissors({ size = 16, color }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || "currentColor"}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" />
      <line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  );
}

function IcoCheck({ size = 16, color }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || "currentColor"}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IcoX({ size = 16, color }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || "currentColor"}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IcoAward({ size = 16, color }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || "currentColor"}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  );
}

function IcoTarget({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 2: DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════

const COL = {
  pri: "#4A4DC9",
  ora: "#FF7212",
  dp: "#533086",
  dOra: "#FC9145",
  lp: "#C1C1EA",
  lOra: "#FFF3E4",
  g9: "#4E4E4E",
  g4: "#CACACA",
  g2: "#EBEBEB",
  g1: "#F5F5F5",
  w: "#FFFFFF",
  ok: "#2ECC71",
  err: "#E74C3C",
};
const GRAD = `linear-gradient(135deg, ${COL.dp} 0%, ${COL.dOra} 100%)`;
const FNT = "'Poppins', sans-serif";
const RAD = { sm: "8px", md: "12px", pill: "40px", xl: "24px" };

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 3: ANGLE CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const DAC = 65,
  ADC = 60;
const DAB = 180 - ADC,
  CAB = DAB - DAC,
  BCD = 180 - ADC,
  ABC = ADC;

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 4: LEARN STEPS
// ═══════════════════════════════════════════════════════════════════════════

const STEPS = [
  {
    id: 0,
    title: "The Problem",
    desc: `In parallelogram ABCD, AB ∥ CD and AD ∥ BC. Diagonal AC divides ∠DAB. Given ∠DAC = ${DAC}° and ∠ADC = ${ADC}°. Find ∠CAB, ∠ABC, and ∠BCD.`,
    hp: "",
    ht: "",
    eq: null as string[] | null,
    sc: false,
    nA: "",
    solved: {} as Record<string, number>,
    sum: false,
  },
  {
    id: 1,
    title: "Step 1 — Find ∠DAB",
    desc: "Parallel pair AB ∥ CD with transversal AD. Interior angles add to 180°.",
    hp: "AB_CD",
    ht: "AD",
    eq: [
      `∠ADC + ∠DAB = 180°`,
      `${ADC}° + ∠DAB = 180°`,
      `∠DAB = 180° − ${ADC}°`,
      `∠DAB = ${DAB}°`,
    ],
    sc: false,
    nA: "DAB",
    solved: { DAB } as Record<string, number>,
    sum: false,
  },
  {
    id: 2,
    title: "Step 2 — Split ∠DAB to find ∠CAB",
    desc: `Diagonal AC splits ∠DAB into ∠DAC + ∠CAB. ∠DAB = ${DAB}°, ∠DAC = ${DAC}°.`,
    hp: "",
    ht: "",
    eq: [
      `∠DAB = ∠DAC + ∠CAB`,
      `${DAB}° = ${DAC}° + ∠CAB`,
      `∠CAB = ${DAB}° − ${DAC}°`,
      `∠CAB = ${CAB}°`,
    ],
    sc: true,
    nA: "CAB",
    solved: { DAB, CAB } as Record<string, number>,
    sum: false,
  },
  {
    id: 3,
    title: "Step 3 — Find ∠BCD",
    desc: "Parallel pair AD ∥ BC with transversal CD. Interior angles add to 180°.",
    hp: "AD_BC",
    ht: "CD",
    eq: [
      `∠ADC + ∠BCD = 180°`,
      `${ADC}° + ∠BCD = 180°`,
      `∠BCD = 180° − ${ADC}°`,
      `∠BCD = ${BCD}°`,
    ],
    sc: false,
    nA: "BCD",
    solved: { DAB, CAB, BCD } as Record<string, number>,
    sum: false,
  },
  {
    id: 4,
    title: "Step 4 — Find ∠ABC",
    desc: "Parallel pair AB ∥ CD with transversal BC. Interior angles add to 180°.",
    hp: "AB_CD",
    ht: "BC",
    eq: [
      `∠BCD + ∠ABC = 180°`,
      `${BCD}° + ∠ABC = 180°`,
      `∠ABC = 180° − ${BCD}°`,
      `∠ABC = ${ABC}°`,
    ],
    sc: false,
    nA: "ABC",
    solved: { DAB, CAB, BCD, ABC } as Record<string, number>,
    sum: false,
  },
  {
    id: 5,
    title: "Summary — Pattern Revealed!",
    desc: "Opposite angles are equal. Consecutive angles add to 180°.",
    hp: "",
    ht: "",
    eq: null,
    sc: false,
    nA: "",
    solved: { DAB, CAB, BCD, ABC } as Record<string, number>,
    sum: true,
  },
];

const SUMPAIRS = [
  { a: `∠DAB = ${DAB}°`, b: `∠BCD = ${BCD}°`, l: "Opposite — Equal!", t: "eq" },
  { a: `∠ADC = ${ADC}°`, b: `∠ABC = ${ABC}°`, l: "Opposite — Equal!", t: "eq" },
  {
    a: `∠DAB + ∠ABC`,
    b: `${DAB}° + ${ABC}° = 180°`,
    l: "Supplementary",
    t: "s",
  },
  {
    a: `∠ADC + ∠BCD`,
    b: `${ADC}° + ${BCD}° = 180°`,
    l: "Supplementary",
    t: "s",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 5: PRACTICE MCQs
// ═══════════════════════════════════════════════════════════════════════════

const QS = [
  {
    q: `AB ∥ CD, AD is transversal. ∠ADC = ${ADC}°. What is ∠DAB?`,
    o: [`${DAB}°`, `${ADC}°`, "90°", `${DAB + 10}°`],
    a: 0,
    e: `Interior angles: ∠DAB = 180° − ${ADC}° = ${DAB}°.`,
    hp: "AB_CD",
    ht: "AD",
  },
  {
    q: `∠DAB = ${DAB}° and ∠DAC = ${DAC}°. What is ∠CAB?`,
    o: [`${DAC}°`, `${CAB}°`, `${DAB}°`, `${CAB + 15}°`],
    a: 1,
    e: `∠CAB = ${DAB}° − ${DAC}° = ${CAB}°.`,
    hp: "",
    ht: "",
  },
  {
    q: `AD ∥ BC, CD is transversal. ∠ADC = ${ADC}°. What is ∠BCD?`,
    o: [`${ADC}°`, "90°", `${BCD}°`, `${BCD - 20}°`],
    a: 2,
    e: `∠BCD = 180° − ${ADC}° = ${BCD}°.`,
    hp: "AD_BC",
    ht: "CD",
  },
  {
    q: "Which angles are always equal in a parallelogram?",
    o: ["∠DAB & ∠ABC", "∠DAB & ∠BCD", "∠ADC & ∠BCD", "∠DAB & ∠ADC"],
    a: 1,
    e: `Opposite angles are equal. ∠DAB = ∠BCD = ${DAB}°.`,
    hp: "",
    ht: "",
  },
  {
    q: "What is ∠DAB + ∠ABC?",
    o: ["360°", "90°", "180°", "270°"],
    a: 2,
    e: `Consecutive angles: ${DAB}° + ${ABC}° = 180°.`,
    hp: "AB_CD",
    ht: "BC",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 6: RESPONSIVE HOOK
// ═══════════════════════════════════════════════════════════════════════════

function useW() {
  const [w, setW] = useState(
    typeof window !== "undefined" ? window.innerWidth : 800,
  );
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 7: SVG DIAGRAM
// ═══════════════════════════════════════════════════════════════════════════

function Dgm({
  hp,
  ht,
  sv,
  isSum,
  sid,
  md,
  small,
}: {
  hp: string;
  ht: string;
  sv: Record<string, number>;
  isSum: boolean;
  sid: number;
  md: string;
  small?: boolean;
}) {
  const s = small ? 0.78 : 1;
  const W = small ? 320 : 400,
    H = small ? 220 : 270;
  const k = small ? 6 : 0;
  const A = { x: k + 115 * s, y: k + 50 * s },
    B = { x: k + 348 * s, y: k + 50 * s };
  const Cv = { x: k + 300 * s, y: k + 222 * s },
    D = { x: k + 67 * s, y: k + 222 * s };
  const cx = (A.x + B.x + Cv.x + D.x) / 4,
    cy = (A.y + B.y + Cv.y + D.y) / 4;

  function getC(n: string) {
    if (isSum) {
      if (n === "AB" || n === "CD") return COL.pri;
      if (n === "AD" || n === "BC") return "#10b981";
    }
    if (hp === "AB_CD" && (n === "AB" || n === "CD")) return COL.pri;
    if (hp === "AD_BC" && (n === "AD" || n === "BC")) return "#10b981";
    if (ht === n) return COL.ora;
    return COL.g4;
  }
  function getSw(n: string) {
    return (hp === "AB_CD" && (n === "AB" || n === "CD")) ||
      (hp === "AD_BC" && (n === "AD" || n === "BC")) ||
      ht === n ||
      isSum
      ? 3
      : 2;
  }
  function mid(a: { x: number; y: number }, b: { x: number; y: number }) {
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  }

  function arrw(
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    dbl: boolean,
    c: string,
  ) {
    const m = mid(p1, p2),
      ang = Math.atan2(p2.y - p1.y, p2.x - p1.x),
      z = 6;
    return (dbl ? [-4, 4] : [0]).map((o, i) => {
      const px = m.x + o * Math.cos(ang),
        py = m.y + o * Math.sin(ang);
      return (
        <polyline
          key={i}
          points={`${px - z * Math.cos(ang - 0.5)},${py - z * Math.sin(ang - 0.5)} ${px},${py} ${px - z * Math.cos(ang + 0.5)},${py - z * Math.sin(ang + 0.5)}`}
          fill="none"
          stroke={c}
          strokeWidth={2}
        />
      );
    });
  }

  function arc(
    v: { x: number; y: number },
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    lb: string,
    cl: string,
    an?: boolean,
  ) {
    const r = 22 * s,
      a1 = Math.atan2(p1.y - v.y, p1.x - v.x),
      a2 = Math.atan2(p2.y - v.y, p2.x - v.x);
    let sa = Math.min(a1, a2),
      ea = Math.max(a1, a2),
      sw2 = ea - sa;
    if (sw2 > Math.PI) {
      const t = sa;
      sa = ea;
      ea = t + 2 * Math.PI;
      sw2 = ea - sa;
    }
    const lg = sw2 > Math.PI ? 1 : 0;
    const x1 = v.x + r * Math.cos(sa),
      y1 = v.y + r * Math.sin(sa),
      x2 = v.x + r * Math.cos(ea),
      y2 = v.y + r * Math.sin(ea);
    const mA = (sa + ea) / 2,
      lr = r + 15;
    return (
      <g style={an ? { animation: "popIn 0.5s ease-out both" } : undefined}>
        <path
          d={`M ${x1} ${y1} A ${r} ${r} 0 ${lg} 1 ${x2} ${y2}`}
          fill="none"
          stroke={cl}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <text
          x={v.x + lr * Math.cos(mA)}
          y={v.y + lr * Math.sin(mA)}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontSize: 10 * s,
            fontWeight: 700,
            fill: cl,
            fontFamily: FNT,
          }}
        >
          {lb}
        </text>
      </g>
    );
  }

  function arcD(
    v: { x: number; y: number },
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    lb: string,
    cl: string,
    an?: boolean,
  ) {
    const r = 24 * s,
      a1 = Math.atan2(p1.y - v.y, p1.x - v.x),
      a2 = Math.atan2(p2.y - v.y, p2.x - v.x);
    let sCCW = a2 - a1;
    if (sCCW < 0) sCCW += 2 * Math.PI;
    let sCW = a1 - a2;
    if (sCW < 0) sCW += 2 * Math.PI;
    const mCCW = a1 + sCCW / 2,
      mCW = a1 - sCW / 2;
    const dCCW = Math.hypot(
      v.x + r * Math.cos(mCCW) - cx,
      v.y + r * Math.sin(mCCW) - cy,
    );
    const dCW = Math.hypot(
      v.x + r * Math.cos(mCW) - cx,
      v.y + r * Math.sin(mCW) - cy,
    );
    const use = dCCW < dCW,
      sf = use ? 1 : 0,
      chM = use ? mCCW : mCW,
      chS = use ? sCCW : sCW,
      lg = chS > Math.PI ? 1 : 0;
    const x1 = v.x + r * Math.cos(a1),
      y1 = v.y + r * Math.sin(a1),
      x2 = v.x + r * Math.cos(a2),
      y2 = v.y + r * Math.sin(a2),
      lr = r + 15;
    return (
      <g style={an ? { animation: "popIn 0.5s ease-out both" } : undefined}>
        <path
          d={`M ${x1} ${y1} A ${r} ${r} 0 ${lg} ${sf} ${x2} ${y2}`}
          fill="none"
          stroke={cl}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <text
          x={v.x + lr * Math.cos(chM)}
          y={v.y + lr * Math.sin(chM)}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontSize: 10 * s,
            fontWeight: 700,
            fill: cl,
            fontFamily: FNT,
          }}
        >
          {lb}
        </text>
      </g>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <rect x="0" y="0" width={W} height={H} fill="#fafaff" rx="12" />
      <polygon
        points={`${A.x},${A.y} ${B.x},${B.y} ${Cv.x},${Cv.y} ${D.x},${D.y}`}
        fill={COL.pri + "06"}
        stroke="none"
      />
      <line
        x1={A.x}
        y1={A.y}
        x2={B.x}
        y2={B.y}
        stroke={getC("AB")}
        strokeWidth={getSw("AB")}
        strokeLinecap="round"
      />
      <line
        x1={B.x}
        y1={B.y}
        x2={Cv.x}
        y2={Cv.y}
        stroke={getC("BC")}
        strokeWidth={getSw("BC")}
        strokeLinecap="round"
      />
      <line
        x1={Cv.x}
        y1={Cv.y}
        x2={D.x}
        y2={D.y}
        stroke={getC("CD")}
        strokeWidth={getSw("CD")}
        strokeLinecap="round"
      />
      <line
        x1={D.x}
        y1={D.y}
        x2={A.x}
        y2={A.y}
        stroke={getC("AD")}
        strokeWidth={getSw("AD")}
        strokeLinecap="round"
      />
      <line
        x1={A.x}
        y1={A.y}
        x2={Cv.x}
        y2={Cv.y}
        stroke={COL.lp}
        strokeWidth={2}
        strokeDasharray="7 4"
      />
      {arrw(A, B, false, getC("AB"))}
      {arrw(D, Cv, false, getC("CD"))}
      {arrw(A, D, true, getC("AD"))}
      {arrw(B, Cv, true, getC("BC"))}
      {arcD(D, A, Cv, `${ADC}°`, COL.pri)}
      {arc(A, D, Cv, `${DAC}°`, COL.pri)}
      {sv.DAB && (sid === 1 || sid === 2)
        ? arc(A, D, B, `${sv.DAB}°`, COL.pri, true)
        : null}
      {sv.CAB && sid >= 2 ? arc(A, Cv, B, `${sv.CAB}°`, COL.ora, true) : null}
      {sv.BCD && (sid >= 3 || md === "practice")
        ? arcD(Cv, D, B, `${sv.BCD}°`, "#10b981", true)
        : null}
      {sv.ABC && (sid >= 4 || md === "practice")
        ? arcD(B, A, Cv, `${sv.ABC}°`, COL.ora, true)
        : null}
      <text
        x={A.x - 5}
        y={A.y - 12}
        textAnchor="middle"
        style={{
          fontSize: 14 * s,
          fontWeight: 700,
          fill: COL.g9,
          fontFamily: FNT,
        }}
      >
        A
      </text>
      <text
        x={B.x + 5}
        y={B.y - 12}
        textAnchor="middle"
        style={{
          fontSize: 14 * s,
          fontWeight: 700,
          fill: COL.g9,
          fontFamily: FNT,
        }}
      >
        B
      </text>
      <text
        x={Cv.x + 12}
        y={Cv.y + 15}
        textAnchor="middle"
        style={{
          fontSize: 14 * s,
          fontWeight: 700,
          fill: COL.g9,
          fontFamily: FNT,
        }}
      >
        C
      </text>
      <text
        x={D.x - 12}
        y={D.y + 15}
        textAnchor="middle"
        style={{
          fontSize: 14 * s,
          fontWeight: 700,
          fill: COL.g9,
          fontFamily: FNT,
        }}
      >
        D
      </text>
      {isSum ? (
        <g>
          <text
            x={mid(A, B).x}
            y={mid(A, B).y - 10}
            textAnchor="middle"
            style={{
              fontSize: 9,
              fontWeight: 600,
              fill: COL.pri,
              fontFamily: FNT,
            }}
          >
            AB ∥ CD
          </text>
          <text
            x={mid(A, D).x - 16}
            y={mid(A, D).y}
            textAnchor="middle"
            style={{
              fontSize: 9,
              fontWeight: 600,
              fill: "#10b981",
              fontFamily: FNT,
            }}
          >
            AD ∥ BC
          </text>
        </g>
      ) : null}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 8: MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function ParallelogramAngleSolver() {
  const ww = useW();
  const mob = ww < 500;
  const tab = ww < 700;
  const pad = mob ? "14px" : tab ? "18px" : "22px";
  const hFs = mob ? 16 : 19;
  const tFs = mob ? 14 : 16;
  const bFs = mob ? 12 : 13;
  const eqFs = mob ? 12 : 14;

  const [mode, setMode] = useState("learn");
  const [si, setSi] = useState(0);
  const [eqI, setEqI] = useState(0);
  const [aV, setAV] = useState(-1);
  const [scA, setScA] = useState(false);
  const [op, setOp] = useState(1);
  const [qi, setQi] = useState(0);
  const [sel, setSel] = useState(-1);
  const [sr, setSr] = useState(false);
  const [sc, setSc] = useState(0);
  const [dn, setDn] = useState(false);
  const [ans, setAns] = useState<boolean[]>([]);

  const step = STEPS[si];
  const question = QS[qi];

  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
    @keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeInScale{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}
    @keyframes popIn{0%{transform:scale(0);opacity:0}70%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}
    @keyframes scissorsCut{0%{transform:rotate(0) scale(1)}25%{transform:rotate(-12deg) scale(1.1)}50%{transform:rotate(12deg) scale(1.1)}100%{transform:rotate(0) scale(1)}}
    @keyframes slideR{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
    @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-5px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)}}
    @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
    @keyframes bounceIn{0%{transform:scale(0)}50%{transform:scale(1.15)}70%{transform:scale(.92)}100%{transform:scale(1)}}`;
    document.head.appendChild(el);
    return () => {
      document.head.removeChild(el);
    };
  }, []);

  useEffect(() => {
    if (mode !== "learn") return;
    setEqI(0);
    setAV(-1);
    setScA(false);
    if (!step.eq) {
      if (step.sc) setTimeout(() => setScA(true), 500);
      return;
    }
    let idx = 0;
    const iv = setInterval(() => {
      idx++;
      setEqI(idx);
      if (idx >= step.eq!.length) {
        clearInterval(iv);
        if (step.nA && step.solved[step.nA] != null) {
          const tgt = step.solved[step.nA];
          const st = performance.now();
          const tick = (t: number) => {
            const p = Math.min((t - st) / 500, 1);
            setAV(Math.round((1 - Math.pow(1 - p, 3)) * tgt));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      }
    }, 700);
    return () => clearInterval(iv);
  }, [si, mode]);

  const go = (d: number) => {
    setOp(0);
    setTimeout(() => {
      setSi((s) => s + d);
      setTimeout(() => setOp(1), 50);
    }, 200);
  };
  const swM = (m: string) => {
    setOp(0);
    setTimeout(() => {
      setMode(m);
      setSi(0);
      setQi(0);
      setSel(-1);
      setSr(false);
      setSc(0);
      setDn(false);
      setAns([]);
      setTimeout(() => setOp(1), 50);
    }, 200);
  };
  const pick = (i: number) => {
    if (sr) return;
    setSel(i);
    setSr(true);
    if (i === question.a) {
      setSc((s) => s + 1);
      setAns((a) => [...a, true]);
    } else {
      setAns((a) => [...a, false]);
    }
  };
  const nxtQ = () => {
    if (qi < QS.length - 1) {
      setOp(0);
      setTimeout(() => {
        setQi((q) => q + 1);
        setSel(-1);
        setSr(false);
        setTimeout(() => setOp(1), 50);
      }, 200);
    } else {
      setDn(true);
    }
  };
  const retry = () => {
    setQi(0);
    setSel(-1);
    setSr(false);
    setSc(0);
    setDn(false);
    setAns([]);
  };
  const prog =
    mode === "learn" ? (si / (STEPS.length - 1)) * 100 : (qi / QS.length) * 100;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 800,
        margin: "0 auto",
        background: COL.w,
        borderRadius: mob ? RAD.md : RAD.xl,
        overflow: "hidden",
        boxShadow: "0 12px 40px rgba(74,77,201,0.14)",
        fontFamily: FNT,
        border: `1px solid ${COL.g2}`,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: GRAD,
          padding: `${mob ? 16 : 20}px ${pad} ${mob ? 12 : 16}px`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 15% 50%,rgba(255,255,255,0.1) 0%,transparent 50%)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 3,
            }}
          >
            <IcoBook size={mob ? 13 : 15} color="rgba(255,255,255,0.7)" />
            <span
              style={{
                fontSize: mob ? 8 : 10,
                fontWeight: 600,
                color: "rgba(255,255,255,0.6)",
                letterSpacing: 1.2,
                textTransform: "uppercase",
              }}
            >
              Example 4 — Grade 7
            </span>
          </div>
          <h1
            style={{
              fontSize: hFs,
              fontWeight: 700,
              color: COL.w,
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            Parallel Lines in a Quadrilateral
          </h1>
          <p
            style={{
              fontSize: mob ? 10 : 11,
              color: "rgba(255,255,255,0.65)",
              margin: "3px 0 0",
            }}
          >
            Angles in parallelogram ABCD using interior angles property
          </p>
        </div>
        <div
          style={{
            marginTop: mob ? 8 : 12,
            height: 3,
            background: "rgba(255,255,255,0.15)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${prog}%`,
              background: COL.ora,
              borderRadius: 2,
              transition: "width 0.4s ease-out",
            }}
          />
        </div>
      </div>

      {/* TABS */}
      <div
        style={{
          display: "flex",
          borderBottom: `1px solid ${COL.g2}`,
          background: COL.g1,
        }}
      >
        <button
          onClick={() => swM("learn")}
          style={{
            flex: 1,
            fontFamily: FNT,
            fontSize: bFs,
            fontWeight: 600,
            padding: mob ? "9px 10px" : "11px 14px",
            border: "none",
            cursor: "pointer",
            background: mode === "learn" ? COL.w : "transparent",
            color: mode === "learn" ? COL.pri : COL.g4,
            borderBottom:
              mode === "learn"
                ? `3px solid ${COL.pri}`
                : "3px solid transparent",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <IcoBook size={mob ? 12 : 14} /> Learn
        </button>
        <button
          onClick={() => swM("practice")}
          style={{
            flex: 1,
            fontFamily: FNT,
            fontSize: bFs,
            fontWeight: 600,
            padding: mob ? "9px 10px" : "11px 14px",
            border: "none",
            cursor: "pointer",
            background: mode === "practice" ? COL.w : "transparent",
            color: mode === "practice" ? COL.pri : COL.g4,
            borderBottom:
              mode === "practice"
                ? `3px solid ${COL.pri}`
                : "3px solid transparent",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <IcoTarget size={mob ? 12 : 14} /> Practice
        </button>
      </div>

      {/* STEP DOTS */}
      {mode === "learn" ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            padding: `8px ${pad}`,
            background: COL.g1,
            borderBottom: `1px solid ${COL.g2}`,
          }}
        >
          {STEPS.map((_, i) => (
            <div
              key={i}
              onClick={() => {
                setOp(0);
                setTimeout(() => {
                  setSi(i);
                  setTimeout(() => setOp(1), 50);
                }, 180);
              }}
              style={{
                flex: 1,
                height: mob ? 4 : 5,
                borderRadius: 3,
                cursor: "pointer",
                background: i <= si ? COL.pri : COL.g2,
                transition: "all 0.3s ease",
              }}
            />
          ))}
          <span
            style={{
              fontSize: mob ? 10 : 11,
              fontWeight: 600,
              color: COL.g4,
              marginLeft: 6,
              fontFamily: FNT,
            }}
          >
            {si + 1}/{STEPS.length}
          </span>
        </div>
      ) : null}

      {/* CONTENT */}
      <div style={{ padding: `${mob ? 14 : 18}px ${pad} ${mob ? 10 : 14}px` }}>
        {mode === "learn" ? (
          <div style={{ opacity: op, transition: "opacity 0.2s ease" }}>
            <h2
              style={{
                fontSize: tFs,
                fontWeight: 700,
                color: COL.g9,
                margin: "0 0 5px",
                fontFamily: FNT,
              }}
            >
              {step.title}
            </h2>
            <p
              style={{
                fontSize: mob ? 12 : 13,
                color: COL.g9,
                lineHeight: 1.6,
                margin: "0 0 12px",
                fontFamily: FNT,
              }}
            >
              {step.desc}
            </p>

            {step.id === 0 ? (
              <div
                style={{
                  background: COL.lOra,
                  border: `1px solid ${COL.dOra}30`,
                  borderRadius: RAD.sm,
                  padding: mob ? "8px 10px" : "10px 14px",
                  marginBottom: 12,
                  animation: "fadeInUp 0.4s ease-out",
                }}
              >
                <p
                  style={{
                    fontSize: mob ? 10 : 11,
                    color: COL.g9,
                    margin: 0,
                    lineHeight: 1.6,
                    fontFamily: FNT,
                  }}
                >
                  <strong>Instructions:</strong> Notice which sides glow as the{" "}
                  <span style={{ color: COL.pri, fontWeight: 700 }}>
                    parallel pair
                  </span>{" "}
                  and which as the{" "}
                  <span style={{ color: COL.ora, fontWeight: 700 }}>
                    transversal
                  </span>
                  .
                </p>
              </div>
            ) : null}

            {/* Two-column → stacks on mobile */}
            <div
              style={{
                display: "flex",
                gap: mob ? 10 : 14,
                flexDirection: tab ? "column" : "row",
                alignItems: "stretch",
              }}
            >
              {/* Diagram */}
              <div
                style={{
                  flex: tab ? "unset" : "1 1 340px",
                  background: COL.g1,
                  borderRadius: RAD.md,
                  padding: mob ? 8 : 12,
                  border: `1px solid ${COL.g2}`,
                }}
              >
                <Dgm
                  hp={step.hp}
                  ht={step.ht}
                  sv={step.solved}
                  isSum={step.sum}
                  sid={step.id}
                  md="learn"
                />
                {step.hp || step.ht ? (
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                      marginTop: 6,
                    }}
                  >
                    {step.hp === "AB_CD" ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <div
                          style={{
                            width: 16,
                            height: 3,
                            borderRadius: 2,
                            background: COL.pri,
                          }}
                        />
                        <span
                          style={{
                            fontSize: mob ? 9 : 10,
                            fontWeight: 500,
                            color: COL.g9,
                            fontFamily: FNT,
                          }}
                        >
                          AB ∥ CD
                        </span>
                      </div>
                    ) : null}
                    {step.hp === "AD_BC" ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <div
                          style={{
                            width: 16,
                            height: 3,
                            borderRadius: 2,
                            background: "#10b981",
                          }}
                        />
                        <span
                          style={{
                            fontSize: mob ? 9 : 10,
                            fontWeight: 500,
                            color: COL.g9,
                            fontFamily: FNT,
                          }}
                        >
                          AD ∥ BC
                        </span>
                      </div>
                    ) : null}
                    {step.ht ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <div
                          style={{
                            width: 16,
                            height: 3,
                            borderRadius: 2,
                            background: COL.ora,
                          }}
                        />
                        <span
                          style={{
                            fontSize: mob ? 9 : 10,
                            fontWeight: 500,
                            color: COL.g9,
                            fontFamily: FNT,
                          }}
                        >
                          {step.ht} (transversal)
                        </span>
                      </div>
                    ) : null}
                  </div>
                ) : null}
                <div
                  style={{
                    display: "flex",
                    gap: 5,
                    marginTop: 6,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      background: COL.pri,
                      color: COL.w,
                      borderRadius: RAD.pill,
                      padding: "2px 8px",
                      fontSize: mob ? 9 : 10,
                      fontWeight: 600,
                      fontFamily: FNT,
                    }}
                  >
                    ∠DAC = {DAC}°
                  </span>
                  <span
                    style={{
                      background: COL.pri,
                      color: COL.w,
                      borderRadius: RAD.pill,
                      padding: "2px 8px",
                      fontSize: mob ? 9 : 10,
                      fontWeight: 600,
                      fontFamily: FNT,
                    }}
                  >
                    ∠ADC = {ADC}°
                  </span>
                </div>
              </div>

              {/* Right panel */}
              <div style={{ flex: tab ? "unset" : "1 1 260px" }}>
                {step.sc ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      background: COL.lOra,
                      borderRadius: RAD.sm,
                      padding: mob ? "8px 10px" : "10px 14px",
                      marginBottom: 10,
                      border: `1px solid ${COL.dOra}40`,
                      animation: "fadeInUp 0.4s ease-out",
                    }}
                  >
                    <div
                      style={{
                        animation: scA
                          ? "scissorsCut 0.7s ease-in-out"
                          : "none",
                      }}
                    >
                      <IcoScissors size={mob ? 18 : 20} color={COL.dOra} />
                    </div>
                    <span
                      style={{
                        fontFamily: FNT,
                        fontSize: mob ? 11 : 12,
                        color: COL.g9,
                        fontWeight: 500,
                      }}
                    >
                      Diagonal AC splits ∠DAB → ∠DAC + ∠CAB
                    </span>
                  </div>
                ) : null}

                {step.eq ? (
                  <div
                    style={{
                      background: COL.w,
                      border: `2px solid ${COL.lp}`,
                      borderRadius: RAD.md,
                      padding: mob ? 12 : 16,
                      boxShadow: "0 2px 8px rgba(74,77,201,0.08)",
                      animation: "fadeInUp 0.4s ease-out",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 8,
                      }}
                    >
                      <div
                        style={{
                          width: mob ? 20 : 24,
                          height: mob ? 20 : 24,
                          borderRadius: "50%",
                          background: GRAD,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: COL.w,
                          fontSize: mob ? 10 : 11,
                          fontWeight: 700,
                          fontFamily: FNT,
                        }}
                      >
                        {step.id}
                      </div>
                      <span
                        style={{
                          fontFamily: FNT,
                          fontSize: mob ? 11 : 12,
                          fontWeight: 600,
                          color: COL.pri,
                        }}
                      >
                        Calculation
                      </span>
                    </div>
                    {step.eq.map((eq, i) => (
                      <div
                        key={i}
                        style={{
                          fontFamily: FNT,
                          fontSize: eqFs,
                          color: i === step.eq!.length - 1 ? COL.pri : COL.g9,
                          fontWeight: i === step.eq!.length - 1 ? 700 : 400,
                          padding: "3px 0",
                          paddingLeft: 10,
                          opacity: i <= eqI ? 1 : 0,
                          transform:
                            i <= eqI ? "translateX(0)" : "translateX(14px)",
                          transition: `all 0.3s ease-out ${i * 0.08}s`,
                          borderLeft:
                            i === step.eq!.length - 1 && i <= eqI
                              ? `3px solid ${COL.pri}`
                              : "3px solid transparent",
                        }}
                      >
                        {eq}
                        {i === step.eq!.length - 1 && aV >= 0 ? (
                          <span
                            style={{
                              marginLeft: 5,
                              animation: "bounceIn 0.5s ease-out",
                              color: COL.ok,
                              display: "inline-block",
                            }}
                          >
                            <IcoCheck size={mob ? 12 : 14} color={COL.ok} />
                          </span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}

                {step.sum ? (
                  <div>
                    {SUMPAIRS.map((p, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: mob ? 6 : 8,
                          flexWrap: "wrap",
                          background: p.t === "eq" ? COL.lp + "30" : COL.lOra,
                          borderRadius: RAD.sm,
                          padding: mob ? "7px 10px" : "9px 12px",
                          marginBottom: 7,
                          border: `1px solid ${p.t === "eq" ? COL.lp : COL.dOra + "30"}`,
                          animation: `slideR 0.4s ease-out ${i * 0.12}s both`,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: FNT,
                            fontSize: mob ? 10 : 12,
                            fontWeight: 600,
                            color: p.t === "eq" ? COL.dp : COL.g9,
                            minWidth: mob ? 80 : 110,
                          }}
                        >
                          {p.a}
                        </span>
                        {p.t === "eq" ? (
                          <span
                            style={{
                              fontWeight: 700,
                              color: COL.pri,
                              fontSize: mob ? 11 : 13,
                            }}
                          >
                            =
                          </span>
                        ) : null}
                        <span
                          style={{
                            fontFamily: FNT,
                            fontSize: mob ? 10 : 12,
                            fontWeight: 600,
                            color: p.t === "eq" ? COL.dp : COL.g9,
                          }}
                        >
                          {p.b}
                        </span>
                        <span
                          style={{
                            marginLeft: "auto",
                            background: p.t === "eq" ? COL.pri : COL.dOra,
                            color: COL.w,
                            borderRadius: RAD.pill,
                            padding: "2px 7px",
                            fontSize: mob ? 8 : 9,
                            fontWeight: 600,
                            fontFamily: FNT,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {p.l}
                        </span>
                      </div>
                    ))}
                    <div
                      style={{
                        marginTop: 10,
                        background: COL.lOra,
                        border: `1px solid ${COL.dOra}30`,
                        borderRadius: RAD.sm,
                        padding: mob ? "8px 10px" : "10px 14px",
                        animation: "fadeInUp 0.5s ease-out 0.5s both",
                      }}
                    >
                      <p
                        style={{
                          fontSize: mob ? 10 : 11,
                          color: COL.g9,
                          margin: 0,
                          lineHeight: 1.5,
                          fontFamily: FNT,
                        }}
                      >
                        <strong>🌾 Real-world:</strong> A parallelogram-shaped
                        farm with irrigation diagonal — angles help plan
                        fencing!
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : /* PRACTICE */
        dn ? (
          <div
            style={{
              textAlign: "center",
              padding: mob ? "24px 12px" : "36px 20px",
              animation: "fadeInScale 0.5s ease-out",
            }}
          >
            <div
              style={{
                width: mob ? 52 : 64,
                height: mob ? 52 : 64,
                borderRadius: "50%",
                background: GRAD,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 14px",
              }}
            >
              <IcoAward size={mob ? 26 : 32} color={COL.w} />
            </div>
            <h3
              style={{
                fontFamily: FNT,
                fontSize: mob ? 17 : 20,
                fontWeight: 700,
                color: COL.g9,
                margin: "0 0 6px",
              }}
            >
              Practice Complete!
            </h3>
            <p
              style={{
                fontFamily: FNT,
                fontSize: mob ? 13 : 15,
                color: COL.g9,
                margin: "0 0 2px",
              }}
            >
              Score:{" "}
              <span
                style={{
                  fontWeight: 700,
                  color: COL.pri,
                  fontSize: mob ? 16 : 18,
                }}
              >
                {sc}
              </span>{" "}
              / {QS.length}
            </p>
            <p
              style={{
                fontFamily: FNT,
                fontSize: mob ? 11 : 12,
                color: COL.g4,
                margin: "0 0 20px",
              }}
            >
              {sc === QS.length
                ? "Perfect! 🎉"
                : sc >= 3
                  ? "Good job!"
                  : "Keep practising!"}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 6,
                marginBottom: 20,
              }}
            >
              {ans.map((ok, i) => (
                <div
                  key={i}
                  style={{
                    width: mob ? 26 : 30,
                    height: mob ? 26 : 30,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: ok ? COL.ok : COL.err,
                    color: COL.w,
                    fontFamily: FNT,
                    fontSize: mob ? 10 : 12,
                    fontWeight: 600,
                    animation: `popIn 0.4s ease-out ${i * 0.1}s both`,
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <button
              onClick={retry}
              style={{
                fontFamily: FNT,
                fontSize: mob ? 12 : 14,
                fontWeight: 600,
                padding: mob ? "9px 22px" : "10px 28px",
                borderRadius: RAD.pill,
                border: "none",
                cursor: "pointer",
                background: GRAD,
                color: COL.w,
              }}
            >
              <IcoReset size={mob ? 12 : 14} /> Retry
            </button>
          </div>
        ) : (
          <div style={{ opacity: op, transition: "opacity 0.2s ease" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: mob ? 10 : 14,
              }}
            >
              <div
                style={{
                  width: mob ? 24 : 28,
                  height: mob ? 24 : 28,
                  borderRadius: "50%",
                  background: COL.pri,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: COL.w,
                  fontSize: mob ? 11 : 13,
                  fontWeight: 700,
                  fontFamily: FNT,
                }}
              >
                {qi + 1}
              </div>
              <span
                style={{
                  fontFamily: FNT,
                  fontSize: mob ? 10 : 11,
                  fontWeight: 500,
                  color: COL.g4,
                }}
              >
                Q {qi + 1}/{QS.length}
              </span>
              <span
                style={{
                  marginLeft: "auto",
                  fontFamily: FNT,
                  fontSize: mob ? 10 : 12,
                  fontWeight: 600,
                  color: COL.pri,
                  background: COL.lp + "50",
                  padding: "3px 8px",
                  borderRadius: RAD.pill,
                }}
              >
                Score: {sc}
              </span>
            </div>
            <p
              style={{
                fontFamily: FNT,
                fontSize: mob ? 12 : 14,
                fontWeight: 600,
                color: COL.g9,
                lineHeight: 1.6,
                margin: "0 0 12px",
              }}
            >
              {question.q}
            </p>
            <div
              style={{
                background: COL.g1,
                borderRadius: RAD.md,
                padding: mob ? 6 : 10,
                marginBottom: 12,
                border: `1px solid ${COL.g2}`,
              }}
            >
              <Dgm
                hp={question.hp}
                ht={question.ht}
                sv={{}}
                isSum={false}
                sid={-1}
                md="practice"
                small={true}
              />
            </div>

            {/* Options: 2 col on tablet+, 1 col on mobile */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
                gap: mob ? 6 : 8,
                marginBottom: 12,
              }}
            >
              {question.o.map((opt, i) => {
                const isSel = sel === i,
                  isCor = i === question.a;
                let bg = COL.w,
                  bd = COL.g2,
                  tx = COL.g9,
                  an = "none";
                if (sr) {
                  if (isCor) {
                    bg = "#ecfdf5";
                    bd = COL.ok;
                    tx = "#065f46";
                  } else if (isSel) {
                    bg = "#fef2f2";
                    bd = COL.err;
                    tx = "#991b1b";
                  } else {
                    bg = COL.g1;
                    tx = COL.g4;
                  }
                }
                if (sr && isSel && !isCor) an = "shake 0.4s ease-out";
                if (sr && isCor) an = "pulse 0.5s ease-out";
                return (
                  <button
                    key={i}
                    onClick={() => pick(i)}
                    style={{
                      fontFamily: FNT,
                      fontSize: mob ? 12 : 13,
                      fontWeight: 600,
                      padding: mob ? "10px 12px" : "12px 14px",
                      borderRadius: RAD.md,
                      border: `2px solid ${bd}`,
                      background: bg,
                      color: tx,
                      cursor: sr ? "default" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      justifyContent: mob ? "flex-start" : "center",
                      transition: "all 0.2s ease",
                      animation: an,
                    }}
                  >
                    <span
                      style={{
                        width: mob ? 18 : 20,
                        height: mob ? 18 : 20,
                        borderRadius: "50%",
                        border: `2px solid ${sr && isCor ? COL.ok : sr && isSel ? COL.err : COL.g4}`,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: mob ? 9 : 10,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                    {sr && isCor ? (
                      <IcoCheck size={mob ? 12 : 14} color={COL.ok} />
                    ) : null}
                    {sr && isSel && !isCor ? (
                      <IcoX size={mob ? 12 : 14} color={COL.err} />
                    ) : null}
                  </button>
                );
              })}
            </div>

            {sr ? (
              <div
                style={{
                  background: sel === question.a ? "#ecfdf5" : "#fef2f2",
                  border: `1px solid ${sel === question.a ? COL.ok + "40" : COL.err + "40"}`,
                  borderRadius: RAD.md,
                  padding: mob ? "10px 12px" : "12px 14px",
                  marginBottom: 10,
                  animation: "fadeInUp 0.3s ease-out",
                }}
              >
                <p
                  style={{
                    fontFamily: FNT,
                    fontSize: mob ? 11 : 12,
                    fontWeight: 600,
                    color: sel === question.a ? "#065f46" : "#991b1b",
                    margin: "0 0 3px",
                  }}
                >
                  {sel === question.a ? "✅ Correct!" : "❌ Incorrect"}
                </p>
                <p
                  style={{
                    fontFamily: FNT,
                    fontSize: mob ? 10 : 11,
                    color: COL.g9,
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {question.e}
                </p>
              </div>
            ) : null}

            {sr ? (
              <div style={{ textAlign: "right" }}>
                <button
                  onClick={nxtQ}
                  style={{
                    fontFamily: FNT,
                    fontSize: mob ? 12 : 13,
                    fontWeight: 600,
                    padding: mob ? "8px 18px" : "9px 24px",
                    borderRadius: RAD.pill,
                    border: "none",
                    cursor: "pointer",
                    background: GRAD,
                    color: COL.w,
                  }}
                >
                  {qi < QS.length - 1 ? "Next Question" : "See Results"}{" "}
                  <IcoRight size={mob ? 12 : 14} />
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* NAV */}
      {mode === "learn" ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: `${mob ? 10 : 12}px ${pad} ${mob ? 12 : 16}px`,
            borderTop: `1px solid ${COL.g2}`,
            background: COL.g1,
            gap: mob ? 6 : 0,
          }}
        >
          <button
            onClick={() => si > 0 && go(-1)}
            disabled={si === 0}
            style={{
              fontFamily: FNT,
              fontSize: mob ? 11 : 13,
              fontWeight: 600,
              padding: mob ? "7px 12px" : "9px 18px",
              borderRadius: RAD.pill,
              border: `2px solid ${si === 0 ? COL.g2 : COL.pri}`,
              background: COL.w,
              color: si === 0 ? COL.g4 : COL.pri,
              cursor: si === 0 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 2,
              transition: "all 0.2s ease",
            }}
          >
            <IcoLeft size={mob ? 13 : 15} /> {mob ? "Prev" : "Previous"}
          </button>
          <button
            onClick={() => {
              setOp(0);
              setTimeout(() => {
                setSi(0);
                setEqI(0);
                setAV(-1);
                setTimeout(() => setOp(1), 50);
              }, 180);
            }}
            style={{
              fontFamily: FNT,
              fontSize: mob ? 11 : 13,
              fontWeight: 600,
              padding: mob ? "7px 10px" : "9px 14px",
              borderRadius: RAD.pill,
              border: "none",
              background: "transparent",
              color: COL.g4,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <IcoReset size={mob ? 11 : 13} /> Reset
          </button>
          <button
            onClick={() => si < STEPS.length - 1 && go(1)}
            disabled={si === STEPS.length - 1}
            style={{
              fontFamily: FNT,
              fontSize: mob ? 11 : 13,
              fontWeight: 600,
              padding: mob ? "7px 12px" : "9px 18px",
              borderRadius: RAD.pill,
              border: "none",
              background: si === STEPS.length - 1 ? COL.g2 : GRAD,
              color: si === STEPS.length - 1 ? COL.g4 : COL.w,
              cursor: si === STEPS.length - 1 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 2,
              transition: "all 0.2s ease",
            }}
          >
            Next <IcoRight size={mob ? 13 : 15} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
