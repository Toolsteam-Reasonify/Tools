// @ts-ignore - module resolved from workspace/parent
import React, { useState, useEffect, useCallback, useRef } from "react";

interface Problem {
  id: string;
  num1: number;
  num2: number;
  operation: "+" | "-";
  answer: number;
  label: string;
  paddingNote?: string;
}
interface CellState {
  value: string;
  correct: boolean | null;
  locked: boolean;
}
interface ProblemState {
  cells: { [k: string]: CellState };
  carries: { [k: string]: string };
  borrows: { [k: string]: string };
  completed: boolean;
  estimateGiven: boolean;
  estimateRange: string;
  showHint: boolean;
  attempts: number;
}
interface DecimalPracticeToolProps {
  props?: {
    width?: number;
    height?: number;
    themeColor?: string;
    darkMode?: boolean;
    additionalProps?: { [k: string]: any };
  };
}

const DS = {
  primary: "#4A4DC9",
  primaryDark: "#533086",
  accent: "#FF7212",
  accentWarm: "#FC9145",
  primaryLight: "#C1C1EA",
  primaryLightest: "#EDEDF8",
  accentLight: "#FFF3E4",
  accentLightest: "#FFF9F2",
  gray900: "#4E4E4E",
  gray500: "#CACACA",
  gray300: "#EBEBEB",
  gray100: "#F5F5F5",
  white: "#FFFFFF",
  success: "#2DB572",
  successLight: "#E8F7EF",
  error: "#E5463D",
  errorLight: "#FDECEB",
  gPri: "linear-gradient(135deg,#533086 0%,#4A4DC9 100%)",
  gAcc: "linear-gradient(135deg,#FF7212 0%,#FC9145 100%)",
  gHero: "linear-gradient(135deg,#533086 0%,#4A4DC9 50%,#FC9145 100%)",
  gSub: "linear-gradient(135deg,#EDEDF8 0%,#FFF3E4 100%)",
  ff: "'Poppins',sans-serif",
  rPill: "100px",
  rLg: "20px",
  rMd: "14px",
  rSm: "10px",
  rXs: "8px",
  sSm: "0 2px 8px rgba(74,77,201,0.08)",
  sMd: "0 4px 16px rgba(74,77,201,0.12)",
  sLg: "0 8px 32px rgba(74,77,201,0.16)",
  sAcc: "0 4px 16px rgba(255,114,18,0.25)",
  sPri: "0 4px 16px rgba(74,77,201,0.25)",
};

const addP: Problem[] = [
  { id: "a1", num1: 5.3, num2: 2.6, operation: "+", answer: 7.9, label: "(a)" },
  {
    id: "a2",
    num1: 18,
    num2: 8.8,
    operation: "+",
    answer: 26.8,
    label: "(b)",
    paddingNote: "18 → 18.0 (padded with zero)",
  },
  {
    id: "a3",
    num1: 2.15,
    num2: 5.26,
    operation: "+",
    answer: 7.41,
    label: "(c)",
  },
  {
    id: "a4",
    num1: 9.01,
    num2: 9.1,
    operation: "+",
    answer: 18.11,
    label: "(d)",
  },
  {
    id: "a5",
    num1: 29.19,
    num2: 9.91,
    operation: "+",
    answer: 39.1,
    label: "(e)",
  },
  {
    id: "a6",
    num1: 0.934,
    num2: 0.6,
    operation: "+",
    answer: 1.534,
    label: "(f)",
    paddingNote: "0.6 → 0.600 (padded with zeros)",
  },
  {
    id: "a7",
    num1: 0.75,
    num2: 0.03,
    operation: "+",
    answer: 0.78,
    label: "(g)",
  },
  {
    id: "a8",
    num1: 6.236,
    num2: 0.487,
    operation: "+",
    answer: 6.723,
    label: "(h)",
  },
];
const subP: Problem[] = [
  { id: "s1", num1: 5.6, num2: 2.3, operation: "-", answer: 3.3, label: "(a)" },
  {
    id: "s2",
    num1: 18,
    num2: 8.8,
    operation: "-",
    answer: 9.2,
    label: "(b)",
    paddingNote: "18 → 18.0 (padded with zero)",
  },
  {
    id: "s3",
    num1: 10.4,
    num2: 4.5,
    operation: "-",
    answer: 5.9,
    label: "(c)",
  },
  {
    id: "s4",
    num1: 17,
    num2: 16.198,
    operation: "-",
    answer: 0.802,
    label: "(d)",
    paddingNote: "17 → 17.000 (padded with zeros)",
  },
  {
    id: "s5",
    num1: 17,
    num2: 0.05,
    operation: "-",
    answer: 16.95,
    label: "(e)",
    paddingNote: "17 → 17.00 (padded with zeros)",
  },
  {
    id: "s6",
    num1: 34.505,
    num2: 18.1,
    operation: "-",
    answer: 16.405,
    label: "(f)",
    paddingNote: "18.1 → 18.100 (padded with zeros)",
  },
  {
    id: "s7",
    num1: 9.9,
    num2: 9.09,
    operation: "-",
    answer: 0.81,
    label: "(g)",
    paddingNote: "9.9 → 9.90 (padded with zero)",
  },
  {
    id: "s8",
    num1: 6.236,
    num2: 0.487,
    operation: "-",
    answer: 5.749,
    label: "(h)",
  },
];

