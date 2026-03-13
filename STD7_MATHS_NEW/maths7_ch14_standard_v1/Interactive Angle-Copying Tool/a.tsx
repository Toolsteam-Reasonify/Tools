// @ts-nocheck
import React, { useState, useEffect } from "react";

const P = Math.PI / 180;
const ANG = 50;
const R = 100;

function pol(cx: number, cy: number, r: number, d: number) {
  return [cx + r * Math.cos(-d * P), cy + r * Math.sin(-d * P)] as const;
}

function arc(cx: number, cy: number, r: number, s: number, e: number) {
  const [sx, sy] = pol(cx, cy, r, s);
  const [ex, ey] = pol(cx, cy, r, e);
  return `M ${sx} ${sy} A ${r} ${r} 0 ${Math.abs(e - s) > 180 ? 1 : 0} 0 ${ex} ${ey}`;
}

const VX = 130,
  VY = 210,
  ARM = 170;
const [sCx, sCy] = pol(VX, VY, ARM, 0);
const [sBx, sBy] = pol(VX, VY, ARM, ANG);
const [sACx, sACy] = pol(VX, VY, R, 0);
const [sABx, sABy] = pol(VX, VY, R, ANG);
const [tZx, tZy] = pol(VX, VY, R, 0);
const [tZFx, tZFy] = pol(VX, VY, ARM, 0);
const [tYx, tYy] = pol(VX, VY, R, ANG);
const [tYFx, tYFy] = pol(VX, VY, ARM, ANG);
const CHL = 2 * R * Math.sin((ANG * P) / 2);

const STEPS = [
  {
    id: 1,
    t: "Observe the Source Angle",
    sl: "Source angle BAC = 50 degrees.",
    tl: "Target: ray from X.",
    ins: "Left: angle BAC = 50 degrees. Right: ray from X. Copy the angle without a protractor.",
  },
  {
    id: 2,
    t: "Draw Arc on Source",
    sl: "Arc from A cuts arms at B, C.",
    tl: "Ray from X ready.",
    ins: "Draw arc from A cutting both arms. AB = AC (same radius), so triangle ABC is isosceles.",
  },
  {
    id: 3,
    t: "Draw Arc on Target",
    sl: "Chord BC captures angle size.",
    tl: "Arc from X, same radius. Z on ray.",
    ins: "Same radius arc from X. Mark Z on ray. Now XZ = AB = AC.",
  },
  {
    id: 4,
    t: "Transfer the Chord",
    sl: "Source with arc and chord.",
    tl: "Transfer chord BC as YZ.",
    ins: "Set compass to chord BC. Place on Z, mark Y on arc. YZ = BC.",
  },
  {
    id: 5,
    t: "Complete!",
    sl: "SSS: triangle ABC = triangle XYZ",
    tl: "Angle YXZ = Angle BAC = 50 degrees!",
    ins: "Draw ray XY. SSS proves: AB=XZ, AC=XZ, BC=YZ. Angles are equal!",
  },
];

const PA = [30, 45, 60, 75, 110, 135];

