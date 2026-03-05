// @ts-ignore - React types resolved by project/bundler
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  // @ts-expect-error React types resolved by project/bundler
} from "react";
// @ts-ignore - lucide-react types resolved by project/bundler
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Check,
  RotateCcw,
  Plus,
  // @ts-expect-error lucide-react types resolved by project/bundler
} from "lucide-react";

// ==================== TYPE DEFINITIONS ====================

type ModeType = "learn";

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
  type: string;
  mode: ModeType;
}

interface BaseDataInterface {
  themeColor?: string;
  autoPlayDuration?: number;
}

interface PlayerData {
  name: string;
  color: string;
  colorLight: string;
  scores: (number | null)[];
  matchLabels: string[];
}

interface AverageMeanAdditionalProps {
  player1?: PlayerData;
  player2?: PlayerData;
  title?: string;
  subtitle?: string;
}

interface NeedForAverageToolProps {
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
    additionalProps?: AverageMeanAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== SINGULARITY DESIGN SYSTEM TOKENS ====================

const DS = {
  primary: "#4A4DC9",
  accent: "#FF7212",
  gradStart: "#533086",
  gradEnd: "#FC9145",
  primaryTint: "#C1C1EA",
  accentTint: "#FFF3E4",
  textDark: "#4E4E4E",
  textMuted: "#CACACA",
  borderLight: "#EBEBEB",
  bgSubtle: "#F5F5F5",
  white: "#FFFFFF",
  player1Color: "#4A4DC9",
  player1Light: "#C1C1EA",
  player2Color: "#FF7212",
  player2Light: "#FFF3E4",
  radiusPill: 100,
  radiusCard: 20,
  radiusChip: 14,
  font: "'Poppins', sans-serif",
};

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

// ==================== DEFAULT DATA ====================

const DEFAULT_PLAYER1: PlayerData = {
  name: "Shubman",
  color: DS.player1Color,
  colorLight: DS.player1Light,
  scores: [23, 7, 10, 52, 18],
  matchLabels: ["Match 1", "Match 2", "Match 3", "Match 4", "Match 5"],
};

const DEFAULT_PLAYER2: PlayerData = {
  name: "Yashasvi",
  color: DS.player2Color,
  colorLight: DS.player2Light,
  scores: [26, 53, 2, null, 15],
  matchLabels: ["Match 1", "Match 2", "Match 3", "Match 4", "Match 5"],
};

const PHASES = [
  { id: 0, title: "Raw Data", icon: "📊" },
  { id: 1, title: "The Problem", icon: "⚠️" },
  { id: 2, title: "Sum", icon: "➕" },
  { id: 3, title: "Count", icon: "🔢" },
  { id: 4, title: "Divide", icon: "➗" },
  { id: 5, title: "Compare", icon: "🏆" },
];

// ==================== KEYFRAMES ====================

const keyframes = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeInRight { from { opacity: 0; transform: translateX(32px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-32px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes popIn { 0% { transform: scale(0); opacity: 0; } 70% { transform: scale(1.12); } 100% { transform: scale(1); opacity: 1; } }
    @keyframes glowPri { 0%, 100% { box-shadow: 0 0 0 0 rgba(74,77,201,0); } 50% { box-shadow: 0 0 16px 3px rgba(74,77,201,0.18); } }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-16px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes bounceIn { 0% { transform: scale(0.3); opacity: 0; } 50% { transform: scale(1.06); } 70% { transform: scale(0.94); } 100% { transform: scale(1); opacity: 1; } }
    @keyframes countPulse { 0% { transform: scale(1); } 50% { transform: scale(1.18); color: #FF7212; } 100% { transform: scale(1); } }
    @keyframes shimGrad { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    @keyframes trophy { 0% { transform: scale(0) rotate(-20deg); } 60% { transform: scale(1.25) rotate(8deg); } 100% { transform: scale(1) rotate(0deg); } }
    @keyframes barGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
    @keyframes numRoll { 0% { opacity: 0; transform: translateY(16px); } 100% { opacity: 1; transform: translateY(0); } }
    @keyframes warnShake { 0%, 100% { transform: translateX(0); } 15%, 45%, 75% { transform: translateX(-3px); } 30%, 60%, 90% { transform: translateX(3px); } }
    @keyframes confA { 0% { transform: translateY(0) rotate(0); opacity:1; } 100% { transform: translateY(-55px) rotate(720deg); opacity:0; } }
    @keyframes confB { 0% { transform: translateY(0) rotate(0); opacity:1; } 100% { transform: translateY(-70px) translateX(25px) rotate(540deg); opacity:0; } }
    @keyframes confC { 0% { transform: translateY(0) rotate(0); opacity:1; } 100% { transform: translateY(-45px) translateX(-20px) rotate(360deg); opacity:0; } }
`;

// ==================== MAIN COMPONENT ====================

const NeedForAverageTool: React.FC<NeedForAverageToolProps> = ({
  props = {} as NonNullable<NeedForAverageToolProps["props"]>,
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 600,
      showNavigation: props.showNavigation ?? true,
      showPlayPause: props.showPlayPause ?? true,
      showStepIndicator: props.showStepIndicator ?? true,
      animationSpeed: props.animationSpeed ?? 1,
      autoPlayDuration: props.autoPlayDuration ?? 0,
      themeColor: props.themeColor ?? DS.primary,
      darkMode: props.darkMode ?? false,
    }),
    [props],
  );

  const additionalProps = props.additionalProps || {};
  const player1: PlayerData = additionalProps.player1 || DEFAULT_PLAYER1;
  const player2: PlayerData = additionalProps.player2 || DEFAULT_PLAYER2;
  const title = additionalProps.title || "Need for Average";
  const subtitle = additionalProps.subtitle || "When Totals Are Not Enough";

  const p1Scores = player1.scores.filter((s) => s !== null) as number[];
  const p2Scores = player2.scores.filter((s) => s !== null) as number[];
  const p1Sum = p1Scores.reduce((a, b) => a + b, 0);
  const p2Sum = p2Scores.reduce((a, b) => a + b, 0);
  const p1Count = p1Scores.length;
  const p2Count = p2Scores.length;
  const p1Avg = p1Sum / p1Count;
  const p2Avg = p2Sum / p2Count;

  const [currentPhase, setCurrentPhase] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animatedP1Sum, setAnimatedP1Sum] = useState(0);
  const [animatedP2Sum, setAnimatedP2Sum] = useState(0);
  const [animatedP1Avg, setAnimatedP1Avg] = useState(0);
  const [animatedP2Avg, setAnimatedP2Avg] = useState(0);
  const [hovNav, setHovNav] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cw, setCw] = useState(800);

  useEffect(() => {
    const obs = new ResizeObserver((e) => {
      for (const en of e) setCw(en.contentRect.width);
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const mob = cw < 600;

  useEffect(() => {
    const id = "singularity-avg-kf";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id;
      s.textContent = keyframes;
      document.head.appendChild(s);
    }
    return () => {
      const el = document.getElementById(id);
      if (el) document.head.removeChild(el);
    };
  }, []);

  useEffect(() => {
    if (currentPhase >= 2) {
      const dur = 1200,
        st = performance.now();
      const anim = (t: number) => {
        const p = Math.min((t - st) / dur, 1),
          e = easeOutCubic(p);
        setAnimatedP1Sum(Math.round(e * p1Sum));
        setAnimatedP2Sum(Math.round(e * p2Sum));
        if (p < 1) requestAnimationFrame(anim);
      };
      requestAnimationFrame(anim);
    }
  }, [currentPhase, p1Sum, p2Sum]);

  useEffect(() => {
    if (currentPhase >= 4) {
      const dur = 1500,
        st = performance.now();
      const anim = (t: number) => {
        const p = Math.min((t - st) / dur, 1),
          e = easeOutCubic(p);
        setAnimatedP1Avg(Math.round(e * p1Avg * 10) / 10);
        setAnimatedP2Avg(Math.round(e * p2Avg * 10) / 10);
        if (p < 1) requestAnimationFrame(anim);
      };
      requestAnimationFrame(anim);
    }
  }, [currentPhase, p1Avg, p2Avg]);

  useEffect(() => {
    if (setStepDetails)
      setStepDetails({
        currentStep: currentPhase,
        totalSteps: PHASES.length,
        isPaused: !isPlaying,
        currentMode: "learn",
      });
  }, [currentPhase, isPlaying, setStepDetails]);

  useEffect(() => {
    if (
      isPlaying &&
      config.autoPlayDuration > 0 &&
      currentPhase < PHASES.length - 1
    ) {
      const t = setTimeout(() => {
        setCurrentPhase((p) => Math.min(p + 1, PHASES.length - 1));
        setAnimKey((k) => k + 1);
      }, config.autoPlayDuration);
      return () => clearTimeout(t);
    }
    if (currentPhase >= PHASES.length - 1) setIsPlaying(false);
  }, [isPlaying, currentPhase, config.autoPlayDuration]);

  const goNext = useCallback(() => {
    if (currentPhase < PHASES.length - 1) {
      setCurrentPhase((p) => p + 1);
      setAnimKey((k) => k + 1);
    }
  }, [currentPhase]);
  const goPrev = useCallback(() => {
    if (currentPhase > 0) {
      setCurrentPhase((p) => p - 1);
      setAnimKey((k) => k + 1);
    }
  }, [currentPhase]);
  const reset = useCallback(() => {
    setCurrentPhase(0);
    setAnimKey((k) => k + 1);
    setIsPlaying(false);
    setAnimatedP1Sum(0);
    setAnimatedP2Sum(0);
    setAnimatedP1Avg(0);
    setAnimatedP2Avg(0);
  }, []);

  // ─── Score Chip ───
  const Chip = ({
    score,
    color,
    delay,
    isNull,
  }: {
    score: number | null;
    color: string;
    delay: number;
    isNull: boolean;
    key?: React.Key;
  }) => (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: mob ? 38 : 46,
        height: mob ? 38 : 46,
        borderRadius: DS.radiusChip,
        background: isNull ? DS.bgSubtle : color,
        color: isNull ? DS.textMuted : DS.white,
        fontWeight: 700,
        fontSize: mob ? 14 : 16,
        fontFamily: DS.font,
        border: isNull ? `2px dashed ${DS.textMuted}` : `2px solid ${color}`,
        animation: `popIn 0.4s ease-out ${delay}s both`,
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: isNull ? "none" : `0 4px 14px ${color}30`,
      }}
    >
      {isNull ? "—" : score}
    </div>
  );

  // ─── Player Card ───
  const Card = ({
    player,
    scores,
    sum,
    count,
    avg,
    animSum,
    animAvg,
    isLeft,
  }: {
    player: PlayerData;
    scores: number[];
    sum: number;
    count: number;
    avg: number;
    animSum: number;
    animAvg: number;
    isLeft: boolean;
  }) => {
    const vc = scores.length;
    const win = currentPhase === 5 && avg >= Math.max(p1Avg, p2Avg);
    const pri = player.color === DS.player1Color;

    return (
      <div
        style={{
          flex: 1,
          minWidth: mob ? "100%" : 260,
          background: DS.white,
          borderRadius: DS.radiusCard,
          padding: mob ? 16 : 24,
          border: win
            ? `3px solid ${DS.accent}`
            : `1.5px solid ${DS.borderLight}`,
          animation: `${isLeft ? "fadeInLeft" : "fadeInRight"} 0.5s ease-out both`,
          boxShadow: win
            ? `0 0 32px ${DS.accent}25`
            : `0 4px 24px rgba(74,77,201,0.06)`,
          transition: "all 0.5s cubic-bezier(0.4,0,0.2,1)",
          position: "relative" as const,
          overflow: "hidden",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: win
              ? `linear-gradient(90deg,${DS.gradStart},${DS.gradEnd})`
              : player.color,
            borderRadius: "20px 20px 0 0",
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 18,
            marginTop: 4,
          }}
        >
          <div
            style={{
              width: mob ? 40 : 48,
              height: mob ? 40 : 48,
              borderRadius: "50%",
              background: `linear-gradient(135deg,${player.color},${pri ? DS.gradStart : DS.gradEnd})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: DS.white,
              fontWeight: 700,
              fontSize: mob ? 17 : 20,
              fontFamily: DS.font,
              boxShadow: `0 4px 14px ${player.color}35`,
            }}
          >
            {player.name[0]}
          </div>
          <div>
            <div
              style={{
                fontFamily: DS.font,
                fontWeight: 700,
                fontSize: mob ? 18 : 22,
                color: player.color,
                lineHeight: 1.15,
              }}
            >
              {player.name}
            </div>
            <div
              style={{
                fontFamily: DS.font,
                fontSize: 12,
                color: DS.textMuted,
                fontWeight: 500,
              }}
            >
              {vc} match{vc !== 1 ? "es" : ""} played
            </div>
          </div>
          {win && (
            <div
              style={{
                marginLeft: "auto",
                fontSize: 28,
                animation: "trophy 0.8s ease-out 0.3s both",
              }}
            >
              🏆
            </div>
          )}
        </div>

        {/* Chips */}
        <div
          style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4 }}
        >
          {player.scores.map((s, i) => (
            <Chip
              key={i}
              score={s}
              color={player.color}
              delay={i * 0.08}
              isNull={s === null}
            />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            marginBottom: 14,
          }}
        >
          {player.matchLabels.map((l, i) => (
            <div
              key={i}
              style={{
                width: mob ? 38 : 46,
                textAlign: "center",
                fontSize: 9,
                color: DS.textMuted,
                fontFamily: DS.font,
                fontWeight: 500,
              }}
            >
              {l.replace("Match ", "M")}
            </div>
          ))}
        </div>

        {/* Phase 1 */}
        {currentPhase >= 1 && (
          <div
            style={{
              background: player.colorLight,
              borderRadius: DS.radiusChip,
              padding: "8px 14px",
              marginBottom: 10,
              animation: "slideDown 0.4s ease-out both",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 15 }}>🏏</span>
            <span
              style={{
                fontFamily: DS.font,
                fontSize: 13,
                fontWeight: 600,
                color: DS.textDark,
              }}
            >
              Played{" "}
              <span
                style={{ color: player.color, fontSize: 17, fontWeight: 700 }}
              >
                {vc}
              </span>{" "}
              match{vc !== 1 ? "es" : ""}
            </span>
          </div>
        )}

        {/* Phase 2: Sum */}
        {currentPhase >= 2 && (
          <div
            style={{
              background: `linear-gradient(135deg,${player.colorLight}88,${DS.white})`,
              borderRadius: DS.radiusChip,
              padding: "10px 14px",
              marginBottom: 10,
              animation: "fadeInUp 0.5s ease-out both",
              border: `1px solid ${player.color}22`,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: DS.textDark,
                fontFamily: DS.font,
                fontWeight: 600,
                marginBottom: 5,
                textTransform: "uppercase" as const,
                letterSpacing: "0.08em",
              }}
            >
              Total Runs
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                flexWrap: "wrap",
              }}
            >
              {scores.map((s, i) => (
                <React.Fragment key={i}>
                  <span
                    style={{
                      fontFamily: DS.font,
                      fontSize: mob ? 15 : 17,
                      fontWeight: 700,
                      color: player.color,
                      animation: `numRoll 0.3s ease-out ${i * 0.12}s both`,
                    }}
                  >
                    {s}
                  </span>
                  {i < scores.length - 1 && (
                    <span
                      style={{
                        color: DS.textMuted,
                        fontWeight: 600,
                        fontSize: 13,
                      }}
                    >
                      +
                    </span>
                  )}
                </React.Fragment>
              ))}
              <span
                style={{
                  color: DS.textMuted,
                  fontWeight: 600,
                  margin: "0 5px",
                  fontSize: 15,
                }}
              >
                =
              </span>
              <span
                style={{
                  fontFamily: DS.font,
                  fontSize: mob ? 22 : 26,
                  fontWeight: 800,
                  color: player.color,
                  animation: "bounceIn 0.6s ease-out 0.4s both",
                }}
              >
                {animSum}
              </span>
            </div>
          </div>
        )}

        {/* Phase 3: Count */}
        {currentPhase >= 3 && (
          <div
            style={{
              background: DS.accentTint,
              borderRadius: DS.radiusChip,
              padding: "10px 14px",
              marginBottom: 10,
              animation: "fadeInUp 0.5s ease-out 0.15s both",
              border: `1px solid ${DS.accent}22`,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: DS.textDark,
                fontFamily: DS.font,
                fontWeight: 600,
                marginBottom: 5,
                textTransform: "uppercase" as const,
                letterSpacing: "0.08em",
              }}
            >
              Matches Played
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {Array.from({ length: vc }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg,${DS.accent},${DS.gradEnd})`,
                    color: DS.white,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: DS.font,
                    fontWeight: 700,
                    fontSize: 13,
                    animation: `popIn 0.3s ease-out ${i * 0.08}s both`,
                    boxShadow: `0 2px 8px ${DS.accent}30`,
                  }}
                >
                  {i + 1}
                </div>
              ))}
              <span
                style={{
                  marginLeft: 8,
                  fontFamily: DS.font,
                  fontSize: 18,
                  fontWeight: 700,
                  color: DS.accent,
                  animation: "countPulse 0.6s ease 0.4s both",
                }}
              >
                = {vc}
              </span>
            </div>
          </div>
        )}

        {/* Phase 4: Division */}
        {currentPhase >= 4 && (
          <div
            style={{
              background: `linear-gradient(135deg,${player.colorLight}44,${DS.bgSubtle})`,
              borderRadius: 16,
              padding: "14px 16px",
              marginBottom: 10,
              animation: "fadeInUp 0.5s ease-out 0.25s both",
              border: `2px solid ${player.color}30`,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: DS.textDark,
                fontFamily: DS.font,
                fontWeight: 600,
                marginBottom: 8,
                textTransform: "uppercase" as const,
                letterSpacing: "0.08em",
              }}
            >
              Average = Total ÷ Matches
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: DS.font,
                    fontSize: mob ? 20 : 24,
                    fontWeight: 800,
                    color: player.color,
                    borderBottom: `3px solid ${player.color}`,
                    paddingBottom: 3,
                    animation: "numRoll 0.4s ease-out both",
                  }}
                >
                  {sum}
                </div>
                <div
                  style={{
                    fontFamily: DS.font,
                    fontSize: mob ? 20 : 24,
                    fontWeight: 800,
                    color: DS.accent,
                    paddingTop: 3,
                    animation: "numRoll 0.4s ease-out 0.15s both",
                  }}
                >
                  {vc}
                </div>
              </div>
              <span
                style={{
                  fontSize: 22,
                  color: DS.textMuted,
                  fontWeight: 700,
                  animation: "fadeInRight 0.3s ease-out 0.35s both",
                }}
              >
                =
              </span>
              <div
                style={{
                  fontFamily: DS.font,
                  fontSize: mob ? 28 : 36,
                  fontWeight: 800,
                  color: player.color,
                  animation: "bounceIn 0.8s ease-out 0.5s both",
                }}
              >
                {animAvg}
              </div>
              <span
                style={{
                  fontFamily: DS.font,
                  fontSize: 11,
                  color: DS.textDark,
                  fontWeight: 500,
                  animation: "fadeInUp 0.3s ease-out 0.7s both",
                  opacity: 0.7,
                }}
              >
                runs/
                <br />
                match
              </span>
            </div>
            <div
              style={{
                marginTop: 12,
                height: 6,
                background: DS.borderLight,
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  background: `linear-gradient(90deg,${player.color},${pri ? DS.gradStart : DS.gradEnd})`,
                  borderRadius: 3,
                  animation: "barGrow 1s ease-out 0.4s both",
                  transformOrigin: "left",
                  width: `${(avg / Math.max(p1Avg, p2Avg)) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Phase 5: Winner */}
        {win && (
          <div
            style={{
              background: `linear-gradient(135deg,${DS.accentTint},${DS.accent}15)`,
              borderRadius: DS.radiusPill,
              padding: "10px 18px",
              animation: "bounceIn 0.8s ease-out both",
              border: `2px solid ${DS.accent}`,
              textAlign: "center",
              position: "relative" as const,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                fontFamily: DS.font,
                fontSize: 14,
                fontWeight: 700,
                color: DS.accent,
              }}
            >
              ✨ Higher Average! ✨
            </div>
            <div
              style={{
                fontFamily: DS.font,
                fontSize: 12,
                color: DS.textDark,
                fontWeight: 500,
              }}
            >
              {avg} runs per match
            </div>
            {["confA", "confB", "confC"].map((a, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  bottom: 8,
                  left: `${25 + i * 25}%`,
                  width: 6,
                  height: 6,
                  borderRadius: i === 1 ? 0 : 3,
                  background: [DS.accent, DS.primary, DS.gradStart][i],
                  animation: `${a} 1.5s ease-out ${0.2 + i * 0.12}s infinite`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // ─── Phase Description ───
  const descriptions: {
    [k: number]: { title: string; text: string; emoji: string };
  } = {
    0: {
      title: "Look at the Raw Scores",
      text: `${player1.name} and ${player2.name} played in a cricket series. Look at their scores in each match. Who do you think performed better?`,
      emoji: "🤔",
    },
    1: {
      title: "The Problem with Totals",
      text: `Wait! ${player1.name} played ${p1Count} matches but ${player2.name} played only ${p2Count}. Is it fair to compare their totals when one played more matches?`,
      emoji: "⚠️",
    },
    2: {
      title: "Adding Up the Runs",
      text: `Let's first find each player's total runs. ${player1.name}: ${p1Sum} runs. ${player2.name}: ${p2Sum} runs. ${p1Sum > p2Sum ? player1.name + " has more total runs." : player2.name + " has more total runs."}`,
      emoji: "➕",
    },
    3: {
      title: "Counting the Matches",
      text: `${player1.name} played ${p1Count} matches. ${player2.name} played ${p2Count} matches. Different numbers — so totals alone aren't a fair comparison!`,
      emoji: "🔢",
    },
    4: {
      title: "Dividing to Find the Average",
      text: "Average = Total runs ÷ Number of matches. This gives us the runs scored per match — a fair way to compare!",
      emoji: "➗",
    },
    5: {
      title: "The Surprising Result!",
      text: `${player1.name}'s average: ${p1Avg} runs/match. ${player2.name}'s average: ${p2Avg} runs/match. ${p2Avg > p1Avg ? player2.name + " has a higher average despite " + (p2Sum < p1Sum ? "fewer total runs!" : "playing fewer matches!") : p1Avg > p2Avg ? player1.name + " has a higher average!" : "They have equal averages!"}`,
      emoji: "🏆",
    },
  };

  const desc = descriptions[currentPhase];
  const descBg: { [k: number]: string } = {
    0: DS.bgSubtle,
    1: "#FFF0F0",
    2: DS.bgSubtle,
    3: DS.bgSubtle,
    4: DS.bgSubtle,
    5: DS.accentTint,
  };
  const descBorder: { [k: number]: string } = {
    0: DS.borderLight,
    1: "#FFCACA",
    2: DS.borderLight,
    3: DS.borderLight,
    4: DS.borderLight,
    5: DS.accent,
  };
  const descTitleColor: { [k: number]: string } = {
    0: DS.primary,
    1: "#CC3333",
    2: DS.primary,
    3: DS.primary,
    4: DS.primary,
    5: DS.accent,
  };

  // ─── Main Render ───
  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: config.width,
        minHeight: 400,
        fontFamily: DS.font,
        background: DS.white,
        borderRadius: 24,
        overflow: "hidden",
        boxShadow: "0 8px 40px rgba(74,77,201,0.08)",
        border: `1px solid ${DS.borderLight}`,
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          background: `linear-gradient(135deg,${DS.gradStart},${DS.gradEnd})`,
          padding: mob ? "18px 16px 14px" : "22px 28px 18px",
          position: "relative" as const,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)",
            backgroundSize: "200% 100%",
            animation: "shimGrad 4s linear infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.12)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -30,
            right: 40,
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            position: "relative" as const,
          }}
        >
          <div
            style={{
              width: mob ? 40 : 48,
              height: mob ? 40 : 48,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
            }}
          >
            🏏
          </div>
          <div>
            <div
              style={{
                fontFamily: DS.font,
                fontSize: mob ? 19 : 24,
                fontWeight: 700,
                color: DS.white,
                lineHeight: 1.15,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontFamily: DS.font,
                fontSize: mob ? 11.5 : 13,
                fontWeight: 500,
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {subtitle}
            </div>
          </div>
          <div
            style={{
              marginLeft: "auto",
              background: "rgba(255,255,255,0.15)",
              borderRadius: DS.radiusPill,
              padding: "5px 14px",
              fontFamily: DS.font,
              fontSize: 11,
              fontWeight: 600,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            Grade 7
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: mob ? 14 : 22, background: DS.bgSubtle }}>
        {/* Timeline */}
        <div
          style={{
            display: "flex",
            gap: mob ? 3 : 5,
            marginBottom: 18,
            overflow: "auto",
          }}
        >
          {PHASES.map((ph, i) => {
            const act = i === currentPhase,
              done = i < currentPhase;
            return (
              <button
                key={ph.id}
                onClick={() => {
                  setCurrentPhase(i);
                  setAnimKey((k) => k + 1);
                }}
                style={{
                  flex: 1,
                  minWidth: mob ? 50 : 0,
                  padding: mob ? "8px 4px" : "10px 8px",
                  borderRadius: 14,
                  border: act
                    ? `2px solid ${DS.primary}`
                    : `1.5px solid ${done ? DS.primary + "40" : DS.borderLight}`,
                  background: act
                    ? DS.primaryTint + "44"
                    : done
                      ? DS.primaryTint + "22"
                      : DS.white,
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                  display: "flex",
                  flexDirection: "column" as const,
                  alignItems: "center",
                  gap: 3,
                  animation: act ? "glowPri 2s ease-in-out infinite" : "none",
                  position: "relative" as const,
                }}
              >
                {done && (
                  <div
                    style={{
                      position: "absolute",
                      top: -5,
                      right: -5,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: DS.primary,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      animation: "popIn 0.3s ease-out both",
                      boxShadow: `0 2px 6px ${DS.primary}40`,
                    }}
                  >
                    <Check size={10} color={DS.white} strokeWidth={3} />
                  </div>
                )}
                <span style={{ fontSize: mob ? 15 : 19 }}>{ph.icon}</span>
                <span
                  style={{
                    fontSize: mob ? 8.5 : 10.5,
                    fontFamily: DS.font,
                    fontWeight: 600,
                    color: act ? DS.primary : done ? DS.primary : DS.textMuted,
                    textAlign: "center",
                    lineHeight: 1.2,
                  }}
                >
                  {ph.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Description */}
        <div
          key={`d-${currentPhase}-${animKey}`}
          style={{
            background: descBg[currentPhase],
            borderRadius: 16,
            padding: mob ? "14px 16px" : "18px 22px",
            marginBottom: 18,
            animation: "fadeInUp 0.45s ease-out both",
            border: `1.5px solid ${descBorder[currentPhase]}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <span
              style={{
                fontSize: 26,
                animation:
                  currentPhase === 1
                    ? "warnShake 0.6s ease-out both"
                    : "bounceIn 0.5s ease-out both",
                flexShrink: 0,
              }}
            >
              {desc.emoji}
            </span>
            <div>
              <div
                style={{
                  fontFamily: DS.font,
                  fontSize: mob ? 15 : 17,
                  fontWeight: 700,
                  color: descTitleColor[currentPhase],
                  marginBottom: 4,
                }}
              >
                {desc.title}
              </div>
              <div
                style={{
                  fontFamily: DS.font,
                  fontSize: mob ? 12.5 : 13.5,
                  color: DS.textDark,
                  lineHeight: 1.55,
                  fontWeight: 500,
                }}
              >
                {desc.text}
              </div>
            </div>
          </div>
        </div>

        {/* Player Cards */}
        <div
          key={`c-${animKey}`}
          style={{
            display: "flex",
            gap: mob ? 14 : 20,
            flexDirection: mob ? ("column" as const) : ("row" as const),
            marginBottom: 16,
          }}
        >
          <Card
            player={player1}
            scores={p1Scores}
            sum={p1Sum}
            count={p1Count}
            avg={p1Avg}
            animSum={animatedP1Sum}
            animAvg={animatedP1Avg}
            isLeft={true}
          />
          <Card
            player={player2}
            scores={p2Scores}
            sum={p2Sum}
            count={p2Count}
            avg={p2Avg}
            animSum={animatedP2Sum}
            animAvg={animatedP2Avg}
            isLeft={false}
          />
        </div>

        {/* Hints */}
        {currentPhase === 0 && (
          <div
            style={{
              background: DS.primaryTint + "33",
              borderRadius: DS.radiusPill,
              padding: "10px 18px",
              animation: "fadeInUp 0.5s ease-out 0.7s both",
              border: `1px solid ${DS.primaryTint}`,
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <span style={{ fontSize: 15 }}>💡</span>
            <span
              style={{
                fontFamily: DS.font,
                fontSize: 12.5,
                color: DS.primary,
                fontWeight: 600,
              }}
            >
              Look at the scores. Who do you think performed better? Click
              "Next" to find out!
            </span>
          </div>
        )}
        {currentPhase === 4 && (
          <div
            style={{
              background: DS.accentTint,
              borderRadius: DS.radiusPill,
              padding: "10px 18px",
              animation: "fadeInUp 0.5s ease-out 0.9s both",
              border: `1px solid ${DS.accent}33`,
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <span style={{ fontSize: 15 }}>🤔</span>
            <span
              style={{
                fontFamily: DS.font,
                fontSize: 12.5,
                color: DS.accent,
                fontWeight: 600,
              }}
            >
              Can you predict who has the higher average before looking?
            </span>
          </div>
        )}
        {currentPhase === 5 && (
          <div
            style={{
              background: `linear-gradient(135deg,${DS.primaryTint}33,${DS.accentTint})`,
              borderRadius: 14,
              padding: "12px 18px",
              animation: "fadeInUp 0.5s ease-out 0.9s both",
              border: `1.5px solid ${DS.primary}30`,
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <span style={{ fontSize: 15 }}>📐</span>
            <span
              style={{
                fontFamily: DS.font,
                fontSize: 12.5,
                color: DS.textDark,
                fontWeight: 500,
                lineHeight: 1.5,
              }}
            >
              <strong style={{ color: DS.primary, fontWeight: 700 }}>
                Key Insight:
              </strong>{" "}
              {p2Sum < p1Sum
                ? `${player2.name} had fewer total runs but a higher average!`
                : "The average gives a fairer comparison than the total!"}{" "}
              When groups are different sizes, the{" "}
              <strong style={{ color: DS.accent, fontWeight: 700 }}>
                arithmetic mean
              </strong>{" "}
              is a fairer way to compare.
            </span>
          </div>
        )}

        {/* Navigation — Singularity pill buttons */}
        {config.showNavigation && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              paddingTop: 14,
              borderTop: `1.5px solid ${DS.borderLight}`,
            }}
          >
            {/* Outlined prev */}
            <button
              onClick={goPrev}
              disabled={currentPhase === 0}
              onMouseEnter={() => setHovNav("prev")}
              onMouseLeave={() => setHovNav(null)}
              style={{
                height: 40,
                padding: "0 16px",
                borderRadius: DS.radiusPill,
                border: `2px solid ${currentPhase === 0 ? DS.borderLight : DS.primary}`,
                background:
                  hovNav === "prev" && currentPhase > 0
                    ? DS.primaryTint + "30"
                    : DS.white,
                cursor: currentPhase === 0 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                opacity: currentPhase === 0 ? 0.45 : 1,
                fontFamily: DS.font,
                fontWeight: 600,
                fontSize: 13,
                color: currentPhase === 0 ? DS.textMuted : DS.primary,
              }}
            >
              <ChevronLeft size={18} />
              {!mob && <span>Previous</span>}
            </button>
            {/* Text reset */}
            <button
              onClick={reset}
              onMouseEnter={() => setHovNav("reset")}
              onMouseLeave={() => setHovNav(null)}
              style={{
                height: 40,
                padding: "0 12px",
                borderRadius: DS.radiusPill,
                border: "none",
                background: hovNav === "reset" ? DS.bgSubtle : "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
                transition: "all 0.3s ease",
                fontFamily: DS.font,
                fontWeight: 600,
                fontSize: 13,
                color: DS.textDark,
              }}
            >
              <RotateCcw size={15} />
              {!mob && <span>Reset</span>}
            </button>
            {/* Counter */}
            <div
              style={{
                fontFamily: DS.font,
                fontSize: 13,
                fontWeight: 600,
                color: DS.textMuted,
                minWidth: 70,
                textAlign: "center",
              }}
            >
              {currentPhase + 1}{" "}
              <span style={{ color: DS.borderLight }}>/</span> {PHASES.length}
            </div>
            {/* Contained next */}
            <button
              onClick={goNext}
              disabled={currentPhase >= PHASES.length - 1}
              onMouseEnter={() => setHovNav("next")}
              onMouseLeave={() => setHovNav(null)}
              style={{
                height: 40,
                padding: "0 20px 0 16px",
                borderRadius: DS.radiusPill,
                border: "none",
                background:
                  currentPhase >= PHASES.length - 1
                    ? DS.borderLight
                    : hovNav === "next"
                      ? `linear-gradient(135deg,${DS.gradStart},${DS.gradEnd})`
                      : DS.primary,
                cursor:
                  currentPhase >= PHASES.length - 1 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                color: DS.white,
                fontFamily: DS.font,
                fontWeight: 600,
                fontSize: 13,
                boxShadow:
                  currentPhase >= PHASES.length - 1
                    ? "none"
                    : hovNav === "next"
                      ? `0 6px 20px ${DS.gradStart}40`
                      : `0 4px 14px ${DS.primary}35`,
                transform:
                  hovNav === "next" && currentPhase < PHASES.length - 1
                    ? "translateY(-1px)"
                    : "none",
              }}
            >
              <span>Next</span>
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* ── Formula Footer ── */}
      {currentPhase >= 4 && (
        <div
          style={{
            background: `linear-gradient(135deg,${DS.gradStart},${DS.gradEnd})`,
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            animation: "slideDown 0.5s ease-out both",
          }}
        >
          <span
            style={{
              fontFamily: DS.font,
              fontSize: mob ? 13 : 14,
              color: "rgba(255,255,255,0.75)",
              fontWeight: 600,
            }}
          >
            Mean =
          </span>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: DS.font,
                fontSize: mob ? 12 : 13,
                color: DS.white,
                fontWeight: 700,
                borderBottom: "2px solid rgba(255,255,255,0.3)",
                paddingBottom: 2,
              }}
            >
              Sum of all values
            </div>
            <div
              style={{
                fontFamily: DS.font,
                fontSize: mob ? 12 : 13,
                color: DS.accentTint,
                fontWeight: 700,
                paddingTop: 2,
              }}
            >
              Number of values
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NeedForAverageTool;