function gdp(n: number) {
  const s = n.toString(),
    d = s.indexOf(".");
  return d === -1 ? 0 : s.length - d - 1;
}
function fmt(n: number, dp: number) {
  return n.toFixed(dp);
}
function mdp(p: Problem) {
  return Math.max(gdp(p.num1), gdp(p.num2), gdp(p.answer));
}
function estR(p: Problem) {
  const w1 = Math.floor(p.num1),
    w2 = Math.floor(p.num2);
  return p.operation === "+"
    ? `Between ${w1 + w2} and ${w1 + w2 + 2}`
    : `Between ${Math.max(0, w1 - w2 - 1)} and ${w1 - w2 + 1}`;
}
function hintT(p: Problem) {
  if (p.operation === "+") {
    return p.paddingNote
      ? `Align decimal points first! ${p.paddingNote}. Then add column by column from right to left, carrying over when a column sums to 10 or more.`
      : "Add column by column from right to left. If any column sums to 10 or more, write the ones digit and carry 1 to the next column.";
  }
  return p.paddingNote
    ? `Align decimal points first! ${p.paddingNote}. Then subtract column by column from right to left, borrowing when the top digit is smaller.`
    : "Subtract column by column from right to left. If the top digit is smaller than the bottom, borrow 1 from the next column (making it 10 more).";
}

type ResolvedProps = NonNullable<DecimalPracticeToolProps["props"]>;