function AngleCopyingTool() {
  const [mob, setMob] = useState(false);
  const [mode, setMode] = useState("learn");
  const [step, setStep] = useState(1);
  const [pa, setPa] = useState(60);
  const [sr, setSr] = useState(false);

  useEffect(() => {
    const fn = () => setMob(window.innerWidth < 640);
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const cur = STEPS.find((s) => s.id === step) || STEPS[0];
  const m = mob;
  const sz = m ? 30 : 36;

  const renderGrid = () => {
    const circles: React.ReactNode[] = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 10; j++) {
        circles.push(
          <circle
            key={"g" + i + "_" + j}
            cx={20 + j * 38}
            cy={20 + i * 36}
            r={1}
            fill="#EBEBEB"
          />,
        );
      }
    }
    return circles;
  };

  const renderTicks = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
    n: number,
  ) => {
    const mx = (x1 + x2) / 2,
      my = (y1 + y2) / 2;
    const dx = x2 - x1,
      dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return null;
    const nx = -dy / len,
      ny = dx / len;
    const lines: React.ReactNode[] = [];
    for (let i = 0; i < n; i++) {
      const off = (i - (n - 1) / 2) * 6;
      const cx = mx + (dx / len) * off;
      const cy = my + (dy / len) * off;
      lines.push(
        <line
          key={"tk" + i + x1 + y1}
          x1={cx + nx * 6}
          y1={cy + ny * 6}
          x2={cx - nx * 6}
          y2={cy - ny * 6}
          stroke={color}
          strokeWidth={2.2}
          strokeLinecap="round"
        />,
      );
    }
    return lines;
  };

  const renderSrc = () => {
    const sa = step >= 2,
      sc = step >= 3,
      s5 = step >= 5;
    return (
      <svg viewBox="0 0 380 280" width="100%" style={{ display: "block" }}>
        {renderGrid()}
        <line
          x1={VX}
          y1={VY}
          x2={sCx}
          y2={sCy}
          stroke="#4E4E4E"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <line
          x1={VX}
          y1={VY}
          x2={sBx}
          y2={sBy}
          stroke="#4E4E4E"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <path
          d={arc(VX, VY, 32, 0, ANG)}
          fill="none"
          stroke="#FC9145"
          strokeWidth={2.5}
        />
        <text
          x={VX + 48}
          y={VY - 16}
          fill="#FF7212"
          fontSize={13}
          fontFamily="'Poppins',sans-serif"
          fontWeight={700}
        >
          50°
        </text>
        {sa ? (
          <path
            d={arc(VX, VY, R, -8, ANG + 8)}
            fill="none"
            stroke="#4A4DC9"
            strokeWidth={2.2}
          />
        ) : null}
        {sc ? (
          <line
            x1={sACx}
            y1={sACy}
            x2={sABx}
            y2={sABy}
            stroke="#FF7212"
            strokeWidth={2.8}
            strokeDasharray="7 5"
          />
        ) : null}
        {s5 ? renderTicks(VX, VY, sABx, sABy, "#4A4DC9", 1) : null}
        {s5 ? renderTicks(VX, VY, sACx, sACy, "#4A4DC9", 1) : null}
        {s5 ? renderTicks(sACx, sACy, sABx, sABy, "#FF7212", 2) : null}
        <circle
          cx={VX}
          cy={VY}
          r={8}
          fill="none"
          stroke="#FF7212"
          strokeWidth={1.5}
          opacity={0.35}
        />
        <circle cx={VX} cy={VY} r={5} fill="#FF7212" />
        <text
          x={VX - 20}
          y={VY + 6}
          fill="#FF7212"
          fontSize={13}
          fontFamily="'Poppins',sans-serif"
          fontWeight={600}
        >
          A
        </text>
        <text
          x={sCx + 8}
          y={sCy + 8}
          fill="#4E4E4E"
          fontSize={13}
          fontFamily="'Poppins',sans-serif"
          fontWeight={600}
        >
          C
        </text>
        <text
          x={sBx - 6}
          y={sBy - 14}
          fill="#4E4E4E"
          fontSize={13}
          fontFamily="'Poppins',sans-serif"
          fontWeight={600}
        >
          B
        </text>
        {sa ? <circle cx={sACx} cy={sACy} r={3.5} fill="#4A4DC9" /> : null}
        {sa ? <circle cx={sABx} cy={sABy} r={3.5} fill="#4A4DC9" /> : null}
        {sc ? (
          <text
            x={(sACx + sABx) / 2 + 10}
            y={(sACy + sABy) / 2 - 8}
            fill="#FF7212"
            fontSize={11}
            fontFamily="'Poppins',sans-serif"
            fontWeight={600}
          >
            chord BC
          </text>
        ) : null}
      </svg>
    );
  };

  const renderTgt = () => {
    const sa = step >= 3,
      sc = step >= 4,
      r2 = step >= 5,
      s5 = step >= 5;
    return (
      <svg viewBox="0 0 380 280" width="100%" style={{ display: "block" }}>
        {renderGrid()}
        <line
          x1={VX}
          y1={VY}
          x2={tZFx}
          y2={tZFy}
          stroke="#4E4E4E"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        {sa ? (
          <path
            d={arc(VX, VY, R, -8, ANG + 18)}
            fill="none"
            stroke="#4A4DC9"
            strokeWidth={2.2}
          />
        ) : null}
        {sc ? (
          <path
            d={arc(tZx, tZy, CHL, ANG - 18, ANG + 35)}
            fill="none"
            stroke="#533086"
            strokeWidth={1.5}
            strokeDasharray="7 5"
          />
        ) : null}
        {sc ? (
          <line
            x1={tZx}
            y1={tZy}
            x2={tYx}
            y2={tYy}
            stroke="#FF7212"
            strokeWidth={2.8}
            strokeDasharray="7 5"
          />
        ) : null}
        {r2 ? (
          <line
            x1={VX}
            y1={VY}
            x2={tYFx}
            y2={tYFy}
            stroke="#4E4E4E"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        ) : null}
        {s5 ? (
          <path
            d={arc(VX, VY, 32, 0, ANG)}
            fill="none"
            stroke="#FC9145"
            strokeWidth={2.5}
          />
        ) : null}
        {s5 ? (
          <text
            x={VX + 48}
            y={VY - 16}
            fill="#FF7212"
            fontSize={13}
            fontFamily="'Poppins',sans-serif"
            fontWeight={700}
          >
            50°
          </text>
        ) : null}
        {s5 ? renderTicks(VX, VY, tYx, tYy, "#4A4DC9", 1) : null}
        {s5 ? renderTicks(VX, VY, tZx, tZy, "#4A4DC9", 1) : null}
        {s5 ? renderTicks(tZx, tZy, tYx, tYy, "#FF7212", 2) : null}
        <circle
          cx={VX}
          cy={VY}
          r={8}
          fill="none"
          stroke="#4A4DC9"
          strokeWidth={1.5}
          opacity={0.35}
        />
        <circle cx={VX} cy={VY} r={5} fill="#4A4DC9" />
        <text
          x={VX - 20}
          y={VY + 6}
          fill="#4A4DC9"
          fontSize={13}
          fontFamily="'Poppins',sans-serif"
          fontWeight={600}
        >
          X
        </text>
        {sa ? <circle cx={tZx} cy={tZy} r={3.5} fill="#4A4DC9" /> : null}
        {sa ? (
          <text
            x={tZx + 6}
            y={tZy + 16}
            fill="#4A4DC9"
            fontSize={13}
            fontFamily="'Poppins',sans-serif"
            fontWeight={600}
          >
            Z
          </text>
        ) : null}
        {sc ? <circle cx={tYx} cy={tYy} r={3.5} fill="#533086" /> : null}
        {sc ? (
          <text
            x={tYx - 6}
            y={tYy - 14}
            fill="#533086"
            fontSize={13}
            fontFamily="'Poppins',sans-serif"
            fontWeight={600}
          >
            Y
          </text>
        ) : null}
        {sc ? (
          <text
            x={(tZx + tYx) / 2 + 10}
            y={(tZy + tYy) / 2 - 8}
            fill="#FF7212"
            fontSize={11}
            fontFamily="'Poppins',sans-serif"
            fontWeight={600}
          >
            YZ = BC
          </text>
        ) : null}
      </svg>
    );
  };

  const renderPracSrc = (angle: number) => {
    const vx = 130,
      vy = 210,
      am = 160,
      r = 90;
    const [pcx, pcy] = pol(vx, vy, am, 0);
    const [pbx, pby] = pol(vx, vy, am, angle);
    const [acx, acy] = pol(vx, vy, r, 0);
    const [abx, aby] = pol(vx, vy, r, angle);
    return (
      <svg viewBox="0 0 380 280" width="100%" style={{ display: "block" }}>
        {renderGrid()}
        <line
          x1={vx}
          y1={vy}
          x2={pcx}
          y2={pcy}
          stroke="#4E4E4E"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <line
          x1={vx}
          y1={vy}
          x2={pbx}
          y2={pby}
          stroke="#4E4E4E"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <path
          d={arc(vx, vy, r, -8, angle + 8)}
          fill="none"
          stroke="#4A4DC9"
          strokeWidth={2.2}
        />
        <line
          x1={acx}
          y1={acy}
          x2={abx}
          y2={aby}
          stroke="#FF7212"
          strokeWidth={2.5}
          strokeDasharray="7 5"
        />
        <path
          d={arc(vx, vy, 30, 0, angle)}
          fill="none"
          stroke="#FC9145"
          strokeWidth={2.5}
        />
        <text
          x={vx + 44}
          y={vy - 14}
          fill="#FF7212"
          fontSize={13}
          fontFamily="'Poppins',sans-serif"
          fontWeight={700}
        >
          {angle}°
        </text>
        <circle
          cx={vx}
          cy={vy}
          r={8}
          fill="none"
          stroke="#FF7212"
          strokeWidth={1.5}
          opacity={0.35}
        />
        <circle cx={vx} cy={vy} r={5} fill="#FF7212" />
        <text
          x={vx - 20}
          y={vy + 6}
          fill="#FF7212"
          fontSize={13}
          fontFamily="'Poppins',sans-serif"
          fontWeight={600}
        >
          A
        </text>
        <circle cx={acx} cy={acy} r={3} fill="#4A4DC9" />
        <circle cx={abx} cy={aby} r={3} fill="#4A4DC9" />
        <text
          x={acx + 6}
          y={acy + 14}
          fill="#4E4E4E"
          fontSize={13}
          fontFamily="'Poppins',sans-serif"
          fontWeight={600}
        >
          C
        </text>
        <text
          x={abx - 6}
          y={aby - 12}
          fill="#4E4E4E"
          fontSize={13}
          fontFamily="'Poppins',sans-serif"
          fontWeight={600}
        >
          B
        </text>
      </svg>
    );
  };

  const renderPracTgt = (angle: number, show: boolean) => {
    const vx = 130,
      vy = 210,
      am = 160,
      r = 90;
    const [zfx, zfy] = pol(vx, vy, am, 0);
    const [zx, zy] = pol(vx, vy, r, 0);
    const [yx, yy] = pol(vx, vy, r, angle);
    const [yfx, yfy] = pol(vx, vy, am, angle);
    return (
      <svg viewBox="0 0 380 280" width="100%" style={{ display: "block" }}>
        {renderGrid()}
        <line
          x1={vx}
          y1={vy}
          x2={zfx}
          y2={zfy}
          stroke="#4E4E4E"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <path
          d={arc(vx, vy, r, -8, angle + 18)}
          fill="none"
          stroke="#4A4DC9"
          strokeWidth={2.2}
        />
        <circle cx={zx} cy={zy} r={3} fill="#4A4DC9" />
        <text
          x={zx + 6}
          y={zy + 14}
          fill="#4A4DC9"
          fontSize={13}
          fontFamily="'Poppins',sans-serif"
          fontWeight={600}
        >
          Z
        </text>
        <circle
          cx={vx}
          cy={vy}
          r={8}
          fill="none"
          stroke="#4A4DC9"
          strokeWidth={1.5}
          opacity={0.35}
        />
        <circle cx={vx} cy={vy} r={5} fill="#4A4DC9" />
        <text
          x={vx - 20}
          y={vy + 6}
          fill="#4A4DC9"
          fontSize={13}
          fontFamily="'Poppins',sans-serif"
          fontWeight={600}
        >
          X
        </text>
        {show ? (
          <line
            x1={zx}
            y1={zy}
            x2={yx}
            y2={yy}
            stroke="#FF7212"
            strokeWidth={2.5}
            strokeDasharray="7 5"
          />
        ) : null}
        {show ? <circle cx={yx} cy={yy} r={3} fill="#533086" /> : null}
        {show ? (
          <text
            x={yx - 6}
            y={yy - 12}
            fill="#533086"
            fontSize={13}
            fontFamily="'Poppins',sans-serif"
            fontWeight={600}
          >
            Y
          </text>
        ) : null}
        {show ? (
          <line
            x1={vx}
            y1={vy}
            x2={yfx}
            y2={yfy}
            stroke="#4E4E4E"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        ) : null}
        {show ? (
          <path
            d={arc(vx, vy, 30, 0, angle)}
            fill="none"
            stroke="#FC9145"
            strokeWidth={2.5}
          />
        ) : null}
        {show ? (
          <text
            x={vx + 44}
            y={vy - 14}
            fill="#FF7212"
            fontSize={13}
            fontFamily="'Poppins',sans-serif"
            fontWeight={700}
          >
            {angle}°
          </text>
        ) : null}
      </svg>
    );
  };

  const badges: Array<{
    l: string;
    v: string;
    bg: string;
    c: string;
    b: string;
  }> = [];
  if (step >= 1)
    badges.push({
      l: "Source",
      v: "50°",
      bg: "#EEEEF8",
      c: "#4A4DC9",
      b: "#C1C1EA",
    });
  if (step >= 3)
    badges.push({
      l: "Chord",
      v: CHL.toFixed(1),
      bg: "#FFF3E4",
      c: "#FF7212",
      b: "#FFD4AC",
    });
  if (step >= 5)
    badges.push({
      l: "Target",
      v: "50° ✓",
      bg: "#E8FAF0",
      c: "#2ECC71",
      b: "#A3E4C1",
    });

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#F5F5F5 0%,#FFFFFF 40%,#F5F5F5 100%)",
        fontFamily: "'Poppins',sans-serif",
        color: "#4E4E4E",
        padding: m ? "16px 10px" : "24px 16px",
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}@keyframes pulseRing{0%,100%{box-shadow:0 0 0 0 rgba(74,77,201,.25)}50%{box-shadow:0 0 0 10px rgba(74,77,201,0)}}*{box-sizing:border-box}.act-panels{display:flex;gap:16px;width:100%;justify-content:center;flex-wrap:wrap}.act-card{flex:1 1 370px;max-width:410px;min-width:0}@media(max-width:639px){.act-panels{flex-direction:column;align-items:stretch;gap:10px}.act-card{flex:1 1 auto;max-width:100%}}`}</style>

      {/* Header */}
      <div
        style={{
          textAlign: "center" as const,
          marginBottom: m ? 14 : 20,
          maxWidth: 640,
          width: "100%",
          padding: "0 4px",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "linear-gradient(135deg,#4A4DC9,#533086)",
            color: "#FFFFFF",
            fontSize: m ? 9 : 10.5,
            fontWeight: 700,
            textTransform: "uppercase" as const,
            letterSpacing: m ? 1 : 1.5,
            padding: m ? "3px 10px" : "4px 14px",
            borderRadius: 40,
            marginBottom: m ? 6 : 10,
          }}
        >
          Geometric Construction
        </div>
        <h1
          style={{
            fontSize: m ? 19 : 26,
            fontWeight: 800,
            lineHeight: 1.2,
            color: "#1A1A2E",
            margin: "0 0 6px",
          }}
        >
          Interactive <span style={{ color: "#4A4DC9" }}>Angle-Copying</span>{" "}
          Tool
        </h1>
        <p
          style={{
            fontSize: m ? 12 : 13.5,
            color: "#7A7A8A",
            lineHeight: 1.5,
            maxWidth: 480,
            margin: "0 auto",
          }}
        >
          Copy an angle using only compass and straightedge, verified by SSS
          congruence
        </p>
      </div>

      {/* Mode Toggle */}
      <div
        style={{
          display: "flex",
          background: "#EBEBEB",
          borderRadius: 40,
          padding: 3,
          marginBottom: m ? 14 : 20,
        }}
      >
        <button
          onClick={() => {
            setMode("learn");
            setStep(1);
            setSr(false);
          }}
          style={{
            padding: m ? "6px 18px" : "8px 28px",
            borderRadius: 40,
            border: "none",
            background: mode === "learn" ? "#FFFFFF" : "transparent",
            color: mode === "learn" ? "#4A4DC9" : "#7A7A8A",
            fontWeight: mode === "learn" ? 700 : 500,
            fontSize: m ? 12 : 13.5,
            cursor: "pointer",
            fontFamily: "'Poppins',sans-serif",
          }}
        >
          Learn
        </button>
        <button
          onClick={() => {
            setMode("practice");
            setStep(1);
            setSr(false);
          }}
          style={{
            padding: m ? "6px 18px" : "8px 28px",
            borderRadius: 40,
            border: "none",
            background: mode === "practice" ? "#FFFFFF" : "transparent",
            color: mode === "practice" ? "#4A4DC9" : "#7A7A8A",
            fontWeight: mode === "practice" ? 700 : 500,
            fontSize: m ? 12 : 13.5,
            cursor: "pointer",
            fontFamily: "'Poppins',sans-serif",
          }}
        >
          Practice
        </button>
      </div>

      {/* LEARN */}
      {mode === "learn" ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            width: "100%",
            maxWidth: 860,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              maxWidth: m ? 320 : 540,
              marginBottom: m ? 10 : 16,
            }}
          >
            {STEPS.map((s, i) => {
              const ac = s.id === step,
                dn = s.id < step;
              return (
                <div
                  key={s.id}
                  style={{ display: "flex", alignItems: "center", flex: 1 }}
                >
                  <button
                    onClick={() => setStep(s.id)}
                    style={{
                      width: sz,
                      height: sz,
                      borderRadius: "50%",
                      border: ac
                        ? "2.5px solid #4A4DC9"
                        : dn
                          ? "none"
                          : "2px solid #CACACA",
                      background: ac
                        ? "linear-gradient(135deg,#4A4DC9,#533086)"
                        : dn
                          ? "#2ECC71"
                          : "#EBEBEB",
                      color: ac || dn ? "#FFFFFF" : "#9E9E9E",
                      fontWeight: 700,
                      fontSize: m ? 12 : 14,
                      cursor: "pointer",
                      fontFamily: "'Poppins',sans-serif",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: ac ? "0 0 0 4px #C1C1EA" : "none",
                      flexShrink: 0,
                    }}
                  >
                    {dn ? "✓" : s.id}
                  </button>
                  {i < STEPS.length - 1 ? (
                    <div
                      style={{
                        flex: 1,
                        height: 2,
                        margin: "0 2px",
                        borderRadius: 2,
                        background: dn ? "#2ECC71" : "#EBEBEB",
                      }}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
          <div
            key={"i" + step}
            style={{
              textAlign: "center" as const,
              marginBottom: m ? 10 : 14,
              maxWidth: 640,
              width: "100%",
              padding: "0 8px",
              animation: "slideUp .35s ease",
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg,#4A4DC9,#533086)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: m ? 13.5 : 16,
                fontWeight: 700,
                marginBottom: 4,
              }}
            >
              {"Step " + step + ": " + cur.t}
            </div>
            <div
              style={{
                fontSize: m ? 11.5 : 13,
                color: "#7A7A8A",
                lineHeight: 1.6,
              }}
            >
              {cur.ins}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: m ? 6 : 10,
              flexWrap: "wrap" as const,
              justifyContent: "center",
              marginBottom: m ? 10 : 14,
            }}
          >
            {badges.map((it, i) => (
              <div
                key={i}
                style={{
                  background: it.bg,
                  border: "1.5px solid " + it.b,
                  borderRadius: 40,
                  padding: m ? "4px 10px" : "5px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: m ? 5 : 8,
                }}
              >
                <span
                  style={{
                    fontSize: m ? 9.5 : 11,
                    color: "#7A7A8A",
                    fontWeight: 500,
                    textTransform: "uppercase" as const,
                    letterSpacing: 0.5,
                  }}
                >
                  {it.l}
                </span>
                <span
                  style={{
                    fontSize: m ? 12 : 14,
                    color: it.c,
                    fontWeight: 700,
                  }}
                >
                  {it.v}
                </span>
              </div>
            ))}
          </div>
          <div className="act-panels">
            <div
              className="act-card"
              style={{
                background: "#FFFFFF",
                border: "1.5px solid #EBEBEB",
                borderRadius: m ? 12 : 16,
                overflow: "hidden" as const,
                boxShadow: "0 4px 12px rgba(74,77,201,.1)",
                width: "100%",
              }}
            >
              <div
                style={{
                  padding: m ? "8px 12px" : "10px 16px",
                  borderBottom: "1.5px solid #EBEBEB",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "linear-gradient(90deg,#F5F5F5,#FFFFFF)",
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#FF7212",
                    boxShadow: "0 0 0 3px rgba(255,114,18,.2)",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: m ? 11 : 12.5,
                    fontWeight: 600,
                    color: "#FF7212",
                    letterSpacing: 0.3,
                    textTransform: "uppercase" as const,
                  }}
                >
                  Source Angle
                </span>
              </div>
              <div style={{ padding: m ? "2px 4px 4px" : "4px 8px 8px" }}>
                {renderSrc()}
              </div>
              <div
                style={{
                  padding: m ? "6px 12px 8px" : "8px 16px 12px",
                  borderTop: "1px solid #EBEBEB",
                  fontSize: m ? 11 : 12,
                  color: "#7A7A8A",
                  lineHeight: 1.55,
                  background: "#F5F5F5",
                }}
              >
                {cur.sl}
              </div>
            </div>
            <div
              className="act-card"
              style={{
                background: "#FFFFFF",
                border: "1.5px solid #EBEBEB",
                borderRadius: m ? 12 : 16,
                overflow: "hidden" as const,
                boxShadow: "0 4px 12px rgba(74,77,201,.1)",
                width: "100%",
              }}
            >
              <div
                style={{
                  padding: m ? "8px 12px" : "10px 16px",
                  borderBottom: "1.5px solid #EBEBEB",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "linear-gradient(90deg,#F5F5F5,#FFFFFF)",
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#4A4DC9",
                    boxShadow: "0 0 0 3px rgba(74,77,201,.2)",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: m ? 11 : 12.5,
                    fontWeight: 600,
                    color: "#4A4DC9",
                    letterSpacing: 0.3,
                    textTransform: "uppercase" as const,
                  }}
                >
                  Target Workspace
                </span>
              </div>
              <div style={{ padding: m ? "2px 4px 4px" : "4px 8px 8px" }}>
                {renderTgt()}
              </div>
              <div
                style={{
                  padding: m ? "6px 12px 8px" : "8px 16px 12px",
                  borderTop: "1px solid #EBEBEB",
                  fontSize: m ? 11 : 12,
                  color: "#7A7A8A",
                  lineHeight: 1.55,
                  background: "#F5F5F5",
                }}
              >
                {cur.tl}
              </div>
            </div>
          </div>
          {step === 5 ? (
            <div
              style={{
                background: "linear-gradient(135deg,#EEEEF8,#FFFFFF)",
                border: "2px solid #C1C1EA",
                borderRadius: 12,
                padding: m ? "12px 14px" : "16px 20px",
                marginTop: m ? 12 : 16,
                width: "100%",
                maxWidth: 700,
                boxShadow: "0 4px 12px rgba(74,77,201,.1)",
                animation: "slideUp .45s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: m ? 8 : 12,
                }}
              >
                <div
                  style={{
                    width: m ? 24 : 28,
                    height: m ? 24 : 28,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#4A4DC9,#533086)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    fontSize: m ? 12 : 14,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  ✓
                </div>
                <span
                  style={{
                    fontSize: m ? 12.5 : 14,
                    fontWeight: 700,
                    color: "#4A4DC9",
                  }}
                >
                  SSS Congruence Proof
                </span>
              </div>
              <div
                style={{
                  fontSize: m ? 12 : 13.5,
                  lineHeight: 1.8,
                  color: "#4E4E4E",
                }}
              >
                <div>
                  <span style={{ fontWeight: 700, color: "#4A4DC9" }}>
                    AB = XZ
                  </span>{" "}
                  <span style={{ color: "#9E9E9E" }}>(same arc radius)</span>
                </div>
                <div>
                  <span style={{ fontWeight: 700, color: "#4A4DC9" }}>
                    AC = XZ
                  </span>{" "}
                  <span style={{ color: "#9E9E9E" }}>(same arc radius)</span>
                </div>
                <div>
                  <span style={{ fontWeight: 700, color: "#FF7212" }}>BC</span>{" "}
                  ={" "}
                  <span style={{ fontWeight: 700, color: "#533086" }}>YZ</span>{" "}
                  <span style={{ color: "#9E9E9E" }}>(transferred chord)</span>
                </div>
              </div>
              <div
                style={{
                  borderTop: "2px solid #C1C1EA",
                  marginTop: 8,
                  paddingTop: 8,
                  fontSize: m ? 12 : 14,
                  fontWeight: 700,
                  color: "#4A4DC9",
                  textAlign: "center" as const,
                }}
              >
                Therefore Angle BAC = Angle YXZ = 50 degrees
              </div>
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              gap: m ? 8 : 14,
              marginTop: m ? 14 : 20,
              alignItems: "center",
              flexWrap: "wrap" as const,
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => {
                if (step > 1) setStep(step - 1);
              }}
              disabled={step === 1}
              style={{
                padding: m ? "8px 18px" : "10px 28px",
                borderRadius: 40,
                border: "2px solid " + (step === 1 ? "#EBEBEB" : "#4A4DC9"),
                background: "transparent",
                color: step === 1 ? "#CACACA" : "#4A4DC9",
                fontWeight: 600,
                fontSize: m ? 12 : 13.5,
                cursor: step === 1 ? "default" : "pointer",
                fontFamily: "'Poppins',sans-serif",
              }}
            >
              {m ? "Prev" : "Previous"}
            </button>
            <div
              style={{
                width: m ? 34 : 40,
                height: m ? 34 : 40,
                borderRadius: "50%",
                background: "#F5F5F5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: m ? 11 : 13,
                fontWeight: 700,
                color: "#7A7A8A",
              }}
            >
              {step + "/5"}
            </div>
            <button
              onClick={() => {
                if (step < 5) setStep(step + 1);
              }}
              disabled={step === 5}
              style={{
                padding: m ? "8px 18px" : "10px 28px",
                borderRadius: 40,
                border: "none",
                background:
                  step === 5
                    ? "#EBEBEB"
                    : "linear-gradient(135deg,#4A4DC9,#533086)",
                color: step === 5 ? "#9E9E9E" : "#FFFFFF",
                fontWeight: 700,
                fontSize: m ? 12 : 13.5,
                cursor: step === 5 ? "default" : "pointer",
                fontFamily: "'Poppins',sans-serif",
                boxShadow: step < 5 ? "0 4px 14px rgba(74,77,201,.27)" : "none",
                animation: step < 5 ? "pulseRing 2s infinite" : "none",
              }}
            >
              {m ? "Next" : "Next Step"}
            </button>
          </div>
          <div
            style={{
              marginTop: m ? 14 : 20,
              padding: m ? "10px 14px" : "14px 20px",
              background: "#FFF3E4",
              border: "1.5px solid #FFD4AC",
              borderRadius: 12,
              width: "100%",
              maxWidth: 700,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: m ? 4 : 6,
              }}
            >
              <span style={{ fontSize: m ? 14 : 16 }}>💡</span>
              <span
                style={{
                  fontSize: m ? 10.5 : 12,
                  fontWeight: 700,
                  color: "#FF7212",
                  textTransform: "uppercase" as const,
                  letterSpacing: 0.8,
                }}
              >
                Teaching Note
              </span>
            </div>
            <div
              style={{
                fontSize: m ? 11 : 12.5,
                color: "#4E4E4E",
                lineHeight: 1.65,
              }}
            >
              The chord BC is the critical measurement. It encodes the angle
              size within the fixed-radius arc. We never measure in degrees. We
              transfer the triangle that defines it.
            </div>
          </div>
        </div>
      ) : null}

      {/* PRACTICE */}
      {mode === "practice" ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            width: "100%",
            maxWidth: 860,
          }}
        >
          <div
            style={{
              textAlign: "center" as const,
              marginBottom: m ? 12 : 16,
              width: "100%",
              padding: "0 8px",
            }}
          >
            <div
              style={{
                fontSize: m ? 14 : 16,
                fontWeight: 700,
                color: "#4A4DC9",
                marginBottom: 6,
              }}
            >
              Practice Mode
            </div>
            <div
              style={{
                fontSize: m ? 11.5 : 13,
                color: "#7A7A8A",
                lineHeight: 1.55,
              }}
            >
              Select an angle. Study the source, then reveal the target.
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: m ? 6 : 8,
              flexWrap: "wrap" as const,
              justifyContent: "center",
              marginBottom: m ? 12 : 18,
            }}
          >
            {PA.map((a) => (
              <button
                key={a}
                onClick={() => {
                  setPa(a);
                  setSr(false);
                }}
                style={{
                  padding: m ? "6px 14px" : "8px 20px",
                  borderRadius: 40,
                  border: "2px solid " + (pa === a ? "#4A4DC9" : "#EBEBEB"),
                  background: pa === a ? "#4A4DC9" : "#FFFFFF",
                  color: pa === a ? "#FFFFFF" : "#7A7A8A",
                  fontWeight: 600,
                  fontSize: m ? 12.5 : 14,
                  cursor: "pointer",
                  fontFamily: "'Poppins',sans-serif",
                }}
              >
                {a + "°"}
              </button>
            ))}
          </div>
          <div className="act-panels">
            <div
              className="act-card"
              style={{
                background: "#FFFFFF",
                border: "1.5px solid #EBEBEB",
                borderRadius: m ? 12 : 16,
                overflow: "hidden" as const,
                boxShadow: "0 4px 12px rgba(74,77,201,.1)",
                width: "100%",
              }}
            >
              <div
                style={{
                  padding: m ? "8px 12px" : "10px 16px",
                  borderBottom: "1.5px solid #EBEBEB",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "linear-gradient(90deg,#F5F5F5,#FFFFFF)",
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#FF7212",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: m ? 11 : 12.5,
                    fontWeight: 600,
                    color: "#FF7212",
                    textTransform: "uppercase" as const,
                  }}
                >
                  {"Source — " + pa + "°"}
                </span>
              </div>
              <div style={{ padding: m ? "2px 4px 4px" : "4px 8px 8px" }}>
                {renderPracSrc(pa)}
              </div>
              <div
                style={{
                  padding: m ? "6px 12px 8px" : "8px 16px 12px",
                  borderTop: "1px solid #EBEBEB",
                  fontSize: m ? 11 : 12,
                  color: "#7A7A8A",
                  lineHeight: 1.55,
                  background: "#F5F5F5",
                }}
              >
                Study the arc, chord, and angle.
              </div>
            </div>
            <div
              className="act-card"
              style={{
                background: "#FFFFFF",
                border: "1.5px solid #EBEBEB",
                borderRadius: m ? 12 : 16,
                overflow: "hidden" as const,
                boxShadow: "0 4px 12px rgba(74,77,201,.1)",
                width: "100%",
              }}
            >
              <div
                style={{
                  padding: m ? "8px 12px" : "10px 16px",
                  borderBottom: "1.5px solid #EBEBEB",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "linear-gradient(90deg,#F5F5F5,#FFFFFF)",
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#4A4DC9",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: m ? 11 : 12.5,
                    fontWeight: 600,
                    color: "#4A4DC9",
                    textTransform: "uppercase" as const,
                  }}
                >
                  Target Workspace
                </span>
              </div>
              <div style={{ padding: m ? "2px 4px 4px" : "4px 8px 8px" }}>
                {renderPracTgt(pa, sr)}
              </div>
              <div
                style={{
                  padding: m ? "6px 12px 8px" : "8px 16px 12px",
                  borderTop: "1px solid #EBEBEB",
                  fontSize: m ? 11 : 12,
                  color: "#7A7A8A",
                  lineHeight: 1.55,
                  background: "#F5F5F5",
                }}
              >
                {sr
                  ? "Construction revealed!"
                  : "Visualise the construction first."}
              </div>
            </div>
          </div>
          <button
            onClick={() => setSr(!sr)}
            style={{
              marginTop: m ? 14 : 20,
              padding: m ? "10px 28px" : "12px 36px",
              borderRadius: 40,
              border: "none",
              background: sr
                ? "linear-gradient(135deg,#2ECC71,#27AE60)"
                : "linear-gradient(135deg,#4A4DC9,#533086)",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: m ? 13 : 14.5,
              cursor: "pointer",
              fontFamily: "'Poppins',sans-serif",
              boxShadow: "0 4px 16px rgba(74,77,201,.27)",
            }}
          >
            {sr ? "✓ Revealed" : "Reveal Construction"}
          </button>
          {sr ? (
            <div
              style={{
                marginTop: m ? 12 : 16,
                padding: m ? "10px 14px" : "14px 20px",
                background: "linear-gradient(135deg,#EEEEF8,#FFFFFF)",
                border: "1.5px solid #C1C1EA",
                borderRadius: 12,
                width: "100%",
                maxWidth: 700,
                animation: "slideUp .4s ease",
              }}
            >
              <div
                style={{
                  fontSize: m ? 12 : 13.5,
                  color: "#4E4E4E",
                  lineHeight: 1.7,
                }}
              >
                <span style={{ fontWeight: 700, color: "#4A4DC9" }}>
                  SSS Congruence:{" "}
                </span>
                {"AB=XZ, AC=XZ, BC=YZ. Therefore Angle A = Angle X = " +
                  pa +
                  " degrees."}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <div
        style={{
          marginTop: m ? 18 : 28,
          fontSize: m ? 10 : 11.5,
          color: "#9E9E9E",
          textAlign: "center" as const,
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexWrap: "wrap" as const,
          justifyContent: "center",
          padding: "0 8px",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 20,
            height: 3,
            background: "linear-gradient(90deg,#4A4DC9,#FF7212)",
            borderRadius: 2,
          }}
        />
        {"Ganita Prakash | Grade 7 | Constructions and Tilings"}
        <span
          style={{
            display: "inline-block",
            width: 20,
            height: 3,
            background: "linear-gradient(90deg,#FF7212,#4A4DC9)",
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  );
}

export { AngleCopyingTool };
export default AngleCopyingTool;
