// @ts-nocheck
import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  useCallback,
} from "react";

// ============================================================================
// DESIGN SYSTEM TOKENS (from Singularity PDF)
// ============================================================================
const DS = {
  colors: {
    primary: "#4A4DC9",
    secondary: "#FF7212",
    gradientStart: "#533086",
    gradientEnd: "#FC9145",
    neutral900: "#4E4E4E",
    neutral600: "#CACACA",
    neutral300: "#EBEBEB",
    neutral100: "#F5F5F5",
    lightPurple: "#C1C1EA",
    lightOrange: "#FFF3E4",
    white: "#FFFFFF",
    black: "#1A1A2E",
    // Derived
    primaryDark: "#3A3DB0",
    primaryLight: "#6B6EE0",
    secondaryDark: "#E0640F",
    secondaryLight: "#FF9A55",
    bg: "#0E0E2C",
    bgCard: "rgba(74, 77, 201, 0.08)",
    bgCardAlt: "rgba(255, 114, 18, 0.06)",
  },
  gradients: {
    primary: "linear-gradient(135deg, #533086 0%, #4A4DC9 50%, #FC9145 100%)",
    primaryBtn: "linear-gradient(135deg, #4A4DC9 0%, #533086 100%)",
    secondaryBtn: "linear-gradient(135deg, #FF7212 0%, #FC9145 100%)",
    hero: "linear-gradient(180deg, #0E0E2C 0%, #1A1044 40%, #0E0E2C 100%)",
    card: "linear-gradient(135deg, rgba(83,48,134,0.15) 0%, rgba(74,77,201,0.10) 100%)",
    cardHover:
      "linear-gradient(135deg, rgba(83,48,134,0.25) 0%, rgba(74,77,201,0.18) 100%)",
    text: "linear-gradient(135deg, #C1C1EA 0%, #FC9145 100%)",
    orangeAccent: "linear-gradient(135deg, #FF7212 0%, #FC9145 100%)",
    purpleAccent: "linear-gradient(135deg, #4A4DC9 0%, #533086 100%)",
  },
  font: "'Poppins', sans-serif",
  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    pill: "9999px",
  },
  shadow: {
    sm: "0 2px 8px rgba(74, 77, 201, 0.10)",
    md: "0 4px 20px rgba(74, 77, 201, 0.15)",
    lg: "0 8px 40px rgba(83, 48, 134, 0.20)",
    glow: "0 0 30px rgba(74, 77, 201, 0.3)",
    orangeGlow: "0 0 30px rgba(255, 114, 18, 0.25)",
  },
};

// ============================================================================
// EASING FUNCTIONS
// ============================================================================
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInOutQuad = (t) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

// ============================================================================
// TRANSLATION DATA
// ============================================================================
const translationsData = {
  en: {
    nav: {
      logo: "Revolution of the Earth",
      tabs: {
        learn: "Learn",
        practice: "Practice",
        applications: "Real World",
      },
    },
    learn: {
      header: "Revolution of the Earth",
      subtitle: "Earth's Journey Around the Sun",
    },
    practice: {
      header: "Practice Revolution",
      subtitle: "Test your knowledge",
    },
    common: {
      comingSoon: "Coming Soon",
      stayTuned: "Stay tuned for exciting interactive content!",
    },
    learnMode: {
      header: "Learn Mode",
      progress: "Progress",
      previous: "Previous",
      next: "Next",
      complete: "Complete! 🎉",
    },
    practiceMode: {
      header: "Practice Mode",
      streak: "Streak",
      score: "Score",
      question: "Question",
      of: "of",
      submitAnswer: "Submit Answer",
      nextQuestion: "Next Question",
      viewResults: "View Results",
      correct: "Correct! 🎉",
      notQuiteRight: "Not quite right",
      quizCompleted: "Quiz Completed!",
      outstanding: "Outstanding! 🎉",
      excellent: "Excellent Work! 🌟",
      goodJob: "Good Job! 👍",
      keepPracticing: "Keep Practicing! 💪",
      dontGiveUp: "Don't Give Up! 🌱",
      finalScore: "Final Score",
      bestStreak: "Best Streak",
      inARow: "in a row",
      questions: "Questions",
      completed: "completed",
      performanceBreakdown: "Performance Breakdown",
      tryAgain: "Try Again",
    },
    realWorld: {
      header: "Real World Applications",
      subtitle: "Apply your knowledge to solve real-life scenarios!",
      description:
        "See how Earth's rotation and revolution affect our daily lives",
      backToScenarios: "Back to Scenarios",
      scenario: "Scenario",
      context: "Context",
      question: "Question:",
      realWorldConnection: "Real-World Connection",
      yourAnswer: "Your Answer:",
      answerPlaceholder: "Type your answer here...",
      checkSolution: "Check Solution",
      quickAnswer: "Quick Answer",
      detailedExplanation: "Detailed Explanation:",
      keyTakeaways: "💡 Key Takeaways",
      previous: "← Previous",
      nextScenario: "Next Scenario →",
      complete: "Complete! 🎉",
    },
    learnContent: {
      earthInSolarSystem: "Earth in the Solar System",
      current: "Current",
      sun: "Sun",
      earth: "Earth",
      directionOfRevolution: "Direction of Revolution",
      counterClockwise: "(Counter-clockwise)",
      pause: "⏸️ Pause",
      play: "▶️ Play",
      speed: "Speed",
      jumpTo: "Jump to",
      keyFactsAboutRevolution: "📚 Key Facts About Revolution",
      seasons: {
        spring: {
          name: "Spring",
          months: "March - May",
          description: "Days get longer and warmer. Plants begin to grow.",
          hemisphere: "Northern Hemisphere tilts toward Sun",
          event: "Spring Equinox (March 21) - Day = Night",
        },
        summer: {
          name: "Summer",
          months: "June - August",
          description: "Longest days and warmest weather of the year.",
          hemisphere: "Northern Hemisphere most tilted toward Sun",
          event: "Summer Solstice (June 21) - Longest Day",
        },
        autumn: {
          name: "Autumn",
          months: "September - November",
          description: "Days get shorter and cooler. Leaves change color.",
          hemisphere: "Northern Hemisphere tilts away from Sun",
          event: "Autumn Equinox (Sept 23) - Day = Night",
        },
        winter: {
          name: "Winter",
          months: "December - February",
          description: "Shortest days and coldest weather of the year.",
          hemisphere: "Northern Hemisphere most tilted away from Sun",
          event: "Winter Solstice (Dec 22) - Shortest Day",
        },
      },
      seasonMarkers: {
        springEquinox: "Spring Equinox",
        summerSolstice: "Summer Solstice",
        autumnEquinox: "Autumn Equinox",
        winterSolstice: "Winter Solstice",
      },
      keyFacts: {
        revolutionPeriod: {
          title: "Revolution Period",
          fact: "365¼ days (1 year)",
          detail: "This extra ¼ day is why we have a leap year every 4 years!",
        },
        orbitalShape: {
          title: "Orbital Shape",
          fact: "Elliptical (oval-shaped)",
          detail: "Earth is sometimes closer to the Sun and sometimes farther.",
        },
        axialTilt: {
          title: "Axial Tilt",
          fact: "23.5 degrees",
          detail: "This tilt is the main reason we have different seasons!",
        },
        orbitalSpeed: {
          title: "Orbital Speed",
          fact: "~30 km/s (108,000 km/h)",
          detail: "That's about 30 times faster than a bullet!",
        },
        distanceFromSun: {
          title: "Distance from Sun",
          fact: "~150 million km (average)",
          detail: "Light from the Sun takes about 8 minutes to reach Earth.",
        },
      },
    },
  },
};

// ============================================================================
// LANGUAGE CONTEXT
// ============================================================================
const LanguageContext = createContext(undefined);
const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
const getSeasonData = (season, translations) => {
  const baseData = {
    spring: {
      color: DS.colors.primaryLight,
      bgGradient: `linear-gradient(135deg, ${DS.colors.lightPurple} 0%, #d4d6f7 50%, ${DS.colors.lightOrange} 100%)`,
      icon: "🌸",
    },
    summer: {
      color: DS.colors.secondary,
      bgGradient: `linear-gradient(135deg, ${DS.colors.lightOrange} 0%, #FFD4A8 50%, ${DS.colors.secondaryLight} 100%)`,
      icon: "☀️",
    },
    autumn: {
      color: "#E8752C",
      bgGradient: `linear-gradient(135deg, ${DS.colors.lightOrange} 0%, #FFDCC0 50%, #FFB87A 100%)`,
      icon: "🍂",
    },
    winter: {
      color: DS.colors.primary,
      bgGradient: `linear-gradient(135deg, #E8E8F8 0%, ${DS.colors.lightPurple} 50%, #B8B8E0 100%)`,
      icon: "❄️",
    },
  };
  const safe = translations?.learnContent?.seasons
    ? translations
    : translationsData["en"];
  const sd = safe?.learnContent?.seasons?.[season];
  const names = {
    spring: "Spring",
    summer: "Summer",
    autumn: "Autumn",
    winter: "Winter",
  };
  return {
    ...baseData[season],
    name: sd?.name || names[season],
    months: sd?.months || "",
    description: sd?.description || "",
    hemisphere: sd?.hemisphere || "",
    event: sd?.event || "",
  };
};

