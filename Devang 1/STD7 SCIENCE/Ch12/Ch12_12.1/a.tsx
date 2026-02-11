import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
  useRef,
} from "react";

/*
 * Design System (from PDF):
 * Primary: #4A4DC9 (indigo)
 * Accent:  #FF7212 (orange)
 * Gradient: #533086 → #FC9145
 * Light:   #C1C1EA, #FFF3E4
 * Neutrals: #4E4E4E, #CACACA, #EBEBEB, #F5F5F5
 * Font: Poppins
 */

// Globe Icon Component
const GlobeIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{
      display: "inline-block",
      verticalAlign: "middle",
      flexShrink: 0,
      width: "clamp(16px, 3vw, 24px)",
      height: "clamp(16px, 3vw, 24px)",
      minWidth: "16px",
      minHeight: "16px",
    }}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

// ============================================================================
// Design Tokens
// ============================================================================
const DS = {
  primary: "#4A4DC9",
  primaryDark: "#3a3da5",
  primaryLight: "#C1C1EA",
  primaryBg: "#EEEEF8",
  accent: "#FF7212",
  accentDark: "#e06000",
  accentLight: "#FFF3E4",
  accentMid: "#FC9145",
  gradientPrimary: "linear-gradient(135deg, #533086, #FC9145)",
  gradientPrimaryHover: "linear-gradient(135deg, #4A2878, #e0813d)",
  gradientSubtle: "linear-gradient(135deg, #C1C1EA 0%, #FFF3E4 100%)",
  gradientBg: "linear-gradient(135deg, #F0F0FA 0%, #FFF8F0 50%, #F0F0FA 100%)",
  text: "#4E4E4E",
  textDark: "#2D2D2D",
  textLight: "#7A7A7A",
  border: "#EBEBEB",
  borderLight: "#F5F5F5",
  disabled: "#CACACA",
  white: "#FFFFFF",
  surface: "#FFFFFF",
  font: '"Poppins", "Noto Sans", sans-serif',
  radius: "12px",
  radiusLg: "20px",
  radiusXl: "24px",
  radiusPill: "100px",
  shadow: "0 4px 20px rgba(74, 77, 201, 0.08)",
  shadowMd: "0 8px 30px rgba(74, 77, 201, 0.10)",
  shadowLg: "0 12px 40px rgba(74, 77, 201, 0.12)",
};

// ============================================================================
// Type Definitions & Translations (unchanged logic)
// ============================================================================
const translationsData = {
  en: {
    language: { en: "English", selectorLabel: "Choose language" },
    nav: {
      logo: "Rotation of the Earth",
      tabs: {
        learn: "Learn",
        practice: "Practice",
        applications: "Real World",
      },
    },
    learn: {
      header: "Rotation of the Earth",
      subtitle: "Interactive Science Learning Experience",
      modes: {
        explore: {
          title: "Explore Earth's Rotation",
          description:
            "Earth rotates on its axis once every 24 hours, spinning from west to east at about 1,670 km/h at the equator. This rotation is what gives us our day and night cycle.",
          icon: "🔭",
        },
        daynight: {
          title: "Day & Night Cycle",
          description:
            "As Earth rotates, different parts face the Sun creating day, while the opposite side experiences night. The boundary between day and night is called the terminator.",
          icon: "🌓",
        },
        timezones: {
          title: "Time Zones",
          description:
            "Earth is divided into 24 time zones. Each zone represents 15° of longitude, or 1 hour of time difference. Click on any city marker to see its local time!",
          icon: "🕐",
        },
        seasons: {
          title: "Axis Tilt & Seasons",
          description:
            "Earth's axis is tilted 23.5° from vertical. This tilt, combined with Earth's orbit around the Sun, creates the four seasons we experience throughout the year.",
          icon: "🍂",
        },
        effects: {
          title: "Effects of Rotation",
          description:
            "Earth's rotation causes many phenomena including the Coriolis effect which deflects winds and ocean currents, the bulging of Earth at the equator, and the apparent motion of stars.",
          icon: "🌀",
        },
      },
      labels: {
        sun: "Sun",
        northPole: "North Pole",
        southPole: "South Pole",
        west: "West",
        east: "East",
        axisTilt: "Axis Tilt",
        day: "DAY",
        night: "NIGHT",
        facingSun: "Facing the Sun",
        awayFromSun: "Away from Sun",
      },
      controls: {
        title: "Controls",
        pause: "Pause",
        play: "Play",
        rotationSpeed: "Rotation Speed",
      },
      keyFacts: {
        title: "Key Facts",
        rotationPeriod: "Rotation Period",
        equatorialSpeed: "Equatorial Speed",
        axisTilt: "Axis Tilt",
        timeZones: "Time Zones",
      },
      effects: {
        title: "Effects of Earth's Rotation",
        coriolisEffect: "Coriolis Effect",
        coriolisDesc:
          "Deflects winds and ocean currents, creating weather patterns",
        equatorialBulge: "Equatorial Bulge",
        bulgeDesc: "Earth is 43 km wider at equator due to centrifugal force",
        tidalForces: "Tidal Forces",
        tidalDesc: "Combined with Moon's gravity, creates ocean tides",
        starTrails: "Star Trails",
        starDesc: "Stars appear to move in circles around celestial poles",
      },
      location: {
        localTime: "Local Time",
        timezone: "Timezone",
        utcOffset: "UTC Offset",
        status: "Status",
        daytime: "Daytime",
        nighttime: "Nighttime",
      },
    },
    practice: {
      question: "Question",
      of: "of",
      score: "Score",
      submitAnswer: "Submit Answer",
      nextQuestion: "Next Question",
      viewResults: "View Results",
      explanation: "Explanation",
      quizCompleted: "Quiz Completed!",
      yourScore: "Your Score",
      perfect: "Perfect! You're a Rotation expert!",
      excellent: "Excellent work! You understand Earth's rotation well!",
      goodJob: "Good job! Keep learning about Earth's rotation!",
      keepPracticing: "Keep practicing! Review the rotation concepts.",
      tryAgain: "Try Again",
      questions: [],
    },
    realWorld: {
      title: "Real World: Earth's Rotation",
      subtitle: "Discover how Earth's spin affects our everyday world",
      overview: "Overview",
      keyFeatures: "Key Features",
      impact: "Impact",
      location: "Location",
      realWorldImpact: "Real-World Impact",
      connection: "Connection to Earth's Rotation",
      examples: [],
    },
  },
};

const LanguageContext = createContext(undefined);

const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState("en");

  const t = useCallback(
    (key, options) => {
      try {
        const keys = key.split(".");
        let value = translationsData[language];
        for (const k of keys) {
          if (value && typeof value === "object" && k in value) {
            value = value[k];
          } else {
            return key;
          }
        }
        if (typeof value === "string") {
          if (options) {
            return value.replace(
              /\{(\w+)\}/g,
              (match, key) => options[key]?.toString() || match,
            );
          }
          return value;
        }
        return key;
      } catch {
        return key;
      }
    },
    [language],
  );

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: setLanguageState, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};

