// ═══════════════════════════════════════════════════════════════════════════
// File: decimal_number_line_tool.tsx
// NCERT-style Decimal Number Line Tool — Full TypeScript
// ═══════════════════════════════════════════════════════════════════════════

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Target,
  Star,
  Award,
} from "lucide-react";

// ==================== TYPE DEFINITIONS ====================

type ModeType = "learn" | "practice" | "real_world";
type HighlightStyleType = "circle" | "oval" | "arrow";
type StepType = "intro" | "explanation" | "practice" | "real_world";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

interface LetterMarker {
  letter: string;
  position: number;
}

interface CustomAnnotation {
  position: number;
  label: string;
  color: string;
}

interface ZeroDemoMarker {
  val: number;
  label: string;
  color: string;
}

interface ScaleConfig {
  rangeMin: number;
  rangeMax: number;
  majorDivisions: number;
  subDivisionsPerMajor?: number;
  showSubTicks?: boolean;
  highlight?: number | null;
  highlightLabel?: string | null;
  highlightStyle?: HighlightStyleType;
  compareNumbers?: number[] | null;
  letterMarkers?: LetterMarker[] | null;
  zeroDemo?: boolean;
  highlightAll?: boolean;
  zoomDemo?: boolean;
  showMagnifier?: boolean;
  magnifierFrom?: number | null;
  magnifierTo?: number | null;
  customAnnotations?: CustomAnnotation[] | null;
  bracketRange?: [number, number] | null;
  bracketLabel?: string | null;
}