// ============================================================================
// ICON COMPONENTS
// ============================================================================
const GlobeIcon = ({ size = 24, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const CheckCircleIcon = ({ size = 24, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const XCircleIcon = ({ size = 24, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);
const TrophyIcon = ({ size = 24, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);
const InfoIcon = ({ size = 24, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

// ============================================================================
// LEARN MODE
// ============================================================================
const RevolutionLearnMode = ({ additionalProps }) => {
  const { translations } = useLanguage();
  const safe = translations || translationsData["en"];

  const [orbitAngle, setOrbitAngle] = useState(
    additionalProps?.orbitStartAngle || 90,
  );
  const [isPlaying, setIsPlaying] = useState(
    additionalProps?.enableAutoPlay !== false,
  );
  const [speed, setSpeed] = useState(1);
  const [currentSeason, setCurrentSeason] = useState("summer");
  const [earthRotation, setEarthRotation] = useState(0);
  const [hoveredFact, setHoveredFact] = useState(null);
  const animationRef = useRef(null);
  const speedRef = useRef(speed);
  const isPlayingRef = useRef(isPlaying);
  const previousQuadrantRef = useRef(Math.floor(orbitAngle / 90));

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const getOrbitPosition = useCallback((angle) => {
    const a = 180,
      b = 120;
    const rad = (angle * Math.PI) / 180;
    const x = a * Math.cos(rad),
      y = b * Math.sin(rad);
    let season, month, tilt;
    if (angle >= 0 && angle < 90) {
      season = "spring";
      month = "March - May";
      tilt = 23.5 * (angle / 90);
    } else if (angle >= 90 && angle < 180) {
      season = "summer";
      month = "June - August";
      tilt = 23.5;
    } else if (angle >= 180 && angle < 270) {
      season = "autumn";
      month = "September - November";
      tilt = 23.5 * (1 - (angle - 180) / 90);
    } else {
      season = "winter";
      month = "December - February";
      tilt = -23.5;
    }
    return { angle, x, y, season, month, tilt };
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }
    const animate = () => {
      if (!isPlayingRef.current) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
        return;
      }
      setOrbitAngle((prev) => (prev - 0.3 * speedRef.current + 360) % 360);
      setEarthRotation((prev) => (prev + 2 * speedRef.current) % 360);
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isPlaying, speed]);

  useEffect(() => {
    const cq = Math.floor(orbitAngle / 90);
    if (cq !== previousQuadrantRef.current) {
      previousQuadrantRef.current = cq;
      setCurrentSeason(getOrbitPosition(orbitAngle).season);
    }
  }, [orbitAngle, getOrbitPosition]);

  const position = getOrbitPosition(orbitAngle);
  const seasonInfo = getSeasonData(currentSeason, safe);

  const keyFacts = [
    {
      icon: "⏱️",
      title:
        safe?.learnContent?.keyFacts?.revolutionPeriod?.title ||
        "Revolution Period",
      fact:
        safe?.learnContent?.keyFacts?.revolutionPeriod?.fact ||
        "365¼ days (1 year)",
      detail:
        safe?.learnContent?.keyFacts?.revolutionPeriod?.detail ||
        "This extra ¼ day is why we have a leap year every 4 years!",
    },
    {
      icon: "🛤️",
      title:
        safe?.learnContent?.keyFacts?.orbitalShape?.title || "Orbital Shape",
      fact:
        safe?.learnContent?.keyFacts?.orbitalShape?.fact ||
        "Elliptical (oval-shaped)",
      detail:
        safe?.learnContent?.keyFacts?.orbitalShape?.detail ||
        "Earth is sometimes closer to the Sun and sometimes farther.",
    },
    {
      icon: "📐",
      title: safe?.learnContent?.keyFacts?.axialTilt?.title || "Axial Tilt",
      fact: safe?.learnContent?.keyFacts?.axialTilt?.fact || "23.5 degrees",
      detail:
        safe?.learnContent?.keyFacts?.axialTilt?.detail ||
        "This tilt is the main reason we have different seasons!",
    },
    {
      icon: "🚀",
      title:
        safe?.learnContent?.keyFacts?.orbitalSpeed?.title || "Orbital Speed",
      fact:
        safe?.learnContent?.keyFacts?.orbitalSpeed?.fact ||
        "~30 km/s (108,000 km/h)",
      detail:
        safe?.learnContent?.keyFacts?.orbitalSpeed?.detail ||
        "That's about 30 times faster than a bullet!",
    },
    {
      icon: "📏",
      title:
        safe?.learnContent?.keyFacts?.distanceFromSun?.title ||
        "Distance from Sun",
      fact:
        safe?.learnContent?.keyFacts?.distanceFromSun?.fact ||
        "~150 million km (average)",
      detail:
        safe?.learnContent?.keyFacts?.distanceFromSun?.detail ||
        "Light from the Sun takes about 8 minutes to reach Earth.",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: DS.gradients.hero,
        color: "white",
        position: "relative",
        overflow: "hidden",
        fontFamily: DS.font,
      }}
    >
      {/* Starfield */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {[...Array(120)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              borderRadius: "50%",
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
              background: Math.random() > 0.7 ? DS.colors.lightPurple : "white",
              animation: `starPulse ${Math.random() * 2 + 1}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header
        style={{
          padding: "1rem 1.5rem",
          background: "rgba(14, 14, 44, 0.7)",
          backdropFilter: "blur(40px)",
          borderBottom: `1px solid rgba(74, 77, 201, 0.2)`,
        }}
      >
        <div style={{ maxWidth: "90rem", margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "clamp(1.25rem, 4vw, 2rem)",
              fontWeight: "700",
              marginBottom: "0.25rem",
              background: DS.gradients.text,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
                WebkitTextFillColor: "initial",
              }}
            >
              🌍
            </span>
            <span style={{ wordBreak: "break-word" }}>
              {safe?.learn?.header || "Revolution of the Earth"}
            </span>
          </h1>
          <p
            style={{
              marginTop: "0.25rem",
              opacity: 0.6,
              fontSize: "clamp(0.75rem, 2vw, 0.95rem)",
              color: DS.colors.lightPurple,
            }}
          >
            {safe?.learn?.subtitle || "Earth's Journey Around the Sun"}
          </p>
        </div>
      </header>

      <main style={{ padding: "1rem", maxWidth: "90rem", margin: "0 auto" }}>
        {/* Animation Section */}
        <div
          style={{
            background: "rgba(74, 77, 201, 0.08)",
            backdropFilter: "blur(8px)",
            borderRadius: DS.radius.lg,
            padding: "1.25rem",
            border: `1px solid rgba(74, 77, 201, 0.2)`,
            marginBottom: "1rem",
            boxShadow: DS.shadow.sm,
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              <h2
                style={{
                  fontSize: "clamp(1rem, 3vw, 1.5rem)",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}>
                  {seasonInfo.icon}
                </span>
                <span style={{ wordBreak: "break-word" }}>
                  {safe?.learnContent?.earthInSolarSystem ||
                    "Earth in the Solar System"}
                </span>
              </h2>
              <div
                style={{
                  color: DS.colors.black,
                  padding: "0.5rem 1rem",
                  borderRadius: DS.radius.pill,
                  fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
                  fontWeight: "600",
                  background: seasonInfo.bgGradient,
                  whiteSpace: "nowrap",
                  boxShadow: DS.shadow.sm,
                }}
              >
                {safe?.learnContent?.current || "Current"}: {seasonInfo.name}
              </div>
            </div>

            {/* SVG Solar System */}
            <div style={{ width: "100%", height: "clamp(250px, 50vw, 500px)" }}>
              <svg
                viewBox="-250 -180 500 360"
                style={{ width: "100%", height: "100%" }}
              >
                <defs>
                  <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="40%" stopColor={DS.colors.secondary} />
                    <stop offset="70%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#dc2626" />
                  </radialGradient>
                  <radialGradient id="earthGradient" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor={DS.colors.primaryLight} />
                    <stop offset="50%" stopColor={DS.colors.primary} />
                    <stop offset="100%" stopColor={DS.colors.gradientStart} />
                  </radialGradient>
                </defs>

                <ellipse
                  cx="0"
                  cy="0"
                  rx="180"
                  ry="120"
                  fill="none"
                  stroke="rgba(193,193,234,0.3)"
                  strokeWidth="2"
                  strokeDasharray="8 4"
                />

                {[
                  {
                    angle: 0,
                    label:
                      safe?.learnContent?.seasonMarkers?.springEquinox ||
                      "Spring Equinox",
                    date: "March 21",
                    color: DS.colors.primaryLight,
                  },
                  {
                    angle: 90,
                    label:
                      safe?.learnContent?.seasonMarkers?.summerSolstice ||
                      "Summer Solstice",
                    date: "June 21",
                    color: DS.colors.secondary,
                  },
                  {
                    angle: 180,
                    label:
                      safe?.learnContent?.seasonMarkers?.autumnEquinox ||
                      "Autumn Equinox",
                    date: "Sept 23",
                    color: "#E8752C",
                  },
                  {
                    angle: 270,
                    label:
                      safe?.learnContent?.seasonMarkers?.winterSolstice ||
                      "Winter Solstice",
                    date: "Dec 22",
                    color: DS.colors.primary,
                  },
                ].map(({ angle, label, date, color }) => {
                  const pos = getOrbitPosition(angle);
                  const isActive =
                    Math.abs(orbitAngle - angle) < 20 ||
                    Math.abs(orbitAngle - angle) > 340;
                  return (
                    <g key={angle}>
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={isActive ? 6 : 4}
                        fill={color}
                        style={{ transition: "all 0.3s" }}
                      />
                      <text
                        x={
                          pos.x +
                          (angle === 90 || angle === 270
                            ? 0
                            : pos.x > 0
                              ? 18
                              : -18)
                        }
                        y={
                          pos.y + (angle === 90 ? -25 : angle === 270 ? 35 : 5)
                        }
                        fill="white"
                        fontSize="11"
                        fontWeight={isActive ? "700" : "400"}
                        textAnchor={
                          angle === 90 || angle === 270
                            ? "middle"
                            : pos.x > 0
                              ? "start"
                              : "end"
                        }
                        opacity={isActive ? 1 : 0.7}
                        fontFamily={DS.font}
                      >
                        {label}
                      </text>
                      <text
                        x={
                          pos.x +
                          (angle === 90 || angle === 270
                            ? 0
                            : pos.x > 0
                              ? 18
                              : -18)
                        }
                        y={
                          pos.y + (angle === 90 ? -12 : angle === 270 ? 48 : 18)
                        }
                        fill={color}
                        fontSize="10"
                        textAnchor={
                          angle === 90 || angle === 270
                            ? "middle"
                            : pos.x > 0
                              ? "start"
                              : "end"
                        }
                        fontFamily={DS.font}
                      >
                        {date}
                      </text>
                    </g>
                  );
                })}

                <circle cx="0" cy="0" r="35" fill="url(#sunGlow)" />
                <text
                  x="0"
                  y="58"
                  textAnchor="middle"
                  fill="white"
                  fontSize="13"
                  fontWeight="600"
                  fontFamily={DS.font}
                >
                  {safe?.learnContent?.sun || "Sun"} ☀️
                </text>

                <g transform={`translate(${position.x}, ${position.y})`}>
                  <line
                    x1="0"
                    y1="-40"
                    x2="0"
                    y2="40"
                    stroke="rgba(193,193,234,0.4)"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    transform={`rotate(${position.tilt})`}
                  />
                  <g transform={`rotate(${position.tilt})`}>
                    <circle r="24" fill="url(#earthGradient)" />
                    <g transform={`rotate(${earthRotation})`}>
                      <ellipse
                        cx="-6"
                        cy="-6"
                        rx="9"
                        ry="7"
                        fill="#22c55e"
                        opacity="0.75"
                      />
                      <ellipse
                        cx="9"
                        cy="4"
                        rx="7"
                        ry="9"
                        fill="#22c55e"
                        opacity="0.75"
                      />
                      <ellipse
                        cx="-8"
                        cy="10"
                        rx="5"
                        ry="4"
                        fill="#22c55e"
                        opacity="0.6"
                      />
                    </g>
                    <ellipse
                      cx="0"
                      cy="0"
                      rx="24"
                      ry="7"
                      fill="none"
                      stroke="rgba(193,193,234,0.35)"
                      strokeWidth="0.8"
                    />
                    <ellipse
                      cx="0"
                      cy="-22"
                      rx="8"
                      ry="3"
                      fill="rgba(255,255,255,0.8)"
                    />
                    <ellipse
                      cx="0"
                      cy="22"
                      rx="6"
                      ry="2"
                      fill="rgba(255,255,255,0.8)"
                    />
                  </g>
                  <text
                    y="45"
                    textAnchor="middle"
                    fill="white"
                    fontSize="12"
                    fontWeight="600"
                    fontFamily={DS.font}
                  >
                    {safe?.learnContent?.earth || "Earth"} 🌍
                  </text>
                  {Math.abs(position.tilt) > 5 && (
                    <text
                      x={position.tilt > 0 ? 20 : -20}
                      y="-20"
                      textAnchor="middle"
                      fill={DS.colors.secondary}
                      fontSize="10"
                      fontWeight="600"
                      fontFamily={DS.font}
                    >
                      {Math.abs(position.tilt).toFixed(1)}°
                    </text>
                  )}
                </g>
              </svg>
            </div>

            {/* Controls */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  padding: "0.625rem 1.25rem",
                  borderRadius: DS.radius.pill,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
                  fontFamily: DS.font,
                  transition: "all 0.3s",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: isPlaying
                    ? "linear-gradient(135deg, #dc2626, #b91c1c)"
                    : DS.gradients.secondaryBtn,
                  color: "white",
                  boxShadow: isPlaying
                    ? "0 4px 15px rgba(220,38,38,0.3)"
                    : DS.shadow.orangeGlow,
                }}
              >
                {isPlaying
                  ? safe?.learnContent?.pause || "⏸️ Pause"
                  : safe?.learnContent?.play || "▶️ Play"}
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  background: "rgba(74, 77, 201, 0.12)",
                  padding: "0.5rem 0.75rem",
                  borderRadius: DS.radius.md,
                  border: `1px solid rgba(74, 77, 201, 0.15)`,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
                    fontWeight: "500",
                    color: DS.colors.lightPurple,
                    whiteSpace: "nowrap",
                  }}
                >
                  {safe?.learnContent?.speed || "Speed"}:
                </span>
                {[0.5, 1, 2, 3].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    style={{
                      padding: "0.375rem 0.625rem",
                      borderRadius: DS.radius.sm,
                      border: "none",
                      cursor: "pointer",
                      fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
                      fontWeight: "600",
                      fontFamily: DS.font,
                      transition: "all 0.3s",
                      background:
                        speed === s
                          ? DS.gradients.primaryBtn
                          : "rgba(193, 193, 234, 0.1)",
                      color: speed === s ? "white" : DS.colors.lightPurple,
                      boxShadow: speed === s ? DS.shadow.sm : "none",
                    }}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  background: "rgba(74, 77, 201, 0.12)",
                  padding: "0.5rem 0.75rem",
                  borderRadius: DS.radius.md,
                  border: `1px solid rgba(74, 77, 201, 0.15)`,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
                    fontWeight: "500",
                    color: DS.colors.lightPurple,
                    whiteSpace: "nowrap",
                  }}
                >
                  {safe?.learnContent?.jumpTo || "Jump to"}:
                </span>
                {[
                  { season: "spring", angle: 45, icon: "🌸" },
                  { season: "summer", angle: 135, icon: "☀️" },
                  { season: "autumn", angle: 225, icon: "🍂" },
                  { season: "winter", angle: 315, icon: "❄️" },
                ].map(({ season, angle, icon }) => (
                  <button
                    key={season}
                    onClick={() => {
                      setOrbitAngle(angle);
                      setIsPlaying(false);
                    }}
                    title={season.charAt(0).toUpperCase() + season.slice(1)}
                    style={{
                      padding: "0.375rem 0.5rem",
                      borderRadius: DS.radius.sm,
                      border: "none",
                      cursor: "pointer",
                      fontSize: "clamp(1rem, 3vw, 1.125rem)",
                      transition: "all 0.3s",
                      fontFamily: DS.font,
                      background:
                        currentSeason === season
                          ? "rgba(74, 77, 201, 0.3)"
                          : "rgba(193, 193, 234, 0.1)",
                      boxShadow:
                        currentSeason === season
                          ? "inset 0 0 0 1px rgba(74, 77, 201, 0.4)"
                          : "none",
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div
          style={{
            background: "rgba(74, 77, 201, 0.08)",
            backdropFilter: "blur(8px)",
            borderRadius: DS.radius.lg,
            padding: "1.25rem",
            border: `1px solid rgba(74, 77, 201, 0.2)`,
            boxShadow: DS.shadow.sm,
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {/* Season Card */}
            <div
              style={{
                borderRadius: DS.radius.lg,
                padding: "1.25rem",
                color: DS.colors.black,
                background: seasonInfo.bgGradient,
                boxShadow: DS.shadow.lg,
                transition: "all 0.5s",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(2rem, 8vw, 3rem)",
                  marginBottom: "0.5rem",
                }}
              >
                {seasonInfo.icon}
              </div>
              <h3
                style={{
                  fontSize: "clamp(1.25rem, 4vw, 2rem)",
                  fontWeight: "700",
                  marginBottom: "0.5rem",
                  wordBreak: "break-word",
                }}
              >
                {seasonInfo.name}
              </h3>
              <p
                style={{
                  marginBottom: "0.75rem",
                  opacity: 0.7,
                  fontSize: "clamp(0.875rem, 2vw, 1rem)",
                }}
              >
                {seasonInfo.months}
              </p>
              <p
                style={{
                  marginBottom: "0.75rem",
                  fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
                  lineHeight: "1.7",
                }}
              >
                {seasonInfo.description}
              </p>
              <div
                style={{
                  padding: "0.75rem",
                  background: "rgba(255,255,255,0.6)",
                  borderRadius: DS.radius.md,
                  fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
                  lineHeight: "1.7",
                  border: `1px solid rgba(74, 77, 201, 0.1)`,
                }}
              >
                <div
                  style={{ marginBottom: "0.5rem", wordBreak: "break-word" }}
                >
                  <strong>🎯 Key Event:</strong> {seasonInfo.event}
                </div>
                <div
                  style={{ marginBottom: "0.5rem", wordBreak: "break-word" }}
                >
                  <strong>🌐 Hemisphere:</strong> {seasonInfo.hemisphere}
                </div>
                <div style={{ wordBreak: "break-word" }}>
                  <strong>📍 Orbit Position:</strong> {Math.round(orbitAngle)}°
                </div>
              </div>
            </div>

            {/* Key Facts */}
            <div
              style={{
                background: "rgba(74, 77, 201, 0.06)",
                borderRadius: DS.radius.lg,
                padding: "1.25rem",
                border: `1px solid rgba(74, 77, 201, 0.12)`,
              }}
            >
              <h3
                style={{
                  fontSize: "clamp(1rem, 3vw, 1.25rem)",
                  fontWeight: "700",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                }}
              >
                {safe?.learnContent?.keyFactsAboutRevolution ||
                  "📚 Key Facts About Revolution"}
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {keyFacts.map(({ icon, title, fact, detail }, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "0.75rem",
                      borderRadius: DS.radius.md,
                      fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      background:
                        hoveredFact === i
                          ? "rgba(74, 77, 201, 0.15)"
                          : "rgba(193, 193, 234, 0.05)",
                      border:
                        hoveredFact === i
                          ? `1px solid rgba(74, 77, 201, 0.3)`
                          : "1px solid transparent",
                      boxShadow: hoveredFact === i ? DS.shadow.sm : "none",
                    }}
                    onMouseEnter={() => setHoveredFact(i)}
                    onMouseLeave={() => setHoveredFact(null)}
                    onTouchStart={() => setHoveredFact(i)}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "start",
                        gap: "0.75rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "clamp(1.25rem, 4vw, 1.5rem)",
                          flexShrink: 0,
                        }}
                      >
                        {icon}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: "600",
                            marginBottom: "0.25rem",
                            wordBreak: "break-word",
                            color: DS.colors.lightPurple,
                          }}
                        >
                          {title}
                        </div>
                        <div style={{ opacity: 0.85, wordBreak: "break-word" }}>
                          {fact}
                        </div>
                      </div>
                    </div>
                    {hoveredFact === i && (
                      <div
                        style={{
                          marginTop: "0.625rem",
                          paddingTop: "0.625rem",
                          borderTop: `1px solid rgba(74, 77, 201, 0.15)`,
                          fontSize: "clamp(0.7rem, 2vw, 0.75rem)",
                          opacity: 0.8,
                          lineHeight: "1.6",
                          animation: "fadeIn 0.3s ease-out",
                          wordBreak: "break-word",
                          color: DS.colors.lightOrange,
                        }}
                      >
                        💡 {detail}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes starPulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// PRACTICE MODE
// ============================================================================
const RevolutionPracticeMode = ({ additionalProps }) => {
  const { translations } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const questions = additionalProps?.customQuestions || [
    {
      id: 1,
      question: "In which direction does the Earth rotate on its axis?",
      options: [
        "East to West",
        "West to East",
        "North to South",
        "South to North",
      ],
      correctAnswer: 1,
      explanation:
        "Earth rotates from West to East. This is why the Sun appears to rise in the East and set in the West. When viewed from above the North Pole, Earth rotates in a counter-clockwise direction.",
      difficulty: "easy",
      topic: "rotation",
    },
    {
      id: 2,
      question:
        "How long does it take for Earth to complete one rotation on its axis?",
      options: ["12 hours", "24 hours", "365 days", "30 days"],
      correctAnswer: 1,
      explanation:
        "Earth completes one full rotation on its axis in approximately 24 hours. More precisely, it takes 23 hours, 56 minutes, and 4 seconds.",
      difficulty: "easy",
      topic: "rotation",
    },
    {
      id: 3,
      question: "What causes day and night on Earth?",
      options: [
        "Earth's revolution around the Sun",
        "Earth's rotation on its axis",
        "The Moon blocking sunlight",
        "Clouds covering the Sun",
      ],
      correctAnswer: 1,
      explanation:
        "Day and night are caused by Earth's rotation on its axis. The side facing the Sun experiences daytime, the opposite side experiences night.",
      difficulty: "easy",
      topic: "rotation",
    },
    {
      id: 4,
      question:
        "How long does it take for Earth to complete one revolution around the Sun?",
      options: [
        "24 hours",
        "30 days",
        "365 days and 6 hours",
        "12 months exactly",
      ],
      correctAnswer: 2,
      explanation:
        "Earth takes approximately 365 days and 6 hours (365.25 days). The extra 6 hours accumulate to create a leap year every 4 years.",
      difficulty: "easy",
      topic: "revolution",
    },
    {
      id: 5,
      question: "What is the main reason for seasons on Earth?",
      options: [
        "Distance from the Sun changes",
        "Earth's tilted axis and revolution around the Sun",
        "The Moon's gravitational pull",
        "Solar flares from the Sun",
      ],
      correctAnswer: 1,
      explanation:
        "Seasons occur primarily due to Earth's axis being tilted at 23.5° relative to its orbital plane.",
      difficulty: "medium",
      topic: "seasons",
    },
    {
      id: 6,
      question: "At what angle is Earth's axis tilted?",
      options: ["0 degrees", "23.5 degrees", "45 degrees", "90 degrees"],
      correctAnswer: 1,
      explanation:
        "Earth's axis is tilted at approximately 23.5 degrees from perpendicular to its orbital plane.",
      difficulty: "medium",
      topic: "seasons",
    },
    {
      id: 7,
      question: "Which statement about Earth's orbit is correct?",
      options: [
        "Earth's orbit is a perfect circle",
        "Earth's orbit is elliptical (oval-shaped)",
        "Earth's orbit is square-shaped",
        "Earth's orbit changes shape every year",
      ],
      correctAnswer: 1,
      explanation:
        "Earth's orbit is elliptical. At perihelion ~147M km, at aphelion ~152M km from the Sun.",
      difficulty: "medium",
      topic: "revolution",
    },
    {
      id: 8,
      question: "Why do we have leap years?",
      options: [
        "To celebrate special events",
        "To account for Earth's extra ¼ day per orbit",
        "Because of the Moon's orbit",
        "To match other planet's calendars",
      ],
      correctAnswer: 1,
      explanation:
        "Leap years account for the extra 0.25 days per orbit. Every 4 years, the extra hours add up to one full day (Feb 29th).",
      difficulty: "easy",
      topic: "revolution",
    },
    {
      id: 9,
      question:
        "When the Northern Hemisphere experiences summer, what season is it in the Southern Hemisphere?",
      options: ["Summer", "Winter", "Spring", "Autumn"],
      correctAnswer: 1,
      explanation:
        "When the Northern Hemisphere tilts toward the Sun, the Southern tilts away, experiencing winter.",
      difficulty: "medium",
      topic: "seasons",
    },
    {
      id: 10,
      question: "What happens during an equinox?",
      options: [
        "Day is longer than night everywhere",
        "Night is longer than day everywhere",
        "Day and night are approximately equal in length",
        "The Sun doesn't rise at all",
      ],
      correctAnswer: 2,
      explanation:
        "During an equinox, day and night are approximately equal (~12 hours each) everywhere on Earth.",
      difficulty: "medium",
      topic: "seasons",
    },
    {
      id: 11,
      question: "What is the summer solstice in the Northern Hemisphere?",
      options: [
        "The shortest day of the year",
        "The longest day of the year",
        "When day equals night",
        "The start of spring",
      ],
      correctAnswer: 1,
      explanation:
        "The summer solstice (~June 21) is the longest day. The Northern Hemisphere is most tilted toward the Sun.",
      difficulty: "easy",
      topic: "seasons",
    },
    {
      id: 12,
      question: "At approximately what speed does Earth orbit the Sun?",
      options: ["30 km/s", "3 km/s", "300 km/s", "3,000 km/s"],
      correctAnswer: 0,
      explanation:
        "Earth orbits at ~30 km/s (~108,000 km/h) — roughly 30 times faster than a bullet!",
      difficulty: "hard",
      topic: "revolution",
    },
    {
      id: 13,
      question: "How far is Earth from the Sun on average?",
      options: [
        "50 million kilometers",
        "150 million kilometers",
        "500 million kilometers",
        "1 billion kilometers",
      ],
      correctAnswer: 1,
      explanation:
        "~150 million km (1 Astronomical Unit). Light takes ~8 min 20 sec to travel this distance.",
      difficulty: "medium",
      topic: "revolution",
    },
    {
      id: 14,
      question: "What would happen if Earth's axis was not tilted?",
      options: [
        "We would have more seasons",
        "We would have no seasons",
        "Days would be longer",
        "Earth would stop rotating",
      ],
      correctAnswer: 1,
      explanation:
        "Without tilt, every location would get the same daylight year-round — no seasons.",
      difficulty: "hard",
      topic: "seasons",
    },
    {
      id: 15,
      question: "Which of these is NOT caused by Earth's rotation?",
      options: [
        "Day and night cycle",
        "Apparent movement of stars across the sky",
        "The four seasons",
        "Time zones",
      ],
      correctAnswer: 2,
      explanation:
        "Seasons are caused by Earth's tilted axis + revolution, NOT rotation. Rotation causes day/night, star movement, and time zones.",
      difficulty: "hard",
      topic: "rotation",
    },
  ];

  if (quizCompleted) {
    const pct = (score / questions.length) * 100;
    return (
      <div
        style={{
          minHeight: "100vh",
          background: DS.gradients.hero,
          color: "white",
          padding: "1.5rem",
          fontFamily: DS.font,
        }}
      >
        <div style={{ maxWidth: "40rem", margin: "0 auto" }}>
          <div
            style={{
              background: "rgba(74, 77, 201, 0.08)",
              backdropFilter: "blur(12px)",
              borderRadius: DS.radius.xl,
              padding: "clamp(1.5rem, 4vw, 2.5rem)",
              border: `1px solid rgba(74, 77, 201, 0.2)`,
              boxShadow: DS.shadow.lg,
              textAlign: "center",
            }}
          >
            <div style={{ marginBottom: "1.5rem" }}>
              <TrophyIcon size={80} color={DS.colors.secondary} />
            </div>
            <h1
              style={{
                fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
                fontWeight: "700",
                marginBottom: "0.5rem",
                background: DS.gradients.text,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {translations?.practiceMode?.quizCompleted || "Quiz Completed!"}
            </h1>
            <p
              style={{
                fontSize: "clamp(1rem, 3vw, 1.25rem)",
                fontWeight: "600",
                color: DS.colors.secondary,
                marginBottom: "2rem",
              }}
            >
              {pct >= 80
                ? translations?.practiceMode?.excellent || "Excellent Work! 🌟"
                : pct >= 50
                  ? "Good Job! 👍"
                  : "Keep Practicing! 💪"}
            </p>
            <div
              style={{
                fontSize: "clamp(2rem, 6vw, 3.5rem)",
                fontWeight: "800",
                marginBottom: "0.5rem",
                background: DS.gradients.orangeAccent,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {score}/{questions.length}
            </div>
            <p style={{ color: DS.colors.lightPurple, fontSize: "0.9rem" }}>
              {translations?.practiceMode?.finalScore || "Final Score"}
            </p>

            <button
              onClick={() => {
                setCurrentQuestion(0);
                setSelectedAnswer(null);
                setShowExplanation(false);
                setScore(0);
                setStreak(0);
                setQuizCompleted(false);
              }}
              style={{
                marginTop: "2rem",
                padding: "0.75rem 2rem",
                borderRadius: DS.radius.pill,
                border: "none",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "1rem",
                fontFamily: DS.font,
                background: DS.gradients.primaryBtn,
                color: "white",
                boxShadow: DS.shadow.glow,
                transition: "all 0.3s",
              }}
            >
              {translations?.practiceMode?.tryAgain || "Try Again"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: DS.gradients.hero,
        color: "white",
        padding: "1.5rem",
        fontFamily: DS.font,
      }}
    >
      <div style={{ maxWidth: "50rem", margin: "0 auto" }}>
        {/* Progress bar */}
        <div style={{ marginBottom: "1.25rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <span
              style={{
                fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
                color: DS.colors.lightPurple,
              }}
            >
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <div style={{ display: "flex", gap: "1rem" }}>
              <span
                style={{
                  fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
                  color: DS.colors.secondary,
                }}
              >
                🔥 Streak: {streak}
              </span>
              <span
                style={{
                  fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
                  color: DS.colors.primaryLight,
                }}
              >
                ⭐ Score: {score}
              </span>
            </div>
          </div>
          <div
            style={{
              height: "4px",
              background: "rgba(74, 77, 201, 0.15)",
              borderRadius: DS.radius.pill,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: DS.radius.pill,
                background: DS.gradients.orangeAccent,
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                transition: "width 0.5s ease",
              }}
            />
          </div>
        </div>

        {/* Question card */}
        <div
          style={{
            background: "rgba(74, 77, 201, 0.08)",
            backdropFilter: "blur(12px)",
            borderRadius: DS.radius.xl,
            padding: "clamp(1.25rem, 3vw, 2rem)",
            border: `1px solid rgba(74, 77, 201, 0.2)`,
            boxShadow: DS.shadow.md,
          }}
        >
          {/* Difficulty badge */}
          <div style={{ marginBottom: "1rem" }}>
            <span
              style={{
                fontSize: "0.75rem",
                padding: "0.25rem 0.75rem",
                borderRadius: DS.radius.pill,
                fontWeight: "600",
                background:
                  currentQ.difficulty === "easy"
                    ? "rgba(34,197,94,0.15)"
                    : currentQ.difficulty === "medium"
                      ? `rgba(255,114,18,0.15)`
                      : "rgba(239,68,68,0.15)",
                color:
                  currentQ.difficulty === "easy"
                    ? "#86efac"
                    : currentQ.difficulty === "medium"
                      ? DS.colors.secondaryLight
                      : "#fca5a5",
                border: `1px solid ${currentQ.difficulty === "easy" ? "rgba(34,197,94,0.25)" : currentQ.difficulty === "medium" ? "rgba(255,114,18,0.25)" : "rgba(239,68,68,0.25)"}`,
              }}
            >
              {currentQ.difficulty.charAt(0).toUpperCase() +
                currentQ.difficulty.slice(1)}
            </span>
          </div>

          <h2
            style={{
              fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
              fontWeight: "600",
              marginBottom: "1.5rem",
              lineHeight: "1.5",
            }}
          >
            {currentQ.question}
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.625rem",
              marginBottom: "1.5rem",
            }}
          >
            {currentQ.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = index === currentQ.correctAnswer;
              const showCorrect = showExplanation && isCorrectAnswer;
              const showIncorrect =
                showExplanation && isSelected && !isCorrectAnswer;

              let borderColor = "rgba(74, 77, 201, 0.15)";
              let bg = "rgba(14, 14, 44, 0.5)";
              if (showCorrect) {
                borderColor = "#22c55e";
                bg = "rgba(34, 197, 94, 0.1)";
              } else if (showIncorrect) {
                borderColor = "#ef4444";
                bg = "rgba(239, 68, 68, 0.1)";
              } else if (isSelected) {
                borderColor = DS.colors.primary;
                bg = "rgba(74, 77, 201, 0.12)";
              }

              return (
                <button
                  key={index}
                  onClick={() => !showExplanation && setSelectedAnswer(index)}
                  disabled={showExplanation}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "clamp(0.75rem, 2vw, 1rem)",
                    borderRadius: DS.radius.md,
                    border: `2px solid ${borderColor}`,
                    background: bg,
                    color: "white",
                    fontFamily: DS.font,
                    cursor: showExplanation ? "not-allowed" : "pointer",
                    transition: "all 0.25s",
                    fontSize: "clamp(0.8rem, 2vw, 0.95rem)",
                    boxShadow:
                      isSelected && !showExplanation ? DS.shadow.glow : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        width: "2rem",
                        height: "2rem",
                        borderRadius: "50%",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "700",
                        fontSize: "0.85rem",
                        background: showCorrect
                          ? "#22c55e"
                          : showIncorrect
                            ? "#ef4444"
                            : isSelected
                              ? DS.colors.primary
                              : "rgba(193, 193, 234, 0.15)",
                        color: "white",
                        transition: "all 0.25s",
                      }}
                    >
                      {showCorrect ? (
                        <CheckCircleIcon size={18} color="white" />
                      ) : showIncorrect ? (
                        <XCircleIcon size={18} color="white" />
                      ) : (
                        String.fromCharCode(65 + index)
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div
              style={{
                borderRadius: DS.radius.md,
                padding: "1.25rem",
                border: `2px solid ${selectedAnswer === currentQ.correctAnswer ? "#22c55e" : "#ef4444"}`,
                background:
                  selectedAnswer === currentQ.correctAnswer
                    ? "rgba(34, 197, 94, 0.08)"
                    : "rgba(239, 68, 68, 0.08)",
                marginBottom: "1.5rem",
                animation: "fadeIn 0.3s ease-out",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "start", gap: "0.75rem" }}
              >
                {selectedAnswer === currentQ.correctAnswer ? (
                  <CheckCircleIcon size={22} color="#22c55e" />
                ) : (
                  <XCircleIcon size={22} color="#ef4444" />
                )}
                <div>
                  <h3
                    style={{
                      fontWeight: "700",
                      fontSize: "1rem",
                      marginBottom: "0.5rem",
                      color:
                        selectedAnswer === currentQ.correctAnswer
                          ? "#22c55e"
                          : "#ef4444",
                    }}
                  >
                    {selectedAnswer === currentQ.correctAnswer
                      ? translations?.practiceMode?.correct || "Correct! 🎉"
                      : translations?.practiceMode?.notQuiteRight ||
                        "Not quite right"}
                  </h3>
                  <p
                    style={{
                      lineHeight: "1.7",
                      fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                      color: DS.colors.lightPurple,
                    }}
                  >
                    {currentQ.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: "0.75rem" }}>
            {!showExplanation ? (
              <button
                onClick={() => {
                  if (selectedAnswer === null) return;
                  setShowExplanation(true);
                  if (selectedAnswer === currentQ.correctAnswer) {
                    setScore((s) => s + 1);
                    setStreak((s) => s + 1);
                  } else {
                    setStreak(0);
                  }
                }}
                disabled={selectedAnswer === null}
                style={{
                  flex: 1,
                  padding: "0.75rem 1.5rem",
                  borderRadius: DS.radius.pill,
                  fontFamily: DS.font,
                  fontWeight: "600",
                  fontSize: "clamp(0.85rem, 2vw, 1rem)",
                  transition: "all 0.3s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  border: "none",
                  cursor: selectedAnswer === null ? "not-allowed" : "pointer",
                  background:
                    selectedAnswer === null
                      ? "rgba(193, 193, 234, 0.15)"
                      : DS.gradients.primaryBtn,
                  color:
                    selectedAnswer === null ? DS.colors.neutral600 : "white",
                  boxShadow: selectedAnswer !== null ? DS.shadow.glow : "none",
                }}
              >
                <CheckCircleIcon size={18} />
                {translations?.practiceMode?.submitAnswer || "Submit Answer"}
              </button>
            ) : (
              <button
                onClick={() => {
                  if (currentQuestion < questions.length - 1) {
                    setCurrentQuestion((q) => q + 1);
                    setSelectedAnswer(null);
                    setShowExplanation(false);
                  } else {
                    setQuizCompleted(true);
                  }
                }}
                style={{
                  flex: 1,
                  padding: "0.75rem 1.5rem",
                  borderRadius: DS.radius.pill,
                  fontFamily: DS.font,
                  fontWeight: "600",
                  fontSize: "clamp(0.85rem, 2vw, 1rem)",
                  transition: "all 0.3s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  border: "none",
                  cursor: "pointer",
                  background: DS.gradients.secondaryBtn,
                  color: "white",
                  boxShadow: DS.shadow.orangeGlow,
                }}
              >
                {currentQuestion < questions.length - 1
                  ? translations?.practiceMode?.nextQuestion || "Next Question"
                  : translations?.practiceMode?.viewResults || "View Results"}
              </button>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

// ============================================================================
// REAL WORLD MODE
// ============================================================================
const RevolutionRealWorld = ({ additionalProps }) => {
  const { translations } = useLanguage();
  const [currentScenario, setCurrentScenario] = useState(0);

  const scenarios = additionalProps?.customScenarios || [
    {
      id: 1,
      title: "Planning an International Cricket Match",
      icon: "🏏",
      difficulty: "Easy",
      context:
        "India is playing a cricket match against Australia. The match in Sydney starts at 10:00 AM local time.",
      question:
        "If Sydney is 4.5 hours ahead of India (IST), what time should Indian fans wake up?",
      realWorldConnection:
        "Time zones exist because Earth rotates from West to East.",
      solution: "Indian fans should wake up at 5:30 AM IST.",
      explanation:
        "Since Sydney is 4.5 hours ahead: When it's 10:00 AM in Sydney, it's 5:30 AM in India.",
      tips: [
        "Countries east of India have later times",
        "Time zones are created by Earth's rotation",
      ],
    },
    {
      id: 2,
      title: "Farmer's Planting Season",
      icon: "🌾",
      difficulty: "Medium",
      context:
        "Ravi is a farmer in Punjab. Wheat grows best when planted after monsoon rains, during cooler months with shorter days.",
      question:
        "Should Ravi plant wheat in June (summer) or November (after monsoon)?",
      realWorldConnection:
        "Seasons occur due to Earth's tilted axis. Different crops grow better in different seasons.",
      solution: "Ravi should plant wheat in November (after monsoon).",
      explanation:
        "Wheat should be planted in November because:\n\n1. Temperature: November marks winter beginning. Wheat grows best in 15-20°C.\n\n2. Day Length: Wheat requires shorter day length for optimal growth.\n\n3. Season Cycle: In June, hot long days. In November, temperatures cool down — perfect for wheat.\n\n4. Monsoon Benefits: Soil retains moisture from monsoon rains.",
      tips: [
        "Summer (June): Hot, long days - not suitable",
        "Winter (November): Cool, shorter days - perfect",
        "Seasons affect crop growth patterns",
      ],
    },
    {
      id: 3,
      title: "Solar Panel Installation",
      icon: "☀️",
      difficulty: "Medium",
      context:
        "A family in Delhi wants to install solar panels. They want to know direction and seasonal energy variation.",
      question:
        "Which direction should panels face? Will energy differ in summer vs winter?",
      realWorldConnection:
        "The Sun's apparent path changes with seasons due to Earth's tilt.",
      solution:
        "Panels should face South. Summer will generate more energy than winter.",
      explanation:
        "Direction: South-facing in Northern Hemisphere.\n\nSummer: Higher sun, longer days (14-15 hours), more energy.\n\nWinter: Lower sun, shorter days (10-11 hours), less energy.\n\nDifference can be 40-60% less energy in winter.",
      tips: [
        "North faces panels away from Sun's path",
        "Summer has ~4 hours more sunlight",
        "Earth's tilt causes seasonal variation",
      ],
    },
    {
      id: 4,
      title: "Planning a Solar Eclipse Trip",
      icon: "🌑",
      difficulty: "Hard",
      context:
        "A total solar eclipse visible from Varanasi on April 20th. Totality lasts 11:45-11:48 AM. Flight lands at 11:00 AM.",
      question: "Is this enough time? What precautions should you take?",
      realWorldConnection:
        "Solar eclipses occur when the Moon passes between Earth and Sun.",
      solution: "It's very tight. Recommend arriving the night before.",
      explanation:
        "Flight lands 11:00 AM, totality at 11:45 AM = 45 min. Airport exit (15-20 min) + travel (20-30 min) leaves only 5-10 min — RISKY!\n\nSafety: NEVER look at Sun without certified eclipse glasses (ISO 12312-2). Only safe during totality.",
      tips: [
        "Plan to arrive a day early",
        "Eclipse glasses are MANDATORY",
        "Totality is the only safe time to look directly",
        "Moon's shadow moves at ~2,000 km/h",
      ],
    },
    {
      id: 5,
      title: "Stargazing Adventure Planning",
      icon: "⭐",
      difficulty: "Medium",
      context: "You want to see the Orion constellation from Bangalore.",
      question: "In which months will Orion be best visible?",
      realWorldConnection:
        "Different constellations are visible in different months due to Earth's revolution.",
      solution: "Orion is best visible in December and January evenings.",
      explanation:
        "As Earth revolves around the Sun, our nighttime view points toward different parts of space.\n\nDecember-January: Earth's nightside faces Orion.\nJune: Orion is in the daytime sky, invisible.\n\nEarth completes 360° in 365 days (~1° per day).",
      tips: [
        "Orion is a winter constellation",
        "Each constellation is best for ~3-4 months",
        "New moon nights provide darkest skies",
      ],
    },
    {
      id: 6,
      title: "Choosing Holiday Destination",
      icon: "✈️",
      difficulty: "Easy",
      context:
        "Family wants December vacation to escape Delhi cold. Want warm beaches.",
      question: "Should you go to Australia or Sri Lanka?",
      realWorldConnection:
        "Seasons are opposite in Northern and Southern Hemispheres.",
      solution: "Go to Australia! It's summer there in December.",
      explanation:
        "Australia (Southern Hemisphere): December = SUMMER (25-35°C, perfect beach weather).\n\nSri Lanka: Pleasant (26-30°C) but monsoon on east coast.\n\nIn December, South Pole tilts TOWARDS Sun → Summer in Southern Hemisphere.",
      tips: [
        "December = Summer in Australia, Winter in India",
        "Countries near equator have less seasonal variation",
        "Seasons are reversed across hemispheres",
      ],
    },
    {
      id: 7,
      title: "Scheduling International Business Meeting",
      icon: "💼",
      difficulty: "Medium",
      context:
        "Video conference with New York, London, Mumbai, and Tokyo teams. Everyone needs working hours (9AM-6PM).",
      question: "What time works for everyone?",
      realWorldConnection:
        "Time zones exist because Earth rotates continuously.",
      solution: "There's NO perfect time for all four cities!",
      explanation:
        "Time Differences from Mumbai (IST):\nLondon: -5.5h | New York: -10.5h | Tokyo: +3.5h\n\n2:30 PM Mumbai = 9:00 AM London ✓ = 6:00 PM Tokyo ✓ = 4:00 AM New York ✗\n\nCompanies rotate meeting times or split into two meetings.",
      tips: [
        "Earth's rotation creates time zones",
        "15° longitude = 1 hour difference",
        "International collaboration requires compromise",
      ],
    },
    {
      id: 8,
      title: "Photography - Golden Hour Planning",
      icon: "📸",
      difficulty: "Medium",
      context:
        "Capture Taj Mahal during golden hour in both summer and winter.",
      question: "Will golden hour timing differ? How to plan?",
      realWorldConnection:
        "Sunrise time changes throughout the year due to Earth's tilt.",
      solution: "Yes! Summer sunrise ~5:30 AM, winter ~7:00 AM.",
      explanation:
        "Summer (June): Sunrise ~5:30 AM, golden hour 5:30-6:30 AM, can be hazy.\n\nWinter (December): Sunrise ~7:00 AM, golden hour 7:00-8:00 AM, clearer air.\n\n~1.5 hour difference due to Earth's 23.5° tilt changing Sun's path.",
      tips: [
        "Sunrise varies by ~1-2 hours through the year",
        "Winter light is often clearer",
        "Sun position affects shadow direction",
      ],
    },
    {
      id: 9,
      title: "Understanding Midnight Sun",
      icon: "🌞",
      difficulty: "Hard",
      context:
        "Friend in Norway in June sends photo at 11 PM showing full daylight.",
      question: "Explain the 'Midnight Sun' phenomenon.",
      realWorldConnection: "Occurs in polar regions due to Earth's axial tilt.",
      solution:
        "Earth's tilt keeps polar regions facing the Sun continuously during summer.",
      explanation:
        "Above Arctic Circle (66.5°N): continuous daylight in summer.\n\nEarth's 23.5° tilt → North Pole tilts toward Sun in June → Arctic stays in sunlight during full 24-hour rotation.\n\nTromsø, Norway (69°N): ~2 months of midnight sun.\nNorth Pole: ~6 months of continuous daylight!",
      tips: [
        "Only occurs above Arctic/Antarctic Circles",
        "Duration increases closer to poles",
        "Winter brings opposite: continuous darkness",
      ],
    },
    {
      id: 10,
      title: "Optimizing Satellite Communication",
      icon: "🛰️",
      difficulty: "Hard",
      context:
        "Positioning a geostationary satellite for India's communication coverage.",
      question:
        "Why must it orbit at exactly 35,786 km altitude above the equator?",
      realWorldConnection:
        "Geostationary satellites match Earth's rotation speed.",
      solution:
        "At 35,786 km, orbital period exactly matches Earth's 24-hour rotation.",
      explanation:
        "At 35,786 km: orbital period = 24 hours, speed ~3.07 km/s, appears stationary.\n\nLow orbit (400 km): 90 min period. Geostationary: 24 hours.\n\nMust be above equator. Critical for communications, TV, and weather satellites.",
      tips: [
        "Only ONE altitude works for geostationary orbit",
        "Must orbit above equator",
        "Matches Earth's 24-hour rotation exactly",
      ],
    },
  ];

  const scenario = scenarios[currentScenario];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: DS.gradients.hero,
        color: "white",
        padding: "1.5rem",
        fontFamily: DS.font,
      }}
    >
      <div style={{ maxWidth: "50rem", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
              fontWeight: "700",
              marginBottom: "0.5rem",
              background: DS.gradients.text,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {translations?.realWorld?.header || "Real World Applications"}
          </h1>
          <p
            style={{
              fontSize: "clamp(0.85rem, 2vw, 1rem)",
              color: DS.colors.lightPurple,
            }}
          >
            {translations?.realWorld?.subtitle ||
              "Apply your knowledge to solve real-life scenarios!"}
          </p>
          <div
            style={{
              marginTop: "0.75rem",
              display: "flex",
              justifyContent: "center",
              gap: "0.35rem",
              flexWrap: "wrap",
            }}
          >
            {scenarios.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === currentScenario ? "24px" : "8px",
                  height: "8px",
                  borderRadius: DS.radius.pill,
                  transition: "all 0.3s",
                  background:
                    i === currentScenario
                      ? DS.gradients.orangeAccent
                      : i < currentScenario
                        ? DS.colors.primary
                        : "rgba(193, 193, 234, 0.2)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Scenario Card */}
        <div
          style={{
            background: "rgba(74, 77, 201, 0.08)",
            backdropFilter: "blur(12px)",
            borderRadius: DS.radius.xl,
            padding: "clamp(1.25rem, 3vw, 2rem)",
            border: `1px solid rgba(74, 77, 201, 0.2)`,
            boxShadow: DS.shadow.md,
            marginBottom: "1.25rem",
          }}
        >
          {/* Title row */}
          <div
            style={{
              display: "flex",
              alignItems: "start",
              justifyContent: "space-between",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                flex: 1,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  fontSize: "clamp(2.5rem, 8vw, 3.5rem)",
                  flexShrink: 0,
                }}
              >
                {scenario.icon}
              </div>
              <h2
                style={{
                  fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
                  fontWeight: "700",
                  color: DS.colors.lightPurple,
                  wordBreak: "break-word",
                }}
              >
                {scenario.title}
              </h2>
            </div>
            <span
              style={{
                fontSize: "0.8rem",
                padding: "0.35rem 0.85rem",
                borderRadius: DS.radius.pill,
                fontWeight: "600",
                whiteSpace: "nowrap",
                flexShrink: 0,
                background:
                  scenario.difficulty === "Easy"
                    ? "rgba(34,197,94,0.15)"
                    : scenario.difficulty === "Medium"
                      ? "rgba(255,114,18,0.15)"
                      : "rgba(239,68,68,0.15)",
                color:
                  scenario.difficulty === "Easy"
                    ? "#86efac"
                    : scenario.difficulty === "Medium"
                      ? DS.colors.secondaryLight
                      : "#fca5a5",
                border: `1px solid ${scenario.difficulty === "Easy" ? "rgba(34,197,94,0.25)" : scenario.difficulty === "Medium" ? "rgba(255,114,18,0.25)" : "rgba(239,68,68,0.25)"}`,
              }}
            >
              {scenario.difficulty}
            </span>
          </div>

          {/* Context */}
          <div
            style={{
              background: "rgba(74, 77, 201, 0.1)",
              borderRadius: DS.radius.md,
              padding: "1rem",
              border: `1px solid rgba(74, 77, 201, 0.18)`,
              marginBottom: "1rem",
            }}
          >
            <h3
              style={{
                fontWeight: "600",
                fontSize: "clamp(0.85rem, 2vw, 1rem)",
                marginBottom: "0.5rem",
                color: DS.colors.primaryLight,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <InfoIcon size={18} color={DS.colors.primaryLight} />
              {translations?.realWorld?.context || "Context"}
            </h3>
            <p
              style={{
                color: DS.colors.lightPurple,
                lineHeight: "1.7",
                fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
              }}
            >
              {scenario.context}
            </p>
          </div>

          {/* Real World Connection */}
          <div
            style={{
              background: "rgba(255, 114, 18, 0.08)",
              borderRadius: DS.radius.md,
              padding: "1rem",
              border: `1px solid rgba(255, 114, 18, 0.18)`,
              marginBottom: "1rem",
            }}
          >
            <h3
              style={{
                fontWeight: "600",
                fontSize: "clamp(0.85rem, 2vw, 1rem)",
                marginBottom: "0.5rem",
                color: DS.colors.secondaryLight,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <GlobeIcon size={18} color={DS.colors.secondaryLight} />
              {translations?.realWorld?.realWorldConnection ||
                "Real-World Connection"}
            </h3>
            <p
              style={{
                color: DS.colors.lightOrange,
                lineHeight: "1.7",
                fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
              }}
            >
              {scenario.realWorldConnection}
            </p>
          </div>

          {/* Solution */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div
              style={{
                background: `linear-gradient(135deg, rgba(255,114,18,0.15), rgba(252,145,69,0.12))`,
                borderRadius: DS.radius.md,
                padding: "1rem",
                border: `1px solid rgba(255,114,18,0.22)`,
              }}
            >
              <h3
                style={{
                  fontWeight: "700",
                  fontSize: "clamp(0.85rem, 2vw, 1rem)",
                  marginBottom: "0.5rem",
                  color: DS.colors.secondary,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                ✓ {translations?.realWorld?.quickAnswer || "Quick Answer"}
              </h3>
              <p
                style={{
                  color: DS.colors.lightOrange,
                  fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
                  fontWeight: "600",
                }}
              >
                {scenario.solution}
              </p>
            </div>

            <div
              style={{
                background: "rgba(14, 14, 44, 0.5)",
                borderRadius: DS.radius.md,
                padding: "1.25rem",
                border: `1px solid rgba(74, 77, 201, 0.12)`,
              }}
            >
              <h3
                style={{
                  fontWeight: "700",
                  fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
                  marginBottom: "0.75rem",
                  color: DS.colors.neutral300,
                }}
              >
                {translations?.realWorld?.detailedExplanation ||
                  "Detailed Explanation:"}
              </h3>
              <div
                style={{
                  color: DS.colors.lightPurple,
                  lineHeight: "1.7",
                  whiteSpace: "pre-line",
                  fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                }}
              >
                {scenario.explanation}
              </div>
            </div>

            <div
              style={{
                background: `linear-gradient(135deg, rgba(74,77,201,0.12), rgba(83,48,134,0.1))`,
                borderRadius: DS.radius.md,
                padding: "1rem",
                border: `1px solid rgba(74, 77, 201, 0.2)`,
              }}
            >
              <h3
                style={{
                  fontWeight: "700",
                  fontSize: "clamp(0.85rem, 2vw, 1rem)",
                  marginBottom: "0.75rem",
                  color: DS.colors.primaryLight,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                {translations?.realWorld?.keyTakeaways || "💡 Key Takeaways"}
              </h3>
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                  margin: 0,
                  paddingLeft: 0,
                  listStyle: "none",
                }}
              >
                {scenario.tips.map((tip, i) => (
                  <li
                    key={i}
                    style={{
                      color: DS.colors.lightPurple,
                      display: "flex",
                      alignItems: "start",
                      gap: "0.5rem",
                      fontSize: "clamp(0.8rem, 2vw, 0.875rem)",
                    }}
                  >
                    <span
                      style={{
                        color: DS.colors.secondary,
                        marginTop: "0.15rem",
                        flexShrink: 0,
                      }}
                    >
                      •
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={() =>
              currentScenario > 0 && setCurrentScenario(currentScenario - 1)
            }
            disabled={currentScenario === 0}
            style={{
              flex: 1,
              padding: "0.75rem 1.25rem",
              borderRadius: DS.radius.pill,
              fontFamily: DS.font,
              fontWeight: "600",
              fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
              transition: "all 0.3s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              border:
                currentScenario === 0
                  ? "none"
                  : `2px solid ${DS.colors.primary}`,
              cursor: currentScenario === 0 ? "not-allowed" : "pointer",
              background:
                currentScenario === 0
                  ? "rgba(193, 193, 234, 0.1)"
                  : "transparent",
              color:
                currentScenario === 0
                  ? DS.colors.neutral600
                  : DS.colors.primaryLight,
            }}
          >
            {translations?.realWorld?.previous || "← Previous"}
          </button>

          <button
            onClick={() =>
              currentScenario < scenarios.length - 1 &&
              setCurrentScenario(currentScenario + 1)
            }
            disabled={currentScenario === scenarios.length - 1}
            style={{
              flex: 1,
              padding: "0.75rem 1.25rem",
              borderRadius: DS.radius.pill,
              fontFamily: DS.font,
              fontWeight: "600",
              fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
              transition: "all 0.3s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              border: "none",
              cursor:
                currentScenario === scenarios.length - 1
                  ? "not-allowed"
                  : "pointer",
              background:
                currentScenario === scenarios.length - 1
                  ? "rgba(193, 193, 234, 0.1)"
                  : DS.gradients.secondaryBtn,
              color:
                currentScenario === scenarios.length - 1
                  ? DS.colors.neutral600
                  : "white",
              boxShadow:
                currentScenario < scenarios.length - 1
                  ? DS.shadow.orangeGlow
                  : "none",
            }}
          >
            {currentScenario === scenarios.length - 1
              ? translations?.realWorld?.complete || "Complete! 🎉"
              : translations?.realWorld?.nextScenario || "Next Scenario →"}
          </button>
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

// ============================================================================
// NAVBAR
// ============================================================================
const Navbar = ({
  mode,
  setMode,
  showModeSelector = true,
  enabledModes = ["learn", "practice", "applications"],
}) => {
  const { translations } = useLanguage();
  const safe = translations || translationsData["en"];

  if (!showModeSelector) return null;

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "rgba(14, 14, 44, 0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid rgba(74, 77, 201, 0.15)`,
        boxShadow: "0 2px 20px rgba(0, 0, 0, 0.3)",
        fontFamily: DS.font,
      }}
    >
      <div style={{ maxWidth: "90rem", margin: "0 auto", padding: "0 1rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "3.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <GlobeIcon size={22} color={DS.colors.primary} />
            <span
              style={{
                fontSize: "clamp(0.85rem, 2.5vw, 1.05rem)",
                fontWeight: "700",
                background: DS.gradients.text,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {safe?.nav?.logo || "Revolution of the Earth"}
            </span>
          </div>

          <div
            style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}
          >
            {enabledModes.map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  padding: "0.4rem 0.85rem",
                  borderRadius: DS.radius.pill,
                  fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
                  fontWeight: "600",
                  transition: "all 0.25s",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: DS.font,
                  minHeight: "36px",
                  background:
                    mode === m ? DS.gradients.primaryBtn : "transparent",
                  color: mode === m ? "white" : DS.colors.lightPurple,
                  boxShadow: mode === m ? DS.shadow.glow : "none",
                }}
              >
                {safe?.nav?.tabs?.[m] || m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const RevolutionOfEarthTool = ({
  props = {},
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const {
    initialMode = "learn",
    showModeSelector = true,
    enabledModes = ["learn", "practice", "applications"],
    language = "en",
    additionalProps = {},
  } = props;

  const [mode, setMode] = useState(initialMode);
  const [currentLanguage, setCurrentLanguage] = useState(language);

  const t = useCallback(
    (key) => {
      const keys = key.split(".");
      let value = translationsData[currentLanguage];
      for (const k of keys) {
        if (value && value[k]) value = value[k];
        else {
          let fb = translationsData["en"];
          for (const k2 of keys) {
            if (fb && fb[k2]) fb = fb[k2];
            else return key;
          }
          return typeof fb === "string" ? fb : key;
        }
      }
      return typeof value === "string" ? value : key;
    },
    [currentLanguage],
  );

  const translations =
    translationsData[currentLanguage] || translationsData["en"];

  useEffect(() => {
    if (setStepDetails) setStepDetails({ currentStep: 1, totalSteps: 1, mode });
  }, [mode, setStepDetails]);

  return (
    <LanguageContext.Provider
      value={{
        language: currentLanguage,
        setLanguage: setCurrentLanguage,
        t,
        translations,
      }}
    >
      <div style={{ fontFamily: DS.font }}>
        <Navbar
          mode={mode}
          setMode={setMode}
          showModeSelector={showModeSelector}
          enabledModes={enabledModes}
        />
        <div style={{ paddingTop: showModeSelector ? "3.5rem" : "0" }}>
          {mode === "learn" && (
            <RevolutionLearnMode additionalProps={additionalProps} />
          )}
          {mode === "practice" && (
            <RevolutionPracticeMode additionalProps={additionalProps} />
          )}
          {mode === "applications" && (
            <RevolutionRealWorld additionalProps={additionalProps} />
          )}
        </div>
      </div>
    </LanguageContext.Provider>
  );
};

export default RevolutionOfEarthTool;