// ============================================================================
// Navbar Component — Redesigned
// ============================================================================
const Navbar = ({ mode, setMode }) => {
  const { t } = useLanguage();

  const tabs = [
    { key: "learn", label: t("nav.tabs.learn"), icon: "📚", color: DS.primary },
    {
      key: "practice",
      label: t("nav.tabs.practice"),
      icon: "🎯",
      color: DS.accent,
    },
    {
      key: "applications",
      label: t("nav.tabs.applications"),
      icon: "🌍",
      color: null,
    },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: DS.white,
        borderBottom: `1px solid ${DS.border}`,
        boxShadow: "0 1px 8px rgba(74, 77, 201, 0.06)",
        backdropFilter: "blur(12px)",
        fontFamily: DS.font,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 clamp(12px, 3vw, 32px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "clamp(56px, 8vw, 68px)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(6px, 1.5vw, 10px)",
            minWidth: 0,
          }}
        >
          <div
            style={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              color: DS.primary,
            }}
          >
            <GlobeIcon />
          </div>
          <span
            style={{
              fontSize: "clamp(0.85rem, 2.5vw, 1.35rem)",
              fontWeight: 700,
              background: DS.gradientPrimary,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {t("nav.logo")}
          </span>
        </div>

        {/* Tab Buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(4px, 1vw, 8px)",
            flexShrink: 0,
          }}
        >
          {tabs.map((tab) => {
            const isActive = mode === tab.key;
            const bg = isActive
              ? tab.key === "applications"
                ? DS.gradientPrimary
                : tab.color
              : DS.white;
            const color = isActive ? DS.white : DS.text;
            const shadow = isActive
              ? `0 2px 12px ${tab.key === "practice" ? "rgba(255,114,18,0.3)" : "rgba(74,77,201,0.3)"}`
              : `0 1px 4px rgba(0,0,0,0.06)`;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setMode(tab.key)}
                style={{
                  padding: "clamp(8px, 1.8vw, 11px) clamp(12px, 2.5vw, 18px)",
                  background: bg,
                  border: isActive ? "none" : `1.5px solid ${DS.border}`,
                  borderRadius: DS.radiusPill,
                  color,
                  fontSize: "clamp(0.75rem, 1.8vw, 0.88rem)",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "clamp(4px, 1vw, 6px)",
                  transition: "all 0.25s ease",
                  boxShadow: shadow,
                  minHeight: "36px",
                  whiteSpace: "nowrap",
                  touchAction: "manipulation",
                  WebkitTapHighlightColor: "transparent",
                  fontFamily: DS.font,
                }}
              >
                <span
                  style={{
                    fontSize: "clamp(0.9rem, 2vw, 1rem)",
                    lineHeight: 1,
                  }}
                >
                  {tab.icon}
                </span>
                <span className="nav-tab-label">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media (max-width: 374px) { .nav-tab-label { display: none !important; } }
        @media (min-width: 375px) { .nav-tab-label { display: inline !important; } }
        @media (hover: hover) and (pointer: fine) {
          nav button:hover { transform: translateY(-1px); filter: brightness(1.06); }
          nav button:active { transform: translateY(0); }
        }
      `,
        }}
      />
    </nav>
  );
};

// ============================================================================
// Learn Mode Component — Redesigned
// ============================================================================
const RotationLearnMode = () => {
  const { language, t } = useLanguage();

  const [activeMode, setActiveMode] = useState("explore");
  const [isRotating, setIsRotating] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showLabels, setShowLabels] = useState(true);
  const animationRef = useRef(undefined);

  const locations = [
    { name: "London", angle: 0, timezone: "GMT", offset: 0 },
    { name: "New York", angle: -75, timezone: "EST", offset: -5 },
    { name: "Tokyo", angle: 139, timezone: "JST", offset: 9 },
    { name: "Sydney", angle: 151, timezone: "AEDT", offset: 11 },
    { name: "Dubai", angle: 55, timezone: "GST", offset: 4 },
    { name: "Mumbai", angle: 73, timezone: "IST", offset: 5.5 },
  ];

  useEffect(() => {
    if (isRotating) {
      const animate = () => {
        setRotationAngle((prev) => (prev + 0.3 * rotationSpeed) % 360);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRotating, rotationSpeed]);

  const getTimeAtLocation = (offset) => {
    const baseHour = (rotationAngle / 15 + 12) % 24;
    const localHour = (baseHour + offset + 24) % 24;
    return `${Math.floor(localHour).toString().padStart(2, "0")}:${Math.floor(
      (localHour % 1) * 60,
    )
      .toString()
      .padStart(2, "0")}`;
  };

  const isDayTime = (angle) => {
    const n = (((angle + rotationAngle + 180) % 360) + 360) % 360;
    return n > 90 && n < 270;
  };

  const modeInfo = {
    explore: {
      title: t("learn.modes.explore.title"),
      description: t("learn.modes.explore.description"),
      icon: "🔭",
    },
    daynight: {
      title: t("learn.modes.daynight.title"),
      description: t("learn.modes.daynight.description"),
      icon: "🌓",
    },
    timezones: {
      title: t("learn.modes.timezones.title"),
      description: t("learn.modes.timezones.description"),
      icon: "🕐",
    },
    seasons: {
      title: t("learn.modes.seasons.title"),
      description: t("learn.modes.seasons.description"),
      icon: "🍂",
    },
    effects: {
      title: t("learn.modes.effects.title"),
      description: t("learn.modes.effects.description"),
      icon: "🌀",
    },
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: DS.gradientBg,
        fontFamily: DS.font,
        color: DS.text,
        padding: "clamp(10px, 3vw, 20px)",
      }}
    >
      {/* Header */}
      <header
        style={{
          textAlign: "center",
          marginBottom: "clamp(16px, 4vw, 24px)",
          padding: "clamp(12px, 3vw, 20px) 0",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(1.5rem, 5vw, 2.8rem)",
            fontWeight: 700,
            background: DS.gradientPrimary,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(8px, 2vw, 16px)",
            flexWrap: "wrap",
            padding: "0 10px",
          }}
        >
          <span style={{ fontSize: "clamp(2rem, 6vw, 3rem)" }}>🌍</span>
          <span>{t("learn.header")}</span>
        </h1>
        <p
          style={{
            color: DS.textLight,
            marginTop: 8,
            fontSize: "clamp(0.85rem, 2.5vw, 1.15rem)",
            fontWeight: 400,
          }}
        >
          {t("learn.subtitle")}
        </p>
      </header>

      {/* Mode Navigation */}
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "clamp(4px, 1.5vw, 8px)",
          marginBottom: "clamp(16px, 4vw, 30px)",
          flexWrap: "wrap",
          padding: "0 clamp(4px, 2vw, 12px)",
        }}
      >
        {Object.keys(modeInfo).map((mode) => (
          <button
            key={mode}
            onClick={() => setActiveMode(mode)}
            style={{
              padding: "clamp(10px, 2.5vw, 14px) clamp(12px, 3vw, 22px)",
              background: activeMode === mode ? DS.gradientPrimary : DS.white,
              border: activeMode === mode ? "none" : `2px solid ${DS.border}`,
              borderRadius: DS.radiusPill,
              color: activeMode === mode ? "#fff" : DS.text,
              cursor: "pointer",
              fontSize: "clamp(0.7rem, 2vw, 0.95rem)",
              fontWeight: activeMode === mode ? 600 : 500,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow:
                activeMode === mode
                  ? "0 6px 20px rgba(83, 48, 134, 0.3)"
                  : DS.shadow,
              display: "flex",
              alignItems: "center",
              gap: "clamp(4px, 1vw, 8px)",
              whiteSpace: "nowrap",
              minHeight: "44px",
              touchAction: "manipulation",
              fontFamily: DS.font,
            }}
          >
            <span
              style={{
                fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
                flexShrink: 0,
              }}
            >
              {modeInfo[mode].icon}
            </span>
            <span className="mode-title">
              {modeInfo[mode].title.split(" ").slice(0, 2).join(" ")}
            </span>
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main
        className="learn-main-content"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "clamp(16px, 3vw, 30px)",
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 clamp(8px, 2vw, 16px)",
          width: "100%",
        }}
      >
        {/* Earth Visualization */}
        <div
          style={{
            background: DS.surface,
            borderRadius: DS.radiusXl,
            padding: "clamp(20px, 4vw, 40px)",
            boxShadow: DS.shadowMd,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            minHeight: "clamp(400px, 60vw, 520px)",
            border: `1px solid ${DS.border}`,
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              maxWidth: 700,
            }}
          >
            {/* Sun */}
            <div
              style={{
                position: "absolute",
                right: 20,
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                className="sun-container"
                style={{
                  width: "clamp(60px, 12vw, 100px)",
                  height: "clamp(60px, 12vw, 100px)",
                  background:
                    "radial-gradient(circle, #fff9c4 0%, #ffeb3b 30%, #ffa000 70%, #ff6f00 100%)",
                  borderRadius: "50%",
                  boxShadow:
                    "0 0 50px 15px rgba(255, 114, 18, 0.3), 0 0 100px 30px rgba(252, 145, 69, 0.15)",
                  animation: "sunPulse 3s ease-in-out infinite",
                }}
              />
              {showLabels && (
                <span
                  style={{
                    fontSize: "clamp(0.75rem, 2vw, 0.95rem)",
                    fontWeight: 600,
                    color: DS.accent,
                    background: DS.accentLight,
                    padding: "4px 12px",
                    borderRadius: DS.radius,
                  }}
                >
                  ☀️ {t("learn.labels.sun")}
                </span>
              )}
            </div>

            {/* Sun rays */}
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "50%",
                transform: "translateY(-50%)",
                width: "clamp(150px, 30vw, 300px)",
                height: "clamp(150px, 30vw, 300px)",
                background:
                  "radial-gradient(ellipse at right, rgba(255, 114, 18, 0.1) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            {/* Earth Container */}
            <div
              className="earth-container"
              style={{
                position: "relative",
                width: "clamp(200px, 40vw, 320px)",
                height: "clamp(200px, 40vw, 320px)",
                marginRight: "clamp(40px, 8vw, 80px)",
              }}
            >
              {/* Axis line */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "clamp(-40px, -8vw, -50px)",
                  width: "clamp(3px, 0.5vw, 4px)",
                  height: "clamp(300px, 60vw, 420px)",
                  background: `linear-gradient(to bottom, ${DS.primary}, rgba(74, 77, 201, 0.2) 20%, rgba(74, 77, 201, 0.2) 80%, ${DS.primary})`,
                  transform: `translateX(-50%) rotate(${activeMode === "seasons" ? 23.5 : 0}deg)`,
                  transformOrigin: "center center",
                  borderRadius: 3,
                  transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                  zIndex: 5,
                }}
              />

              {/* North Pole Label */}
              {showLabels && (
                <div
                  style={{
                    position: "absolute",
                    top: "clamp(-60px, -12vw, -70px)",
                    left: "50%",
                    transform: `translateX(-50%) rotate(${activeMode === "seasons" ? 23.5 : 0}deg)`,
                    transformOrigin: "center 230px",
                    transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                    fontSize: "clamp(0.7rem, 1.5vw, 0.85rem)",
                    fontWeight: 600,
                    color: DS.primary,
                    background: DS.primaryBg,
                    padding: "clamp(3px, 0.8vw, 4px) clamp(8px, 2vw, 10px)",
                    borderRadius: 8,
                    whiteSpace: "nowrap",
                  }}
                >
                  🧭 {t("learn.labels.northPole")}
                </div>
              )}

              {/* South Pole Label */}
              {showLabels && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "clamp(-60px, -12vw, -70px)",
                    left: "50%",
                    transform: `translateX(-50%) rotate(${activeMode === "seasons" ? 23.5 : 0}deg)`,
                    transformOrigin: "center -110px",
                    transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                    fontSize: "clamp(0.7rem, 1.5vw, 0.85rem)",
                    fontWeight: 600,
                    color: DS.primary,
                    background: DS.primaryBg,
                    padding: "clamp(3px, 0.8vw, 4px) clamp(8px, 2vw, 10px)",
                    borderRadius: 8,
                    whiteSpace: "nowrap",
                  }}
                >
                  🧭 {t("learn.labels.southPole")}
                </div>
              )}

              {/* West Label */}
              {showLabels && (
                <div
                  className="direction-label"
                  style={{
                    position: "absolute",
                    left:
                      activeMode === "seasons"
                        ? "clamp(-100px, -15vw, -90px)"
                        : "clamp(-90px, -12vw, -80px)",
                    top: "50%",
                    transform: `translateY(-50%) rotate(${activeMode === "seasons" ? 23.5 : 0}deg)`,
                    transformOrigin:
                      activeMode === "seasons"
                        ? "clamp(150px, 25vw, 170px) center"
                        : "center",
                    transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                    fontSize: "clamp(0.7rem, 2vw, 0.85rem)",
                    fontWeight: 600,
                    color: DS.text,
                    background: DS.white,
                    padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
                    borderRadius: 8,
                    whiteSpace: "nowrap",
                    boxShadow: DS.shadow,
                  }}
                >
                  {t("learn.labels.west")}
                </div>
              )}

              {/* East Label */}
              {showLabels && (
                <div
                  className="direction-label"
                  style={{
                    position: "absolute",
                    right:
                      activeMode === "seasons"
                        ? "clamp(-100px, -15vw, -90px)"
                        : "clamp(-90px, -12vw, -80px)",
                    top: "50%",
                    transform: `translateY(-50%) rotate(${activeMode === "seasons" ? 23.5 : 0}deg)`,
                    transformOrigin:
                      activeMode === "seasons"
                        ? "clamp(-150px, -25vw, -170px) center"
                        : "center",
                    transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                    fontSize: "clamp(0.7rem, 2vw, 0.85rem)",
                    fontWeight: 600,
                    color: DS.text,
                    background: DS.white,
                    padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
                    borderRadius: 8,
                    whiteSpace: "nowrap",
                    boxShadow: DS.shadow,
                  }}
                >
                  {t("learn.labels.east")}
                </div>
              )}

              {/* Axis tilt indicator */}
              {activeMode === "seasons" && (
                <div
                  style={{
                    position: "absolute",
                    top: -30,
                    right: -80,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    animation: "fadeIn 0.5s ease",
                    background: DS.accentLight,
                    padding: "8px 14px",
                    borderRadius: DS.radius,
                    boxShadow: DS.shadow,
                  }}
                >
                  <span style={{ fontSize: "1.5rem" }}>📐</span>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: DS.accent,
                        fontSize: "1.1rem",
                      }}
                    >
                      23.5°
                    </div>
                    <div style={{ fontSize: "0.75rem", color: DS.accentDark }}>
                      {t("learn.labels.axisTilt")}
                    </div>
                  </div>
                </div>
              )}

              {/* Earth */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: `0 0 0 4px rgba(74, 77, 201, 0.15), 0 15px 50px rgba(0,0,0,0.15), inset -40px -20px 60px rgba(0, 0, 80, 0.3)`,
                  transform: `rotate(${activeMode === "seasons" ? 23.5 : 0}deg)`,
                  transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(135deg, #4fc3f7 0%, #0288d1 40%, #01579b 100%)",
                    borderRadius: "50%",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    transform: `rotateY(${rotationAngle}deg)`,
                    transformStyle: "preserve-3d",
                    transition: "transform 0.05s linear",
                  }}
                >
                  <svg
                    viewBox="0 0 100 100"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <defs>
                      <linearGradient
                        id="landGrad"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#66bb6a" />
                        <stop offset="50%" stopColor="#43a047" />
                        <stop offset="100%" stopColor="#2e7d32" />
                      </linearGradient>
                      <filter id="landShadow">
                        <feDropShadow
                          dx="1"
                          dy="1"
                          stdDeviation="0.5"
                          floodColor="#1b5e20"
                          floodOpacity="0.3"
                        />
                      </filter>
                    </defs>
                    <path
                      d="M 12 22 Q 22 17, 32 22 Q 38 32, 34 42 Q 28 48, 18 44 Q 8 38, 12 22"
                      fill="url(#landGrad)"
                      filter="url(#landShadow)"
                    />
                    <path
                      d="M 22 52 Q 30 47, 34 52 Q 38 68, 28 80 Q 20 75, 22 52"
                      fill="url(#landGrad)"
                      filter="url(#landShadow)"
                    />
                    <path
                      d="M 42 18 Q 52 15, 58 22 Q 56 32, 48 38 L 52 58 Q 48 72, 42 68 Q 38 54, 42 38 Q 36 28, 42 18"
                      fill="url(#landGrad)"
                      filter="url(#landShadow)"
                    />
                    <path
                      d="M 58 12 Q 78 10, 88 22 Q 94 38, 84 44 Q 74 50, 64 40 Q 54 30, 58 12"
                      fill="url(#landGrad)"
                      filter="url(#landShadow)"
                    />
                    <path
                      d="M 72 58 Q 86 55, 88 65 Q 84 76, 72 73 Q 66 68, 72 58"
                      fill="url(#landGrad)"
                      filter="url(#landShadow)"
                    />
                    <ellipse
                      cx="50"
                      cy="6"
                      rx="32"
                      ry="6"
                      fill="rgba(255, 255, 255, 0.95)"
                    />
                    <ellipse
                      cx="50"
                      cy="94"
                      rx="28"
                      ry="6"
                      fill="rgba(255, 255, 255, 0.95)"
                    />
                    <ellipse
                      cx="22"
                      cy="32"
                      rx="9"
                      ry="3"
                      fill="rgba(255, 255, 255, 0.7)"
                    />
                    <ellipse
                      cx="68"
                      cy="28"
                      rx="11"
                      ry="4"
                      fill="rgba(255, 255, 255, 0.6)"
                    />
                    <ellipse
                      cx="52"
                      cy="52"
                      rx="13"
                      ry="4"
                      fill="rgba(255, 255, 255, 0.5)"
                    />
                  </svg>
                </div>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(to left, transparent 45%, rgba(10, 20, 50, 0.85) 55%, rgba(5, 10, 30, 0.95) 100%)",
                    zIndex: 3,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: -5,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle at 65% 35%, rgba(255, 255, 255, 0.25) 0%, transparent 40%)",
                    pointerEvents: "none",
                  }}
                />
              </div>

              {/* Location markers for timezone mode */}
              {activeMode === "timezones" &&
                locations.map((loc, i) => {
                  const rad = ((loc.angle + rotationAngle) * Math.PI) / 180;
                  const x = 160 + Math.sin(rad) * 130;
                  const y = 160 - Math.cos(rad) * 45;
                  const isDay = isDayTime(loc.angle);
                  const visible = Math.cos(rad) > -0.3;
                  return visible ? (
                    <div
                      key={loc.name}
                      onClick={() => setSelectedLocation(loc)}
                      style={{
                        position: "absolute",
                        left: x,
                        top: y,
                        transform: "translate(-50%, -50%)",
                        cursor: "pointer",
                        zIndex: 10,
                        animation: `popIn 0.4s ease ${i * 0.08}s both`,
                      }}
                    >
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          background: isDay
                            ? `linear-gradient(135deg, ${DS.accentMid}, ${DS.accent})`
                            : `linear-gradient(135deg, ${DS.primaryLight}, ${DS.primary})`,
                          border: "3px solid white",
                          boxShadow: `0 3px 12px ${isDay ? "rgba(255, 114, 18, 0.4)" : "rgba(74, 77, 201, 0.4)"}`,
                        }}
                      />
                      {showLabels && (
                        <div
                          style={{
                            position: "absolute",
                            top: 24,
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: "#fff",
                            padding: "6px 10px",
                            borderRadius: 8,
                            fontSize: "0.75rem",
                            whiteSpace: "nowrap",
                            boxShadow: DS.shadow,
                            border: `1px solid ${DS.border}`,
                          }}
                        >
                          <div style={{ fontWeight: 700, color: DS.primary }}>
                            {loc.name}
                          </div>
                          <div
                            style={{
                              color: isDay ? DS.accent : DS.primary,
                              fontWeight: 600,
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              justifyContent: "center",
                            }}
                          >
                            {isDay ? "☀️" : "🌙"}{" "}
                            {getTimeAtLocation(loc.offset)}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null;
                })}
            </div>

            {/* Day/Night labels */}
            {activeMode === "daynight" && (
              <>
                <div
                  style={{
                    position: "absolute",
                    right: "clamp(10px, 5vw, 150px)",
                    top: "50%",
                    transform: "translateY(-50%)",
                    textAlign: "center",
                    animation: "fadeIn 0.5s ease",
                    background: DS.accentLight,
                    padding: "clamp(10px, 2vw, 16px) clamp(12px, 3vw, 20px)",
                    borderRadius: "clamp(12px, 2vw, 16px)",
                    boxShadow: "0 4px 20px rgba(255, 114, 18, 0.15)",
                    maxWidth: "clamp(100px, 25vw, 180px)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                      marginBottom: 4,
                    }}
                  >
                    ☀️
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(0.9rem, 2.5vw, 1.2rem)",
                      fontWeight: 700,
                      color: DS.accent,
                    }}
                  >
                    {t("learn.labels.day")}
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(0.7rem, 1.8vw, 0.85rem)",
                      color: DS.accentDark,
                      marginTop: 2,
                    }}
                  >
                    {t("learn.labels.facingSun")}
                  </div>
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: "clamp(10px, 3vw, 30px)",
                    top: "50%",
                    transform: "translateY(-50%)",
                    textAlign: "center",
                    animation: "fadeIn 0.5s ease 0.2s both",
                    background: DS.primaryBg,
                    padding: "clamp(10px, 2vw, 16px) clamp(12px, 3vw, 20px)",
                    borderRadius: "clamp(12px, 2vw, 16px)",
                    boxShadow: `0 4px 20px rgba(74, 77, 201, 0.12)`,
                    maxWidth: "clamp(100px, 25vw, 180px)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                      marginBottom: 4,
                    }}
                  >
                    🌙
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(0.9rem, 2.5vw, 1.2rem)",
                      fontWeight: 700,
                      color: DS.primary,
                    }}
                  >
                    {t("learn.labels.night")}
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(0.7rem, 1.8vw, 0.85rem)",
                      color: DS.primaryDark,
                      marginTop: 2,
                    }}
                  >
                    {t("learn.labels.awayFromSun")}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Info Panel */}
        <aside
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "clamp(16px, 3vw, 20px)",
          }}
        >
          {/* Mode Info Card */}
          <div
            style={{
              background: DS.surface,
              borderRadius: DS.radiusLg,
              padding: "clamp(16px, 3vw, 24px)",
              boxShadow: DS.shadowMd,
              border: `1px solid ${DS.border}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "clamp(8px, 2vw, 12px)",
                marginBottom: "clamp(12px, 2vw, 16px)",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                  background: DS.gradientSubtle,
                  padding: "clamp(8px, 2vw, 12px)",
                  borderRadius: "clamp(12px, 2vw, 16px)",
                  flexShrink: 0,
                }}
              >
                {modeInfo[activeMode].icon}
              </span>
              <h2
                style={{
                  fontSize: "clamp(1rem, 2.5vw, 1.35rem)",
                  fontWeight: 700,
                  color: DS.primary,
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {modeInfo[activeMode].title}
              </h2>
            </div>
            <p
              style={{
                color: DS.textLight,
                lineHeight: 1.75,
                fontSize: "clamp(0.875rem, 2vw, 1rem)",
                margin: 0,
              }}
            >
              {modeInfo[activeMode].description}
            </p>
          </div>

          {/* Controls Card */}
          <div
            style={{
              background: DS.surface,
              borderRadius: DS.radiusLg,
              padding: "clamp(16px, 3vw, 24px)",
              boxShadow: DS.shadowMd,
              border: `1px solid ${DS.border}`,
            }}
          >
            <h3
              style={{
                fontSize: "clamp(0.95rem, 2.2vw, 1.1rem)",
                fontWeight: 700,
                marginBottom: "clamp(14px, 2.5vw, 18px)",
                color: DS.primary,
                display: "flex",
                alignItems: "center",
                gap: "clamp(6px, 1.5vw, 8px)",
              }}
            >
              <span>🎮</span> {t("learn.controls.title")}
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "clamp(12px, 2vw, 16px)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "clamp(8px, 2vw, 12px)",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() => setIsRotating(!isRotating)}
                  style={{
                    flex: 1,
                    minWidth: "120px",
                    padding: "clamp(12px, 2.5vw, 16px) clamp(16px, 3vw, 24px)",
                    background: isRotating
                      ? "linear-gradient(135deg, #ef5350, #e53935)"
                      : "linear-gradient(135deg, #66bb6a, #43a047)",
                    border: "none",
                    borderRadius: DS.radius,
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: isRotating
                      ? "0 6px 20px rgba(229, 57, 53, 0.25)"
                      : "0 6px 20px rgba(67, 160, 71, 0.25)",
                    minHeight: "44px",
                    fontFamily: DS.font,
                  }}
                >
                  {isRotating
                    ? "⏸️ " + t("learn.controls.pause")
                    : "▶️ " + t("learn.controls.play")}
                </button>
                <button
                  onClick={() => setShowLabels(!showLabels)}
                  style={{
                    padding: "clamp(12px, 2.5vw, 16px) clamp(14px, 3vw, 20px)",
                    background: showLabels ? DS.primary : DS.borderLight,
                    border: showLabels ? "none" : `2px solid ${DS.border}`,
                    borderRadius: DS.radius,
                    color: showLabels ? "#fff" : DS.disabled,
                    cursor: "pointer",
                    fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
                    fontWeight: 600,
                    minHeight: "44px",
                    minWidth: "44px",
                  }}
                >
                  🏷️
                </button>
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                      color: DS.textLight,
                      fontWeight: 500,
                    }}
                  >
                    {t("learn.controls.rotationSpeed")}
                  </span>
                  <span
                    style={{
                      fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                      fontWeight: 700,
                      color: DS.primary,
                      background: DS.primaryBg,
                      padding: "2px 10px",
                      borderRadius: 8,
                    }}
                  >
                    {rotationSpeed}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.25"
                  max="5"
                  step="0.25"
                  value={rotationSpeed}
                  onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                  style={{
                    width: "100%",
                    height: "clamp(6px, 1.5vw, 10px)",
                    borderRadius: 4,
                    background: DS.gradientPrimary,
                    cursor: "pointer",
                    appearance: "none",
                    outline: "none",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Key Facts Card */}
          <div
            style={{
              background: DS.gradientSubtle,
              borderRadius: DS.radiusLg,
              padding: 24,
              boxShadow: DS.shadowMd,
            }}
          >
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                marginBottom: 16,
                color: DS.primary,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>📊</span> {t("learn.keyFacts.title")}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                {
                  label: t("learn.keyFacts.rotationPeriod"),
                  value: "23h 56m 4s",
                  icon: "⏱️",
                  color: DS.primary,
                },
                {
                  label: t("learn.keyFacts.equatorialSpeed"),
                  value: "1,670 km/h",
                  icon: "💨",
                  color: "#00897b",
                },
                {
                  label: t("learn.keyFacts.axisTilt"),
                  value: "23.5°",
                  icon: "📐",
                  color: DS.accent,
                },
                {
                  label: t("learn.keyFacts.timeZones"),
                  value: "24",
                  icon: "🌐",
                  color: "#533086",
                },
              ].map((fact) => (
                <div
                  key={fact.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    background: DS.white,
                    borderRadius: DS.radius,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <span
                    style={{
                      color: DS.textLight,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      fontWeight: 500,
                    }}
                  >
                    <span style={{ fontSize: "1.2rem" }}>{fact.icon}</span>
                    {fact.label}
                  </span>
                  <span
                    style={{
                      fontWeight: 700,
                      color: fact.color,
                      fontSize: "1.05rem",
                    }}
                  >
                    {fact.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Effects Card */}
          {activeMode === "effects" && (
            <div
              style={{
                background: DS.surface,
                borderRadius: DS.radiusLg,
                padding: 24,
                boxShadow: DS.shadowMd,
                animation: "slideUp 0.5s ease",
                border: `1px solid ${DS.border}`,
              }}
            >
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  marginBottom: 16,
                  color: "#533086",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span>🌀</span> {t("learn.effects.title")}
              </h3>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {[
                  {
                    title: t("learn.effects.coriolisEffect"),
                    desc: t("learn.effects.coriolisDesc"),
                    emoji: "🌪️",
                  },
                  {
                    title: t("learn.effects.equatorialBulge"),
                    desc: t("learn.effects.bulgeDesc"),
                    emoji: "🥚",
                  },
                  {
                    title: t("learn.effects.tidalForces"),
                    desc: t("learn.effects.tidalDesc"),
                    emoji: "🌊",
                  },
                  {
                    title: t("learn.effects.starTrails"),
                    desc: t("learn.effects.starDesc"),
                    emoji: "✨",
                  },
                ].map((effect) => (
                  <div
                    key={effect.title}
                    style={{
                      padding: "14px 16px",
                      background: DS.primaryBg,
                      borderRadius: DS.radius,
                      borderLeft: `4px solid ${DS.primary}`,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        color: "#533086",
                        marginBottom: 4,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span>{effect.emoji}</span>
                      {effect.title}
                    </div>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: DS.textLight,
                        lineHeight: 1.5,
                      }}
                    >
                      {effect.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Location Card */}
          {selectedLocation && activeMode === "timezones" && (
            <div
              style={{
                background: DS.accentLight,
                borderRadius: DS.radiusLg,
                padding: 24,
                boxShadow: `0 8px 30px rgba(255, 114, 18, 0.12)`,
                animation: "slideUp 0.3s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <h3
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    color: DS.accent,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    margin: 0,
                  }}
                >
                  <span>📍</span> {selectedLocation.name}
                </h3>
                <button
                  onClick={() => setSelectedLocation(null)}
                  style={{
                    background: "rgba(255, 114, 18, 0.1)",
                    border: "none",
                    color: DS.accent,
                    cursor: "pointer",
                    fontSize: "1.3rem",
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ×
                </button>
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {[
                  {
                    label: t("learn.location.localTime"),
                    value: getTimeAtLocation(selectedLocation.offset),
                  },
                  {
                    label: t("learn.location.timezone"),
                    value: selectedLocation.timezone,
                  },
                  {
                    label: t("learn.location.utcOffset"),
                    value: `${selectedLocation.offset >= 0 ? "+" : ""}${selectedLocation.offset}h`,
                  },
                  {
                    label: t("learn.location.status"),
                    value: isDayTime(selectedLocation.angle)
                      ? `☀️ ${t("learn.location.daytime")}`
                      : `🌙 ${t("learn.location.nighttime")}`,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      background: "#fff",
                      padding: "10px 14px",
                      borderRadius: 10,
                    }}
                  >
                    <span style={{ color: DS.accentDark, fontWeight: 500 }}>
                      {item.label}
                    </span>
                    <span style={{ fontWeight: 700, color: DS.accent }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes sunPulse {
          0%, 100% { box-shadow: 0 0 50px 15px rgba(255, 114, 18, 0.3), 0 0 100px 30px rgba(252, 145, 69, 0.15); }
          50% { box-shadow: 0 0 60px 20px rgba(255, 114, 18, 0.4), 0 0 120px 40px rgba(252, 145, 69, 0.2); }
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes popIn { from { opacity: 0; transform: translate(-50%, -50%) scale(0.5); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
        input[type="range"]::-webkit-slider-thumb { appearance: none; width: 22px; height: 22px; background: white; border-radius: 50%; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.2); border: 3px solid ${DS.primary}; }
        input[type="range"]::-moz-range-thumb { width: 22px; height: 22px; background: white; border-radius: 50%; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.2); border: 3px solid ${DS.primary}; }
        @media (min-width: 1024px) { .learn-main-content { grid-template-columns: 1fr 380px !important; } }
        @media (max-width: 640px) { .mode-title { display: none; } }
        @media (max-width: 768px) { .earth-container { width: 250px !important; height: 250px !important; margin-right: 60px !important; } .sun-container { width: 70px !important; height: 70px !important; } }
        @media (max-width: 640px) { .earth-container { width: 220px !important; height: 220px !important; margin-right: 50px !important; } .sun-container { width: 60px !important; height: 60px !important; } .direction-label { font-size: 0.7rem !important; padding: 3px 8px !important; } }
        @media (max-width: 480px) { .earth-container { width: 180px !important; height: 180px !important; margin-right: 30px !important; } .sun-container { width: 50px !important; height: 50px !important; right: 10px !important; } .direction-label { font-size: 0.65rem !important; padding: 2px 6px !important; } h1 { font-size: clamp(1.3rem, 6vw, 2rem) !important; } }
        @media (hover: none) and (pointer: coarse) { button { min-height: 44px !important; min-width: 44px !important; } }
        html { scroll-behavior: smooth; }
      `,
        }}
      />
    </div>
  );
};