interface MCQData {
  question: string;
  mcq: boolean;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface LearnData {
  highlight?: number;
  range?: [number, number];
  showDivisions?: number;
  highlightAll?: boolean;
  zoomDemo?: boolean;
  compare?: number[];
  zeroDemo?: boolean;
  letterMarkers?: LetterMarker[];
}

interface RulerData {
  context: "ruler";
  value: number;
}

interface MedicineData {
  context: "medicine";
  values: number[];
}

interface MoneyData {
  context: "money";
  value: number;
}

interface SportsData {
  context: "sports";
  values: number[];
}

type RealWorldData = RulerData | MedicineData | MoneyData | SportsData;

interface StepDataInterface {
  id: number | string;
  title: string;
  description: string;
  type: StepType;
  mode: ModeType;
  data?: LearnData | MCQData | RealWorldData;
  scale?: ScaleConfig;
}

interface ModeTheme {
  from: string;
  to: string;
  light: string;
  icon: React.FC<IconProps>;
  label: string;
}

interface NCERTNumberLineProps {
  rangeMin?: number;
  rangeMax?: number;
  majorDivisions?: number;
  subDivisionsPerMajor?: number;
  showSubTicks?: boolean;
  highlight?: number | null;
  highlightLabel?: string | null;
  highlightStyle?: HighlightStyleType;
  compareNumbers?: number[] | null;
  letterMarkers?: LetterMarker[] | null;
  zeroDemo?: boolean;
  highlightAll?: boolean;
  zoomDemo?: boolean;
  showMagnifier?: boolean;
  magnifierFrom?: number | null;
  magnifierTo?: number | null;
  customAnnotations?: CustomAnnotation[] | null;
  bracketRange?: [number, number] | null;
  bracketLabel?: string | null;
  animDelay?: number;
  width?: number;
}

// ==================== LOCAL SVG ICONS ====================

const BookOpen: React.FC<IconProps> = ({ size = 24, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...rest}
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const Globe: React.FC<IconProps> = ({ size = 24, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...rest}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    <path d="M2 12h20" />
  </svg>
);

// ==================== DESIGN TOKENS ====================

const DS = {
  primary: "#4A4DC9",
  accent: "#FF7212",
  gradientFrom: "#533086",
  gradientTo: "#FC9145",
  primaryLight: "#C1C1EA",
  accentLight: "#FFF3E4",
  gray900: "#4E4E4E",
  gray400: "#CACACA",
  gray200: "#EBEBEB",
  gray100: "#F5F5F5",
  white: "#FFFFFF",
  success: "#2ECC71",
  error: "#E74C3C",
  fontFamily:
    "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  radiusPill: "999px",
  radiusLg: "20px",
  radiusMd: "16px",
  radiusSm: "12px",
  radiusXs: "8px",
  shadowMd: "0 8px 24px rgba(74, 77, 201, 0.12)",
  shadowXl: "0 24px 64px rgba(83, 48, 134, 0.20)",
} as const;

// ══════════════════════════════════════════════════════════════
// NCERT-STYLE SVG NUMBER LINE COMPONENT
// ══════════════════════════════════════════════════════════════

const NCERTNumberLine: React.FC<NCERTNumberLineProps> = ({
  rangeMin = 0,
  rangeMax = 10,
  majorDivisions = 10,
  subDivisionsPerMajor = 10,
  showSubTicks = true,
  highlight = null,
  highlightLabel = null,
  highlightStyle = "circle",
  compareNumbers = null,
  letterMarkers = null,
  zeroDemo = false,
  highlightAll = false,
  zoomDemo = false,
  showMagnifier = false,
  magnifierFrom = null,
  magnifierTo = null,
  customAnnotations = null,
  bracketRange = null,
  bracketLabel = null,
  animDelay = 0,
  width = 700,
}) => {
  const [animProgress, setAnimProgress] = useState<number>(0);
  const idSuffix = useMemo(() => Math.random().toString(36).slice(2, 8), []);

  useEffect(() => {
    setAnimProgress(0);
    let start: number | null = null;
    let raf: number | undefined;
    const dur = 1200;
    const tick = (ts: number): void => {
      if (!start) start = ts;
      const p: number = Math.min((ts - start) / dur, 1);
      setAnimProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    const timeout: ReturnType<typeof setTimeout> = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, animDelay);
    return () => {
      clearTimeout(timeout);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [rangeMin, rangeMax, majorDivisions, highlight, animDelay]);

  const pad = 50;
  const svgW: number = width;
  const lineY = 80;
  const svgH: number = zeroDemo
    ? 180
    : showMagnifier
      ? 250
      : highlight !== null || letterMarkers || compareNumbers
        ? 160
        : bracketRange
          ? 160
          : 130;
  const lineStart: number = pad;
  const lineEnd: number = svgW - pad;
  const totalLen: number = lineEnd - lineStart;
  const majorSpacing: number = totalLen / majorDivisions;
  const rangeStep: number = (rangeMax - rangeMin) / majorDivisions;
  const decPlaces: number =
    rangeStep < 0.01 ? 3 : rangeStep < 0.1 ? 2 : rangeStep < 1 ? 1 : 0;
  const valToX = (val: number): number =>
    lineStart + ((val - rangeMin) / (rangeMax - rangeMin)) * totalLen;
  const easeOut = (t: number): number => 1 - Math.pow(1 - t, 3);
  const ap: number = easeOut(animProgress);
  const majorTickH = 16;
  const subTickH = 7;
  const midTickH = 11;

  const arrowLeftId: string = `arrowLeft-${idSuffix}`;
  const arrowRightId: string = `arrowRight-${idSuffix}`;

  return (
    <svg
      viewBox={`0 0 ${svgW} ${svgH}`}
      width="100%"
      style={{
        maxWidth: svgW,
        display: "block",
        margin: "16px auto",
        overflow: "visible",
      }}
    >
      <defs>
        <marker
          id={arrowLeftId}
          markerWidth="10"
          markerHeight="8"
          refX="10"
          refY="4"
          orient="auto"
        >
          <polygon points="10,0 0,4 10,8" fill="#1a1a1a" />
        </marker>
        <marker
          id={arrowRightId}
          markerWidth="10"
          markerHeight="8"
          refX="0"
          refY="4"
          orient="auto"
        >
          <polygon points="0,0 10,4 0,8" fill="#1a1a1a" />
        </marker>
      </defs>

      <line
        x1={lineStart - 16}
        y1={lineY}
        x2={lineStart + (totalLen + 16) * ap}
        y2={lineY}
        stroke="#1a1a1a"
        strokeWidth="2.5"
        strokeLinecap="round"
        markerStart={ap > 0.3 ? `url(#${arrowLeftId})` : undefined}
        markerEnd={ap > 0.95 ? `url(#${arrowRightId})` : undefined}
      />

      {/* Major ticks & labels */}
      {Array.from({ length: majorDivisions + 1 }, (_: unknown, i: number) => {
        const x: number = lineStart + i * majorSpacing;
        const val: number = rangeMin + i * rangeStep;
        const label: string = val.toFixed(decPlaces);
        const tickP: number = Math.max(
          0,
          Math.min((animProgress - 0.1 - i * 0.02) * 4, 1),
        );
        const tsc: number = easeOut(tickP);
        if (tsc <= 0) return null;
        const isHL: boolean =
          highlight !== null &&
          Math.abs(val - highlight) < rangeStep * 0.01 + 0.0001;
        const isCmp: boolean = !!(
          compareNumbers &&
          compareNumbers.some(
            (c: number) => Math.abs(val - c) < rangeStep * 0.01 + 0.0001,
          )
        );
        const isSpecial: boolean = isHL || isCmp || highlightAll;

        return (
          <g key={`major-${i}`} opacity={tsc}>
            <line
              x1={x}
              y1={lineY - majorTickH * tsc}
              x2={x}
              y2={lineY + majorTickH * tsc}
              stroke="#1a1a1a"
              strokeWidth="2.5"
            />
            <text
              x={x}
              y={lineY + majorTickH * tsc + 18}
              textAnchor="middle"
              fill={isHL ? DS.accent : isCmp ? DS.primary : "#1a1a1a"}
              fontSize={isSpecial ? 14 : 12}
              fontWeight={isSpecial ? 700 : 600}
              fontFamily="Poppins, sans-serif"
            >
              {label}
            </text>

            {isHL && highlightStyle === "circle" && tsc > 0.5 && (
              <g opacity={Math.min((tsc - 0.5) * 2, 1)}>
                <ellipse
                  cx={x}
                  cy={lineY}
                  rx={22}
                  ry={majorTickH + 10}
                  fill="none"
                  stroke={DS.accent}
                  strokeWidth="2.5"
                />
                {highlightLabel && (
                  <text
                    x={x}
                    y={lineY - majorTickH - 18}
                    textAnchor="middle"
                    fill={DS.accent}
                    fontSize={13}
                    fontWeight={700}
                    fontFamily="Poppins, sans-serif"
                  >
                    {highlightLabel}
                  </text>
                )}
              </g>
            )}

            {showSubTicks &&
              i < majorDivisions &&
              Array.from(
                { length: subDivisionsPerMajor - 1 },
                (_: unknown, s: number) => {
                  const si: number = s + 1;
                  const sx: number =
                    x + (si / subDivisionsPerMajor) * majorSpacing;
                  const stp: number = Math.max(
                    0,
                    Math.min(
                      (animProgress - 0.2 - i * 0.02 - si * 0.005) * 4,
                      1,
                    ),
                  );
                  if (stp <= 0) return null;
                  const isMid: boolean = si === 5;
                  const stH: number = isMid ? midTickH : subTickH;
                  return (
                    <line
                      key={`sub-${i}-${si}`}
                      x1={sx}
                      y1={lineY - stH * easeOut(stp)}
                      x2={sx}
                      y2={lineY + stH * easeOut(stp)}
                      stroke="#555"
                      strokeWidth={isMid ? 1.5 : 1}
                      opacity={easeOut(stp)}
                    />
                  );
                },
              )}
          </g>
        );
      })}

      {/* Highlight arrow at precise position */}
      {highlight !== null &&
        animProgress > 0.5 &&
        (() => {
          const hlX: number = valToX(highlight);
          const onMajor: boolean = Array.from(
            { length: majorDivisions + 1 },
            (_: unknown, i: number) => rangeMin + i * rangeStep,
          ).some(
            (v: number) => Math.abs(v - highlight) < rangeStep * 0.01 + 0.0001,
          );
          if (
            highlightStyle === "arrow" ||
            (!onMajor && highlightStyle !== "circle")
          ) {
            const hp: number = Math.min((animProgress - 0.5) * 3, 1);
            const hsc: number = easeOut(hp);
            return (
              <g opacity={hp}>
                <line
                  x1={hlX}
                  y1={lineY - 10}
                  x2={hlX}
                  y2={lineY + 10}
                  stroke={DS.accent}
                  strokeWidth="2"
                />
                <line
                  x1={hlX}
                  y1={lineY - majorTickH - 6}
                  x2={hlX}
                  y2={lineY - majorTickH - 34 * hsc}
                  stroke={DS.accent}
                  strokeWidth="2.5"
                />
                <polygon
                  points={`${hlX},${lineY - majorTickH - 6} ${hlX - 5},${lineY - majorTickH - 16} ${hlX + 5},${lineY - majorTickH - 16}`}
                  fill={DS.accent}
                />
                <circle
                  cx={hlX}
                  cy={lineY - majorTickH - 48 * hsc}
                  r={18 * hsc}
                  fill={DS.accentLight}
                  stroke={DS.accent}
                  strokeWidth="2"
                />
                <text
                  x={hlX}
                  y={lineY - majorTickH - 48 * hsc + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={DS.accent}
                  fontSize={12 * hsc}
                  fontWeight={700}
                  fontFamily="Poppins, sans-serif"
                >
                  {highlightLabel || highlight.toString()}
                </text>
              </g>
            );
          }
          if (onMajor && highlightStyle === "circle") return null;
          const hp: number = Math.min((animProgress - 0.5) * 3, 1);
          return (
            <g opacity={easeOut(hp)}>
              <line
                x1={hlX}
                y1={lineY - 10}
                x2={hlX}
                y2={lineY + 10}
                stroke={DS.accent}
                strokeWidth="2"
              />
              <ellipse
                cx={hlX}
                cy={lineY}
                rx={20}
                ry={majorTickH + 8}
                fill="none"
                stroke={DS.accent}
                strokeWidth="2.5"
              />
              <text
                x={hlX}
                y={lineY - majorTickH - 16}
                textAnchor="middle"
                fill={DS.accent}
                fontSize={13}
                fontWeight={700}
                fontFamily="Poppins, sans-serif"
              >
                {highlightLabel || highlight.toString()}
              </text>
            </g>
          );
        })()}

      {/* Letter markers */}
      {letterMarkers &&
        letterMarkers.map((lm: LetterMarker, li: number) => {
          const lp: number = Math.max(
            0,
            Math.min((animProgress - 0.45 - li * 0.08) * 3, 1),
          );
          if (lp <= 0) return null;
          const lsc: number = easeOut(lp);
          const lx: number = valToX(lm.position);
          return (
            <g key={`lm-${li}`} opacity={lp}>
              <line
                x1={lx}
                y1={lineY - majorTickH - 4}
                x2={lx}
                y2={lineY - majorTickH - 32 * lsc}
                stroke={DS.error}
                strokeWidth="2.5"
              />
              <polygon
                points={`${lx},${lineY - majorTickH - 4} ${lx - 4},${lineY - majorTickH - 14} ${lx + 4},${lineY - majorTickH - 14}`}
                fill={DS.error}
              />
              <text
                x={lx}
                y={lineY - majorTickH - 36 * lsc}
                textAnchor="middle"
                dominantBaseline="auto"
                fill="#1a1a1a"
                fontSize={14 * lsc}
                fontWeight={800}
                fontFamily="Poppins, sans-serif"
              >
                {lm.letter}
              </text>
              <text
                x={lx}
                y={lineY - majorTickH - 50 * lsc}
                textAnchor="middle"
                dominantBaseline="auto"
                fill={DS.error}
                fontSize={10 * lsc}
                fontWeight={600}
                fontFamily="Poppins, sans-serif"
              >
                {lm.position.toFixed(2)}
              </text>
            </g>
          );
        })}

      {/* Compare mode */}
      {compareNumbers &&
        animProgress > 0.5 &&
        (() => {
          const cp: number = Math.min((animProgress - 0.5) * 3, 1);
          const csc: number = easeOut(cp);
          return (
            <g opacity={cp}>
              {compareNumbers.map((val: number, ci: number) => {
                const cx: number = valToX(val);
                const color: string = ci === 0 ? DS.primary : DS.accent;
                const lightColor: string =
                  ci === 0 ? DS.primaryLight : DS.accentLight;
                return (
                  <g key={`cmp-${ci}`}>
                    <line
                      x1={cx}
                      y1={lineY - majorTickH - 4}
                      x2={cx}
                      y2={lineY - majorTickH - 30 * csc}
                      stroke={color}
                      strokeWidth="2.5"
                    />
                    <polygon
                      points={`${cx},${lineY - majorTickH - 4} ${cx - 5},${lineY - majorTickH - 14} ${cx + 5},${lineY - majorTickH - 14}`}
                      fill={color}
                    />
                    <circle
                      cx={cx}
                      cy={lineY - majorTickH - 44 * csc}
                      r={20 * csc}
                      fill={lightColor}
                      stroke={color}
                      strokeWidth="2"
                    />
                    <text
                      x={cx}
                      y={lineY - majorTickH - 44 * csc + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={color}
                      fontSize={10 * csc}
                      fontWeight={700}
                      fontFamily="Poppins, sans-serif"
                    >
                      {val.toFixed(3)}
                    </text>
                  </g>
                );
              })}
              {cp > 0.6 &&
                (() => {
                  const bigger: number =
                    compareNumbers[0] > compareNumbers[1]
                      ? compareNumbers[0]
                      : compareNumbers[1];
                  const smaller: number =
                    compareNumbers[0] > compareNumbers[1]
                      ? compareNumbers[1]
                      : compareNumbers[0];
                  return (
                    <text
                      x={svgW / 2}
                      y={16}
                      textAnchor="middle"
                      fill={DS.gradientFrom}
                      fontSize={13}
                      fontWeight={700}
                      fontFamily="Poppins, sans-serif"
                    >
                      {bigger.toFixed(3)} {">"} {smaller.toFixed(3)}
                    </text>
                  );
                })()}
            </g>
          );
        })()}

      {/* Zero demo */}
      {zeroDemo &&
        animProgress > 0.4 &&
        (() => {
          const zp: number = Math.min((animProgress - 0.4) * 2.5, 1);
          const markers: ZeroDemoMarker[] = [
            { val: 0.2, label: "0.2", color: "#1A7A42" },
            { val: 0.02, label: "0.02", color: DS.error },
            { val: 0.002, label: "0.002", color: DS.error },
          ];
          return (
            <g opacity={easeOut(zp)}>
              <text
                x={svgW / 2}
                y={14}
                textAnchor="middle"
                fill="#1A7A42"
                fontSize={13}
                fontWeight={700}
                fontFamily="Poppins, sans-serif"
              >
                0.2 = 0.20 = 0.200 ✓ Same value!
              </text>
              <text
                x={svgW / 2}
                y={32}
                textAnchor="middle"
                fill={DS.error}
                fontSize={13}
                fontWeight={700}
                fontFamily="Poppins, sans-serif"
              >
                0.2 ≠ 0.02 ≠ 0.002 ✗ Different!
              </text>
              {markers.map((m: ZeroDemoMarker, mi: number) => {
                const mx: number = valToX(m.val);
                return (
                  <g key={`zm-${mi}`}>
                    <line
                      x1={mx}
                      y1={lineY - majorTickH - 2}
                      x2={mx}
                      y2={lineY - majorTickH - 24}
                      stroke={m.color}
                      strokeWidth="2"
                    />
                    <polygon
                      points={`${mx},${lineY - majorTickH - 2} ${mx - 4},${lineY - majorTickH - 12} ${mx + 4},${lineY - majorTickH - 12}`}
                      fill={m.color}
                    />
                    <text
                      x={mx}
                      y={lineY - majorTickH - 28}
                      textAnchor="middle"
                      fill={m.color}
                      fontSize={10}
                      fontWeight={700}
                      fontFamily="Poppins, sans-serif"
                    >
                      {m.label}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })()}

      {/* Zoom demo hint */}
      {zoomDemo && animProgress > 0.7 && (
        <text
          x={svgW / 2}
          y={svgH - 8}
          textAnchor="middle"
          fill={DS.primary}
          fontSize={12}
          fontWeight={500}
          fontFamily="Poppins, sans-serif"
          opacity={Math.min((animProgress - 0.7) * 3, 1)}
        >
          🔍 Each small division ={" "}
          {(rangeStep / subDivisionsPerMajor).toFixed(decPlaces + 1)} (
          {rangeStep < 0.1
            ? "one thousandth"
            : rangeStep < 1
              ? "one hundredth"
              : "one tenth"}
          )
        </text>
      )}

      {/* Bracket annotation */}
      {bracketRange &&
        animProgress > 0.6 &&
        (() => {
          const bp: number = Math.min((animProgress - 0.6) * 3, 1);
          const bx1: number = valToX(bracketRange[0]);
          const bx2: number = valToX(bracketRange[1]);
          const by: number = lineY + majorTickH + 32;
          return (
            <g opacity={easeOut(bp)}>
              <path
                d={`M${bx1},${by - 8} L${bx1},${by} L${bx2},${by} L${bx2},${by - 8}`}
                fill="none"
                stroke={DS.primary}
                strokeWidth="2"
              />
              {bracketLabel && (
                <text
                  x={(bx1 + bx2) / 2}
                  y={by + 16}
                  textAnchor="middle"
                  fill={DS.primary}
                  fontSize={11}
                  fontWeight={600}
                  fontFamily="Poppins, sans-serif"
                >
                  {bracketLabel}
                </text>
              )}
            </g>
          );
        })()}

      {/* Custom annotations */}
      {customAnnotations &&
        customAnnotations.map((ann: CustomAnnotation, ai: number) => {
          const ap2: number = Math.max(
            0,
            Math.min((animProgress - 0.5 - ai * 0.05) * 3, 1),
          );
          if (ap2 <= 0) return null;
          const ax: number = valToX(ann.position);
          return (
            <g key={`ann-${ai}`} opacity={easeOut(ap2)}>
              <line
                x1={ax}
                y1={lineY - majorTickH - 4}
                x2={ax}
                y2={lineY - majorTickH - 28}
                stroke={ann.color || DS.primary}
                strokeWidth="2"
              />
              <text
                x={ax}
                y={lineY - majorTickH - 32}
                textAnchor="middle"
                fill={ann.color || DS.primary}
                fontSize={10}
                fontWeight={600}
                fontFamily="Poppins, sans-serif"
              >
                {ann.label}
              </text>
            </g>
          );
        })}

      {/* Magnifier / zoom inset */}
      {showMagnifier &&
        magnifierFrom !== null &&
        magnifierTo !== null &&
        animProgress > 0.6 &&
        (() => {
          const mp: number = Math.min((animProgress - 0.6) * 2.5, 1);
          const msc: number = easeOut(mp);
          const mx1: number = valToX(magnifierFrom);
          const mx2: number = valToX(magnifierTo);
          const zoomY: number = lineY + 65;
          const zoomLineStart: number = pad + 30;
          const zoomLineEnd: number = svgW - pad - 30;
          const zoomLen: number = zoomLineEnd - zoomLineStart;
          const zoomDivs = 10;
          const zoomSpacing: number = zoomLen / zoomDivs;
          const zoomStep: number = (magnifierTo - magnifierFrom) / zoomDivs;
          const zoomDec: number =
            zoomStep < 0.001 ? 4 : zoomStep < 0.01 ? 3 : 2;
          return (
            <g opacity={msc}>
              <rect
                x={mx1}
                y={lineY - majorTickH - 2}
                width={mx2 - mx1}
                height={majorTickH * 2 + 4}
                fill={DS.primary}
                fillOpacity="0.08"
                stroke={DS.primary}
                strokeWidth="1.5"
                rx="4"
              />
              <line
                x1={mx1}
                y1={lineY + majorTickH + 2}
                x2={zoomLineStart}
                y2={zoomY}
                stroke={DS.primary}
                strokeWidth="1"
                strokeDasharray="4,3"
              />
              <line
                x1={mx2}
                y1={lineY + majorTickH + 2}
                x2={zoomLineEnd}
                y2={zoomY}
                stroke={DS.primary}
                strokeWidth="1"
                strokeDasharray="4,3"
              />
              <line
                x1={zoomLineStart - 12}
                y1={zoomY}
                x2={zoomLineEnd + 12}
                y2={zoomY}
                stroke="#1a1a1a"
                strokeWidth="2"
              />
              {Array.from({ length: zoomDivs + 1 }, (_: unknown, i: number) => {
                const zx: number = zoomLineStart + i * zoomSpacing;
                const zval: number = magnifierFrom + i * zoomStep;
                return (
                  <g key={`ztick-${i}`}>
                    <line
                      x1={zx}
                      y1={zoomY - 12}
                      x2={zx}
                      y2={zoomY + 12}
                      stroke="#1a1a1a"
                      strokeWidth={i === 0 || i === zoomDivs ? 2.5 : 1.5}
                    />
                    <text
                      x={zx}
                      y={zoomY + 26}
                      textAnchor="middle"
                      fill="#1a1a1a"
                      fontSize={10}
                      fontWeight={600}
                      fontFamily="Poppins, sans-serif"
                    >
                      {zval.toFixed(zoomDec)}
                    </text>
                    {i < zoomDivs &&
                      Array.from({ length: 9 }, (_: unknown, s: number) => {
                        const ssx: number = zx + ((s + 1) / 10) * zoomSpacing;
                        return (
                          <line
                            key={`zsub-${i}-${s}`}
                            x1={ssx}
                            y1={zoomY - 4}
                            x2={ssx}
                            y2={zoomY + 4}
                            stroke="#888"
                            strokeWidth="0.8"
                          />
                        );
                      })}
                  </g>
                );
              })}
              {highlight !== null &&
                highlight >= magnifierFrom &&
                highlight <= magnifierTo &&
                (() => {
                  const zhx: number =
                    zoomLineStart +
                    ((highlight - magnifierFrom) /
                      (magnifierTo - magnifierFrom)) *
                      zoomLen;
                  return (
                    <g>
                      <line
                        x1={zhx}
                        y1={zoomY - 14}
                        x2={zhx}
                        y2={zoomY - 30}
                        stroke={DS.accent}
                        strokeWidth="2"
                      />
                      <polygon
                        points={`${zhx},${zoomY - 14} ${zhx - 4},${zoomY - 22} ${zhx + 4},${zoomY - 22}`}
                        fill={DS.accent}
                      />
                      <circle
                        cx={zhx}
                        cy={zoomY - 42}
                        r={14}
                        fill={DS.accentLight}
                        stroke={DS.accent}
                        strokeWidth="2"
                      />
                      <text
                        x={zhx}
                        y={zoomY - 41}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={DS.accent}
                        fontSize={10}
                        fontWeight={700}
                        fontFamily="Poppins, sans-serif"
                      >
                        {highlight.toFixed(zoomDec)}
                      </text>
                    </g>
                  );
                })()}
              <text x={zoomLineStart - 20} y={zoomY + 5} fontSize={16}>
                🔍
              </text>
            </g>
          );
        })()}
    </svg>
  );
};

// ══════════════════════════════════════════════════════════════
// DEFAULT STEPS
// ══════════════════════════════════════════════════════════════

const DEFAULT_STEPS: StepDataInterface[] = [
  // ─── LEARN ───
  {
    id: 1,
    title: "Why Do We Need Decimals?",
    description:
      "Imagine you measure a pencil and it is longer than 3 cm but shorter than 4 cm. Whole numbers can't describe this! We need numbers 'between' whole numbers — these are called decimals. A decimal point separates the whole part from the fractional part. For example, 3.4 means 3 whole units and 4 tenths of the next unit.",
    type: "intro",
    mode: "learn",
    data: { highlight: 3.4, range: [3, 4], showDivisions: 10 },
    scale: {
      rangeMin: 3,
      rangeMax: 4,
      majorDivisions: 10,
      showSubTicks: false,
      highlight: 3.4,
      highlightStyle: "circle",
      bracketRange: [3, 4],
      bracketLabel: "3.4 is between 3 and 4",
    },
  },
  {
    id: 2,
    title: "Place Value Extends Beyond the Point!",
    description:
      "You already know Ones, Tens, Hundreds to the left of a number. After the decimal point, the place value continues but gets SMALLER: the first digit is Tenths (1/10), the second is Hundredths (1/100), the third is Thousandths (1/1000). So in 5.237 → 5 is Ones, 2 is Tenths, 3 is Hundredths, 7 is Thousandths.",
    type: "explanation",
    mode: "learn",
    data: { range: [5, 6], showDivisions: 10, highlight: 5.237 },
    scale: {
      rangeMin: 5,
      rangeMax: 6,
      majorDivisions: 10,
      showSubTicks: true,
      subDivisionsPerMajor: 10,
      highlight: 5.237,
      highlightStyle: "arrow",
      highlightLabel: "5.237",
      customAnnotations: [
        { position: 5.2, label: "2 tenths", color: DS.primary },
        { position: 5.23, label: "3 hundredths", color: "#1A7A42" },
        { position: 5.237, label: "7 thousandths", color: DS.accent },
      ],
    },
  },
  {
    id: 3,
    title: "Locating Decimals on a Number Line",
    description:
      "To place 1.4 on a number line: First, find it is between 1 and 2. Next, divide the space between 1 and 2 into 10 equal parts. Each part = 0.1 (one-tenth). Count 4 parts from 1 — that's where 1.4 sits! The number line helps us SEE exactly where a decimal lives.",
    type: "explanation",
    mode: "learn",
    data: { range: [1, 2], showDivisions: 10, highlight: 1.4 },
    scale: {
      rangeMin: 1,
      rangeMax: 2,
      majorDivisions: 10,
      showSubTicks: true,
      highlight: 1.4,
      highlightStyle: "circle",
      bracketRange: [1, 1.4],
      bracketLabel: "Count 4 tenths from 1",
    },
  },
  {
    id: 4,
    title: "Zooming In — Seeing Tenths",
    description:
      "When we divide the segment between any two whole numbers into 10 equal parts, we get tenths. Between 1 and 2, we find: 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0. Notice that 1.0 = 1 and 2.0 = 2. Each small step is exactly 0.1.",
    type: "explanation",
    mode: "learn",
    data: { range: [1, 2], showDivisions: 10, highlightAll: true },
    scale: {
      rangeMin: 1,
      rangeMax: 2,
      majorDivisions: 10,
      showSubTicks: true,
      highlightAll: true,
      bracketRange: [1, 1.1],
      bracketLabel: "Each part = 0.1 (one tenth)",
    },
  },
  {
    id: 5,
    title: "Zooming In More — Hundredths!",
    description:
      "We can zoom into any tenth! Take the space between 1.0 and 1.1 — divide it into 10 more parts. Each tiny part = 0.01 (one-hundredth). So 1.04 means: start at 1.0, move 4 hundredths forward. This is like looking through a magnifying glass at the number line!",
    type: "explanation",
    mode: "learn",
    data: {
      range: [1.0, 1.1],
      showDivisions: 10,
      highlight: 1.04,
      zoomDemo: true,
    },
    scale: {
      rangeMin: 1,
      rangeMax: 1.3,
      majorDivisions: 3,
      showSubTicks: true,
      subDivisionsPerMajor: 10,
      highlight: 1.04,
      highlightStyle: "arrow",
      highlightLabel: "1.04",
      showMagnifier: true,
      magnifierFrom: 1.0,
      magnifierTo: 1.1,
      zoomDemo: true,
    },
  },
  {
    id: 6,
    title: "Comparing Decimals — Digit by Digit",
    description:
      "To compare 6.456 and 6.465: Start from the LEFT. Ones digit? Both 6 — same! Tenths digit? Both 4 — same! Hundredths digit? 5 vs 6 — here 6 > 5. So 6.465 > 6.456. Always compare from the leftmost place. The moment digits differ, the one with the bigger digit wins!",
    type: "explanation",
    mode: "learn",
    data: { compare: [6.456, 6.465], range: [6.4, 6.5] },
    scale: {
      rangeMin: 6.4,
      rangeMax: 6.5,
      majorDivisions: 10,
      showSubTicks: true,
      compareNumbers: [6.456, 6.465],
    },
  },
  {
    id: 7,
    title: "The Trailing Zero Rule",
    description:
      "Here's an important trick: adding zeros AFTER the last decimal digit does NOT change the value! So 0.2 = 0.20 = 0.200 (all equal 2 tenths). But MOVING the digit changes everything: 0.2 ≠ 0.02 ≠ 0.002. Think of it this way — 0.2 is like 20 paise, but 0.02 is only 2 paise!",
    type: "explanation",
    mode: "learn",
    data: { zeroDemo: true, range: [0, 1], showDivisions: 10 },
    scale: {
      rangeMin: 0,
      rangeMax: 1,
      majorDivisions: 10,
      showSubTicks: true,
      zeroDemo: true,
    },
  },
  {
    id: "id8a",
    title: "Try It! — Identify the Decimals",
    description:
      "Look at the number line below from 5 to 5.5. Four points A, B, C, D are marked with red arrows. Each small division = 0.01. Can you read each letter? A = 5.08, B = 5.14, C = 5.26, D = 5.35. Just count the tiny ticks from the nearest labelled mark!",
    type: "explanation",
    mode: "learn",
    data: {
      range: [5.0, 5.5],
      showDivisions: 5,
      letterMarkers: [
        { letter: "A", position: 5.08 },
        { letter: "B", position: 5.14 },
        { letter: "C", position: 5.26 },
        { letter: "D", position: 5.35 },
      ],
    },
    scale: {
      rangeMin: 5.0,
      rangeMax: 5.5,
      majorDivisions: 5,
      showSubTicks: true,
      subDivisionsPerMajor: 10,
      letterMarkers: [
        { letter: "A", position: 5.08 },
        { letter: "B", position: 5.14 },
        { letter: "C", position: 5.26 },
        { letter: "D", position: 5.35 },
      ],
    },
  },
  {
    id: 8,
    title: "Converting Units with Decimals",
    description:
      "Decimals pop up everywhere in conversions! 1 mm = 0.1 cm (because 10 mm = 1 cm). 1 g = 0.001 kg (because 1000 g = 1 kg). 1 paisa = ₹0.01 (because 100 paise = ₹1). So when you write 4.7 cm, the .7 means 7 millimeters. Decimals make measuring super precise!",
    type: "explanation",
    mode: "learn",
    data: { range: [0, 1], showDivisions: 10, highlightAll: true },
    scale: {
      rangeMin: 0,
      rangeMax: 1,
      majorDivisions: 10,
      showSubTicks: true,
      highlightAll: true,
      customAnnotations: [
        { position: 0.1, label: "1mm = 0.1cm", color: DS.primary },
        { position: 0.5, label: "5mm = 0.5cm", color: "#1A7A42" },
      ],
      bracketRange: [0, 0.1],
      bracketLabel: "1 mm = 0.1 cm",
    },
  },
  // ─── PRACTICE ───
  {
    id: 10,
    title: "Question 1: Locating a Decimal",
    description:
      "The number 2.7 lies between which two whole numbers on the number line?",
    type: "practice",
    mode: "practice",
    data: {
      question: "2.7 lies between which two whole numbers?",
      mcq: true,
      options: ["1 and 2", "2 and 3", "3 and 4", "7 and 8"],
      correctIndex: 1,
      explanation:
        "2.7 has whole part 2, so it lies between 2 and 3. It is 7 tenths past 2.",
    },
    scale: {
      rangeMin: 1,
      rangeMax: 4,
      majorDivisions: 3,
      showSubTicks: true,
      highlight: 2.7,
      highlightStyle: "circle",
    },
  },
  {
    id: 11,
    title: "Question 2: Place Value",
    description: "In the number 8.365, what is the place value of the digit 6?",
    type: "practice",
    mode: "practice",
    data: {
      question: "In 8.365, the digit 6 is in the _____ place.",
      mcq: true,
      options: ["Tenths", "Hundredths", "Thousandths", "Ones"],
      correctIndex: 1,
      explanation:
        "After the decimal: 3 is tenths, 6 is hundredths, 5 is thousandths.",
    },
    scale: {
      rangeMin: 8,
      rangeMax: 9,
      majorDivisions: 10,
      showSubTicks: true,
      highlight: 8.365,
      highlightStyle: "arrow",
      highlightLabel: "8.365",
    },
  },
  {
    id: 12,
    title: "Question 3: Comparing Decimals",
    description: "Which is greater: 4.56 or 4.506?",
    type: "practice",
    mode: "practice",
    data: {
      question: "Which is greater?",
      mcq: true,
      options: ["4.56", "4.506", "Both are equal", "Can't compare"],
      correctIndex: 0,
      explanation:
        "Compare digit by digit: Ones=4, Tenths=5, Hundredths: 6 vs 0. Since 6 > 0, 4.56 > 4.506.",
    },
    scale: {
      rangeMin: 4.5,
      rangeMax: 4.6,
      majorDivisions: 10,
      showSubTicks: true,
      compareNumbers: [4.56, 4.506],
    },
  },
  {
    id: 13,
    title: "Question 4: Trailing Zeros",
    description: "Which of these is equal to 0.5?",
    type: "practice",
    mode: "practice",
    data: {
      question: "Which is equal to 0.5?",
      mcq: true,
      options: ["0.05", "0.50", "0.005", "5.0"],
      correctIndex: 1,
      explanation:
        "Adding a zero AFTER the last decimal digit doesn't change the value: 0.5 = 0.50.",
    },
    scale: {
      rangeMin: 0,
      rangeMax: 1,
      majorDivisions: 10,
      showSubTicks: false,
      highlight: 0.5,
      highlightStyle: "circle",
    },
  },
  {
    id: 14,
    title: "Question 5: Smallest Decimal",
    description: "Which is the smallest number among 0.3, 0.03, 0.33, 0.303?",
    type: "practice",
    mode: "practice",
    data: {
      question: "Which is the smallest?",
      mcq: true,
      options: ["0.3", "0.03", "0.33", "0.303"],
      correctIndex: 1,
      explanation:
        "0.03 = 0.030. Compare: 0.030 < 0.300 < 0.303 < 0.330. So 0.03 is the smallest!",
    },
    scale: {
      rangeMin: 0,
      rangeMax: 0.4,
      majorDivisions: 4,
      showSubTicks: true,
      customAnnotations: [
        { position: 0.03, label: "0.03", color: DS.success },
        { position: 0.3, label: "0.3", color: DS.primary },
        { position: 0.303, label: "0.303", color: DS.accent },
        { position: 0.33, label: "0.33", color: DS.error },
      ],
    },
  },
  {
    id: 15,
    title: "Question 6: Number Line Position",
    description: "How many tenths is 0.8 away from 0?",
    type: "practice",
    mode: "practice",
    data: {
      question: "0.8 is how many tenths from 0?",
      mcq: true,
      options: ["8 tenths", "80 tenths", "8 hundredths", "0.8 tenths"],
      correctIndex: 0,
      explanation: "0.8 = 8/10 = 8 tenths.",
    },
    scale: {
      rangeMin: 0,
      rangeMax: 1,
      majorDivisions: 10,
      showSubTicks: false,
      highlight: 0.8,
      highlightStyle: "circle",
      bracketRange: [0, 0.8],
      bracketLabel: "8 tenths",
    },
  },
  {
    id: 16,
    title: "Question 7: Unit Conversion",
    description: "5 mm is equal to how many centimeters?",
    type: "practice",
    mode: "practice",
    data: {
      question: "5 mm = ? cm",
      mcq: true,
      options: ["0.5 cm", "5.0 cm", "0.05 cm", "50 cm"],
      correctIndex: 0,
      explanation: "Since 10 mm = 1 cm, each mm = 0.1 cm. So 5 mm = 0.5 cm.",
    },
    scale: {
      rangeMin: 0,
      rangeMax: 1,
      majorDivisions: 10,
      showSubTicks: false,
      highlight: 0.5,
      highlightStyle: "circle",
      bracketRange: [0, 0.5],
      bracketLabel: "5 mm = 0.5 cm",
    },
  },
  {
    id: 17,
    title: "Question 8: Ordering Decimals",
    description: "Arrange in ascending order: 1.5, 1.05, 1.50, 1.005",
    type: "practice",
    mode: "practice",
    data: {
      question: "Correct ascending order?",
      mcq: true,
      options: [
        "1.005 < 1.05 < 1.5 < 1.50",
        "1.005 < 1.05 < 1.50 < 1.5",
        "1.50 < 1.5 < 1.05 < 1.005",
        "1.05 < 1.005 < 1.5 < 1.50",
      ],
      correctIndex: 0,
      explanation: "1.005 < 1.050 < 1.500. Note: 1.5 = 1.50 (equal!).",
    },
    scale: {
      rangeMin: 1,
      rangeMax: 1.6,
      majorDivisions: 6,
      showSubTicks: true,
      customAnnotations: [
        { position: 1.005, label: "1.005", color: "#1A7A42" },
        { position: 1.05, label: "1.05", color: DS.primary },
        { position: 1.5, label: "1.5 = 1.50", color: DS.accent },
      ],
    },
  },
  {
    id: 18,
    title: "Question 9: Hundredths on the Line",
    description:
      "The number 3.47 has how many hundredths after the whole number 3?",
    type: "practice",
    mode: "practice",
    data: {
      question: "3.47 has how many hundredths after 3?",
      mcq: true,
      options: [
        "4 hundredths",
        "7 hundredths",
        "47 hundredths",
        "470 hundredths",
      ],
      correctIndex: 2,
      explanation: "3.47 = 3 + 47/100. That's 47 hundredths.",
    },
    scale: {
      rangeMin: 3,
      rangeMax: 4,
      majorDivisions: 10,
      showSubTicks: true,
      highlight: 3.47,
      highlightStyle: "arrow",
      highlightLabel: "3.47",
      bracketRange: [3, 3.47],
      bracketLabel: "47 hundredths",
    },
  },
  {
    id: 19,
    title: "Question 10: Real-Life Decimals",
    description:
      "Rahul bought an eraser for ₹3.75. How many paise is the amount after the rupee?",
    type: "practice",
    mode: "practice",
    data: {
      question: "₹3.75 has how many paise after the decimal?",
      mcq: true,
      options: ["7 paise", "5 paise", "75 paise", "37 paise"],
      correctIndex: 2,
      explanation: "₹3.75 = 3 rupees and 75 paise.",
    },
    scale: {
      rangeMin: 3,
      rangeMax: 4,
      majorDivisions: 10,
      showSubTicks: true,
      highlight: 3.75,
      highlightStyle: "arrow",
      highlightLabel: "₹3.75",
      bracketRange: [3, 3.75],
      bracketLabel: "75 paise",
    },
  },
  // ─── REAL WORLD ───
  {
    id: 20,
    title: "📏 Measuring with a Ruler",
    description:
      "Your ruler has mm marks that divide each cm into 10 equal parts — just like tenths on a number line! When your pencil is at the 4th mm mark past 3 cm, its length is 3.4 cm.",
    type: "real_world",
    mode: "real_world",
    data: { context: "ruler" as const, value: 3.4 },
    scale: {
      rangeMin: 3,
      rangeMax: 4,
      majorDivisions: 10,
      showSubTicks: false,
      highlight: 3.4,
      highlightStyle: "circle",
      bracketRange: [3, 3.4],
      bracketLabel: "4 mm = 0.4 cm",
    },
  },
  {
    id: 21,
    title: "💊 Medicine Dosage — Decimals Save Lives!",
    description:
      "A doctor prescribes 0.05 mg of medicine. If a nurse misreads it as 0.5 mg, the patient gets 10 TIMES the correct dose!",
    type: "real_world",
    mode: "real_world",
    data: { context: "medicine" as const, values: [0.05, 0.5] },
    scale: {
      rangeMin: 0,
      rangeMax: 1,
      majorDivisions: 10,
      showSubTicks: true,
      customAnnotations: [
        { position: 0.05, label: "0.05 mg ✓", color: "#1A7A42" },
        { position: 0.5, label: "0.5 mg ✗ (10×!)", color: DS.error },
      ],
    },
  },
  {
    id: 22,
    title: "💰 Money — Rupees and Paise",
    description:
      "When you see a price tag of ₹12.50, it means 12 rupees and 50 paise. ₹2.45 = 2 rupees + 45 paise.",
    type: "real_world",
    mode: "real_world",
    data: { context: "money" as const, value: 2.45 },
    scale: {
      rangeMin: 2,
      rangeMax: 3,
      majorDivisions: 10,
      showSubTicks: true,
      highlight: 2.45,
      highlightStyle: "arrow",
      highlightLabel: "₹2.45",
      bracketRange: [2, 2.45],
      bracketLabel: "45 paise",
    },
  },
  {
    id: 23,
    title: "🏃 Sports Timing — Every Millisecond Counts!",
    description:
      "In the Olympics, if Runner A finishes in 9.85s and Runner B in 9.86s, A wins by just 0.01 second!",
    type: "real_world",
    mode: "real_world",
    data: { context: "sports" as const, values: [9.85, 9.86] },
    scale: {
      rangeMin: 9.8,
      rangeMax: 9.9,
      majorDivisions: 10,
      showSubTicks: true,
      compareNumbers: [9.85, 9.86],
    },
  },
];

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

const DecimalNumberLineTool: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<ModeType>("learn");
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [contentVisible, setContentVisible] = useState<boolean>(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const transitionLockRef = useRef<boolean>(false);

  const filteredSteps: StepDataInterface[] = useMemo(
    () =>
      DEFAULT_STEPS.filter((s: StepDataInterface) => s.mode === selectedMode),
    [selectedMode],
  );
  const currentStep: StepDataInterface =
    filteredSteps[currentStepIndex] || filteredSteps[0];

  const modeThemes: Record<ModeType, ModeTheme> = {
    learn: {
      from: DS.primary,
      to: "#6366f1",
      light: DS.primaryLight,
      icon: BookOpen,
      label: "Learn",
    },
    practice: {
      from: DS.gradientFrom,
      to: DS.gradientTo,
      light: "#F3E8FF",
      icon: Target,
      label: "Practice",
    },
    real_world: {
      from: DS.accent,
      to: "#E65100",
      light: DS.accentLight,
      icon: Globe,
      label: "Real World",
    },
  };
  const mt: ModeTheme = modeThemes[selectedMode];

  const resetQ = useCallback((): void => {
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, []);

  const goToStep = useCallback(
    (idx: number): void => {
      if (transitionLockRef.current || idx < 0 || idx >= filteredSteps.length)
        return;
      transitionLockRef.current = true;
      setContentVisible(false);
      setTimeout(() => {
        setCurrentStepIndex(idx);
        resetQ();
        requestAnimationFrame(() => {
          setContentVisible(true);
          transitionLockRef.current = false;
        });
      }, 200);
    },
    [filteredSteps.length, resetQ],
  );

  const changeMode = useCallback(
    (mode: ModeType): void => {
      if (mode === selectedMode || transitionLockRef.current) return;
      transitionLockRef.current = true;
      setContentVisible(false);
      setTimeout(() => {
        setSelectedMode(mode);
        setCurrentStepIndex(0);
        resetQ();
        requestAnimationFrame(() => {
          setContentVisible(true);
          transitionLockRef.current = false;
        });
      }, 200);
    },
    [selectedMode, resetQ],
  );

  useEffect(() => {
    if (!isPlaying) return;
    const t: ReturnType<typeof setTimeout> = setTimeout(() => {
      if (currentStepIndex < filteredSteps.length - 1)
        goToStep(currentStepIndex + 1);
      else setIsPlaying(false);
    }, 8000);
    return () => clearTimeout(t);
  }, [isPlaying, currentStepIndex, filteredSteps.length, goToStep]);

  const renderPractice = (): React.ReactNode => {
    const d = currentStep?.data as MCQData | undefined;
    if (!d || !d.mcq) return null;
    const answered: boolean = isCorrect !== null;
    return (
      <div style={{ padding: "20px 0" }}>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: DS.gray900,
            marginBottom: 20,
            fontFamily: DS.fontFamily,
            textAlign: "center" as const,
          }}
        >
          {d.question}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column" as const,
            gap: 10,
            maxWidth: 500,
            margin: "0 auto",
          }}
        >
          {d.options.map((opt: string, i: number) => {
            const isSel: boolean = selectedAnswer === i;
            const isCorr: boolean = i === d.correctIndex;
            const isWrong: boolean = answered && isSel && !isCorr;
            return (
              <button
                key={i}
                onClick={() => {
                  if (answered) return;
                  setSelectedAnswer(i);
                  setAttempts((a: number) => a + 1);
                  const c: boolean = i === d.correctIndex;
                  setIsCorrect(c);
                  if (c) setScore((s: number) => s + 1);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 20px",
                  borderRadius: 12,
                  textAlign: "left" as const,
                  fontSize: 15,
                  fontWeight: 600,
                  fontFamily: DS.fontFamily,
                  cursor: answered ? "default" : "pointer",
                  transition: "all 0.2s ease",
                  outline: "none",
                  border: `2.5px solid ${answered && isCorr ? DS.success : isWrong ? DS.error : isSel ? DS.primary : DS.gray200}`,
                  background:
                    answered && isCorr
                      ? "#EAFFF3"
                      : isWrong
                        ? "#FFF0EE"
                        : isSel
                          ? DS.primaryLight
                          : DS.white,
                  color:
                    answered && isCorr
                      ? "#1A7A42"
                      : isWrong
                        ? DS.error
                        : DS.gray900,
                }}
              >
                <span
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    background:
                      answered && isCorr
                        ? DS.success
                        : isWrong
                          ? DS.error
                          : isSel
                            ? DS.primary
                            : DS.gray200,
                    color:
                      (answered && isCorr) || isWrong || isSel
                        ? DS.white
                        : DS.gray900,
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {answered && isCorr
                    ? "✓"
                    : isWrong
                      ? "✗"
                      : String.fromCharCode(65 + i)}
                </span>
                <span style={{ flex: 1 }}>{opt}</span>
              </button>
            );
          })}
        </div>
        {isCorrect !== null && (
          <div
            style={{
              marginTop: 16,
              padding: "14px 24px",
              borderRadius: DS.radiusSm,
              background: isCorrect ? "#EAFFF3" : "#FFF0EE",
              color: isCorrect ? "#1A7A42" : DS.error,
              fontWeight: 600,
              fontFamily: DS.fontFamily,
              fontSize: 14,
              lineHeight: 1.6,
              maxWidth: 500,
              margin: "16px auto 0",
              textAlign: "left" as const,
            }}
          >
            {isCorrect
              ? `🎉 Correct! ${d.explanation}`
              : `❌ The answer is (${String.fromCharCode(65 + d.correctIndex)}). ${d.explanation}`}
          </div>
        )}
      </div>
    );
  };

  const renderRW = (): React.ReactNode => {
    const d = currentStep?.data as RealWorldData | undefined;
    if (!d) return null;
    const iconBox = (emoji: string): React.ReactNode => (
      <div
        style={{
          flex: "0 0 auto",
          width: 56,
          height: 56,
          borderRadius: DS.radiusMd,
          background: `linear-gradient(135deg, ${DS.gradientFrom}, ${DS.gradientTo})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
        }}
      >
        {emoji}
      </div>
    );
    if (d.context === "ruler")
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "20px 0",
          }}
        >
          {iconBox("📏")}
          <div style={{ fontFamily: DS.fontFamily }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: DS.gray900 }}>
              Ruler Reading:{" "}
              <span style={{ color: DS.primary }}>{d.value} cm</span>
            </div>
            <div style={{ fontSize: 13, color: DS.gray400, marginTop: 3 }}>
              = {Math.floor(d.value)} cm and {Math.round((d.value % 1) * 10)} mm
            </div>
          </div>
        </div>
      );
    if (d.context === "medicine")
      return (
        <div
          style={{
            display: "flex",
            gap: 16,
            padding: "20px 0",
            flexWrap: "wrap" as const,
            justifyContent: "center",
          }}
        >
          {d.values.map((v: number, i: number) => (
            <div
              key={i}
              style={{
                padding: "20px 28px",
                borderRadius: DS.radiusMd,
                textAlign: "center" as const,
                background: i === 0 ? "#EAFFF3" : "#FFF0EE",
                border: `2px solid ${i === 0 ? DS.success : DS.error}`,
                fontFamily: DS.fontFamily,
              }}
            >
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: i === 0 ? "#1A7A42" : DS.error,
                }}
              >
                {v} mg
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: i === 0 ? DS.success : DS.error,
                  marginTop: 4,
                  fontWeight: 600,
                }}
              >
                {i === 0 ? "✓ Correct dose" : "✗ 10× overdose!"}
              </div>
            </div>
          ))}
        </div>
      );
    if (d.context === "money")
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "20px 0",
          }}
        >
          {iconBox("💰")}
          <div style={{ fontFamily: DS.fontFamily }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: DS.gray900 }}>
              Price: <span style={{ color: DS.primary }}>₹{d.value}</span>
            </div>
            <div style={{ fontSize: 13, color: DS.gray400, marginTop: 3 }}>
              = {Math.floor(d.value)} rupees + {Math.round((d.value % 1) * 100)}{" "}
              paise
            </div>
          </div>
        </div>
      );
    if (d.context === "sports")
      return (
        <div
          style={{
            display: "flex",
            gap: 16,
            padding: "20px 0",
            flexWrap: "wrap" as const,
            justifyContent: "center",
          }}
        >
          {d.values.map((v: number, i: number) => (
            <div
              key={i}
              style={{
                padding: "18px 28px",
                borderRadius: DS.radiusMd,
                textAlign: "center" as const,
                background: i === 0 ? "#EAFFF3" : DS.accentLight,
                border: `2px solid ${i === 0 ? DS.success : DS.accent}`,
                fontFamily: DS.fontFamily,
              }}
            >
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: i === 0 ? "#1A7A42" : DS.accent,
                }}
              >
                {v}s
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: i === 0 ? DS.success : DS.accent,
                  marginTop: 4,
                  fontWeight: 600,
                }}
              >
                Runner {String.fromCharCode(65 + i)} {i === 0 ? "🥇" : "🥈"}
              </div>
            </div>
          ))}
          <div
            style={{
              width: "100%",
              textAlign: "center" as const,
              fontSize: 13,
              color: DS.primary,
              fontWeight: 600,
              marginTop: 6,
              fontFamily: DS.fontFamily,
            }}
          >
            Difference: just {(d.values[1] - d.values[0]).toFixed(2)} seconds!
          </div>
        </div>
      );
    return null;
  };

  const pct: number =
    ((currentStepIndex + 1) / Math.max(filteredSteps.length, 1)) * 100;
  const canPrev: boolean = currentStepIndex > 0;
  const canNext: boolean = currentStepIndex < filteredSteps.length - 1;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 800,
        margin: "0 auto",
        background: DS.white,
        borderRadius: DS.radiusLg,
        overflow: "hidden",
        boxShadow: DS.shadowXl,
        fontFamily: DS.fontFamily,
      }}
    >
      {/* Mode Selector */}
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "16px 24px",
          background: DS.gray100,
          borderBottom: `1px solid ${DS.gray200}`,
          justifyContent: "center",
          flexWrap: "wrap" as const,
        }}
      >
        {(["learn", "practice", "real_world"] as ModeType[]).map(
          (mode: ModeType) => {
            const sel: boolean = selectedMode === mode;
            const t: ModeTheme = modeThemes[mode];
            const Icon: React.FC<IconProps> = t.icon;
            return (
              <button
                key={mode}
                onClick={() => changeMode(mode)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 24px",
                  height: 40,
                  borderRadius: 999,
                  fontFamily: DS.fontFamily,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  outline: "none",
                  border: sel ? "none" : `2px solid ${DS.gray200}`,
                  background: sel
                    ? `linear-gradient(135deg, ${t.from}, ${t.to})`
                    : DS.white,
                  color: sel ? DS.white : DS.gray900,
                  boxShadow: sel ? DS.shadowMd : "none",
                }}
              >
                <Icon size={16} />
                {t.label}
              </button>
            );
          },
        )}
      </div>

      {/* Header */}
      <div
        style={{
          padding: "28px 32px 24px",
          color: DS.white,
          position: "relative" as const,
          overflow: "hidden",
          background: `linear-gradient(135deg, ${mt.from}, ${mt.to})`,
        }}
      >
        <div
          style={{
            position: "absolute" as const,
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.12)",
          }}
        />
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            margin: 0,
            fontFamily: DS.fontFamily,
            position: "relative" as const,
            zIndex: 1,
          }}
        >
          {currentStep?.title}
        </h2>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(255,255,255,0.18)",
            padding: "5px 14px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 500,
            marginTop: 8,
            position: "relative" as const,
            zIndex: 1,
          }}
        >
          Step {currentStepIndex + 1} of {filteredSteps.length}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: DS.gray200, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            background: `linear-gradient(90deg, ${mt.from}, ${mt.to})`,
            transition: "width 0.5s ease-out",
            width: `${pct}%`,
          }}
        />
      </div>

      {/* Score bar */}
      {selectedMode === "practice" && attempts > 0 && (
        <div style={{ padding: "12px 28px 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "10px 18px",
              background: DS.primaryLight + "40",
              borderRadius: DS.radiusSm,
            }}
          >
            <Award size={18} style={{ color: DS.primary }} />
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: DS.gray900,
                fontFamily: DS.fontFamily,
              }}
            >
              Score: {score}/{attempts}
            </span>
            <div
              style={{
                flex: 1,
                height: 6,
                background: DS.gray200,
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  background: `linear-gradient(90deg, ${DS.gradientFrom}, ${DS.gradientTo})`,
                  width: `${(score / Math.max(attempts, 1)) * 100}%`,
                  borderRadius: 3,
                  transition: "width 0.5s ease",
                }}
              />
            </div>
            <Star
              size={15}
              style={{
                color: DS.accent,
                opacity: score === attempts && attempts > 0 ? 1 : 0.25,
              }}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div
        style={{
          padding: "24px 28px",
          opacity: contentVisible ? 1 : 0,
          transform: contentVisible ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
        }}
      >
        <div
          style={{
            fontSize: 15,
            lineHeight: 1.75,
            color: DS.gray900,
            padding: "16px 20px",
            background: DS.gray100,
            borderRadius: DS.radiusSm,
            borderLeft: `4px solid ${mt.from}`,
            fontFamily: DS.fontFamily,
          }}
        >
          {currentStep?.description}
        </div>

        {currentStep?.scale && (
          <div
            style={{
              margin: "20px 0 8px",
              padding: "16px 8px",
              background: "#FAFAFE",
              borderRadius: DS.radiusSm,
              border: `1px solid ${DS.gray200}`,
            }}
          >
            <NCERTNumberLine
              key={`${currentStep.id}-${currentStepIndex}`}
              rangeMin={currentStep.scale.rangeMin}
              rangeMax={currentStep.scale.rangeMax}
              majorDivisions={currentStep.scale.majorDivisions}
              subDivisionsPerMajor={
                currentStep.scale.subDivisionsPerMajor || 10
              }
              showSubTicks={currentStep.scale.showSubTicks !== false}
              highlight={currentStep.scale.highlight ?? null}
              highlightLabel={currentStep.scale.highlightLabel ?? null}
              highlightStyle={currentStep.scale.highlightStyle || "circle"}
              compareNumbers={currentStep.scale.compareNumbers ?? null}
              letterMarkers={currentStep.scale.letterMarkers ?? null}
              zeroDemo={currentStep.scale.zeroDemo || false}
              highlightAll={currentStep.scale.highlightAll || false}
              zoomDemo={currentStep.scale.zoomDemo || false}
              showMagnifier={currentStep.scale.showMagnifier || false}
              magnifierFrom={currentStep.scale.magnifierFrom ?? null}
              magnifierTo={currentStep.scale.magnifierTo ?? null}
              customAnnotations={currentStep.scale.customAnnotations ?? null}
              bracketRange={currentStep.scale.bracketRange ?? null}
              bracketLabel={currentStep.scale.bracketLabel ?? null}
            />
          </div>
        )}

        {selectedMode === "practice" && renderPractice()}
        {selectedMode === "real_world" && renderRW()}
      </div>

      {/* Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 28px",
          background: DS.gray100,
          borderTop: `1px solid ${DS.gray200}`,
        }}
      >
        <button
          disabled={!canPrev}
          onClick={() => goToStep(currentStepIndex - 1)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "8px 20px",
            height: 38,
            borderRadius: 999,
            fontFamily: DS.fontFamily,
            fontWeight: 600,
            fontSize: 13,
            cursor: canPrev ? "pointer" : "not-allowed",
            outline: "none",
            border: `2px solid ${canPrev ? DS.primary : DS.gray200}`,
            background: DS.white,
            color: canPrev ? DS.primary : DS.gray400,
            opacity: canPrev ? 1 : 0.45,
          }}
        >
          <ChevronLeft size={16} />
          Previous
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "8px 20px",
            height: 38,
            borderRadius: 999,
            fontFamily: DS.fontFamily,
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
            outline: "none",
            border: "none",
            background: `linear-gradient(135deg, ${DS.gradientFrom}, ${DS.gradientTo})`,
            color: "#fff",
            boxShadow: "0 2px 8px rgba(83, 48, 134, 0.18)",
          }}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          disabled={!canNext}
          onClick={() => goToStep(currentStepIndex + 1)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "8px 20px",
            height: 38,
            borderRadius: 999,
            fontFamily: DS.fontFamily,
            fontWeight: 600,
            fontSize: 13,
            cursor: canNext ? "pointer" : "not-allowed",
            outline: "none",
            border: "none",
            background: canNext
              ? `linear-gradient(135deg, ${DS.gradientFrom}, ${DS.gradientTo})`
              : DS.gray200,
            color: canNext ? "#fff" : DS.gray400,
            boxShadow: canNext ? "0 2px 8px rgba(83, 48, 134, 0.18)" : "none",
            opacity: canNext ? 1 : 0.45,
          }}
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default DecimalNumberLineTool;