const DecimalPracticeTool: React.FC<DecimalPracticeToolProps> = ({
  props: propsIn = {},
}) => {
  const props = propsIn as ResolvedProps;
  const width = props?.width ?? 800;
  const height = props?.height ?? 600;
  const [activeTab, setActiveTab] = useState<"add" | "sub">("add");
  const [cpi, setCpi] = useState(0);
  const [ps, setPs] = useState<{ [k: string]: ProblemState }>({});
  const [animCell, setAnimCell] = useState<string | null>(null);
  const [showCeleb, setShowCeleb] = useState(false);
  const [shakeC, setShakeC] = useState<string | null>(null);
  const [mt, setMt] = useState(false);
  const [focC, setFocC] = useState<string | null>(null);
  const [hovN, setHovN] = useState<string | null>(null);
  const [hovB, setHovB] = useState<string | null>(null);
  const iRefs = useRef<{ [k: string]: HTMLInputElement | null }>({});
  const probs = activeTab === "add" ? addP : subP;
  const cp = probs[cpi];

  useEffect(() => {
    setMt(true);
    const s = document.createElement("style");
    s.id = "sg-ds";
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
      @keyframes fadeInUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
      @keyframes fadeInScale{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
      @keyframes popIn{0%{transform:scale(0);opacity:0}60%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
      @keyframes correctPulse{0%{box-shadow:0 0 0 0 rgba(45,181,114,.45)}70%{box-shadow:0 0 0 14px rgba(45,181,114,0)}100%{box-shadow:0 0 0 0 rgba(45,181,114,0)}}
      @keyframes incorrectShake{0%,100%{transform:translateX(0)}10%,30%,50%,70%,90%{transform:translateX(-5px)}20%,40%,60%,80%{transform:translateX(5px)}}
      @keyframes celebBurst{0%{transform:scale(0) rotate(0);opacity:1}50%{transform:scale(1.8) rotate(180deg);opacity:.7}100%{transform:scale(2.5) rotate(360deg);opacity:0}}
      @keyframes floatS{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-8px) rotate(3deg)}}
      @keyframes confFall{0%{transform:translateY(0) rotate(0) scale(1);opacity:1}100%{transform:translateY(350px) rotate(720deg) scale(.3);opacity:0}}
      @keyframes tabIn{from{opacity:0;transform:translateY(-8px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
      @keyframes progShine{0%{left:-40%}100%{left:140%}}
      .sg-i:focus{outline:none!important}.sg-b:active{transform:scale(.96)!important}
    `;
    document.head.appendChild(s);
    return () => {
      const e = document.getElementById("sg-ds");
      if (e) document.head.removeChild(e);
    };
  }, []);

  const initS = useCallback(
    (): ProblemState => ({
      cells: {},
      carries: {},
      borrows: {},
      completed: false,
      estimateGiven: false,
      estimateRange: "",
      showHint: false,
      attempts: 0,
    }),
    [],
  );
  const getS = useCallback(
    (id: string): ProblemState => ps[id] || initS(),
    [ps, initS],
  );
  const upS = useCallback(
    (id: string, fn: (p: ProblemState) => ProblemState) => {
      setPs((pv) => ({ ...pv, [id]: fn(pv[id] || initS()) }));
    },
    [initS],
  );
  const cAdd = addP.filter((p) => ps[p.id]?.completed).length;
  const cSub = subP.filter((p) => ps[p.id]?.completed).length;
  const cTot = cAdd + cSub;

  const gCD = useCallback((prob: Problem) => {
    const md = mdp(prob),
      s1 = fmt(prob.num1, md),
      s2 = fmt(prob.num2, md),
      sA = fmt(prob.answer, md);
    const tL = Math.max(s1.length, s2.length, sA.length) + 1;
    const d1 = s1.padStart(tL, " ").split(""),
      d2 = s2.padStart(tL, " ").split(""),
      dA = sA.padStart(tL, " ").split("");
    const di = d1.indexOf(".");
    const hd: string[] = new Array(tL).fill("");
    if (di !== -1) {
      let p = di - 1,
        ni = 0;
      const pn = ["Units", "Tens", "Hds"];
      while (p >= 0 && ni < pn.length) {
        if (d1[p] !== " " || d2[p] !== " " || dA[p] !== " ") hd[p] = pn[ni];
        p--;
        ni++;
      }
      hd[di] = "•";
      const dn = ["Tenths", "Hths", "Thths"];
      for (let i = di + 1; i < tL; i++) {
        const x = i - di - 1;
        if (x < dn.length) hd[i] = dn[x];
      }
    }
    return { d1, d2, dA, hd, tL, di };
  }, []);

  const hEst = useCallback(() => {
    upS(cp.id, (pv) => ({
      ...pv,
      estimateGiven: true,
      estimateRange: estR(cp),
    }));
  }, [cp, upS]);

  const hDig = useCallback(
    (col: number, val: string) => {
      const { dA, tL } = gCD(cp);
      if (val.length > 1) val = val.slice(-1);
      if (val && !/^[0-9]$/.test(val)) return;
      const exp = dA[col];
      if (exp === "." || exp === " ") return;
      const ck = `${cp.id}_${col}`,
        ok = val === exp;
      if (!val) return;
      upS(cp.id, (pv) => {
        const nc = {
          ...pv.cells,
          [ck]: { value: val, correct: ok, locked: ok },
        };
        let all = true;
        for (let i = 0; i < tL; i++) {
          const e = dA[i];
          if (e === "." || e === " ") continue;
          const k = `${cp.id}_${i}`;
          if (!nc[k] || !nc[k].correct) {
            all = false;
            break;
          }
        }
        if (all && !pv.completed) {
          setTimeout(() => setShowCeleb(true), 200);
          setTimeout(() => setShowCeleb(false), 2200);
        }
        return {
          ...pv,
          cells: nc,
          completed: all,
          attempts: pv.attempts + (ok ? 0 : 1),
        };
      });
      if (ok) {
        setAnimCell(ck);
        setTimeout(() => setAnimCell(null), 700);
        for (let i = col - 1; i >= 0; i--) {
          const e = dA[i];
          if (e === "." || e === " ") continue;
          const nk = `${cp.id}_${i}`;
          const st = ps[cp.id];
          if (!st?.cells[nk]?.correct) {
            setTimeout(() => iRefs.current[nk]?.focus(), 120);
            break;
          }
        }
      } else {
        setShakeC(ck);
        setTimeout(() => {
          setShakeC(null);
          upS(cp.id, (pv) => ({
            ...pv,
            cells: {
              ...pv.cells,
              [ck]: { value: "", correct: null, locked: false },
            },
          }));
        }, 550);
      }
    },
    [cp, gCD, upS, ps],
  );

  const hCB = useCallback(
    (col: number, val: string) => {
      if (val.length > 1) val = val.slice(-1);
      if (val && !/^[0-9]$/.test(val)) return;
      const k = cp.operation === "+" ? "carries" : "borrows";
      upS(cp.id, (pv) => ({
        ...pv,
        [k]: { ...pv[k], [`${cp.id}_${col}`]: val },
      }));
    },
    [cp, upS],
  );
  const st = getS(cp.id);
  const { d1, d2, dA, hd, tL, di } = gCD(cp);
  const CL = 46,
    GP = 4,
    OW = 34;

  const rCell = (ch: string, row: "n1" | "n2" | "ans" | "cb", ci: number) => {
    const isD = ch === ".",
      isS = ch === " " || ch === "",
      ck = `${cp.id}_${ci}`;
    if (row === "cb") {
      if (isD || hd[ci] === "•")
        return <div key={`cb${ci}`} style={{ width: CL, height: 24 }} />;
      return (
        <div
          key={`cb${ci}`}
          style={{
            width: CL,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <input
            className="sg-i"
            style={{
              width: 24,
              height: 22,
              border: `1.5px dashed ${DS.accent}60`,
              borderRadius: DS.rXs,
              background: DS.accentLight,
              textAlign: "center",
              fontSize: 10,
              fontFamily: DS.ff,
              fontWeight: 700,
              color: "#8B4513",
              outline: "none",
              padding: 0,
            }}
            maxLength={1}
            value={st[cp.operation === "+" ? "carries" : "borrows"][ck] || ""}
            onChange={(e) => hCB(ci, e.target.value)}
            placeholder={cp.operation === "+" ? "c" : "b"}
            inputMode="numeric"
          />
        </div>
      );
    }
    if (row === "ans") {
      if (isD)
        return (
          <div
            key={`a${ci}`}
            style={{
              width: CL,
              height: CL,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 800,
              color: DS.primary,
              fontFamily: DS.ff,
            }}
          >
            .
          </div>
        );
      if (isS) return <div key={`a${ci}`} style={{ width: CL, height: CL }} />;
      const cs = st.cells[ck],
        isOk = cs?.correct === true,
        isBd = shakeC === ck,
        isAn = animCell === ck,
        isLk = cs?.locked,
        isF = focC === ck;
      return (
        <div
          key={`a${ci}`}
          style={{ width: CL, height: CL, position: "relative" }}
        >
          <input
            ref={(el) => {
              iRefs.current[ck] = el;
            }}
            className="sg-i"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: DS.rSm,
              textAlign: "center",
              fontSize: 20,
              fontFamily: DS.ff,
              fontWeight: 700,
              outline: "none",
              padding: 0,
              cursor: isLk ? "default" : "text",
              border: isOk
                ? `2.5px solid ${DS.success}`
                : isBd
                  ? `2.5px solid ${DS.error}`
                  : isF
                    ? `2.5px solid ${DS.primary}`
                    : `2px solid ${DS.gray300}`,
              background: isOk
                ? DS.successLight
                : isBd
                  ? DS.errorLight
                  : isF
                    ? DS.primaryLightest
                    : DS.white,
              color: isOk ? DS.success : isBd ? DS.error : DS.gray900,
              transition: "border-color .2s,background .2s,box-shadow .2s",
              animation: isAn
                ? "correctPulse .7s ease"
                : isBd
                  ? "incorrectShake .5s ease"
                  : "none",
              boxShadow: isF && !isOk ? `0 0 0 4px ${DS.primary}18` : "none",
            }}
            maxLength={1}
            value={cs?.value || ""}
            onChange={(e) => !isLk && hDig(ci, e.target.value)}
            onFocus={() => setFocC(ck)}
            onBlur={() => setFocC(null)}
            disabled={isLk}
            inputMode="numeric"
          />
          {isOk && (
            <div
              style={{
                position: "absolute",
                top: -7,
                right: -7,
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: DS.success,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "popIn .35s cubic-bezier(.16,1,.3,1)",
                boxShadow: `0 2px 6px ${DS.success}40`,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M2 5.5L4 7.5L8 3"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
      );
    }
    if (isD)
      return (
        <div
          key={`${row}${ci}`}
          style={{
            width: CL,
            height: CL,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            fontWeight: 800,
            color: DS.primary,
            fontFamily: DS.ff,
          }}
        >
          .
        </div>
      );
    return (
      <div
        key={`${row}${ci}`}
        style={{
          width: CL,
          height: CL,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isS ? "transparent" : DS.primaryLightest,
          borderRadius: DS.rSm,
          border: isS ? "none" : `1.5px solid ${DS.primaryLight}`,
          fontSize: 20,
          fontFamily: DS.ff,
          fontWeight: 700,
          color: DS.gray900,
        }}
      >
        {isS ? "" : ch}
      </div>
    );
  };

  const isFirst = cpi === 0,
    isLast = cpi === probs.length - 1;
  const tabClr = activeTab === "add" ? DS.primary : DS.accent;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: width,
        minHeight: height,
        margin: "0 auto",
        fontFamily: DS.ff,
        background: DS.gray100,
        borderRadius: DS.rLg,
        overflow: "hidden",
        position: "relative",
        opacity: mt ? 1 : 0,
        transform: mt ? "translateY(0)" : "translateY(16px)",
        transition: "all .5s cubic-bezier(.16,1,.3,1)",
        boxShadow: DS.sLg,
      }}
    >
      {/* CELEBRATION */}
      {showCeleb && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
            zIndex: 100,
            overflow: "hidden",
          }}
        >
          {Array.from({ length: 28 }).map((_, i) => {
            const sh = i % 3,
              sz = 8 + Math.random() * 10,
              cl = [
                DS.primary,
                DS.accent,
                DS.accentWarm,
                DS.success,
                DS.primaryLight,
                "#FC9145",
                "#7C5BB0",
              ][i % 7],
              fl = i % 2 === 0;
            return (
              <svg
                key={i}
                style={{
                  position: "absolute",
                  top: -15,
                  left: `${Math.random() * 100}%`,
                  width: sz,
                  height: sz,
                  animation: `confFall ${1.5 + Math.random() * 1.8}s ease-out forwards`,
                  animationDelay: `${Math.random() * 0.6}s`,
                }}
                viewBox="0 0 20 20"
              >
                {sh === 0 && (
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    fill={fl ? cl : "none"}
                    stroke={cl}
                    strokeWidth="2"
                  />
                )}
                {sh === 1 && (
                  <polygon
                    points="10,2 18,18 2,18"
                    fill={fl ? cl : "none"}
                    stroke={cl}
                    strokeWidth="2"
                  />
                )}
                {sh === 2 && (
                  <rect
                    x="2"
                    y="2"
                    width="16"
                    height="16"
                    rx="2"
                    fill={fl ? cl : "none"}
                    stroke={cl}
                    strokeWidth="2"
                  />
                )}
              </svg>
            );
          })}
          <div
            style={{
              position: "absolute",
              top: "45%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              animation: "celebBurst 1.8s ease forwards",
              fontSize: 48,
            }}
          >
            🎉
          </div>
        </div>
      )}

      {/* HEADER */}
      <div
        style={{
          background: DS.gHero,
          padding: "24px 28px 20px",
          color: DS.white,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg
          style={{
            position: "absolute",
            top: 14,
            right: 85,
            opacity: 0.15,
            animation: "floatS 6s ease-in-out infinite",
          }}
          width="38"
          height="38"
          viewBox="0 0 38 38"
        >
          <circle
            cx="19"
            cy="19"
            r="17"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
        <svg
          style={{
            position: "absolute",
            bottom: 18,
            right: 32,
            opacity: 0.12,
            animation: "floatS 8s ease-in-out infinite reverse",
          }}
          width="30"
          height="30"
          viewBox="0 0 30 30"
        >
          <polygon points="15,2 28,26 2,26" fill="white" />
        </svg>
        <svg
          style={{
            position: "absolute",
            top: 55,
            right: 155,
            opacity: 0.1,
            animation: "floatS 7s ease-in-out infinite",
          }}
          width="26"
          height="26"
          viewBox="0 0 26 26"
        >
          <rect
            x="2"
            y="2"
            width="22"
            height="22"
            fill="none"
            stroke="white"
            strokeWidth="2"
            rx="2"
          />
        </svg>
        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(255,255,255,.15)",
                  backdropFilter: "blur(8px)",
                  borderRadius: DS.rPill,
                  padding: "5px 14px",
                  marginBottom: 10,
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: DS.ff,
                  letterSpacing: ".03em",
                }}
              >
                CBSE Grade 7 • Ganita Prakash
              </div>
              <h1
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  margin: 0,
                  fontFamily: DS.ff,
                  letterSpacing: "-.01em",
                  lineHeight: 1.2,
                }}
              >
                Figure it Out
              </h1>
              <p
                style={{
                  fontSize: 13,
                  margin: "6px 0 0",
                  opacity: 0.85,
                  fontWeight: 500,
                  fontFamily: DS.ff,
                }}
              >
                Decimal Addition & Subtraction — Column Method
              </p>
            </div>
            <div
              style={{
                background: "rgba(255,255,255,.18)",
                backdropFilter: "blur(8px)",
                borderRadius: DS.rMd,
                padding: "10px 18px",
                textAlign: "center",
                border: "1px solid rgba(255,255,255,.15)",
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  fontFamily: DS.ff,
                  lineHeight: 1,
                }}
              >
                {cTot}
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  opacity: 0.8,
                  fontFamily: DS.ff,
                  marginTop: 2,
                }}
              >
                of 16
              </div>
            </div>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,.15)",
              borderRadius: DS.rPill,
              height: 10,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                background: DS.gAcc,
                height: "100%",
                borderRadius: DS.rPill,
                width: `${(cTot / 16) * 100}%`,
                transition: "width .8s cubic-bezier(.16,1,.3,1)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  width: "40%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg,transparent,rgba(255,255,255,.4),transparent)",
                  animation: "progShine 2.5s ease-in-out infinite",
                }}
              />
            </div>
          </div>
          <p
            style={{
              fontSize: 11,
              margin: "10px 0 0",
              opacity: 0.7,
              fontFamily: DS.ff,
              fontWeight: 500,
            }}
          >
            Enter digits from{" "}
            <strong style={{ opacity: 1 }}>right to left</strong>. Decimal
            points are pre-aligned!
          </p>
        </div>
      </div>

      {/* TABS */}
      <div
        style={{
          display: "flex",
          background: DS.white,
          borderBottom: `2px solid ${DS.gray300}`,
        }}
      >
        {[
          { k: "add" as const, l: "Find the Sums", ic: "+", c: cAdd },
          { k: "sub" as const, l: "Find the Differences", ic: "−", c: cSub },
        ].map((t) => {
          const act = activeTab === t.k,
            cl = t.k === "add" ? DS.primary : DS.accent;
          return (
            <button
              key={t.k}
              onClick={() => {
                setActiveTab(t.k);
                setCpi(0);
              }}
              className="sg-b"
              style={{
                flex: 1,
                padding: "15px 16px",
                border: "none",
                borderBottom: `3px solid ${act ? cl : "transparent"}`,
                background: act
                  ? t.k === "add"
                    ? DS.primaryLightest
                    : DS.accentLightest
                  : "transparent",
                color: act ? cl : DS.gray500,
                fontFamily: DS.ff,
                fontSize: 13,
                fontWeight: act ? 700 : 500,
                cursor: "pointer",
                transition: "all .3s cubic-bezier(.16,1,.3,1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 800,
                  background: act ? cl : DS.gray300,
                  color: act ? DS.white : DS.gray500,
                  transition: "all .3s",
                  fontFamily: DS.ff,
                }}
              >
                {t.ic}
              </span>
              {t.l}
              <span
                style={{
                  background: act ? `${cl}20` : DS.gray300,
                  color: act ? cl : DS.gray500,
                  borderRadius: DS.rPill,
                  padding: "2px 10px",
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: DS.ff,
                  transition: "all .3s",
                }}
              >
                {t.c}/8
              </span>
            </button>
          );
        })}
      </div>

      {/* COMPLETION */}
      {cTot >= 16 && (
        <div
          style={{
            margin: "16px 24px 0",
            padding: "20px 24px",
            background: DS.gSub,
            border: `2px solid ${DS.primaryLight}`,
            borderRadius: DS.rLg,
            textAlign: "center",
            animation: "fadeInScale .6s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>🏆</div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              fontFamily: DS.ff,
              color: DS.primary,
              marginBottom: 4,
            }}
          >
            All 16 Problems Complete!
          </div>
          <div
            style={{
              fontSize: 13,
              color: DS.gray900,
              fontFamily: DS.ff,
              fontWeight: 500,
            }}
          >
            Excellent work mastering decimal addition and subtraction!
          </div>
        </div>
      )}

      {/* PROBLEM NAV */}
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "14px 24px",
          background: DS.gray100,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {probs.map((p, idx) => {
          const pst = ps[p.id],
            act = idx === cpi,
            dn = pst?.completed,
            hv = hovN === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setCpi(idx)}
              onMouseEnter={() => setHovN(p.id)}
              onMouseLeave={() => setHovN(null)}
              className="sg-b"
              style={{
                width: 42,
                height: 40,
                borderRadius: DS.rSm,
                border: act
                  ? `2.5px solid ${DS.primary}`
                  : dn
                    ? `2px solid ${DS.success}`
                    : `1.5px solid ${hv ? DS.primaryLight : DS.gray300}`,
                background: dn
                  ? DS.successLight
                  : act
                    ? DS.primaryLightest
                    : hv
                      ? DS.gray100
                      : DS.white,
                color: dn ? DS.success : act ? DS.primary : DS.gray900,
                fontSize: 13,
                fontWeight: 700,
                fontFamily: DS.ff,
                cursor: "pointer",
                transition: "all .2s cubic-bezier(.16,1,.3,1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: act ? "scale(1.1)" : hv ? "scale(1.04)" : "scale(1)",
                boxShadow: act ? DS.sPri : "none",
              }}
            >
              {dn ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8.5L6.5 12L13 4"
                    stroke={DS.success}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                p.label.replace(/[()]/g, "")
              )}
            </button>
          );
        })}
      </div>

      {/* ESTIMATE */}
      {st.estimateGiven ? (
        <div
          style={{
            margin: "0 24px 14px",
            padding: "12px 18px",
            background: DS.successLight,
            border: `1.5px solid ${DS.success}50`,
            borderRadius: DS.rMd,
            display: "flex",
            alignItems: "center",
            gap: 12,
            animation: "fadeInUp .4s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: `${DS.success}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle
                cx="9"
                cy="9"
                r="7"
                stroke={DS.success}
                strokeWidth="1.5"
              />
              <circle
                cx="9"
                cy="9"
                r="3.5"
                stroke={DS.success}
                strokeWidth="1.5"
              />
              <circle cx="9" cy="9" r="1" fill={DS.success} />
            </svg>
          </div>
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: DS.success,
                fontFamily: DS.ff,
              }}
            >
              Estimate: {st.estimateRange}
            </div>
            <div
              style={{
                fontSize: 11,
                color: DS.gray900,
                fontFamily: DS.ff,
                marginTop: 2,
                fontWeight: 500,
              }}
            >
              Answer: <strong style={{ color: DS.primary }}>{cp.answer}</strong>{" "}
              — within range!
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            margin: "0 24px 14px",
            padding: "12px 18px",
            background: DS.accentLight,
            border: `1.5px dashed ${DS.accent}60`,
            borderRadius: DS.rMd,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            animation: "fadeInUp .4s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: `${DS.accent}18`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: 16,
              }}
            >
              ❓
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#8B4513",
                fontFamily: DS.ff,
              }}
            >
              Estimate first! What range should the answer be in?
            </span>
          </div>
          <button
            onClick={hEst}
            onMouseEnter={() => setHovB("est")}
            onMouseLeave={() => setHovB(null)}
            className="sg-b"
            style={{
              background: hovB === "est" ? DS.accent : DS.gAcc,
              color: DS.white,
              border: "none",
              borderRadius: DS.rPill,
              padding: "8px 20px",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: DS.ff,
              transition: "all .2s",
              boxShadow: hovB === "est" ? DS.sAcc : "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            Show Range
          </button>
        </div>
      )}

      {/* WORKSPACE */}
      <div
        style={{
          padding: "18px 24px",
          animation: "tabIn .35s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <span
            style={{
              fontFamily: DS.ff,
              fontSize: 14,
              fontWeight: 700,
              color: tabClr,
              background:
                activeTab === "add" ? DS.primaryLightest : DS.accentLight,
              borderRadius: DS.rPill,
              padding: "5px 14px",
              border: `1.5px solid ${activeTab === "add" ? DS.primaryLight : `${DS.accent}30`}`,
            }}
          >
            {cp.label}
          </span>
          <span
            style={{
              fontFamily: DS.ff,
              fontSize: 18,
              fontWeight: 600,
              color: DS.gray900,
            }}
          >
            {cp.num1}
            <span style={{ color: tabClr, margin: "0 6px", fontWeight: 800 }}>
              {cp.operation === "+" ? "+" : "−"}
            </span>
            {cp.num2}
          </span>
          {st.completed && (
            <span
              style={{
                background: DS.successLight,
                color: DS.success,
                borderRadius: DS.rPill,
                padding: "5px 14px",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: DS.ff,
                animation: "popIn .4s cubic-bezier(.16,1,.3,1)",
                border: `1.5px solid ${DS.success}40`,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 6.5L5 9.5L10 3"
                  stroke={DS.success}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Correct!
            </span>
          )}
        </div>
        {cp.paddingNote && (
          <div
            style={{
              background: DS.accentLight,
              border: `1.5px solid ${DS.accent}25`,
              borderRadius: DS.rSm,
              padding: "10px 16px",
              marginBottom: 14,
              fontSize: 12,
              color: "#8B4513",
              fontWeight: 500,
              fontFamily: DS.ff,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 14 }}>📌</span>
            {cp.paddingNote}
          </div>
        )}
        <div
          style={{
            overflowX: "auto",
            display: "flex",
            justifyContent: "center",
            padding: "4px 0",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: DS.white,
              borderRadius: DS.rLg,
              padding: "16px 20px 20px",
              border: `1.5px solid ${DS.gray300}`,
              boxShadow: DS.sSm,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: GP,
                marginBottom: 6,
                paddingLeft: OW + GP,
              }}
            >
              {hd.map((h, i) => (
                <div
                  key={`h${i}`}
                  style={{
                    width: CL,
                    textAlign: "center",
                    fontSize: 9,
                    fontWeight: 700,
                    color: h === "•" ? DS.primary : DS.gray500,
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                    fontFamily: DS.ff,
                  }}
                >
                  {h}
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                gap: GP,
                marginBottom: 3,
                paddingLeft: OW + GP,
              }}
            >
              {d1.map((_, i) => rCell("", "cb", i))}
            </div>
            <div
              style={{
                display: "flex",
                gap: GP,
                alignItems: "center",
                marginBottom: GP,
              }}
            >
              <div style={{ width: OW }} />
              {d1.map((c, i) => rCell(c, "n1", i))}
            </div>
            <div
              style={{
                display: "flex",
                gap: GP,
                alignItems: "center",
                marginBottom: GP,
              }}
            >
              <div
                style={{
                  width: OW,
                  height: CL,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  fontWeight: 800,
                  color: tabClr,
                  fontFamily: DS.ff,
                }}
              >
                {cp.operation === "+" ? "+" : "−"}
              </div>
              {d2.map((c, i) => rCell(c, "n2", i))}
            </div>
            <div
              style={{
                height: 3,
                background: activeTab === "add" ? DS.gPri : DS.gAcc,
                borderRadius: DS.rPill,
                margin: `6px 0 ${GP + 6}px ${OW + GP}px`,
                width: tL * (CL + GP) - GP,
              }}
            />
            <div style={{ display: "flex", gap: GP, alignItems: "center" }}>
              <div
                style={{
                  width: OW,
                  height: CL,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 700,
                  color: DS.gray500,
                  fontFamily: DS.ff,
                }}
              >
                =
              </div>
              {dA.map((c, i) => rCell(c, "ans", i))}
            </div>
          </div>
        </div>
      </div>

      {/* HINT */}
      <div style={{ padding: "0 24px 16px" }}>
        {!st.showHint ? (
          <button
            onClick={() => upS(cp.id, (pv) => ({ ...pv, showHint: true }))}
            onMouseEnter={() => setHovB("hint")}
            onMouseLeave={() => setHovB(null)}
            className="sg-b"
            style={{
              background: "transparent",
              border: `1.5px solid ${hovB === "hint" ? DS.primary : DS.gray300}`,
              borderRadius: DS.rPill,
              padding: "9px 20px",
              fontSize: 12,
              fontWeight: 600,
              color: hovB === "hint" ? DS.primary : DS.gray900,
              cursor: "pointer",
              fontFamily: DS.ff,
              transition: "all .25s",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            💡 Need a hint?
          </button>
        ) : (
          <div
            style={{
              background: DS.primaryLightest,
              border: `1.5px solid ${DS.primaryLight}`,
              borderRadius: DS.rMd,
              padding: "14px 18px",
              fontSize: 12,
              color: DS.gray900,
              lineHeight: 1.65,
              fontFamily: DS.ff,
              fontWeight: 500,
              animation: "fadeInUp .35s cubic-bezier(.16,1,.3,1)",
            }}
          >
            <strong style={{ color: DS.primary, fontWeight: 700 }}>
              💡 Strategy:{" "}
            </strong>
            {hintT(cp)}
          </div>
        )}
      </div>

      {/* NAV BUTTONS */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "14px 24px 24px",
          gap: 12,
        }}
      >
        <button
          onClick={() => setCpi(Math.max(0, cpi - 1))}
          disabled={isFirst}
          onMouseEnter={() => !isFirst && setHovB("prev")}
          onMouseLeave={() => setHovB(null)}
          className="sg-b"
          style={{
            flex: 1,
            height: 42,
            border: `1.5px solid ${isFirst ? DS.gray300 : hovB === "prev" ? DS.primary : DS.gray500}`,
            borderRadius: DS.rPill,
            background:
              hovB === "prev" && !isFirst ? DS.primaryLightest : DS.white,
            color: isFirst
              ? DS.gray500
              : hovB === "prev"
                ? DS.primary
                : DS.gray900,
            fontSize: 13,
            fontWeight: 600,
            cursor: isFirst ? "not-allowed" : "pointer",
            fontFamily: DS.ff,
            opacity: isFirst ? 0.5 : 1,
            transition: "all .25s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          ← Previous
        </button>
        <button
          onClick={() => upS(cp.id, () => initS())}
          onMouseEnter={() => setHovB("rst")}
          onMouseLeave={() => setHovB(null)}
          className="sg-b"
          style={{
            height: 42,
            border: "none",
            background: "transparent",
            color: hovB === "rst" ? DS.primary : DS.gray500,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: DS.ff,
            transition: "all .25s",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            gap: 6,
            textDecoration: hovB === "rst" ? "underline" : "none",
          }}
        >
          ↻ Reset
        </button>
        <button
          onClick={() => setCpi(Math.min(probs.length - 1, cpi + 1))}
          disabled={isLast}
          onMouseEnter={() => !isLast && setHovB("next")}
          onMouseLeave={() => setHovB(null)}
          className="sg-b"
          style={{
            flex: 1,
            height: 42,
            border: "none",
            borderRadius: DS.rPill,
            background: isLast
              ? DS.gray300
              : hovB === "next"
                ? DS.primary
                : DS.gPri,
            color: DS.white,
            fontSize: 13,
            fontWeight: 600,
            cursor: isLast ? "not-allowed" : "pointer",
            fontFamily: DS.ff,
            opacity: isLast ? 0.5 : 1,
            transition: "all .25s",
            boxShadow: isLast || hovB !== "next" ? "none" : DS.sPri,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default DecimalPracticeTool;