// ============================================================================
// Practice Mode Component — Redesigned
// ============================================================================
const RotationPracticeMode = () => {
  const { language, t } = useLanguage();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [streak, setStreak] = useState(0);

  const questionsData = {
    en: [
      {
        id: 1,
        type: "mcq",
        question:
          "How long does it take for Earth to complete one full rotation on its axis?",
        options: ["12 hours", "24 hours", "365 days", "30 days"],
        correctAnswer: 1,
        explanation:
          "Earth takes approximately 24 hours (23 hours, 56 minutes, and 4 seconds to be exact) to complete one full rotation on its axis.",
        difficulty: "easy",
      },
      {
        id: 2,
        type: "mcq",
        question:
          "In which direction does Earth rotate when viewed from above the North Pole?",
        options: [
          "Clockwise",
          "Counter-clockwise",
          "It doesn't rotate",
          "Both directions",
        ],
        correctAnswer: 1,
        explanation:
          "Earth rotates counter-clockwise (from west to east) when viewed from above the North Pole.",
        difficulty: "easy",
      },
      {
        id: 3,
        type: "truefalse",
        question: "The Earth's axis is tilted at approximately 23.5 degrees.",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation:
          "True! Earth's axis is tilted at about 23.5 degrees relative to its orbital plane.",
        difficulty: "easy",
      },
      {
        id: 4,
        type: "mcq",
        question: "What is the speed of Earth's rotation at the equator?",
        options: [
          "About 500 km/h",
          "About 1,000 km/h",
          "About 1,670 km/h",
          "About 2,500 km/h",
        ],
        correctAnswer: 2,
        explanation:
          "At the equator, Earth's surface moves at approximately 1,670 km/h due to rotation.",
        difficulty: "medium",
      },
      {
        id: 5,
        type: "mcq",
        question: "What causes day and night on Earth?",
        options: [
          "Earth's revolution around the Sun",
          "Earth's rotation on its axis",
          "The Moon blocking sunlight",
          "The Sun moving around Earth",
        ],
        correctAnswer: 1,
        explanation:
          "Day and night are caused by Earth's rotation on its axis.",
        difficulty: "easy",
      },
      {
        id: 6,
        type: "mcq",
        question:
          "The Coriolis effect deflects moving objects in which direction in the Northern Hemisphere?",
        options: ["To the left", "To the right", "Downward", "Upward"],
        correctAnswer: 1,
        explanation:
          "In the Northern Hemisphere, the Coriolis effect deflects moving objects to the right.",
        difficulty: "hard",
      },
      {
        id: 7,
        type: "mcq",
        question: "Why does Earth bulge slightly at the equator?",
        options: [
          "Because of the Moon's gravity",
          "Because of centrifugal force from rotation",
          "Because of volcanic activity",
          "Because of ocean water weight",
        ],
        correctAnswer: 1,
        explanation:
          "Earth's rotation creates centrifugal force that pushes material outward at the equator.",
        difficulty: "hard",
      },
      {
        id: 8,
        type: "truefalse",
        question:
          "If Earth stopped rotating, one side would always face the Sun.",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation:
          "True! One hemisphere would experience permanent day while the other would have permanent night.",
        difficulty: "medium",
      },
      {
        id: 9,
        type: "mcq",
        question: "How many degrees does Earth rotate in one hour?",
        options: ["10 degrees", "15 degrees", "20 degrees", "30 degrees"],
        correctAnswer: 1,
        explanation:
          "Earth rotates 360° in 24 hours, so 15° per hour (360 ÷ 24 = 15).",
        difficulty: "medium",
      },
      {
        id: 10,
        type: "mcq",
        question: "What would happen to our weight if Earth rotated faster?",
        options: [
          "We would weigh more",
          "We would weigh less",
          "Our weight wouldn't change",
          "We would float away immediately",
        ],
        correctAnswer: 1,
        explanation:
          "Increased centrifugal force would make us weigh slightly less, especially at the equator.",
        difficulty: "hard",
      },
      {
        id: 11,
        type: "truefalse",
        question:
          "People at the North Pole experience the same day length as people at the equator.",
        options: ["True", "False"],
        correctAnswer: 1,
        explanation:
          "False! Due to Earth's axial tilt, polar regions experience extreme day length variations.",
        difficulty: "medium",
      },
      {
        id: 12,
        type: "mcq",
        question: "Earth is divided into how many time zones?",
        options: ["12", "24", "36", "48"],
        correctAnswer: 1,
        explanation:
          "Earth is divided into 24 time zones, each representing 15° of longitude.",
        difficulty: "easy",
      },
      {
        id: 13,
        type: "mcq",
        question:
          "The exact time for one Earth rotation is 23 hours, 56 minutes, and how many seconds?",
        options: ["4 seconds", "10 seconds", "30 seconds", "60 seconds"],
        correctAnswer: 0,
        explanation:
          "One sidereal day takes 23 hours, 56 minutes, and 4 seconds.",
        difficulty: "hard",
      },
      {
        id: 14,
        type: "mcq",
        question: "Which of the following is NOT caused by Earth's rotation?",
        options: [
          "Day and night cycle",
          "Coriolis effect",
          "The four seasons",
          "Time zones",
        ],
        correctAnswer: 2,
        explanation:
          "Seasons are caused by axial tilt and revolution, not rotation.",
        difficulty: "medium",
      },
      {
        id: 15,
        type: "mcq",
        question: "At which location does Earth rotate the fastest?",
        options: ["North Pole", "South Pole", "Equator", "Mid-latitudes"],
        correctAnswer: 2,
        explanation:
          "Earth rotates fastest at the equator (~1,670 km/h) because the circumference is largest there.",
        difficulty: "easy",
      },
    ],
  };

  const filteredQuestions = questionsData[language].filter(
    (q) => q.type === "mcq" || q.type === "truefalse",
  );
  const currentQuestion = filteredQuestions[currentQuestionIndex];

  useEffect(() => {
    if (!quizCompleted && !showResult) {
      const interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [quizCompleted, showResult]);

  const handleSubmit = () => {
    if (!currentQuestion) return;
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setStreak(isCorrect ? streak + 1 : 0);
    setResults([
      ...results,
      {
        questionId: currentQuestion.id,
        isCorrect,
        userAnswer: selectedAnswer,
        timeTaken: timer,
      },
    ]);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimer(0);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setResults([]);
    setQuizCompleted(false);
    setStreak(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimer(0);
  };

  const getScore = () =>
    Math.round(
      (results.filter((r) => r.isCorrect).length / results.length) * 100,
    );

  if (quizCompleted) {
    const score = getScore();
    const totalTime = results.reduce((acc, r) => acc + r.timeTaken, 0);
    return (
      <div
        style={{
          minHeight: "100vh",
          background: DS.gradientBg,
          fontFamily: DS.font,
          padding: "clamp(15px, 4vw, 30px)",
        }}
      >
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            background: DS.surface,
            borderRadius: DS.radiusXl,
            padding: "clamp(20px, 5vw, 40px)",
            boxShadow: DS.shadowLg,
            border: `1px solid ${DS.border}`,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <div style={{ fontSize: "4rem", marginBottom: 16 }}>
              {score >= 80
                ? "🏆"
                : score >= 60
                  ? "🌟"
                  : score >= 40
                    ? "💪"
                    : "📚"}
            </div>
            <h1
              style={{
                fontSize: "clamp(1.5rem, 5vw, 2.2rem)",
                fontWeight: 700,
                background: DS.gradientPrimary,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("practice.quizCompleted")}
            </h1>
            <p style={{ color: DS.textLight, marginTop: 8 }}>
              {score >= 80
                ? t("practice.perfect")
                : score >= 60
                  ? t("practice.excellent")
                  : score >= 40
                    ? t("practice.goodJob")
                    : t("practice.keepPracticing")}
            </p>
          </div>

          <div
            className="quiz-results-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "clamp(12px, 3vw, 20px)",
              marginBottom: "clamp(20px, 4vw, 30px)",
            }}
          >
            <div
              style={{
                background: DS.primaryBg,
                padding: 24,
                borderRadius: 16,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  color: DS.primary,
                }}
              >
                {score}%
              </div>
              <div style={{ color: DS.textLight, fontWeight: 500 }}>
                {t("practice.score")}
              </div>
            </div>
            <div
              style={{
                background: "#e8f5e9",
                padding: 24,
                borderRadius: 16,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  color: "#2e7d32",
                }}
              >
                {results.filter((r) => r.isCorrect).length}/{results.length}
              </div>
              <div style={{ color: DS.textLight, fontWeight: 500 }}>
                Correct
              </div>
            </div>
            <div
              style={{
                background: DS.accentLight,
                padding: 24,
                borderRadius: 16,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  color: DS.accent,
                }}
              >
                {Math.floor(totalTime / 60)}:
                {(totalTime % 60).toString().padStart(2, "0")}
              </div>
              <div style={{ color: DS.textLight, fontWeight: 500 }}>Time</div>
            </div>
          </div>

          <div style={{ marginBottom: 30 }}>
            <h3 style={{ color: DS.primary, marginBottom: 16 }}>
              📊 {t("practice.viewResults")}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {results.map((result, index) => {
                const question = questionsData[language].find(
                  (q) => q.id === result.questionId,
                );
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 16px",
                      background: result.isCorrect ? "#e8f5e9" : "#ffebee",
                      borderRadius: DS.radius,
                      borderLeft: `4px solid ${result.isCorrect ? "#4caf50" : "#f44336"}`,
                    }}
                  >
                    <span style={{ fontSize: "1.3rem" }}>
                      {result.isCorrect ? "✅" : "❌"}
                    </span>
                    <span style={{ flex: 1, color: DS.text, fontWeight: 500 }}>
                      Q{index + 1}: {question?.question.substring(0, 50)}...
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={restartQuiz}
            style={{
              width: "100%",
              padding: "clamp(14px, 3vw, 18px)",
              background: DS.gradientPrimary,
              border: "none",
              borderRadius: DS.radius,
              color: "#fff",
              fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(83, 48, 134, 0.25)",
              minHeight: "48px",
              fontFamily: DS.font,
            }}
          >
            🔄 {t("practice.tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: DS.gradientBg,
        fontFamily: DS.font,
        padding: "clamp(10px, 3vw, 20px)",
      }}
    >
      <main
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 clamp(8px, 2vw, 16px)",
          width: "100%",
        }}
      >
        <div
          style={{
            background: DS.surface,
            borderRadius: DS.radiusXl,
            padding: "clamp(16px, 4vw, 32px)",
            boxShadow: DS.shadowMd,
            border: `1px solid ${DS.border}`,
          }}
        >
          {/* Progress */}
          <div style={{ marginBottom: "clamp(16px, 3vw, 24px)" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  color: DS.textLight,
                  fontWeight: 500,
                  fontSize: "clamp(0.85rem, 2vw, 1rem)",
                }}
              >
                {t("practice.question")} {currentQuestionIndex + 1}{" "}
                {t("practice.of")} {filteredQuestions.length}
              </span>
            </div>
            <div
              style={{
                height: "clamp(6px, 1.5vw, 10px)",
                background: DS.border,
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%`,
                  background: DS.gradientPrimary,
                  borderRadius: 4,
                  transition: "width 0.5s ease",
                }}
              />
            </div>
          </div>

          {/* Question */}
          <div style={{ marginBottom: "clamp(20px, 4vw, 28px)" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "clamp(8px, 2vw, 12px)",
              }}
            >
              <span
                style={{
                  fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
                  background: DS.gradientSubtle,
                  padding: "clamp(6px, 1.5vw, 10px) clamp(10px, 2vw, 14px)",
                  borderRadius: DS.radius,
                  flexShrink: 0,
                }}
              >
                ❓
              </span>
              <h2
                style={{
                  fontSize: "clamp(1rem, 3vw, 1.3rem)",
                  fontWeight: 600,
                  color: DS.textDark,
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {currentQuestion?.question}
              </h2>
            </div>
          </div>

          {/* Options */}
          <div style={{ marginBottom: "clamp(16px, 3vw, 24px)" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "clamp(10px, 2vw, 14px)",
              }}
            >
              {currentQuestion?.options?.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect =
                  showResult && index === currentQuestion.correctAnswer;
                const isWrong =
                  showResult &&
                  isSelected &&
                  index !== currentQuestion.correctAnswer;
                return (
                  <button
                    key={index}
                    onClick={() => !showResult && setSelectedAnswer(index)}
                    disabled={showResult}
                    style={{
                      padding: "clamp(14px, 3vw, 18px) clamp(16px, 3vw, 22px)",
                      background: isCorrect
                        ? "#e8f5e9"
                        : isWrong
                          ? "#ffebee"
                          : isSelected
                            ? DS.primaryBg
                            : DS.borderLight,
                      border: `2px solid ${isCorrect ? "#4caf50" : isWrong ? "#f44336" : isSelected ? DS.primary : "transparent"}`,
                      borderRadius: DS.radius,
                      cursor: showResult ? "default" : "pointer",
                      textAlign: "left",
                      fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                      fontWeight: 500,
                      color: DS.text,
                      display: "flex",
                      alignItems: "center",
                      gap: "clamp(10px, 2vw, 14px)",
                      minHeight: "56px",
                      fontFamily: DS.font,
                      transition: "all 0.2s ease",
                    }}
                  >
                    <span
                      style={{
                        width: "clamp(28px, 4vw, 36px)",
                        height: "clamp(28px, 4vw, 36px)",
                        borderRadius: "50%",
                        background: isCorrect
                          ? "#4caf50"
                          : isWrong
                            ? "#f44336"
                            : isSelected
                              ? DS.primary
                              : DS.border,
                        color:
                          isSelected || isCorrect || isWrong
                            ? "#fff"
                            : DS.textLight,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {isCorrect
                        ? "✓"
                        : isWrong
                          ? "✗"
                          : String.fromCharCode(65 + index)}
                    </span>
                    <span style={{ flex: 1, wordBreak: "break-word" }}>
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation */}
          {showResult && (
            <div
              style={{
                padding: "18px 22px",
                background: results[results.length - 1]?.isCorrect
                  ? "#e8f5e9"
                  : DS.accentLight,
                borderRadius: DS.radius,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <span style={{ fontSize: "1.8rem" }}>
                  {results[results.length - 1]?.isCorrect ? "🎉" : "💡"}
                </span>
                <h3
                  style={{
                    margin: 0,
                    color: results[results.length - 1]?.isCorrect
                      ? "#2e7d32"
                      : DS.accent,
                  }}
                >
                  {results[results.length - 1]?.isCorrect
                    ? "Correct!"
                    : "Not quite right"}
                </h3>
              </div>
              <p style={{ margin: 0, color: DS.textLight, lineHeight: 1.7 }}>
                <strong
                  style={{ display: "block", marginBottom: 4, color: DS.text }}
                >
                  {t("practice.explanation")}:
                </strong>
                {currentQuestion?.explanation}
              </p>
            </div>
          )}

          {/* Actions */}
          <div
            style={{
              display: "flex",
              gap: "clamp(10px, 2vw, 14px)",
              flexWrap: "wrap",
            }}
          >
            {!showResult ? (
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                style={{
                  flex: 1,
                  padding: "clamp(14px, 3vw, 18px)",
                  background: DS.gradientPrimary,
                  border: "none",
                  borderRadius: DS.radius,
                  color: "#fff",
                  fontSize: "clamp(0.95rem, 2.5vw, 1.05rem)",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(83, 48, 134, 0.25)",
                  opacity: selectedAnswer === null ? 0.5 : 1,
                  minHeight: "48px",
                  fontFamily: DS.font,
                }}
              >
                ✓ {t("practice.submitAnswer")}
              </button>
            ) : (
              <button
                onClick={handleNext}
                style={{
                  flex: 1,
                  padding: "clamp(14px, 3vw, 18px)",
                  background: "linear-gradient(135deg, #43a047, #2e7d32)",
                  border: "none",
                  borderRadius: DS.radius,
                  color: "#fff",
                  fontSize: "clamp(0.95rem, 2.5vw, 1.05rem)",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(46, 125, 50, 0.25)",
                  minHeight: "48px",
                  fontFamily: DS.font,
                }}
              >
                {currentQuestionIndex < filteredQuestions.length - 1
                  ? `→ ${t("practice.nextQuestion")}`
                  : `🏁 ${t("practice.viewResults")}`}
              </button>
            )}
          </div>
        </div>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media (max-width: 768px) { .quiz-results-grid { grid-template-columns: 1fr !important; } }
        @media (min-width: 769px) and (max-width: 1024px) { .quiz-results-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }
      `,
        }}
      />
    </div>
  );
};

// ============================================================================
// Real World Applications Mode — Redesigned
// ============================================================================
const RotationRealWorld = () => {
  const { language, t } = useLanguage();
  const [activeTopic, setActiveTopic] = useState("aviation");
  const [flightDirection, setFlightDirection] = useState("east");
  const [planePosition, setPlanePosition] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [weatherHemisphere, setWeatherHemisphere] = useState("north");
  const [satelliteOrbit, setSatelliteOrbit] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedCity, setSelectedCity] = useState(0);
  const animationRef = useRef(undefined);

  const cities = [
    { name: "New York", timezone: -5, country: "USA" },
    { name: "London", timezone: 0, country: "UK" },
    { name: "Dubai", timezone: 4, country: "UAE" },
    { name: "Mumbai", timezone: 5.5, country: "India" },
    { name: "Tokyo", timezone: 9, country: "Japan" },
    { name: "Sydney", timezone: 11, country: "Australia" },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (activeTopic === "satellites") {
      const animate = () => {
        setSatelliteOrbit((prev) => (prev + 0.3) % 360);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
      return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      };
    }
  }, [activeTopic]);

  const simulateFlight = () => {
    setIsAnimating(true);
    setPlanePosition(0);
    const speed = flightDirection === "east" ? 3 : 2;
    const interval = setInterval(() => {
      setPlanePosition((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnimating(false);
          return 100;
        }
        return prev + speed;
      });
    }, 50);
  };

  const getTimeInCity = (timezone) => {
    const utc = currentTime.getTime() + currentTime.getTimezoneOffset() * 60000;
    return new Date(utc + 3600000 * timezone).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const topics = {
    aviation: {
      title: "Aviation & Flight Times",
      icon: "✈️",
      description:
        "Earth's rotation significantly affects flight times. Flying east (with Earth's rotation) is generally faster than flying west due to jet streams created by the rotation.",
      facts: [
        {
          title: "Eastbound Flights Are Faster",
          content:
            "A flight from New York to London (eastbound) takes about 7 hours, while the return takes about 8 hours.",
          icon: "⏱️",
        },
        {
          title: "Jet Streams",
          content:
            "Fast-flowing air currents at 9-12 km altitude, flowing west to east. They can reach 400 km/h.",
          icon: "💨",
        },
        {
          title: "Fuel Savings",
          content:
            "Airlines save millions by planning routes that take advantage of jet streams. Eastbound flights can save up to 10% fuel.",
          icon: "⛽",
        },
        {
          title: "Great Circle Routes",
          content:
            "Pilots fly curved paths (great circles) rather than straight lines on maps — the shortest routes on a sphere.",
          icon: "🗺️",
        },
      ],
    },
    navigation: {
      title: "Navigation & GPS",
      icon: "🧭",
      description:
        "Modern navigation must account for Earth's rotation. GPS satellites, ships, and aircraft all compensate for Earth's spin.",
      facts: [
        {
          title: "GPS Corrections",
          content:
            "GPS satellites must account for Earth's rotation. Without corrections, your location would be off by hundreds of meters.",
          icon: "📡",
        },
        {
          title: "Ship Navigation",
          content:
            "Ships must factor in Earth's rotation. The Coriolis effect can push ships off course over long distances.",
          icon: "🚢",
        },
        {
          title: "Military Accuracy",
          content:
            "Long-range missiles must account for Earth's rotation. A shell fired north lands slightly to the right.",
          icon: "🎯",
        },
        {
          title: "Surveying",
          content:
            "Surveyors must account for rotation when making precise measurements over large distances.",
          icon: "📐",
        },
      ],
    },
    weather: {
      title: "Weather Patterns",
      icon: "🌪️",
      description:
        "Earth's rotation creates the Coriolis effect, shaping global weather, ocean currents, and hurricane spin direction.",
      facts: [
        {
          title: "Hurricane Spin Direction",
          content:
            "Hurricanes spin counter-clockwise in the Northern Hemisphere and clockwise in the Southern.",
          icon: "🌀",
        },
        {
          title: "Trade Winds",
          content:
            "The reliable trade winds are created by Earth's rotation deflecting air moving toward the equator.",
          icon: "⛵",
        },
        {
          title: "Ocean Currents",
          content:
            "Major currents like the Gulf Stream are influenced by rotation, carrying warm water and affecting climates.",
          icon: "🌊",
        },
        {
          title: "Weather Forecasting",
          content:
            "Meteorologists must factor rotation into weather models for high/low pressure system movement.",
          icon: "🌤️",
        },
      ],
    },
    satellites: {
      title: "Satellites & Space",
      icon: "🛰️",
      description:
        "Earth's rotation is crucial for satellite launches. Launching eastward gets a speed boost from rotation.",
      facts: [
        {
          title: "Launch Advantage",
          content:
            "Rockets launched eastward from the equator get a free 1,670 km/h boost from Earth's rotation.",
          icon: "🚀",
        },
        {
          title: "Geostationary Orbit",
          content:
            "Satellites at 35,786 km orbit at Earth's rotation rate, appearing stationary. Used for TV and weather.",
          icon: "📺",
        },
        {
          title: "ISS Orbit",
          content:
            "The ISS orbits every 90 minutes, experiencing 16 sunrises and sunsets daily.",
          icon: "🛸",
        },
        {
          title: "Space Launch Sites",
          content:
            "Launch sites are often built near the equator to maximize the rotational speed boost.",
          icon: "🏗️",
        },
      ],
    },
    "daily-life": {
      title: "Daily Life",
      icon: "🌅",
      description:
        "Earth's rotation shapes daily routines, from sunrise/sunset times to time zones coordinating global activities.",
      facts: [
        {
          title: "Time Zones",
          content:
            "The world has 24 time zones because Earth rotates 15° per hour.",
          icon: "🕐",
        },
        {
          title: "Jet Lag",
          content:
            "Your body's internal clock gets out of sync. It takes about 1 day per zone to adjust.",
          icon: "😴",
        },
        {
          title: "Business & Communication",
          content:
            "Global businesses coordinate across zones. When it's morning in New York, it's evening in Tokyo.",
          icon: "💼",
        },
        {
          title: "Day Length Variation",
          content:
            "Due to tilt, day length varies by season and latitude. Near the poles, summer brings 24-hour daylight.",
          icon: "📅",
        },
      ],
    },
    sports: {
      title: "Sports & Games",
      icon: "⚽",
      description:
        "Earth's rotation affects long-range sports in subtle but measurable ways.",
      facts: [
        {
          title: "Long Golf Drives",
          content:
            "A 300-meter drive can be deflected ~1 cm due to Earth's rotation.",
          icon: "⛳",
        },
        {
          title: "Baseball",
          content:
            "A baseball thrown coast-to-coast would be deflected about 100 meters to the right.",
          icon: "⚾",
        },
        {
          title: "Olympic Shooting",
          content:
            "Competitors must account for Earth's rotation over long distances.",
          icon: "🎯",
        },
        {
          title: "Soccer & Cricket",
          content: "Wind patterns created by rotation affect outdoor sports.",
          icon: "🏏",
        },
      ],
    },
  };

  const currentTopic = topics[activeTopic];

  const ut = {
    interactive: "Interactive Demonstration",
    flightSim: "Flight Time Simulator",
    selectDirection: "Select Direction:",
    eastbound: "→ Eastbound (Faster)",
    westbound: "← Westbound (Slower)",
    newYork: "New York",
    london: "London",
    jetStream: "Jet Stream",
    flying: "✈️ Flying...",
    startFlight: "🛫 Start Flight",
    fastFlight: "⚡ Fast Flight!",
    slowFlight: "🐢 Slower Flight",
    jetStreamHelp: "Jet streams helped push the plane, saving ~1 hour!",
    jetStreamHinder: "Flying against jet streams added ~1 hour to the trip.",
    hurricaneSpin: "Hurricane Spin Direction",
    selectHemisphere: "Select Hemisphere:",
    northern: "Northern",
    southern: "Southern",
    counterClockwise: "↺ Counter-Clockwise",
    clockwise: "↻ Clockwise",
    inThe: "In the",
    hemisphereSpins: "Hemisphere, hurricanes spin",
    dueToCoriolis: "due to the Coriolis effect.",
    satelliteOrbits: "Satellite Orbits",
    geostationary: "Geostationary",
    iss: "ISS",
    orbit24hr: "24 hr orbit",
    orbit90min: "90 min orbit",
    worldTimeZones: "World Time Zones",
    didYouKnow: "Did you know?",
    gpsCoriolis: "GPS & Coriolis Correction",
    withoutCorrection: "Without correction",
    withCorrection: "With correction",
    gpsExplanation:
      "Earth's rotation causes moving objects to curve. GPS, missiles, and even long kicks must account for this Coriolis effect!",
    sportsRotation: "Sports & Earth's Rotation",
    golf: "Golf",
    baseball: "Baseball",
    shooting: "Shooting",
    soccer: "Soccer",
    golfEffect: "300m drive deflected ~1cm",
    baseballEffect: "Home runs not affected noticeably",
    shootingEffect: "Olympic shooters must compensate",
    soccerEffect: "Wind patterns affect outdoor play",
    sportsConclusion:
      "🤔 The effect is real but usually too small to notice in most sports!",
    keyFacts: "Key Facts",
    thinkAboutIt: "Think About It",
    timeComparison: "When it's {t1} in {c1}, it's {t2} in {c2}!",
  };

  // Styled toggle button helper
  const ToggleBtn = ({ active, onClick, children, style: extraStyle }) => (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        minWidth: "120px",
        padding: "clamp(12px, 2.5vw, 16px)",
        background: active ? DS.primary : DS.white,
        border: `2px solid ${active ? DS.primary : DS.border}`,
        borderRadius: DS.radius,
        color: active ? "#fff" : DS.text,
        fontWeight: 600,
        cursor: "pointer",
        fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
        minHeight: "44px",
        fontFamily: DS.font,
        transition: "all 0.2s ease",
        ...extraStyle,
      }}
    >
      {children}
    </button>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: DS.gradientBg,
        fontFamily: DS.font,
        padding: "clamp(10px, 3vw, 20px)",
      }}
    >
      {/* Header */}
      <header
        style={{ textAlign: "center", marginBottom: 24, padding: "16px 0" }}
      >
        <h1
          style={{
            fontSize: "clamp(1.5rem, 5vw, 2.4rem)",
            fontWeight: 700,
            background: DS.gradientPrimary,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(8px, 2vw, 12px)",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: "2.5rem" }}>🌍</span>
          {t("realWorld.title")}
        </h1>
        <p
          style={{
            color: DS.textLight,
            marginTop: 8,
            fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
          }}
        >
          {t("realWorld.subtitle")}
        </p>
      </header>

      {/* Topic Navigation */}
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "clamp(4px, 1.5vw, 8px)",
          marginBottom: "clamp(20px, 4vw, 30px)",
          flexWrap: "wrap",
        }}
      >
        {Object.keys(topics).map((topic) => (
          <button
            key={topic}
            onClick={() => setActiveTopic(topic)}
            style={{
              padding: "clamp(10px, 2.5vw, 14px) clamp(14px, 3vw, 22px)",
              background: activeTopic === topic ? DS.gradientPrimary : DS.white,
              border: activeTopic === topic ? "none" : `2px solid ${DS.border}`,
              borderRadius: DS.radiusPill,
              color: activeTopic === topic ? "#fff" : DS.text,
              cursor: "pointer",
              fontSize: "clamp(0.75rem, 2vw, 0.95rem)",
              fontWeight: activeTopic === topic ? 600 : 500,
              boxShadow:
                activeTopic === topic
                  ? "0 6px 20px rgba(83, 48, 134, 0.3)"
                  : DS.shadow,
              display: "flex",
              alignItems: "center",
              gap: "clamp(6px, 1.5vw, 10px)",
              minHeight: "44px",
              fontFamily: DS.font,
              transition: "all 0.3s ease",
            }}
          >
            <span
              style={{ fontSize: "clamp(1rem, 2.5vw, 1.2rem)", flexShrink: 0 }}
            >
              {topics[topic].icon}
            </span>
            <span className="topic-label">
              {topics[topic].title.split(" ")[0]}
            </span>
          </button>
        ))}
      </nav>

      <main
        className="realworld-main-grid"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "clamp(16px, 3vw, 24px)",
          width: "100%",
        }}
      >
        {/* Interactive Demo */}
        <div
          style={{
            background: DS.surface,
            borderRadius: DS.radiusXl,
            padding: "clamp(20px, 4vw, 28px)",
            boxShadow: DS.shadowMd,
            border: `1px solid ${DS.border}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(8px, 2vw, 12px)",
              marginBottom: "clamp(16px, 3vw, 20px)",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                background: DS.gradientSubtle,
                padding: "clamp(8px, 2vw, 12px)",
                borderRadius: "clamp(12px, 2vw, 16px)",
                flexShrink: 0,
              }}
            >
              {currentTopic.icon}
            </span>
            <div>
              <h2
                style={{
                  fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
                  fontWeight: 700,
                  color: DS.primary,
                  margin: 0,
                }}
              >
                {currentTopic.title}
              </h2>
              <p
                style={{
                  color: DS.textLight,
                  margin: "4px 0 0",
                  fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                }}
              >
                {ut.interactive}
              </p>
            </div>
          </div>

          {/* Aviation Demo */}
          {activeTopic === "aviation" && (
            <div
              style={{
                background: DS.primaryBg,
                borderRadius: 16,
                padding: 20,
              }}
            >
              <h3
                style={{
                  color: DS.primary,
                  margin: "0 0 16px",
                  fontSize: "1.1rem",
                }}
              >
                ✈️ {ut.flightSim}
              </h3>
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    color: DS.text,
                    fontWeight: 500,
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  {ut.selectDirection}
                </label>
                <div
                  style={{
                    display: "flex",
                    gap: "clamp(8px, 2vw, 12px)",
                    flexWrap: "wrap",
                  }}
                >
                  <ToggleBtn
                    active={flightDirection === "east"}
                    onClick={() => setFlightDirection("east")}
                  >
                    {ut.eastbound}
                  </ToggleBtn>
                  <ToggleBtn
                    active={flightDirection === "west"}
                    onClick={() => setFlightDirection("west")}
                  >
                    {ut.westbound}
                  </ToggleBtn>
                </div>
              </div>

              <div
                style={{
                  background: "#fff",
                  borderRadius: DS.radius,
                  padding: "clamp(16px, 3vw, 20px)",
                  position: "relative",
                  overflow: "hidden",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 20,
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  <div style={{ textAlign: "center", flex: "1 1 120px" }}>
                    <div style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
                      🗽
                    </div>
                    <div style={{ fontWeight: 600, color: DS.primary }}>
                      {ut.newYork}
                    </div>
                  </div>
                  <div style={{ textAlign: "center", flex: "1 1 120px" }}>
                    <div style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
                      🏰
                    </div>
                    <div style={{ fontWeight: 600, color: DS.primary }}>
                      {ut.london}
                    </div>
                  </div>
                </div>
                <div
                  className="flight-demo"
                  style={{
                    height: "clamp(50px, 8vw, 60px)",
                    background: DS.primaryBg,
                    borderRadius: 30,
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 30,
                      opacity: 0.3,
                      color: DS.primary,
                    }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        style={{ fontSize: "clamp(1rem, 2.5vw, 1.5rem)" }}
                      >
                        →
                      </span>
                    ))}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: -18,
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontSize: "0.7rem",
                      color: DS.primary,
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {ut.jetStream} →
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left:
                        flightDirection === "east"
                          ? `${planePosition}%`
                          : `${100 - planePosition}%`,
                      transform: `translateX(-50%) scaleX(${flightDirection === "east" ? 1 : -1})`,
                      fontSize: "clamp(1.5rem, 3vw, 2rem)",
                      transition: "left 0.05s linear",
                      zIndex: 2,
                    }}
                  >
                    ✈️
                  </div>
                </div>
              </div>

              <button
                onClick={simulateFlight}
                disabled={isAnimating}
                style={{
                  width: "100%",
                  padding: "clamp(12px, 2.5vw, 16px)",
                  background: isAnimating ? DS.disabled : DS.gradientPrimary,
                  border: "none",
                  borderRadius: DS.radius,
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                  cursor: isAnimating ? "default" : "pointer",
                  boxShadow: isAnimating
                    ? "none"
                    : "0 4px 15px rgba(83, 48, 134, 0.25)",
                  minHeight: "48px",
                  fontFamily: DS.font,
                }}
              >
                {isAnimating ? ut.flying : ut.startFlight}
              </button>

              {planePosition >= 100 && (
                <div
                  style={{
                    marginTop: 16,
                    padding: "14px 18px",
                    background:
                      flightDirection === "east" ? "#e8f5e9" : DS.accentLight,
                    borderRadius: DS.radius,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      color: flightDirection === "east" ? "#2e7d32" : DS.accent,
                      fontSize: "1.1rem",
                    }}
                  >
                    {flightDirection === "east" ? ut.fastFlight : ut.slowFlight}
                  </div>
                  <div style={{ color: DS.textLight, marginTop: 4 }}>
                    {flightDirection === "east"
                      ? ut.jetStreamHelp
                      : ut.jetStreamHinder}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Weather Demo */}
          {activeTopic === "weather" && (
            <div
              style={{
                background: DS.primaryBg,
                borderRadius: 16,
                padding: 20,
              }}
            >
              <h3
                style={{
                  color: DS.primary,
                  margin: "0 0 16px",
                  fontSize: "1.1rem",
                }}
              >
                🌀 {ut.hurricaneSpin}
              </h3>
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    color: DS.text,
                    fontWeight: 500,
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  {ut.selectHemisphere}
                </label>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <ToggleBtn
                    active={weatherHemisphere === "north"}
                    onClick={() => setWeatherHemisphere("north")}
                  >
                    🌍 {ut.northern}
                  </ToggleBtn>
                  <ToggleBtn
                    active={weatherHemisphere === "south"}
                    onClick={() => setWeatherHemisphere("south")}
                  >
                    🌏 {ut.southern}
                  </ToggleBtn>
                </div>
              </div>

              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: 30,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  className="hurricane-demo"
                  style={{
                    width: "clamp(120px, 25vw, 150px)",
                    height: "clamp(120px, 25vw, 150px)",
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${DS.primaryBg} 0%, ${DS.primary} 50%, ${DS.primaryDark} 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    boxShadow: `0 8px 30px rgba(74, 77, 201, 0.3)`,
                  }}
                >
                  <div
                    style={{
                      fontSize: "clamp(2rem, 5vw, 3rem)",
                      animation: `spin${weatherHemisphere === "north" ? "CCW" : "CW"} 3s linear infinite`,
                    }}
                  >
                    🌀
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      width: "clamp(16px, 3vw, 20px)",
                      height: "clamp(16px, 3vw, 20px)",
                      background: "#fff",
                      borderRadius: "50%",
                    }}
                  />
                </div>
                <div
                  style={{ marginTop: 20, textAlign: "center", maxWidth: 400 }}
                >
                  <div
                    style={{
                      fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
                      fontWeight: 700,
                      color: DS.primary,
                      marginBottom: 8,
                    }}
                  >
                    {weatherHemisphere === "north"
                      ? ut.counterClockwise
                      : ut.clockwise}
                  </div>
                  <div style={{ color: DS.textLight, lineHeight: 1.6 }}>
                    {ut.inThe}{" "}
                    {weatherHemisphere === "north" ? ut.northern : ut.southern}{" "}
                    {ut.hemisphereSpins}{" "}
                    {weatherHemisphere === "north"
                      ? ut.counterClockwise.toLowerCase()
                      : ut.clockwise.toLowerCase()}{" "}
                    {ut.dueToCoriolis}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Satellites Demo */}
          {activeTopic === "satellites" && (
            <div
              style={{
                background: DS.accentLight,
                borderRadius: 16,
                padding: 20,
              }}
            >
              <h3
                style={{
                  color: "#533086",
                  margin: "0 0 16px",
                  fontSize: "1.1rem",
                }}
              >
                🛰️ {ut.satelliteOrbits}
              </h3>
              <div
                className="satellite-demo"
                style={{
                  background: "#1a1a2e",
                  borderRadius: 16,
                  padding: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                  minHeight: "clamp(200px, 40vw, 250px)",
                }}
              >
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      width: 2,
                      height: 2,
                      background: "#fff",
                      borderRadius: "50%",
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      opacity: Math.random() * 0.8 + 0.2,
                    }}
                  />
                ))}
                <div
                  style={{
                    width: "clamp(60px, 12vw, 80px)",
                    height: "clamp(60px, 12vw, 80px)",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #4fc3f7, #0288d1, #01579b)",
                    boxShadow: "0 0 30px rgba(79, 195, 247, 0.4)",
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(to left, transparent 50%, rgba(0,0,0,0.5) 100%)",
                    }}
                  />
                </div>
                <div
                  style={{
                    position: "absolute",
                    width: "clamp(150px, 30vw, 200px)",
                    height: "clamp(150px, 30vw, 200px)",
                    border: `2px dashed ${DS.primaryLight}`,
                    borderRadius: "50%",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    width: "clamp(150px, 30vw, 200px)",
                    height: "clamp(150px, 30vw, 200px)",
                    transform: `rotate(${satelliteOrbit}deg)`,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)",
                    }}
                  >
                    🛰️
                  </div>
                </div>
                <div
                  style={{
                    position: "absolute",
                    width: "clamp(100px, 20vw, 130px)",
                    height: "clamp(100px, 20vw, 130px)",
                    border: `2px dashed rgba(252, 145, 69, 0.4)`,
                    borderRadius: "50%",
                    transform: "rotate(30deg)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    width: "clamp(100px, 20vw, 130px)",
                    height: "clamp(100px, 20vw, 130px)",
                    transform: `rotate(${30 + satelliteOrbit * 3}deg)`,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontSize: "clamp(1rem, 2vw, 1.2rem)",
                    }}
                  >
                    🛸
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: 14,
                  marginTop: 16,
                }}
              >
                <div
                  style={{
                    background: "#fff",
                    padding: "14px 18px",
                    borderRadius: 10,
                    textAlign: "center",
                  }}
                >
                  <div style={{ color: DS.textLight, fontSize: "0.8rem" }}>
                    🛰️ {ut.geostationary}
                  </div>
                  <div style={{ color: "#533086", fontWeight: 700 }}>
                    35,786 km
                  </div>
                  <div style={{ color: DS.textLight, fontSize: "0.75rem" }}>
                    {ut.orbit24hr}
                  </div>
                </div>
                <div
                  style={{
                    background: "#fff",
                    padding: "14px 18px",
                    borderRadius: 10,
                    textAlign: "center",
                  }}
                >
                  <div style={{ color: DS.accent, fontSize: "0.8rem" }}>
                    🛸 {ut.iss}
                  </div>
                  <div style={{ color: "#533086", fontWeight: 700 }}>
                    408 km
                  </div>
                  <div style={{ color: DS.textLight, fontSize: "0.75rem" }}>
                    {ut.orbit90min}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Daily Life Demo */}
          {activeTopic === "daily-life" && (
            <div
              style={{
                background: DS.accentLight,
                borderRadius: 16,
                padding: 20,
              }}
            >
              <h3
                style={{
                  color: DS.accent,
                  margin: "0 0 16px",
                  fontSize: "1.1rem",
                }}
              >
                🕐 {ut.worldTimeZones}
              </h3>
              <div
                style={{
                  background: "#fff",
                  borderRadius: DS.radius,
                  padding: 20,
                }}
              >
                <div
                  className="city-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(clamp(100px, 20vw, 140px), 1fr))",
                    gap: 14,
                  }}
                >
                  {cities.map((city, index) => (
                    <div
                      key={city.name}
                      onClick={() => setSelectedCity(index)}
                      style={{
                        padding: "clamp(12px, 2.5vw, 16px)",
                        background:
                          selectedCity === index
                            ? DS.accentLight
                            : DS.borderLight,
                        borderRadius: DS.radius,
                        cursor: "pointer",
                        textAlign: "center",
                        border:
                          selectedCity === index
                            ? `2px solid ${DS.accent}`
                            : "2px solid transparent",
                        transition: "all 0.3s ease",
                        minHeight: "120px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
                          marginBottom: 4,
                        }}
                      >
                        {["🗽", "🏰", "🏜️", "🕌", "🗼", "🦘"][index]}
                      </div>
                      <div
                        style={{
                          fontWeight: 700,
                          color: DS.primary,
                          fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                        }}
                      >
                        {city.name}
                      </div>
                      <div
                        style={{
                          fontFamily: "monospace",
                          fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)",
                          fontWeight: 700,
                          color: DS.accent,
                          marginTop: 4,
                        }}
                      >
                        {getTimeInCity(city.timezone)}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: DS.disabled }}>
                        UTC{city.timezone >= 0 ? "+" : ""}
                        {city.timezone}
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: 16,
                    padding: "14px 18px",
                    background: "#e8f5e9",
                    borderRadius: 10,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      color: "#2e7d32",
                      marginBottom: 4,
                    }}
                  >
                    💡 {ut.didYouKnow}
                  </div>
                  <div style={{ color: DS.textLight, fontSize: "0.9rem" }}>
                    {ut.timeComparison
                      .replace(
                        "{t1}",
                        getTimeInCity(cities[selectedCity].timezone),
                      )
                      .replace("{c1}", cities[selectedCity].name)
                      .replace(
                        "{t2}",
                        getTimeInCity(cities[(selectedCity + 3) % 6].timezone),
                      )
                      .replace("{c2}", cities[(selectedCity + 3) % 6].name)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Demo */}
          {activeTopic === "navigation" && (
            <div
              style={{
                background: DS.primaryBg,
                borderRadius: 16,
                padding: 20,
              }}
            >
              <h3
                style={{
                  color: DS.primary,
                  margin: "0 0 16px",
                  fontSize: "1.1rem",
                }}
              >
                🧭 {ut.gpsCoriolis}
              </h3>
              <div
                style={{
                  background: "#fff",
                  borderRadius: DS.radius,
                  padding: 20,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 200,
                    height: 200,
                    margin: "0 auto 20px",
                    borderRadius: "50%",
                    background: "#e8f5e9",
                    position: "relative",
                    border: "3px solid #4caf50",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: 0,
                      bottom: 0,
                      width: 1,
                      background: "rgba(0,0,0,0.1)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: 0,
                      right: 0,
                      height: 1,
                      background: "rgba(0,0,0,0.1)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "30%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontSize: "1.5rem",
                    }}
                  >
                    🎯
                  </div>
                  <svg
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <path
                      d="M 100 180 Q 130 100, 115 65"
                      fill="none"
                      stroke="#f44336"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                    <path
                      d="M 100 180 Q 90 100, 100 60"
                      fill="none"
                      stroke="#4caf50"
                      strokeWidth="2"
                    />
                  </svg>
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontSize: "1.5rem",
                    }}
                  >
                    🚀
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "30%",
                      right: "35%",
                      fontSize: "0.8rem",
                      color: "#f44336",
                    }}
                  >
                    ✗
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 20,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{ width: 20, height: 3, background: "#f44336" }}
                    />
                    <span style={{ fontSize: "0.85rem", color: DS.textLight }}>
                      {ut.withoutCorrection}
                    </span>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{ width: 20, height: 3, background: "#4caf50" }}
                    />
                    <span style={{ fontSize: "0.85rem", color: DS.textLight }}>
                      {ut.withCorrection}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    padding: 14,
                    background: DS.primaryBg,
                    borderRadius: 10,
                    color: DS.primary,
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                  }}
                >
                  {ut.gpsExplanation}
                </div>
              </div>
            </div>
          )}

          {/* Sports Demo */}
          {activeTopic === "sports" && (
            <div
              style={{
                background: DS.primaryBg,
                borderRadius: 16,
                padding: 20,
              }}
            >
              <h3
                style={{
                  color: DS.primary,
                  margin: "0 0 16px",
                  fontSize: "1.1rem",
                }}
              >
                ⚽ {ut.sportsRotation}
              </h3>
              <div
                style={{
                  background: "#fff",
                  borderRadius: DS.radius,
                  padding: 20,
                }}
              >
                <div
                  className="sports-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: 16,
                  }}
                >
                  {[
                    {
                      emoji: "⛳",
                      name: ut.golf,
                      effect: ut.golfEffect,
                      bg: "#e8f5e9",
                      color: "#2e7d32",
                    },
                    {
                      emoji: "⚾",
                      name: ut.baseball,
                      effect: ut.baseballEffect,
                      bg: DS.primaryBg,
                      color: DS.primary,
                    },
                    {
                      emoji: "🎯",
                      name: ut.shooting,
                      effect: ut.shootingEffect,
                      bg: DS.accentLight,
                      color: DS.accent,
                    },
                    {
                      emoji: "⚽",
                      name: ut.soccer,
                      effect: ut.soccerEffect,
                      bg: "#FFF3E4",
                      color: "#e06000",
                    },
                  ].map((s) => (
                    <div
                      key={s.name}
                      style={{
                        padding: 16,
                        background: s.bg,
                        borderRadius: DS.radius,
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>
                        {s.emoji}
                      </div>
                      <div
                        style={{
                          fontWeight: 700,
                          color: s.color,
                          marginBottom: 4,
                        }}
                      >
                        {s.name}
                      </div>
                      <div style={{ color: DS.textLight, fontSize: "0.85rem" }}>
                        {s.effect}
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: 16,
                    padding: 14,
                    background: "#e8f5e9",
                    borderRadius: 10,
                    textAlign: "center",
                  }}
                >
                  <span style={{ color: "#2e7d32", fontWeight: 500 }}>
                    {ut.sportsConclusion}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Facts Section */}
        <div
          style={{
            background: DS.surface,
            borderRadius: DS.radiusXl,
            padding: "clamp(20px, 4vw, 28px)",
            boxShadow: DS.shadowMd,
            border: `1px solid ${DS.border}`,
          }}
        >
          <h2
            style={{
              fontSize: "1.3rem",
              fontWeight: 700,
              color: DS.primary,
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            📚 {ut.keyFacts}
          </h2>
          <p
            style={{
              color: DS.textLight,
              lineHeight: 1.7,
              marginBottom: 24,
              padding: 16,
              background: DS.borderLight,
              borderRadius: DS.radius,
            }}
          >
            {currentTopic.description}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {currentTopic.facts.map((fact, index) => (
              <div
                key={index}
                style={{
                  padding: "18px 20px",
                  background: DS.borderLight,
                  borderRadius: 14,
                  borderLeft: `4px solid ${DS.primary}`,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <span style={{ fontSize: "1.5rem" }}>{fact.icon}</span>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      color: DS.primary,
                    }}
                  >
                    {fact.title}
                  </h3>
                </div>
                <p
                  style={{
                    margin: 0,
                    color: DS.textLight,
                    lineHeight: 1.7,
                    fontSize: "0.95rem",
                  }}
                >
                  {fact.content}
                </p>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 24,
              padding: 20,
              background: DS.accentLight,
              borderRadius: 16,
            }}
          >
            <h3
              style={{
                color: DS.accent,
                margin: "0 0 12px",
                fontSize: "1.1rem",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              💡 {ut.thinkAboutIt}
            </h3>
            <p style={{ color: DS.text, margin: 0, lineHeight: 1.7 }}>
              {activeTopic === "aviation" &&
                "Why do you think most major airports are built in the eastern parts of continents?"}
              {activeTopic === "navigation" &&
                "How would GPS work differently if Earth rotated twice as fast?"}
              {activeTopic === "weather" &&
                "Would hurricanes exist on a planet that doesn't rotate?"}
              {activeTopic === "satellites" &&
                "Why are most rocket launch sites located near the equator?"}
              {activeTopic === "daily-life" &&
                "What would happen to time zones if Earth rotated in the opposite direction?"}
              {activeTopic === "sports" &&
                "Would snipers need to adjust their aim more at the equator or near the poles?"}
            </p>
          </div>
        </div>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes spinCCW { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes spinCW { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (min-width: 1024px) { .realworld-main-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 640px) { .topic-label { display: none !important; } }
        @media (min-width: 768px) { .city-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 479px) { .city-grid { grid-template-columns: 1fr !important; } }
        @media (min-width: 768px) { .sports-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (hover: hover) and (pointer: fine) { button:hover { transform: translateY(-1px); filter: brightness(1.05); } }
        @media (hover: none) and (pointer: coarse) { button { min-height: 44px !important; min-width: 44px !important; } }
      `,
        }}
      />
    </div>
  );
};

// ============================================================================
// Main App Component
// ============================================================================
const App = () => {
  const [mode, setMode] = useState("learn");

  return (
    <LanguageProvider>
      <Navbar mode={mode} setMode={setMode} />
      <div
        style={{
          paddingTop: "clamp(56px, 8vw, 68px)",
          minHeight: "100vh",
          width: "100%",
          maxWidth: "100vw",
          overflowX: "hidden",
        }}
      >
        {mode === "learn" && <RotationLearnMode />}
        {mode === "practice" && <RotationPracticeMode />}
        {mode === "applications" && <RotationRealWorld />}
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; }
        body { margin: 0; padding: 0; overflow-x: hidden; font-family: "Poppins", "Noto Sans", sans-serif; }
        html { scroll-behavior: smooth; -webkit-overflow-scrolling: touch; }
        @supports (padding: max(0px)) {
          body { padding-top: env(safe-area-inset-top); padding-left: env(safe-area-inset-left); padding-right: env(safe-area-inset-right); }
        }
        @media screen and (max-width: 768px) { input, select, textarea { font-size: 16px !important; } body { overscroll-behavior-y: contain; } }
      `,
        }}
      />
    </LanguageProvider>
  );
};

export default App;
