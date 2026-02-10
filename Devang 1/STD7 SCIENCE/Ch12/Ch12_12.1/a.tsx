import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
  useRef,
} from "react";
import type { ReactNode } from "react";

/*
 * RESPONSIVE DESIGN CONFIGURATION
 * ================================
 * This application is fully responsive and optimized for all devices.
 * 
 * IMPORTANT: Add this meta tag to your HTML <head> for proper mobile rendering:
 * <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
 * 
 * Supported Devices:
 * - Mobile phones (320px - 480px)
 * - Tablets portrait (481px - 768px)
 * - Tablets landscape (769px - 1024px)
 * - Laptops (1025px - 1440px)
 * - Desktop (1441px+)
 * 
 * Features:
 * - Touch-friendly tap targets (min 44x44px)
 * - Responsive typography using clamp()
 * - Fluid spacing and sizing
 * - Safe area insets for notched devices
 * - Optimized for both portrait and landscape modes
 * - Prevents horizontal scroll on all devices
 * - Accessible keyboard navigation
 */

// Globe Icon Component (inline SVG to avoid dependency issues)
const GlobeIcon: React.FC<{ className?: string }> = ({ className = '' }) => {
  const iconStyle: React.CSSProperties = {
    display: 'inline-block',
    verticalAlign: 'middle',
    flexShrink: 0,
    width: 'clamp(16px, 3vw, 24px)',
    height: 'clamp(16px, 3vw, 24px)',
    minWidth: '16px',
    minHeight: '16px'
  };
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={iconStyle}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
};

// ============================================================================
// Type Definitions
// ============================================================================
export type Language = "en";
export type LanguageCode = Language;

export interface LanguageSelector {
  en: string;
  selectorLabel: string;
}

export interface NavTranslations {
  logo: string;
  tabs: {
    learn: string;
    practice: string;
    applications: string;
  };
}

export interface BaseTranslations {
  language: LanguageSelector;
  nav: NavTranslations;
  learn: {
    header: string;
    subtitle: string;
    modes: {
      explore: { title: string; description: string; icon: string };
      daynight: { title: string; description: string; icon: string };
      timezones: { title: string; description: string; icon: string };
      seasons: { title: string; description: string; icon: string };
      effects: { title: string; description: string; icon: string };
    };
    labels: {
      sun: string;
      northPole: string;
      southPole: string;
      west: string;
      east: string;
      axisTilt: string;
      day: string;
      night: string;
      facingSun: string;
      awayFromSun: string;
    };
    controls: {
      title: string;
      pause: string;
      play: string;
      rotationSpeed: string;
    };
    keyFacts: {
      title: string;
      rotationPeriod: string;
      equatorialSpeed: string;
      axisTilt: string;
      timeZones: string;
    };
    effects: {
      title: string;
      coriolisEffect: string;
      coriolisDesc: string;
      equatorialBulge: string;
      bulgeDesc: string;
      tidalForces: string;
      tidalDesc: string;
      starTrails: string;
      starDesc: string;
    };
    location: {
      localTime: string;
      timezone: string;
      utcOffset: string;
      status: string;
      daytime: string;
      nighttime: string;
    };
  };
  practice: {
    question: string;
    of: string;
    score: string;
    submitAnswer: string;
    nextQuestion: string;
    viewResults: string;
    explanation: string;
    quizCompleted: string;
    yourScore: string;
    perfect: string;
    excellent: string;
    goodJob: string;
    keepPracticing: string;
    tryAgain: string;
    questions: Array<{
      question: string;
      options: string[];
      explanation: string;
    }>;
  };
  realWorld: {
    title: string;
    subtitle: string;
    overview: string;
    keyFeatures: string;
    impact: string;
    location: string;
    realWorldImpact: string;
    connection: string;
    examples: Array<{
      title: string;
      location: string;
      description: string;
      category: string;
      impact: string;
      keyFeatures: string[];
      connection: string;
    }>;
  };
}

// Basic translations data
const translationsData: { [key: string]: BaseTranslations } = {
  en: {
    language: {
      en: "English",
      selectorLabel: "Choose language",
    },
    nav: {
      logo: "Rotation of the Earth",
      tabs: {
        learn: "Learn",
        practice: "Practice",
        applications: "Real World",
      },
    },
    learn: {
      header: 'Rotation of the Earth',
      subtitle: 'Interactive Science Learning Experience',
      modes: {
        explore: { title: 'Explore Earth\'s Rotation', description: 'Earth rotates on its axis once every 24 hours, spinning from west to east at about 1,670 km/h at the equator. This rotation is what gives us our day and night cycle.', icon: '🔭' },
        daynight: { title: 'Day & Night Cycle', description: 'As Earth rotates, different parts face the Sun creating day, while the opposite side experiences night. The boundary between day and night is called the terminator.', icon: '🌓' },
        timezones: { title: 'Time Zones', description: 'Earth is divided into 24 time zones. Each zone represents 15° of longitude, or 1 hour of time difference. Click on any city marker to see its local time!', icon: '🕐' },
        seasons: { title: 'Axis Tilt & Seasons', description: 'Earth\'s axis is tilted 23.5° from vertical. This tilt, combined with Earth\'s orbit around the Sun, creates the four seasons we experience throughout the year.', icon: '🍂' },
        effects: { title: 'Effects of Rotation', description: 'Earth\'s rotation causes many phenomena including the Coriolis effect which deflects winds and ocean currents, the bulging of Earth at the equator, and the apparent motion of stars.', icon: '🌀' }
      },
      labels: { sun: 'Sun', northPole: 'North Pole', southPole: 'South Pole', west: 'West', east: 'East', axisTilt: 'Axis Tilt', day: 'DAY', night: 'NIGHT', facingSun: 'Facing the Sun', awayFromSun: 'Away from Sun' },
      controls: { title: 'Controls', pause: 'Pause', play: 'Play', rotationSpeed: 'Rotation Speed' },
      keyFacts: { title: 'Key Facts', rotationPeriod: 'Rotation Period', equatorialSpeed: 'Equatorial Speed', axisTilt: 'Axis Tilt', timeZones: 'Time Zones' },
      effects: { title: 'Effects of Earth\'s Rotation', coriolisEffect: 'Coriolis Effect', coriolisDesc: 'Deflects winds and ocean currents, creating weather patterns', equatorialBulge: 'Equatorial Bulge', bulgeDesc: 'Earth is 43 km wider at equator due to centrifugal force', tidalForces: 'Tidal Forces', tidalDesc: 'Combined with Moon\'s gravity, creates ocean tides', starTrails: 'Star Trails', starDesc: 'Stars appear to move in circles around celestial poles' },
      location: { localTime: 'Local Time', timezone: 'Timezone', utcOffset: 'UTC Offset', status: 'Status', daytime: 'Daytime', nighttime: 'Nighttime' }
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

// Get appropriate font family based on language
export const getFontFamilyForLanguage = (lang: Language | string): string => {
  return 'Poppins, "Noto Sans", sans-serif';
};

// ============================================================================
// Language Context
// ============================================================================
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const getInitialLanguage = (): Language => {
    return "en";
  };
  
  const initialLanguage = getInitialLanguage();
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  // Custom translation function that accesses translationsData directly
  const t = useCallback(
    (key: string, options?: Record<string, unknown>): string => {
      try {
        const keys = key.split(".");
        let value: any = translationsData[language];

        for (const k of keys) {
          if (value && typeof value === "object" && k in value) {
            value = value[k];
          } else {
            return key;
          }
        }

        if (typeof value === "string") {
          if (options) {
            return value.replace(/\{(\w+)\}/g, (match, key) => {
              return options[key]?.toString() || match;
            });
          }
          return value;
        }

        return key;
      } catch (error) {
        return key;
      }
    },
    [language]
  );

  const handleSetLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("i18nextLng", lang);
      } catch (error) {
        console.warn("Failed to save language preference to localStorage:", error);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && document && document.documentElement) {
      try {
        document.documentElement.lang = language;
      } catch (error) {
        // Silently handle any DOM access errors
      }
    }
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

// ============================================================================
// Navbar Component
// ============================================================================
interface NavbarProps {
  mode: "learn" | "practice" | "applications";
  setMode: (mode: "learn" | "practice" | "applications") => void;
}

const Navbar: React.FC<NavbarProps> = ({ mode, setMode }) => {
  const { t } = useLanguage();

  const isLearn = mode === "learn";
  const isPractice = mode === "practice";
  const isApplications = mode === "applications";

  const handleModeChange = (newMode: "learn" | "practice" | "applications") => {
    setMode(newMode);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-teal-50 via-purple-50 to-teal-50 border-b border-teal-200/50 shadow-sm backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-18">
          {/* Logo Section - Left Side */}
          <div className="flex-shrink-0 flex items-center gap-1 sm:gap-2 min-w-0" style={{ flex: '0 1 auto' }}>
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', color: '#0d9488' }}>
              <GlobeIcon />
            </div>
            <span style={{
              fontSize: 'clamp(0.875rem, 2.5vw, 1.5rem)',
              fontWeight: 700,
              background: 'linear-gradient(to right, #0d9488, #9333ea)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {t("nav.logo")}
            </span>
          </div>

          {/* Mode Buttons Section - Right Side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1vw, 10px)', flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => handleModeChange("learn")}
              style={{
                padding: 'clamp(8px, 1.8vw, 12px) clamp(12px, 2.5vw, 18px)',
                background: isLearn ? '#14b8a6' : '#ffffff',
                border: 'none',
                borderRadius: '10px',
                color: isLearn ? '#ffffff' : '#0f766e',
                fontSize: 'clamp(0.75rem, 1.8vw, 0.9rem)',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(4px, 1vw, 6px)',
                transition: 'all 0.2s ease',
                boxShadow: isLearn ? '0 2px 10px rgba(20, 184, 166, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                minHeight: '36px',
                whiteSpace: 'nowrap',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              <span style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)', lineHeight: 1 }}>📚</span>
              <span style={{ lineHeight: 1 }} className="hidden xs:inline">{t("nav.tabs.learn")}</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange("practice")}
              style={{
                padding: 'clamp(8px, 1.8vw, 12px) clamp(12px, 2.5vw, 18px)',
                background: isPractice ? '#a855f7' : '#ffffff',
                border: 'none',
                borderRadius: '10px',
                color: isPractice ? '#ffffff' : '#7e22ce',
                fontSize: 'clamp(0.75rem, 1.8vw, 0.9rem)',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(4px, 1vw, 6px)',
                transition: 'all 0.2s ease',
                boxShadow: isPractice ? '0 2px 10px rgba(168, 85, 247, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                minHeight: '36px',
                whiteSpace: 'nowrap',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              <span style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)', lineHeight: 1 }}>🎯</span>
              <span style={{ lineHeight: 1 }} className="hidden xs:inline">{t("nav.tabs.practice")}</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange("applications")}
              style={{
                padding: 'clamp(8px, 1.8vw, 12px) clamp(12px, 2.5vw, 18px)',
                background: isApplications ? 'linear-gradient(135deg, #14b8a6, #a855f7)' : '#ffffff',
                border: 'none',
                borderRadius: '10px',
                color: isApplications ? '#ffffff' : '#059669',
                fontSize: 'clamp(0.75rem, 1.8vw, 0.9rem)',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(4px, 1vw, 6px)',
                transition: 'all 0.2s ease',
                boxShadow: isApplications ? '0 2px 10px rgba(20, 184, 166, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                minHeight: '36px',
                whiteSpace: 'nowrap',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              <span style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)', lineHeight: 1 }}>🌍</span>
              <span style={{ lineHeight: 1 }} className="hidden xs:inline">{t("nav.tabs.applications")}</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Navbar Responsive Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Show button text on screens 375px and above */
          @media (min-width: 375px) {
            .hidden.xs\\:inline {
              display: inline !important;
            }
          }
          
          /* Hide button text on very small screens */
          @media (max-width: 374px) {
            .hidden.xs\\:inline {
              display: none !important;
            }
            
            nav button {
              padding: 8px 10px !important;
            }
          }
          
          /* Button hover effects for desktop */
          @media (hover: hover) and (pointer: fine) {
            nav button:hover {
              transform: translateY(-1px);
              filter: brightness(1.08);
            }
            
            nav button:active {
              transform: translateY(0);
            }
          }
          
          /* Mobile touch optimization */
          @media (hover: none) and (pointer: coarse) {
            nav button:active {
              opacity: 0.9;
            }
          }
        `
      }} />
    </nav>
  );
};

// ============================================================================
// Learn Mode Component
// ============================================================================
interface RotationLearnModeProps {
  props?: {
    language?: LanguageCode;
  };
}

const RotationLearnMode: React.FC<RotationLearnModeProps> = ({ props: _props }) => {
  const { language, t } = useLanguage();
  type LearningMode = 'explore' | 'daynight' | 'timezones' | 'seasons' | 'effects';

  interface Location {
    name: string;
    angle: number;
    timezone: string;
    offset: number;
  }

  const [activeMode, setActiveMode] = useState<LearningMode>('explore');
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [rotationSpeed, setRotationSpeed] = useState<number>(1);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const animationRef = useRef<number | undefined>(undefined);

  const locations: Location[] = [
    { name: 'London', angle: 0, timezone: 'GMT', offset: 0 },
    { name: 'New York', angle: -75, timezone: 'EST', offset: -5 },
    { name: 'Tokyo', angle: 139, timezone: 'JST', offset: 9 },
    { name: 'Sydney', angle: 151, timezone: 'AEDT', offset: 11 },
    { name: 'Dubai', angle: 55, timezone: 'GST', offset: 4 },
    { name: 'Mumbai', angle: 73, timezone: 'IST', offset: 5.5 },
  ];

  useEffect(() => {
    if (isRotating) {
      const animate = () => {
        setRotationAngle(prev => (prev + 0.3 * rotationSpeed) % 360);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRotating, rotationSpeed]);

  const getTimeAtLocation = (offset: number): string => {
    const baseHour = (rotationAngle / 15 + 12) % 24;
    const localHour = (baseHour + offset + 24) % 24;
    const hours = Math.floor(localHour);
    const minutes = Math.floor((localHour % 1) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const isDayTime = (angle: number): boolean => {
    const normalizedAngle = ((angle + rotationAngle + 180) % 360 + 360) % 360;
    return normalizedAngle > 90 && normalizedAngle < 270;
  };

  const modeInfo: Record<LearningMode, { title: string; description: string; icon: string }> = {
    explore: {
      title: t('learn.modes.explore.title'),
      description: t('learn.modes.explore.description'),
      icon: t('learn.modes.explore.icon')
    },
    daynight: {
      title: t('learn.modes.daynight.title'),
      description: t('learn.modes.daynight.description'),
      icon: t('learn.modes.daynight.icon')
    },
    timezones: {
      title: t('learn.modes.timezones.title'),
      description: t('learn.modes.timezones.description'),
      icon: t('learn.modes.timezones.icon')
    },
    seasons: {
      title: t('learn.modes.seasons.title'),
      description: t('learn.modes.seasons.description'),
      icon: t('learn.modes.seasons.icon')
    },
    effects: {
      title: t('learn.modes.effects.title'),
      description: t('learn.modes.effects.description'),
      icon: t('learn.modes.effects.icon')
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e8f5e9 0%, #e3f2fd 50%, #f3e5f5 100%)',
      fontFamily: getFontFamilyForLanguage(language),
      color: '#1a365d',
      padding: 'clamp(10px, 3vw, 20px)'
    }}>
      {/* Header */}
      <header style={{
        textAlign: 'center',
        marginBottom: 'clamp(16px, 4vw, 24px)',
        padding: 'clamp(12px, 3vw, 20px) 0'
      }}>
        <h1 style={{
          fontSize: 'clamp(1.5rem, 5vw, 2.8rem)',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #1565c0, #7b1fa2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(8px, 2vw, 16px)',
          flexWrap: 'wrap',
          padding: '0 10px'
        }}>
          <span style={{ fontSize: 'clamp(2rem, 6vw, 3rem)' }}>🌍</span>
          <span style={{ textAlign: 'center' }}>{t('learn.header')}</span>
        </h1>
        <p style={{
          color: '#546e7a',
          marginTop: 8,
          fontSize: 'clamp(0.85rem, 2.5vw, 1.15rem)',
          fontWeight: 400,
          padding: '0 10px'
        }}>
          {t('learn.subtitle')}
        </p>
      </header>

      {/* Mode Navigation */}
      <nav style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 'clamp(4px, 1.5vw, 8px)',
        marginBottom: 'clamp(16px, 4vw, 30px)',
        flexWrap: 'wrap',
        padding: '0 clamp(4px, 2vw, 12px)'
      }}>
        {(Object.keys(modeInfo) as LearningMode[]).map(mode => (
          <button
            key={mode}
            onClick={() => setActiveMode(mode)}
            style={{
              padding: 'clamp(10px, 2.5vw, 14px) clamp(12px, 3vw, 22px)',
              background: activeMode === mode
                ? 'linear-gradient(135deg, #1976d2, #7b1fa2)'
                : '#ffffff',
              border: activeMode === mode
                ? 'none'
                : '2px solid #e0e0e0',
              borderRadius: 30,
              color: activeMode === mode ? '#fff' : '#546e7a',
              cursor: 'pointer',
              fontSize: 'clamp(0.7rem, 2vw, 0.95rem)',
              fontWeight: activeMode === mode ? 600 : 500,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: activeMode === mode
                ? '0 6px 20px rgba(25, 118, 210, 0.35)'
                : '0 2px 8px rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(4px, 1vw, 8px)',
              whiteSpace: 'nowrap',
              minHeight: '44px',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            <span style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)', flexShrink: 0 }}>{modeInfo[mode].icon}</span>
            <span className="mode-title hidden sm:inline">{modeInfo[mode].title.split(' ').slice(0, 2).join(' ')}</span>
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="learn-main-content" style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 'clamp(16px, 3vw, 30px)',
        maxWidth: 1400,
        margin: '0 auto',
        padding: '0 clamp(8px, 2vw, 16px)',
        width: '100%'
      }}>
        {/* Earth Visualization Area */}
        <div style={{
          background: '#ffffff',
          borderRadius: 'clamp(16px, 3vw, 24px)',
          padding: 'clamp(20px, 4vw, 40px)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          minHeight: 'clamp(400px, 60vw, 520px)'
        }}>
          {/* Visualization Container */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            maxWidth: 700
          }}>
            {/* Sun */}
            <div style={{
              position: 'absolute',
              right: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8
            }}>
              <div className="sun-container" style={{
                width: 'clamp(60px, 12vw, 100px)',
                height: 'clamp(60px, 12vw, 100px)',
                background: 'radial-gradient(circle, #fff9c4 0%, #ffeb3b 30%, #ffa000 70%, #ff6f00 100%)',
                borderRadius: '50%',
                boxShadow: '0 0 50px 15px rgba(255, 193, 7, 0.4), 0 0 100px 30px rgba(255, 152, 0, 0.2)',
                animation: 'sunPulse 3s ease-in-out infinite'
              }} />
              {showLabels && (
                <span style={{
                  fontSize: 'clamp(0.75rem, 2vw, 0.95rem)',
                  fontWeight: 600,
                  color: '#f57c00',
                  background: 'rgba(255, 243, 224, 0.9)',
                  padding: '4px 12px',
                  borderRadius: 12
                }}>☀️ {t('learn.labels.sun')}</span>
              )}
            </div>

            {/* Sun rays */}
            <div style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 'clamp(150px, 30vw, 300px)',
              height: 'clamp(150px, 30vw, 300px)',
              background: 'radial-gradient(ellipse at right, rgba(255, 235, 59, 0.15) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />

            {/* Earth Container */}
            <div className="earth-container" style={{
              position: 'relative',
              width: 'clamp(200px, 40vw, 320px)',
              height: 'clamp(200px, 40vw, 320px)',
              marginRight: 'clamp(40px, 8vw, 80px)'
            }}>
              {/* Axis line */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: 'clamp(-40px, -8vw, -50px)',
                width: 'clamp(3px, 0.5vw, 4px)',
                height: 'clamp(300px, 60vw, 420px)',
                background: 'linear-gradient(to bottom, #9c27b0, rgba(156, 39, 176, 0.2) 20%, rgba(156, 39, 176, 0.2) 80%, #9c27b0)',
                transform: `translateX(-50%) rotate(${activeMode === 'seasons' ? 23.5 : 0}deg)`,
                transformOrigin: 'center center',
                borderRadius: 3,
                transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 5
              }} />

              {/* North Pole Label */}
              {showLabels && (
                <div style={{
                  position: 'absolute',
                  top: 'clamp(-60px, -12vw, -70px)',
                  left: '50%',
                  transform: `translateX(-50%) rotate(${activeMode === 'seasons' ? 23.5 : 0}deg)`,
                  transformOrigin: 'center 230px',
                  transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                  fontWeight: 600,
                  color: '#7b1fa2',
                  background: '#f3e5f5',
                  padding: 'clamp(3px, 0.8vw, 4px) clamp(8px, 2vw, 10px)',
                  borderRadius: 8,
                  whiteSpace: 'nowrap'
                }}>
                  🧭 {t('learn.labels.northPole')}
                </div>
              )}

              {/* South Pole Label */}
              {showLabels && (
                <div style={{
                  position: 'absolute',
                  bottom: 'clamp(-60px, -12vw, -70px)',
                  left: '50%',
                  transform: `translateX(-50%) rotate(${activeMode === 'seasons' ? 23.5 : 0}deg)`,
                  transformOrigin: 'center -110px',
                  transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                  fontWeight: 600,
                  color: '#7b1fa2',
                  background: '#f3e5f5',
                  padding: 'clamp(3px, 0.8vw, 4px) clamp(8px, 2vw, 10px)',
                  borderRadius: 8,
                  whiteSpace: 'nowrap'
                }}>
                  🧭 {t('learn.labels.southPole')}
                </div>
              )}

              {/* West Label */}
              {showLabels && (
                <div className="direction-label" style={{
                  position: 'absolute',
                  left: activeMode === 'seasons' ? 'clamp(-100px, -15vw, -90px)' : 'clamp(-90px, -12vw, -80px)',
                  top: '50%',
                  transform: `translateY(-50%) rotate(${activeMode === 'seasons' ? 23.5 : 0}deg)`,
                  transformOrigin: activeMode === 'seasons' ? 'clamp(150px, 25vw, 170px) center' : 'center',
                  transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontSize: 'clamp(0.7rem, 2vw, 0.85rem)',
                  fontWeight: 600,
                  color: '#546e7a',
                  background: '#ffffff',
                  padding: 'clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)',
                  borderRadius: 8,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  {t('learn.labels.west')}
                </div>
              )}

              {/* East Label */}
              {showLabels && (
                <div className="direction-label" style={{
                  position: 'absolute',
                  right: activeMode === 'seasons' ? 'clamp(-100px, -15vw, -90px)' : 'clamp(-90px, -12vw, -80px)',
                  top: '50%',
                  transform: `translateY(-50%) rotate(${activeMode === 'seasons' ? 23.5 : 0}deg)`,
                  transformOrigin: activeMode === 'seasons' ? 'clamp(-150px, -25vw, -170px) center' : 'center',
                  transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontSize: 'clamp(0.7rem, 2vw, 0.85rem)',
                  fontWeight: 600,
                  color: '#546e7a',
                  background: '#ffffff',
                  padding: 'clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)',
                  borderRadius: 8,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  {t('learn.labels.east')}
                </div>
              )}

              {/* Axis tilt indicator */}
              {activeMode === 'seasons' && (
                <div style={{
                  position: 'absolute',
                  top: -30,
                  right: -80,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  animation: 'fadeIn 0.5s ease',
                  background: '#fff3e0',
                  padding: '8px 14px',
                  borderRadius: 12,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>📐</span>
                  <div>
                    <div style={{ fontWeight: 700, color: '#e65100', fontSize: '1.1rem' }}>23.5°</div>
                    <div style={{ fontSize: '0.75rem', color: '#bf360c' }}>{t('learn.labels.axisTilt')}</div>
                  </div>
                </div>
              )}

              {/* Earth */}
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 0 0 4px rgba(33, 150, 243, 0.2), 0 15px 50px rgba(0,0,0,0.15), inset -40px -20px 60px rgba(0, 0, 80, 0.3)',
                transform: `rotate(${activeMode === 'seasons' ? 23.5 : 0}deg)`,
                transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                {/* Ocean base */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, #4fc3f7 0%, #0288d1 40%, #01579b 100%)',
                  borderRadius: '50%'
                }} />

                {/* Rotating surface layer */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  transform: `rotateY(${rotationAngle}deg)`,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.05s linear'
                }}>
                  <svg viewBox="0 0 100 100" style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%'
                  }}>
                    <defs>
                      <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#66bb6a" />
                        <stop offset="50%" stopColor="#43a047" />
                        <stop offset="100%" stopColor="#2e7d32" />
                      </linearGradient>
                      <filter id="landShadow">
                        <feDropShadow dx="1" dy="1" stdDeviation="0.5" floodColor="#1b5e20" floodOpacity="0.3" />
                      </filter>
                    </defs>

                    {/* Continents */}
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

                    {/* Ice caps */}
                    <ellipse cx="50" cy="6" rx="32" ry="6" fill="rgba(255, 255, 255, 0.95)" />
                    <ellipse cx="50" cy="94" rx="28" ry="6" fill="rgba(255, 255, 255, 0.95)" />

                    {/* Clouds */}
                    <ellipse cx="22" cy="32" rx="9" ry="3" fill="rgba(255, 255, 255, 0.7)" />
                    <ellipse cx="68" cy="28" rx="11" ry="4" fill="rgba(255, 255, 255, 0.6)" />
                    <ellipse cx="52" cy="52" rx="13" ry="4" fill="rgba(255, 255, 255, 0.5)" />
                  </svg>
                </div>

                {/* Night shadow */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: 'linear-gradient(to left, transparent 45%, rgba(10, 20, 50, 0.85) 55%, rgba(5, 10, 30, 0.95) 100%)',
                  zIndex: 3
                }} />

                {/* Atmosphere highlight */}
                <div style={{
                  position: 'absolute',
                  inset: -5,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 65% 35%, rgba(255, 255, 255, 0.25) 0%, transparent 40%)',
                  pointerEvents: 'none'
                }} />
              </div>

              {/* Location markers for timezone mode */}
              {activeMode === 'timezones' && locations.map((loc, i) => {
                const rad = (loc.angle + rotationAngle) * Math.PI / 180;
                const x = 160 + Math.sin(rad) * 130;
                const y = 160 - Math.cos(rad) * 45;
                const isDay = isDayTime(loc.angle);
                const visible = Math.cos(rad) > -0.3;

                return visible ? (
                  <div
                    key={loc.name}
                    onClick={() => setSelectedLocation(loc)}
                    style={{
                      position: 'absolute',
                      left: x,
                      top: y,
                      transform: 'translate(-50%, -50%)',
                      cursor: 'pointer',
                      zIndex: 10,
                      animation: `popIn 0.4s ease ${i * 0.08}s both`
                    }}
                  >
                    <div style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: isDay
                        ? 'linear-gradient(135deg, #ffca28, #ff9800)'
                        : 'linear-gradient(135deg, #7986cb, #3f51b5)',
                      border: '3px solid white',
                      boxShadow: `0 3px 12px ${isDay ? 'rgba(255, 152, 0, 0.5)' : 'rgba(63, 81, 181, 0.5)'}`,
                      transition: 'all 0.3s ease'
                    }} />
                    {showLabels && (
                      <div style={{
                        position: 'absolute',
                        top: 24,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#fff',
                        padding: '6px 10px',
                        borderRadius: 8,
                        fontSize: '0.75rem',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 3px 12px rgba(0,0,0,0.15)',
                        border: '1px solid #e0e0e0'
                      }}>
                        <div style={{ fontWeight: 700, color: '#1a237e' }}>{loc.name}</div>
                        <div style={{
                          color: isDay ? '#e65100' : '#283593',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          justifyContent: 'center'
                        }}>
                          {isDay ? '☀️' : '🌙'} {getTimeAtLocation(loc.offset)}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null;
              })}

            </div>

            {/* Day/Night labels */}
            {activeMode === 'daynight' && (
              <>
                <div style={{
                  position: 'absolute',
                  right: 'clamp(10px, 5vw, 150px)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  textAlign: 'center',
                  animation: 'fadeIn 0.5s ease',
                  background: 'linear-gradient(135deg, #fff8e1, #ffecb3)',
                  padding: 'clamp(10px, 2vw, 16px) clamp(12px, 3vw, 20px)',
                  borderRadius: 'clamp(12px, 2vw, 16px)',
                  boxShadow: '0 4px 20px rgba(255, 152, 0, 0.2)',
                  maxWidth: 'clamp(100px, 25vw, 180px)'
                }}>
                  <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', marginBottom: 4 }}>☀️</div>
                  <div style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)', fontWeight: 700, color: '#e65100' }}>{t('learn.labels.day')}</div>
                  <div style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)', color: '#f57c00', marginTop: 2 }}>{t('learn.labels.facingSun')}</div>
                </div>
                <div style={{
                  position: 'absolute',
                  left: 'clamp(10px, 3vw, 30px)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  textAlign: 'center',
                  animation: 'fadeIn 0.5s ease 0.2s both',
                  background: 'linear-gradient(135deg, #e8eaf6, #c5cae9)',
                  padding: 'clamp(10px, 2vw, 16px) clamp(12px, 3vw, 20px)',
                  borderRadius: 'clamp(12px, 2vw, 16px)',
                  boxShadow: '0 4px 20px rgba(63, 81, 181, 0.2)',
                  maxWidth: 'clamp(100px, 25vw, 180px)'
                }}>
                  <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', marginBottom: 4 }}>🌙</div>
                  <div style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)', fontWeight: 700, color: '#283593' }}>{t('learn.labels.night')}</div>
                  <div style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)', color: '#3949ab', marginTop: 2 }}>{t('learn.labels.awayFromSun')}</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Info Panel */}
        <aside style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(16px, 3vw, 20px)'
        }}>
          {/* Mode Info Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: 'clamp(16px, 3vw, 20px)',
            padding: 'clamp(16px, 3vw, 24px)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(8px, 2vw, 12px)',
              marginBottom: 'clamp(12px, 2vw, 16px)',
              flexWrap: 'wrap'
            }}>
              <span style={{
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                background: 'linear-gradient(135deg, #e3f2fd, #f3e5f5)',
                padding: 'clamp(8px, 2vw, 12px)',
                borderRadius: 'clamp(12px, 2vw, 16px)',
                flexShrink: 0
              }}>{modeInfo[activeMode].icon}</span>
              <h2 style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',
                fontWeight: 700,
                color: '#1a237e',
                margin: 0,
                lineHeight: 1.3
              }}>
                {modeInfo[activeMode].title}
              </h2>
            </div>
            <p style={{
              color: '#546e7a',
              lineHeight: 1.75,
              fontSize: 'clamp(0.875rem, 2vw, 1rem)',
              margin: 0
            }}>
              {modeInfo[activeMode].description}
            </p>
          </div>

          {/* Controls Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: 'clamp(16px, 3vw, 20px)',
            padding: 'clamp(16px, 3vw, 24px)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{
              fontSize: 'clamp(0.95rem, 2.2vw, 1.1rem)',
              fontWeight: 700,
              marginBottom: 'clamp(14px, 2.5vw, 18px)',
              color: '#1a237e',
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(6px, 1.5vw, 8px)'
            }}>
              <span>🎮</span> {t('learn.controls.title')}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }}>
              <div style={{ display: 'flex', gap: 'clamp(8px, 2vw, 12px)', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setIsRotating(!isRotating)}
                  style={{
                    flex: 1,
                    minWidth: '120px',
                    padding: 'clamp(12px, 2.5vw, 16px) clamp(16px, 3vw, 24px)',
                    background: isRotating
                      ? 'linear-gradient(135deg, #ef5350, #e53935)'
                      : 'linear-gradient(135deg, #66bb6a, #43a047)',
                    border: 'none',
                    borderRadius: 14,
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    transition: 'all 0.3s ease',
                    boxShadow: isRotating
                      ? '0 6px 20px rgba(229, 57, 53, 0.3)'
                      : '0 6px 20px rgba(67, 160, 71, 0.3)',
                    minHeight: '44px',
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  {isRotating ? '⏸️ ' + t('learn.controls.pause') : '▶️ ' + t('learn.controls.play')}
                </button>
                <button
                  onClick={() => setShowLabels(!showLabels)}
                  style={{
                    padding: 'clamp(12px, 2.5vw, 16px) clamp(14px, 3vw, 20px)',
                    background: showLabels
                      ? 'linear-gradient(135deg, #42a5f5, #1e88e5)'
                      : '#f5f5f5',
                    border: showLabels ? 'none' : '2px solid #e0e0e0',
                    borderRadius: 14,
                    color: showLabels ? '#fff' : '#757575',
                    cursor: 'pointer',
                    fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    minHeight: '44px',
                    minWidth: '44px',
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  🏷️
                </button>
              </div>

              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 10
                }}>
                  <span style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', color: '#546e7a', fontWeight: 500 }}>
                    {t('learn.controls.rotationSpeed')}
                  </span>
                  <span style={{
                    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                    fontWeight: 700,
                    color: '#1976d2',
                    background: '#e3f2fd',
                    padding: 'clamp(2px, 0.5vw, 2px) clamp(8px, 2vw, 10px)',
                    borderRadius: 8
                  }}>
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
                    width: '100%',
                    height: 'clamp(6px, 1.5vw, 10px)',
                    borderRadius: 4,
                    background: 'linear-gradient(90deg, #1976d2, #7b1fa2)',
                    cursor: 'pointer',
                    appearance: 'none',
                    outline: 'none',
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Key Facts Card */}
          <div style={{
            background: 'linear-gradient(135deg, #e3f2fd, #f3e5f5)',
            borderRadius: 20,
            padding: 24,
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              marginBottom: 16,
              color: '#1a237e',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <span>📊</span> {t('learn.keyFacts.title')}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: t('learn.keyFacts.rotationPeriod'), value: '23h 56m 4s', icon: '⏱️', color: '#1565c0' },
                { label: t('learn.keyFacts.equatorialSpeed'), value: '1,670 km/h', icon: '💨', color: '#00897b' },
                { label: t('learn.keyFacts.axisTilt'), value: '23.5°', icon: '📐', color: '#e65100' },
                { label: t('learn.keyFacts.timeZones'), value: '24', icon: '🌐', color: '#7b1fa2' }
              ].map((fact) => (
                <div
                  key={fact.label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: '#ffffff',
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                  }}
                >
                  <span style={{
                    color: '#546e7a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontWeight: 500
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>{fact.icon}</span>
                    {fact.label}
                  </span>
                  <span style={{
                    fontWeight: 700,
                    color: fact.color,
                    fontSize: '1.05rem'
                  }}>
                    {fact.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Effects Card (conditional) */}
          {activeMode === 'effects' && (
            <div style={{
              background: '#ffffff',
              borderRadius: 20,
              padding: 24,
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
              animation: 'slideUp 0.5s ease'
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                marginBottom: 16,
                color: '#7b1fa2',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                <span>🌀</span> {t('learn.effects.title')}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { title: t('learn.effects.coriolisEffect'), desc: t('learn.effects.coriolisDesc'), emoji: '🌪️' },
                  { title: t('learn.effects.equatorialBulge'), desc: t('learn.effects.bulgeDesc'), emoji: '🥚' },
                  { title: t('learn.effects.tidalForces'), desc: t('learn.effects.tidalDesc'), emoji: '🌊' },
                  { title: t('learn.effects.starTrails'), desc: t('learn.effects.starDesc'), emoji: '✨' }
                ].map((effect) => (
                  <div
                    key={effect.title}
                    style={{
                      padding: '14px 16px',
                      background: 'linear-gradient(135deg, #faf5ff, #f3e5f5)',
                      borderRadius: 12,
                      borderLeft: '4px solid #7b1fa2'
                    }}
                  >
                    <div style={{
                      fontWeight: 700,
                      color: '#4a148c',
                      marginBottom: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}>
                      <span>{effect.emoji}</span>
                      {effect.title}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#6a1b9a', lineHeight: 1.5 }}>
                      {effect.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Location Card (conditional) */}
          {selectedLocation && activeMode === 'timezones' && (
            <div style={{
              background: 'linear-gradient(135deg, #fff8e1, #ffecb3)',
              borderRadius: 20,
              padding: 24,
              boxShadow: '0 8px 30px rgba(255, 152, 0, 0.15)',
              animation: 'slideUp 0.3s ease'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16
              }}>
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: '#e65100',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  margin: 0
                }}>
                  <span>📍</span> {selectedLocation.name}
                </h3>
                <button
                  onClick={() => setSelectedLocation(null)}
                  style={{
                    background: 'rgba(230, 81, 0, 0.1)',
                    border: 'none',
                    color: '#e65100',
                    cursor: 'pointer',
                    fontSize: '1.3rem',
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >×</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: t('learn.location.localTime'), value: getTimeAtLocation(selectedLocation.offset) },
                  { label: t('learn.location.timezone'), value: selectedLocation.timezone },
                  { label: t('learn.location.utcOffset'), value: `${selectedLocation.offset >= 0 ? '+' : ''}${selectedLocation.offset}h` },
                  { label: t('learn.location.status'), value: isDayTime(selectedLocation.angle) ? `☀️ ${t('learn.location.daytime')}` : `🌙 ${t('learn.location.nighttime')}` }
                ].map(item => (
                  <div
                    key={item.label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      background: '#fff',
                      padding: '10px 14px',
                      borderRadius: 10
                    }}
                  >
                    <span style={{ color: '#bf360c', fontWeight: 500 }}>{item.label}</span>
                    <span style={{ fontWeight: 700, color: '#e65100' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </main>

      {/* CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes sunPulse {
          0%, 100% { box-shadow: 0 0 50px 15px rgba(255, 193, 7, 0.4), 0 0 100px 30px rgba(255, 152, 0, 0.2); }
          50% { box-shadow: 0 0 60px 20px rgba(255, 193, 7, 0.5), 0 0 120px 40px rgba(255, 152, 0, 0.3); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes popIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 22px;
          height: 22px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          border: 3px solid #1976d2;
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 22px;
          height: 22px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          border: 3px solid #1976d2;
        }
        
        button:hover {
          transform: translateY(-2px);
          filter: brightness(1.05);
        }
        
        button:active {
          transform: translateY(0);
        }
        
        /* Responsive Grid Layouts */
        @media (min-width: 1024px) {
          .learn-main-content {
            grid-template-columns: 1fr 380px !important;
          }
        }
        
        @media (max-width: 1023px) {
          .learn-main-content {
            grid-template-columns: 1fr !important;
          }
        }
        
        /* Mode Title Visibility */
        @media (max-width: 640px) {
          .mode-title {
            display: none;
          }
        }
        
        /* Earth Container Responsive Sizing */
        @media (max-width: 768px) {
          .earth-container {
            width: 250px !important;
            height: 250px !important;
            margin-right: 60px !important;
          }
          
          .sun-container {
            width: 70px !important;
            height: 70px !important;
          }
        }
        
        @media (max-width: 640px) {
          .earth-container {
            width: 220px !important;
            height: 220px !important;
            margin-right: 50px !important;
          }
          
          .sun-container {
            width: 60px !important;
            height: 60px !important;
          }
          
          .direction-label {
            font-size: 0.7rem !important;
            padding: 3px 8px !important;
          }
        }
        
        @media (max-width: 480px) {
          .earth-container {
            width: 180px !important;
            height: 180px !important;
            margin-right: 30px !important;
          }
          
          .sun-container {
            width: 50px !important;
            height: 50px !important;
            right: 10px !important;
          }
          
          .direction-label {
            font-size: 0.65rem !important;
            padding: 2px 6px !important;
          }
        }
        
        /* Touch-friendly tap targets */
        @media (hover: none) and (pointer: coarse) {
          button {
            min-height: 44px !important;
            min-width: 44px !important;
          }
        }
        
        /* Prevent text selection on mobile */
        @media (max-width: 768px) {
          * {
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
          }
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Responsive typography */
        @media (max-width: 480px) {
          h1 { font-size: clamp(1.3rem, 6vw, 2rem) !important; }
          h2 { font-size: clamp(1rem, 4vw, 1.3rem) !important; }
          h3 { font-size: clamp(0.9rem, 3vw, 1.1rem) !important; }
          p { font-size: clamp(0.85rem, 2.5vw, 1rem) !important; }
        }
      `}} />
    </div>
  );
};

// ============================================================================
// Practice Mode Component
// ============================================================================
type QuestionType = 'mcq' | 'truefalse' | 'fillblank' | 'matching' | 'ordering';

interface Question {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | number | number[];
  explanation: string;
  hint?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  matchPairs?: { left: string; right: string }[];
  orderItems?: string[];
}

interface QuizResult {
  questionId: number;
  isCorrect: boolean;
  userAnswer: string | number | number[];
  timeTaken: number;
}

interface RotationPracticeModeProps {
  props?: {
    language?: LanguageCode;
  };
}

const RotationPracticeMode: React.FC<RotationPracticeModeProps> = ({
  props: _props,
}) => {
  const { language, t } = useLanguage();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  const questionsData: Record<Language, Question[]> = {
    en: [
      {
        id: 1,
        type: 'mcq',
        question: 'How long does it take for Earth to complete one full rotation on its axis?',
        options: ['12 hours', '24 hours', '365 days', '30 days'],
        correctAnswer: 1,
        explanation: 'Earth takes approximately 24 hours (23 hours, 56 minutes, and 4 seconds to be exact) to complete one full rotation on its axis. This is why we have day and night cycles.',
        hint: 'Think about how long a complete day-night cycle lasts.',
        difficulty: 'easy'
      },
      {
        id: 2,
        type: 'mcq',
        question: 'In which direction does Earth rotate when viewed from above the North Pole?',
        options: ['Clockwise', 'Counter-clockwise', 'It doesn\'t rotate', 'Both directions'],
        correctAnswer: 1,
        explanation: 'Earth rotates counter-clockwise (from west to east) when viewed from above the North Pole. This is why the Sun appears to rise in the east and set in the west.',
        hint: 'Where does the Sun rise?',
        difficulty: 'easy'
      },
      {
        id: 3,
        type: 'truefalse',
        question: 'The Earth\'s axis is tilted at approximately 23.5 degrees.',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'True! Earth\'s axis is tilted at about 23.5 degrees relative to its orbital plane. This tilt is responsible for the seasons.',
        difficulty: 'easy'
      },
      {
        id: 4,
        type: 'mcq',
        question: 'What is the speed of Earth\'s rotation at the equator?',
        options: ['About 500 km/h', 'About 1,000 km/h', 'About 1,670 km/h', 'About 2,500 km/h'],
        correctAnswer: 2,
        explanation: 'At the equator, Earth\'s surface moves at approximately 1,670 km/h (or about 1,040 mph) due to rotation. This speed decreases as you move toward the poles.',
        hint: 'It\'s faster than any commercial airplane!',
        difficulty: 'medium'
      },
      {
        id: 5,
        type: 'mcq',
        question: 'What causes day and night on Earth?',
        options: [
          'Earth\'s revolution around the Sun',
          'Earth\'s rotation on its axis',
          'The Moon blocking sunlight',
          'The Sun moving around Earth'
        ],
        correctAnswer: 1,
        explanation: 'Day and night are caused by Earth\'s rotation on its axis. As Earth spins, different parts face toward or away from the Sun, creating the day-night cycle.',
        difficulty: 'easy'
      },
      {
        id: 6,
        type: 'mcq',
        question: 'The Coriolis effect, caused by Earth\'s rotation, deflects moving objects in which direction in the Northern Hemisphere?',
        options: ['To the left', 'To the right', 'Downward', 'Upward'],
        correctAnswer: 1,
        explanation: 'In the Northern Hemisphere, the Coriolis effect deflects moving objects to the right of their direction of motion. In the Southern Hemisphere, it deflects them to the left.',
        hint: 'Think about how hurricanes spin in the Northern Hemisphere.',
        difficulty: 'hard'
      },
      {
        id: 7,
        type: 'mcq',
        question: 'Why does Earth bulge slightly at the equator?',
        options: [
          'Because of the Moon\'s gravity',
          'Because of centrifugal force from rotation',
          'Because of volcanic activity',
          'Because of ocean water weight'
        ],
        correctAnswer: 1,
        explanation: 'Earth\'s rotation creates a centrifugal force that pushes material outward at the equator, causing Earth to bulge. The equatorial diameter is about 43 km larger than the polar diameter.',
        hint: 'Think about what happens when you spin something...',
        difficulty: 'hard'
      },
      {
        id: 8,
        type: 'truefalse',
        question: 'If Earth stopped rotating, one side would always face the Sun.',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'True! If Earth stopped rotating, one hemisphere would experience permanent day while the other would have permanent night. This would cause extreme temperature differences.',
        difficulty: 'medium'
      },
      {
        id: 9,
        type: 'mcq',
        question: 'How many degrees does Earth rotate in one hour?',
        options: ['10 degrees', '15 degrees', '20 degrees', '30 degrees'],
        correctAnswer: 1,
        explanation: 'Earth rotates 360 degrees in 24 hours, so it rotates 15 degrees per hour (360 ÷ 24 = 15). This is why each time zone represents 15 degrees of longitude.',
        hint: 'Divide 360 by 24.',
        difficulty: 'medium'
      },
      {
        id: 10,
        type: 'mcq',
        question: 'What would happen to our weight if Earth rotated faster?',
        options: [
          'We would weigh more',
          'We would weigh less',
          'Our weight wouldn\'t change',
          'We would float away immediately'
        ],
        correctAnswer: 1,
        explanation: 'If Earth rotated faster, the increased centrifugal force would make us weigh slightly less, especially at the equator. Currently, rotation already makes us about 0.3% lighter at the equator.',
        difficulty: 'hard'
      },
      {
        id: 11,
        type: 'truefalse',
        question: 'People at the North Pole experience the same day length as people at the equator.',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False! Due to Earth\'s axial tilt, people at the poles experience extreme variations in day length throughout the year, including 24 hours of daylight in summer and 24 hours of darkness in winter.',
        difficulty: 'medium'
      },
      {
        id: 12,
        type: 'mcq',
        question: 'Earth is divided into how many time zones?',
        options: ['12', '24', '36', '48'],
        correctAnswer: 1,
        explanation: 'Earth is divided into 24 time zones, each representing 15 degrees of longitude (360° ÷ 24 = 15°). Each zone differs by one hour from its neighbors.',
        hint: 'Think about hours in a day...',
        difficulty: 'easy'
      },
      {
        id: 13,
        type: 'mcq',
        question: 'The exact time for one Earth rotation is 23 hours, 56 minutes, and how many seconds?',
        options: ['4 seconds', '10 seconds', '30 seconds', '60 seconds'],
        correctAnswer: 0,
        explanation: 'One complete rotation of Earth (a sidereal day) takes 23 hours, 56 minutes, and 4 seconds. The 24-hour day we use includes the extra time needed because Earth has moved in its orbit.',
        hint: 'It\'s a single digit number.',
        difficulty: 'hard'
      },
      {
        id: 14,
        type: 'mcq',
        question: 'Which of the following is NOT caused by Earth\'s rotation?',
        options: [
          'Day and night cycle',
          'Coriolis effect',
          'The four seasons',
          'Time zones'
        ],
        correctAnswer: 2,
        explanation: 'The four seasons are caused by Earth\'s axial tilt and its revolution around the Sun, not by its rotation. Rotation causes day/night, Coriolis effect, and necessitates time zones.',
        difficulty: 'medium'
      },
      {
        id: 15,
        type: 'mcq',
        question: 'At which location does Earth rotate the fastest?',
        options: ['North Pole', 'South Pole', 'Equator', 'Mid-latitudes'],
        correctAnswer: 2,
        explanation: 'Earth rotates fastest at the equator (about 1,670 km/h) because that\'s where the circumference is largest. At the poles, the rotational speed is essentially zero.',
        difficulty: 'easy'
      }
    ]
  };

  const allQuestions = questionsData[language];

  // Filter to only MCQs
  const filteredQuestions = allQuestions.filter(q => q.type === 'mcq' || q.type === 'truefalse');

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  useEffect(() => {
    if (!quizCompleted && !showResult) {
      const interval = setInterval(() => setTimer(prev => prev + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [quizCompleted, showResult]);

  const handleSubmit = () => {
    if (!currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const userAnswer = selectedAnswer as number;

    setStreak(isCorrect ? streak + 1 : 0);
    setResults([...results, { questionId: currentQuestion.id, isCorrect, userAnswer, timeTaken: timer }]);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      resetQuestion();
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setTimer(0);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setResults([]);
    setQuizCompleted(false);
    setStreak(0);
    resetQuestion();
  };

  const getScore = () => Math.round((results.filter(r => r.isCorrect).length / results.length) * 100);

  // Quiz Completed Screen
  if (quizCompleted) {
    const score = getScore();
    const totalTime = results.reduce((acc, r) => acc + r.timeTaken, 0);

    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e8f5e9 0%, #e3f2fd 50%, #f3e5f5 100%)',
        fontFamily: getFontFamilyForLanguage(language),
        padding: 'clamp(15px, 4vw, 30px)'
      }}>
        <div style={{
          maxWidth: 800,
          margin: '0 auto',
          background: '#fff',
          borderRadius: 'clamp(16px, 3vw, 24px)',
          padding: 'clamp(20px, 5vw, 40px)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>
              {score >= 80 ? '🏆' : score >= 60 ? '🌟' : score >= 40 ? '💪' : '📚'}
            </div>
            <h1 style={{
              fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #1565c0, #7b1fa2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {t('practice.quizCompleted')}
            </h1>
            <p style={{ color: '#546e7a', marginTop: 8 }}>
              {score >= 80 ? t('practice.perfect') :
                score >= 60 ? t('practice.excellent') :
                  score >= 40 ? t('practice.goodJob') :
                    t('practice.keepPracticing')}
            </p>
          </div>

          <div className="quiz-results-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'clamp(12px, 3vw, 20px)', marginBottom: 'clamp(20px, 4vw, 30px)' }}>
            <div style={{ background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', padding: 24, borderRadius: 16, textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#1565c0' }}>{score}%</div>
              <div style={{ color: '#546e7a', fontWeight: 500 }}>{t('practice.score')}</div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)', padding: 24, borderRadius: 16, textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#2e7d32' }}>
                {results.filter(r => r.isCorrect).length}/{results.length}
              </div>
              <div style={{ color: '#546e7a', fontWeight: 500 }}>Correct</div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #f3e5f5, #e1bee7)', padding: 24, borderRadius: 16, textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#7b1fa2' }}>
                {Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}
              </div>
              <div style={{ color: '#546e7a', fontWeight: 500 }}>Time</div>
            </div>
          </div>

          <div style={{ marginBottom: 30 }}>
            <h3 style={{ color: '#1a237e', marginBottom: 16 }}>📊 {t('practice.viewResults')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {results.map((result, index) => {
                const question = allQuestions.find(q => q.id === result.questionId);
                return (
                  <div key={index} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                    background: result.isCorrect ? '#e8f5e9' : '#ffebee',
                    borderRadius: 12, borderLeft: `4px solid ${result.isCorrect ? '#4caf50' : '#f44336'}`
                  }}>
                    <span style={{ fontSize: '1.3rem' }}>{result.isCorrect ? '✅' : '❌'}</span>
                    <span style={{ flex: 1, color: '#37474f', fontWeight: 500 }}>
                      Q{index + 1}: {question?.question.substring(0, 50)}...
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <button onClick={restartQuiz} style={{
            width: '100%', padding: 'clamp(14px, 3vw, 18px) clamp(24px, 4vw, 32px)',
            background: 'linear-gradient(135deg, #1976d2, #7b1fa2)',
            border: 'none', borderRadius: 14, color: '#fff', fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
            fontWeight: 600, cursor: 'pointer', boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)',
            minHeight: '48px',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
            transition: 'all 0.2s ease'
          }}>
            🔄 {t('practice.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e8f5e9 0%, #e3f2fd 50%, #f3e5f5 100%)',
      fontFamily: getFontFamilyForLanguage(language),
      padding: 'clamp(10px, 3vw, 20px)'
    }}>
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '0 clamp(8px, 2vw, 16px)', width: '100%' }}>
        {/* Question Card */}
        <div style={{ background: '#fff', borderRadius: 'clamp(16px, 3vw, 24px)', padding: 'clamp(16px, 4vw, 32px)', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
          {/* Progress */}
          <div style={{ marginBottom: 'clamp(16px, 3vw, 24px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
              <span style={{ color: '#546e7a', fontWeight: 500, fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
                {t('practice.question')} {currentQuestionIndex + 1} {t('practice.of')} {filteredQuestions.length}
              </span>
            </div>
            <div style={{ height: 'clamp(6px, 1.5vw, 10px)', background: '#e0e0e0', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%`,
                background: 'linear-gradient(90deg, #1976d2, #7b1fa2)', borderRadius: 4, transition: 'width 0.5s ease'
              }} />
            </div>
          </div>

          {/* Question */}
          <div style={{ marginBottom: 'clamp(20px, 4vw, 28px)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'clamp(8px, 2vw, 12px)' }}>
              <span style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', background: 'linear-gradient(135deg, #e3f2fd, #f3e5f5)', padding: 'clamp(6px, 1.5vw, 10px) clamp(10px, 2vw, 14px)', borderRadius: 12, flexShrink: 0 }}>
                ❓
              </span>
              <h2 style={{ fontSize: 'clamp(1rem, 3vw, 1.3rem)', fontWeight: 600, color: '#1a237e', margin: 0, lineHeight: 1.5 }}>
                {currentQuestion?.question}
              </h2>
            </div>
          </div>

          {/* Answer Options */}
          <div style={{ marginBottom: 'clamp(16px, 3vw, 24px)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
              {currentQuestion?.options?.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = showResult && index === currentQuestion.correctAnswer;
                const isWrong = showResult && isSelected && index !== currentQuestion.correctAnswer;

                return (
                  <button key={index} onClick={() => !showResult && setSelectedAnswer(index)} disabled={showResult}
                    style={{
                      padding: 'clamp(14px, 3vw, 18px) clamp(16px, 3vw, 22px)',
                      background: isCorrect ? 'linear-gradient(135deg, #e8f5e9, #c8e6c9)'
                        : isWrong ? 'linear-gradient(135deg, #ffebee, #ffcdd2)'
                          : isSelected ? 'linear-gradient(135deg, #e3f2fd, #bbdefb)' : '#f5f5f5',
                      border: `2px solid ${isCorrect ? '#4caf50' : isWrong ? '#f44336' : isSelected ? '#1976d2' : 'transparent'}`,
                      borderRadius: 14, cursor: showResult ? 'default' : 'pointer', textAlign: 'left',
                      fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', fontWeight: 500, color: '#37474f', display: 'flex', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)',
                      minHeight: '56px',
                      touchAction: 'manipulation',
                      WebkitTapHighlightColor: 'transparent',
                      transition: 'all 0.2s ease'
                    }}>
                    <span style={{
                      width: 'clamp(28px, 4vw, 36px)', height: 'clamp(28px, 4vw, 36px)', borderRadius: '50%',
                      background: isCorrect ? '#4caf50' : isWrong ? '#f44336' : isSelected ? '#1976d2' : '#e0e0e0',
                      color: (isSelected || isCorrect || isWrong) ? '#fff' : '#757575',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, flexShrink: 0,
                      fontSize: 'clamp(0.85rem, 2vw, 1rem)'
                    }}>
                      {isCorrect ? '✓' : isWrong ? '✗' : String.fromCharCode(65 + index)}
                    </span>
                    <span style={{ flex: 1, wordBreak: 'break-word' }}>{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation */}
          {showResult && (
            <div style={{
              padding: '18px 22px',
              background: results[results.length - 1]?.isCorrect ? 'linear-gradient(135deg, #e8f5e9, #c8e6c9)' : 'linear-gradient(135deg, #fff3e0, #ffe0b2)',
              borderRadius: 14, marginBottom: 20
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: '1.8rem' }}>{results[results.length - 1]?.isCorrect ? '🎉' : '💡'}</span>
                <h3 style={{ margin: 0, color: results[results.length - 1]?.isCorrect ? '#2e7d32' : '#e65100' }}>
                  {results[results.length - 1]?.isCorrect ? 'Correct!' : 'Not quite right'}
                </h3>
              </div>
              <p style={{ margin: 0, color: '#546e7a', lineHeight: 1.7 }}>
                <strong style={{ display: 'block', marginBottom: 4 }}>{t('practice.explanation')}:</strong>
                {currentQuestion?.explanation}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 'clamp(10px, 2vw, 14px)', flexWrap: 'wrap' }}>
            {!showResult ? (
              <button onClick={handleSubmit}
                disabled={selectedAnswer === null}
                style={{
                  flex: 1, padding: 'clamp(14px, 3vw, 18px) clamp(24px, 4vw, 32px)', background: 'linear-gradient(135deg, #1976d2, #7b1fa2)',
                  border: 'none', borderRadius: 14, color: '#fff', fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)', fontWeight: 600, cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)',
                  opacity: selectedAnswer === null ? 0.5 : 1,
                  minWidth: 'clamp(150px, 30vw, 200px)',
                  minHeight: '48px',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent',
                  transition: 'all 0.2s ease'
                }}>✓ {t('practice.submitAnswer')}</button>
            ) : (
              <button onClick={handleNext} style={{
                flex: 1, padding: 'clamp(14px, 3vw, 18px) clamp(24px, 4vw, 32px)', background: 'linear-gradient(135deg, #43a047, #2e7d32)',
                border: 'none', borderRadius: 14, color: '#fff', fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)', fontWeight: 600, cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(46, 125, 50, 0.3)',
                minWidth: 'clamp(150px, 30vw, 200px)',
                minHeight: '48px',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
                transition: 'all 0.2s ease'
              }}>
                {currentQuestionIndex < filteredQuestions.length - 1 ? `→ ${t('practice.nextQuestion')}` : `🏁 ${t('practice.viewResults')}`}
              </button>
            )}
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        button:hover:not(:disabled) { 
          transform: translateY(-2px); 
          filter: brightness(1.05);
        }
        button:active:not(:disabled) { 
          transform: translateY(0); 
        }
        input:focus { 
          border-color: #1976d2 !important; 
          box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1); 
        }
        
        /* Responsive Quiz Results Grid */
        @media (max-width: 768px) {
          .quiz-results-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
        }
        
        @media (min-width: 769px) and (max-width: 1024px) {
          .quiz-results-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        
        /* Touch-friendly buttons */
        @media (max-width: 768px) {
          button {
            min-height: 48px !important;
            font-size: clamp(0.9rem, 2.5vw, 1rem) !important;
            padding: 14px 20px !important;
          }
        }
        
        /* Mobile-optimized question cards */
        @media (max-width: 480px) {
          .quiz-results-grid > div {
            padding: 16px !important;
          }
        }
        
        /* Prevent text overflow */
        @media (max-width: 640px) {
          h1, h2, h3 {
            word-break: break-word;
            hyphens: auto;
          }
        }
        
        /* Responsive spacing */
        @media (max-width: 768px) {
          main {
            padding: 0 12px !important;
          }
        }
        
        /* Smooth animations on mobile */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* Landscape mode adjustments */
        @media (max-width: 768px) and (orientation: landscape) {
          .quiz-results-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}} />
    </div>
  );
};

// ============================================================================
// Real World Applications Mode Component
// ============================================================================
type RealWorldTopic = 'aviation' | 'navigation' | 'weather' | 'satellites' | 'daily-life' | 'sports';

interface TopicContent {
  title: string;
  icon: string;
  description: string;
  facts: { title: string; content: string; icon: string }[];
}

interface RotationRealWorldProps {
  props?: {
    language?: LanguageCode;
  };
}

const RotationRealWorld: React.FC<RotationRealWorldProps> = ({ props: _props }) => {
  const { language, t } = useLanguage();
  const [activeTopic, setActiveTopic] = useState<RealWorldTopic>('aviation');
  const [flightDirection, setFlightDirection] = useState<'east' | 'west'>('east');
  const [planePosition, setPlanePosition] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [weatherHemisphere, setWeatherHemisphere] = useState<'north' | 'south'>('north');
  const [satelliteOrbit, setSatelliteOrbit] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [selectedCity, setSelectedCity] = useState<number>(0);
  const animationRef = useRef<number | undefined>(undefined);

  const citiesData: Record<Language, { name: string; timezone: number; country: string }[]> = {
    en: [
      { name: 'New York', timezone: -5, country: 'USA' },
      { name: 'London', timezone: 0, country: 'UK' },
      { name: 'Dubai', timezone: 4, country: 'UAE' },
      { name: 'Mumbai', timezone: 5.5, country: 'India' },
      { name: 'Tokyo', timezone: 9, country: 'Japan' },
      { name: 'Sydney', timezone: 11, country: 'Australia' }
    ]
  };

  const cities = citiesData[language];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (activeTopic === 'satellites') {
      const animate = () => {
        setSatelliteOrbit(prev => (prev + 0.3) % 360);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
      return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
    }
  }, [activeTopic]);

  const simulateFlight = () => {
    setIsAnimating(true);
    setPlanePosition(0);
    const speed = flightDirection === 'east' ? 3 : 2;
    const interval = setInterval(() => {
      setPlanePosition(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnimating(false);
          return 100;
        }
        return prev + speed;
      });
    }, 50);
  };

  const getTimeInCity = (timezone: number) => {
    const utc = currentTime.getTime() + currentTime.getTimezoneOffset() * 60000;
    const cityTime = new Date(utc + 3600000 * timezone);
    return cityTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const topicsData: Record<Language, Record<RealWorldTopic, TopicContent>> = {
    en: {
      aviation: {
        title: 'Aviation & Flight Times',
        icon: '✈️',
        description: 'Earth\'s rotation significantly affects flight times. Flying east (with Earth\'s rotation) is generally faster than flying west due to jet streams created by the rotation.',
        facts: [
          { title: 'Eastbound Flights Are Faster', content: 'A flight from New York to London (eastbound) takes about 7 hours, while the return flight takes about 8 hours due to prevailing westerly winds.', icon: '⏱️' },
          { title: 'Jet Streams', content: 'Jet streams are fast-flowing air currents at 9-12 km altitude, flowing west to east due to Earth\'s rotation. They can reach 400 km/h.', icon: '💨' },
          { title: 'Fuel Savings', content: 'Airlines save millions in fuel costs by planning routes that take advantage of jet streams. Eastbound flights can save up to 10% fuel.', icon: '⛽' },
          { title: 'Great Circle Routes', content: 'Pilots fly curved paths (great circles) rather than straight lines on maps. These are actually the shortest routes on a sphere.', icon: '🗺️' }
        ]
      },
      navigation: {
        title: 'Navigation & GPS',
        icon: '🧭',
        description: 'Modern navigation systems must account for Earth\'s rotation. GPS satellites, ships, and aircraft all compensate for Earth\'s spin to maintain accuracy.',
        facts: [
          { title: 'GPS Corrections', content: 'GPS satellites must account for Earth\'s rotation to provide accurate positioning. Without corrections, your location would be off by hundreds of meters.', icon: '📡' },
          { title: 'Ship Navigation', content: 'Ships crossing oceans must factor in Earth\'s rotation when plotting courses. The Coriolis effect can push ships off course over long distances.', icon: '🚢' },
          { title: 'Military Accuracy', content: 'Long-range missiles and artillery must account for Earth\'s rotation. A shell fired north in the Northern Hemisphere will land slightly to the right.', icon: '🎯' },
          { title: 'Surveying', content: 'Land surveyors must account for Earth\'s rotation when making precise measurements over large distances.', icon: '📐' }
        ]
      },
      weather: {
        title: 'Weather Patterns',
        icon: '🌪️',
        description: 'Earth\'s rotation creates the Coriolis effect, which shapes global weather patterns, ocean currents, and the direction hurricanes spin.',
        facts: [
          { title: 'Hurricane Spin Direction', content: 'Hurricanes spin counter-clockwise in the Northern Hemisphere and clockwise in the Southern Hemisphere due to the Coriolis effect.', icon: '🌀' },
          { title: 'Trade Winds', content: 'The reliable trade winds that sailors have used for centuries are created by Earth\'s rotation deflecting air moving toward the equator.', icon: '⛵' },
          { title: 'Ocean Currents', content: 'Major ocean currents like the Gulf Stream are influenced by Earth\'s rotation, carrying warm water and affecting coastal climates.', icon: '🌊' },
          { title: 'Weather Forecasting', content: 'Meteorologists must factor Earth\'s rotation into weather models. It affects how high and low pressure systems move and develop.', icon: '🌤️' }
        ]
      },
      satellites: {
        title: 'Satellites & Space',
        icon: '🛰️',
        description: 'Earth\'s rotation is crucial for satellite launches and orbits. Launching toward the east gets a speed boost from Earth\'s rotation.',
        facts: [
          { title: 'Launch Advantage', content: 'Rockets launched eastward from the equator get a free 1,670 km/h boost from Earth\'s rotation, saving significant fuel.', icon: '🚀' },
          { title: 'Geostationary Orbit', content: 'Satellites at 35,786 km altitude orbit at the same rate as Earth rotates, appearing stationary. Used for TV and weather satellites.', icon: '📺' },
          { title: 'ISS Orbit', content: 'The International Space Station orbits Earth every 90 minutes, experiencing 16 sunrises and sunsets daily.', icon: '🛸' },
          { title: 'Space Launch Sites', content: 'Launch sites are often built near the equator (like French Guiana) to maximize the rotational speed boost.', icon: '🏗️' }
        ]
      },
      'daily-life': {
        title: 'Daily Life',
        icon: '🌅',
        description: 'Earth\'s rotation shapes our daily routines, from sunrise and sunset times to time zones that coordinate global activities.',
        facts: [
          { title: 'Time Zones', content: 'The world is divided into 24 time zones because Earth rotates 15° per hour. This allows for coordinated time across the globe.', icon: '🕐' },
          { title: 'Jet Lag', content: 'When you travel across time zones, your body\'s internal clock gets out of sync with local time. It takes about 1 day per zone to adjust.', icon: '😴' },
          { title: 'Business & Communication', content: 'Global businesses must coordinate across time zones. When it\'s morning in New York, it\'s evening in Tokyo.', icon: '💼' },
          { title: 'Day Length Variation', content: 'Due to Earth\'s tilt, day length varies by season and latitude. Near the poles, summer brings 24-hour daylight.', icon: '📅' }
        ]
      },
      sports: {
        title: 'Sports & Games',
        icon: '⚽',
        description: 'Earth\'s rotation affects long-range sports and games in subtle but measurable ways, from golf to baseball to shooting sports.',
        facts: [
          { title: 'Long Golf Drives', content: 'A 300-meter golf drive can be deflected by about 1 cm due to Earth\'s rotation. Professional golfers don\'t usually compensate.', icon: '⛳' },
          { title: 'Baseball', content: 'A baseball thrown from New York to Los Angeles would be deflected about 100 meters to the right by the Coriolis effect.', icon: '⚾' },
          { title: 'Olympic Shooting', content: 'In Olympic rifle shooting, competitors must account for Earth\'s rotation over long distances. The effect is small but measurable.', icon: '🎯' },
          { title: 'Soccer & Cricket', content: 'While Earth\'s rotation doesn\'t noticeably affect soccer or cricket at normal scales, wind patterns do affect outdoor sports.', icon: '🏏' }
        ]
      }
    }
  };

  const topics = topicsData[language];
  const currentTopic = topics[activeTopic];

  const uiText = {
    en: {
      interactive: 'Interactive Demonstration',
      flightSim: 'Flight Time Simulator',
      selectDirection: 'Select Direction:',
      eastbound: '→ Eastbound (Faster)',
      westbound: '← Westbound (Slower)',
      newYork: 'New York',
      london: 'London',
      jetStream: 'Jet Stream',
      flying: '✈️ Flying...',
      startFlight: '🛫 Start Flight',
      fastFlight: '⚡ Fast Flight!',
      slowFlight: '🐢 Slower Flight',
      jetStreamHelp: 'Jet streams helped push the plane, saving ~1 hour!',
      jetStreamHinder: 'Flying against jet streams added ~1 hour to the trip.',
      hurricaneSpin: 'Hurricane Spin Direction',
      selectHemisphere: 'Select Hemisphere:',
      northern: 'Northern',
      southern: 'Southern',
      counterClockwise: '↺ Counter-Clockwise',
      clockwise: '↻ Clockwise',
      inThe: 'In the',
      hemisphereSpins: 'Hemisphere, hurricanes spin',
      dueToCoriolis: 'due to the Coriolis effect.',
      satelliteOrbits: 'Satellite Orbits',
      geostationary: 'Geostationary',
      iss: 'ISS',
      orbit24hr: '24 hr orbit',
      orbit90min: '90 min orbit',
      worldTimeZones: 'World Time Zones',
      didYouKnow: 'Did you know?',
      gpsCoriolis: 'GPS & Coriolis Correction',
      withoutCorrection: 'Without correction',
      withCorrection: 'With correction',
      gpsExplanation: "Earth's rotation causes moving objects to curve. GPS, missiles, and even long kicks must account for this Coriolis effect!",
      sportsRotation: "Sports & Earth's Rotation",
      golf: 'Golf',
      baseball: 'Baseball',
      shooting: 'Shooting',
      soccer: 'Soccer',
      golfEffect: '300m drive deflected ~1cm',
      baseballEffect: 'Home runs not affected noticeably',
      shootingEffect: 'Olympic shooters must compensate',
      soccerEffect: 'Wind patterns affect outdoor play',
      sportsConclusion: '🤔 The effect is real but usually too small to notice in most sports!',
      keyFacts: 'Key Facts',
      thinkAboutIt: 'Think About It',
      timeComparison: "When it's {t1} in {c1}, it's {t2} in {c2}!"
    }
  };

  const ut = uiText[language];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e8f5e9 0%, #e3f2fd 50%, #f3e5f5 100%)',
      fontFamily: '"Poppins", "Segoe UI", sans-serif',
      padding: 'clamp(10px, 3vw, 20px)'
    }}>
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: 24, padding: '16px 0' }}>
        <h1 style={{
          fontSize: 'clamp(1.5rem, 5vw, 2.4rem)', fontWeight: 700,
          background: 'linear-gradient(135deg, #1565c0, #7b1fa2)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(8px, 2vw, 12px)',
          flexWrap: 'wrap', padding: '0 10px'
        }}>
          <span style={{ fontSize: '2.5rem' }}>🌍</span>
          {t('realWorld.title')}
        </h1>
        <p style={{ color: '#546e7a', marginTop: 8, fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)', padding: '0 10px' }}>
          {t('realWorld.subtitle')}
        </p>
      </header>

      {/* Topic Navigation */}
      <nav style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(4px, 1.5vw, 8px)', marginBottom: 'clamp(20px, 4vw, 30px)', flexWrap: 'wrap', padding: '0 clamp(4px, 2vw, 12px)' }}>
        {(Object.keys(topics) as RealWorldTopic[]).map(topic => (
          <button key={topic} onClick={() => setActiveTopic(topic)}
            style={{
              padding: 'clamp(10px, 2.5vw, 14px) clamp(14px, 3vw, 22px)',
              background: activeTopic === topic ? 'linear-gradient(135deg, #1976d2, #7b1fa2)' : '#ffffff',
              border: activeTopic === topic ? 'none' : '2px solid #e0e0e0',
              borderRadius: 25, color: activeTopic === topic ? '#fff' : '#546e7a',
              cursor: 'pointer', fontSize: 'clamp(0.75rem, 2vw, 0.95rem)', fontWeight: activeTopic === topic ? 600 : 500,
              transition: 'all 0.3s ease',
              boxShadow: activeTopic === topic ? '0 6px 20px rgba(25, 118, 210, 0.35)' : '0 2px 8px rgba(0,0,0,0.08)',
              display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.5vw, 10px)',
              minHeight: '44px',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent'
            }}>
            <span style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', flexShrink: 0 }}>{topics[topic].icon}</span>
            <span className="hidden sm:inline">{topics[topic].title.split(' ')[0]}</span>
          </button>
        ))}
      </nav>

      <main className="realworld-main-grid" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr', gap: 'clamp(16px, 3vw, 24px)', padding: '0 clamp(8px, 2vw, 16px)', width: '100%' }}>
        {/* Interactive Demo Section */}
        <div style={{ background: '#ffffff', borderRadius: 'clamp(16px, 3vw, 24px)', padding: 'clamp(20px, 4vw, 28px)', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 12px)', marginBottom: 'clamp(16px, 3vw, 20px)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', background: 'linear-gradient(135deg, #e3f2fd, #f3e5f5)', padding: 'clamp(8px, 2vw, 12px)', borderRadius: 'clamp(12px, 2vw, 16px)', flexShrink: 0 }}>{currentTopic.icon}</span>
            <div>
              <h2 style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', fontWeight: 700, color: '#1a237e', margin: 0 }}>{currentTopic.title}</h2>
              <p style={{ color: '#546e7a', margin: 'clamp(4px, 1vw, 4px) 0 0 0', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>{ut.interactive}</p>
            </div>
          </div>

          {/* Aviation Demo */}
          {activeTopic === 'aviation' && (
            <div style={{ background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: '#1565c0', margin: '0 0 16px 0', fontSize: '1.1rem' }}>✈️ {ut.flightSim}</h3>

              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#37474f', fontWeight: 500, display: 'block', marginBottom: 8, fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}>{ut.selectDirection}</label>
                <div style={{ display: 'flex', gap: 'clamp(8px, 2vw, 12px)', flexWrap: 'wrap' }}>
                  <button onClick={() => setFlightDirection('east')}
                    style={{
                      flex: 1, minWidth: '120px', padding: 'clamp(12px, 2.5vw, 16px)', background: flightDirection === 'east' ? '#1976d2' : '#fff',
                      border: `2px solid ${flightDirection === 'east' ? '#1976d2' : '#e0e0e0'}`, borderRadius: 10,
                      color: flightDirection === 'east' ? '#fff' : '#546e7a', fontWeight: 600, cursor: 'pointer',
                      fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', minHeight: '44px',
                      touchAction: 'manipulation',
                      WebkitTapHighlightColor: 'transparent',
                      transition: 'all 0.2s ease'
                    }}>
                    {ut.eastbound}
                  </button>
                  <button onClick={() => setFlightDirection('west')}
                    style={{
                      flex: 1, minWidth: '120px', padding: 'clamp(12px, 2.5vw, 16px)', background: flightDirection === 'west' ? '#1976d2' : '#fff',
                      border: `2px solid ${flightDirection === 'west' ? '#1976d2' : '#e0e0e0'}`, borderRadius: 10,
                      color: flightDirection === 'west' ? '#fff' : '#546e7a', fontWeight: 600, cursor: 'pointer',
                      fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', minHeight: '44px',
                      touchAction: 'manipulation',
                      WebkitTapHighlightColor: 'transparent',
                      transition: 'all 0.2s ease'
                    }}>
                    {ut.westbound}
                  </button>
                </div>
              </div>

              <div style={{ background: '#fff', borderRadius: 'clamp(10px, 2vw, 12px)', padding: 'clamp(16px, 3vw, 20px)', position: 'relative', overflow: 'hidden', marginBottom: 'clamp(12px, 2vw, 16px)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'clamp(16px, 3vw, 20px)', gap: 'clamp(8px, 2vw, 12px)', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center', flex: '1 1 120px', minWidth: '100px' }}><div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>🗽</div><div style={{ fontWeight: 600, color: '#1a237e', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>{ut.newYork}</div></div>
                  <div style={{ textAlign: 'center', flex: '1 1 120px', minWidth: '100px' }}><div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>🏰</div><div style={{ fontWeight: 600, color: '#1a237e', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>{ut.london}</div></div>
                </div>

                <div className="flight-demo" style={{ height: 'clamp(50px, 8vw, 60px)', background: 'linear-gradient(90deg, #e3f2fd, #bbdefb)', borderRadius: 'clamp(25px, 5vw, 30px)', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(20px, 4vw, 30px)', opacity: 0.3, color: '#1565c0', overflow: 'hidden' }}>
                    {[...Array(5)].map((_, i) => <span key={i} style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)' }}>→</span>)}
                  </div>
                  <div style={{ position: 'absolute', top: 'clamp(-18px, -3vw, -20px)', left: '50%', transform: 'translateX(-50%)', fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)', color: '#1565c0', fontWeight: 500, whiteSpace: 'nowrap' }}>{ut.jetStream} →</div>
                  <div style={{
                    position: 'absolute', left: flightDirection === 'east' ? `${planePosition}%` : `${100 - planePosition}%`,
                    transform: `translateX(-50%) scaleX(${flightDirection === 'east' ? 1 : -1})`, fontSize: 'clamp(1.5rem, 3vw, 2rem)', transition: 'left 0.05s linear', zIndex: 2
                  }}>✈️</div>
                </div>
              </div>

              <button onClick={simulateFlight} disabled={isAnimating}
                style={{
                  width: '100%', padding: 'clamp(12px, 2.5vw, 16px)', background: isAnimating ? '#bdbdbd' : 'linear-gradient(135deg, #43a047, #2e7d32)',
                  border: 'none', borderRadius: 12, color: '#fff', fontWeight: 600, fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', cursor: isAnimating ? 'default' : 'pointer',
                  boxShadow: isAnimating ? 'none' : '0 4px 15px rgba(46, 125, 50, 0.3)',
                  minHeight: '48px',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent',
                  transition: 'all 0.2s ease'
                }}>
                {isAnimating ? ut.flying : ut.startFlight}
              </button>

              {planePosition >= 100 && (
                <div style={{ marginTop: 16, padding: '14px 18px', background: flightDirection === 'east' ? '#e8f5e9' : '#fff3e0', borderRadius: 12, textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, color: flightDirection === 'east' ? '#2e7d32' : '#e65100', fontSize: '1.1rem' }}>
                    {flightDirection === 'east' ? ut.fastFlight : ut.slowFlight}
                  </div>
                  <div style={{ color: '#546e7a', marginTop: 4 }}>
                    {flightDirection === 'east' ? ut.jetStreamHelp : ut.jetStreamHinder}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Weather Demo */}
          {activeTopic === 'weather' && (
            <div style={{ background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: '#2e7d32', margin: '0 0 16px 0', fontSize: '1.1rem' }}>🌀 {ut.hurricaneSpin}</h3>

              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#37474f', fontWeight: 500, display: 'block', marginBottom: 8, fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}>{ut.selectHemisphere}</label>
                <div style={{ display: 'flex', gap: 'clamp(8px, 2vw, 12px)', flexWrap: 'wrap' }}>
                  <button onClick={() => setWeatherHemisphere('north')}
                    style={{
                      flex: 1, minWidth: '120px', padding: 'clamp(12px, 2.5vw, 16px)', background: weatherHemisphere === 'north' ? '#2e7d32' : '#fff',
                      border: `2px solid ${weatherHemisphere === 'north' ? '#2e7d32' : '#e0e0e0'}`, borderRadius: 10,
                      color: weatherHemisphere === 'north' ? '#fff' : '#546e7a', fontWeight: 600, cursor: 'pointer',
                      fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', minHeight: '44px',
                      touchAction: 'manipulation',
                      WebkitTapHighlightColor: 'transparent',
                      transition: 'all 0.2s ease'
                    }}>🌍 {ut.northern}</button>
                  <button onClick={() => setWeatherHemisphere('south')}
                    style={{
                      flex: 1, minWidth: '120px', padding: 'clamp(12px, 2.5vw, 16px)', background: weatherHemisphere === 'south' ? '#2e7d32' : '#fff',
                      border: `2px solid ${weatherHemisphere === 'south' ? '#2e7d32' : '#e0e0e0'}`, borderRadius: 10,
                      color: weatherHemisphere === 'south' ? '#fff' : '#546e7a', fontWeight: 600, cursor: 'pointer',
                      fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', minHeight: '44px',
                      touchAction: 'manipulation',
                      WebkitTapHighlightColor: 'transparent',
                      transition: 'all 0.2s ease'
                    }}>🌏 {ut.southern}</button>
                </div>
              </div>

              <div style={{ background: '#fff', borderRadius: 'clamp(12px, 2vw, 16px)', padding: 'clamp(20px, 4vw, 30px)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="hurricane-demo" style={{
                  width: 'clamp(120px, 25vw, 150px)', height: 'clamp(120px, 25vw, 150px)', borderRadius: '50%', background: 'radial-gradient(circle, #e3f2fd 0%, #1976d2 50%, #0d47a1 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: '0 8px 30px rgba(25, 118, 210, 0.3)'
                }}>
                  <div style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', animation: `spin${weatherHemisphere === 'north' ? 'CCW' : 'CW'} 3s linear infinite` }}>🌀</div>
                  <div style={{ position: 'absolute', width: 'clamp(16px, 3vw, 20px)', height: 'clamp(16px, 3vw, 20px)', background: '#fff', borderRadius: '50%' }} />
                </div>

                <div style={{ marginTop: 'clamp(16px, 3vw, 20px)', textAlign: 'center', width: '100%', maxWidth: '400px' }}>
                  <div style={{ fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', fontWeight: 700, color: '#1565c0', marginBottom: 'clamp(6px, 1.5vw, 8px)' }}>
                    {weatherHemisphere === 'north' ? ut.counterClockwise : ut.clockwise}
                  </div>
                  <div style={{ color: '#546e7a', lineHeight: 1.6, fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
                    {ut.inThe} {weatherHemisphere === 'north' ? ut.northern : ut.southern} {ut.hemisphereSpins} {weatherHemisphere === 'north' ? ut.counterClockwise : ut.clockwise} {ut.dueToCoriolis}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Satellites Demo */}
          {activeTopic === 'satellites' && (
            <div style={{ background: 'linear-gradient(135deg, #f3e5f5, #e1bee7)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: '#7b1fa2', margin: '0 0 16px 0', fontSize: '1.1rem' }}>🛰️ {ut.satelliteOrbits}</h3>

              <div className="satellite-demo" style={{ background: '#1a1a2e', borderRadius: 'clamp(12px, 2vw, 16px)', padding: 'clamp(20px, 4vw, 30px)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', minHeight: 'clamp(200px, 40vw, 250px)' }}>
                {[...Array(30)].map((_, i) => (
                  <div key={i} style={{ position: 'absolute', width: 2, height: 2, background: '#fff', borderRadius: '50%', left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() * 0.8 + 0.2 }} />
                ))}

                <div style={{ width: 'clamp(60px, 12vw, 80px)', height: 'clamp(60px, 12vw, 80px)', borderRadius: '50%', background: 'linear-gradient(135deg, #4fc3f7 0%, #0288d1 50%, #01579b 100%)', boxShadow: '0 0 30px rgba(79, 195, 247, 0.4)', position: 'relative', zIndex: 2 }}>
                  <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'linear-gradient(to left, transparent 50%, rgba(0,0,0,0.5) 100%)' }} />
                </div>

                <div style={{ position: 'absolute', width: 'clamp(150px, 30vw, 200px)', height: 'clamp(150px, 30vw, 200px)', border: '2px dashed rgba(255,255,255,0.3)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', width: 'clamp(150px, 30vw, 200px)', height: 'clamp(150px, 30vw, 200px)', transform: `rotate(${satelliteOrbit}deg)` }}>
                  <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)' }}>🛰️</div>
                </div>

                <div style={{ position: 'absolute', width: 'clamp(100px, 20vw, 130px)', height: 'clamp(100px, 20vw, 130px)', border: '2px dashed rgba(255,200,0,0.4)', borderRadius: '50%', transform: 'rotate(30deg)' }} />
                <div style={{ position: 'absolute', width: 'clamp(100px, 20vw, 130px)', height: 'clamp(100px, 20vw, 130px)', transform: `rotate(${30 + satelliteOrbit * 3}deg)` }}>
                  <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>🛸</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'clamp(10px, 2vw, 14px)', marginTop: 16 }}>
                <div style={{ background: '#fff', padding: 'clamp(10px, 2vw, 14px) clamp(12px, 2.5vw, 18px)', borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ color: '#9e9e9e', fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)' }}>🛰️ {ut.geostationary}</div>
                  <div style={{ color: '#7b1fa2', fontWeight: 700, fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>35,786 km</div>
                  <div style={{ color: '#546e7a', fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)' }}>{ut.orbit24hr}</div>
                </div>
                <div style={{ background: '#fff', padding: 'clamp(10px, 2vw, 14px) clamp(12px, 2.5vw, 18px)', borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ color: '#ffc107', fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)' }}>🛸 {ut.iss}</div>
                  <div style={{ color: '#7b1fa2', fontWeight: 700, fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>408 km</div>
                  <div style={{ color: '#546e7a', fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)' }}>{ut.orbit90min}</div>
                </div>
              </div>
            </div>
          )}

          {/* Daily Life Demo */}
          {activeTopic === 'daily-life' && (
            <div style={{ background: 'linear-gradient(135deg, #fff3e0, #ffe0b2)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: '#e65100', margin: '0 0 16px 0', fontSize: '1.1rem' }}>🕐 {ut.worldTimeZones}</h3>

              <div style={{ background: '#fff', borderRadius: 12, padding: 20 }}>
                <div className="city-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(100px, 20vw, 140px), 1fr))', gap: 'clamp(8px, 2vw, 14px)' }}>
                  {cities.map((city, index) => (
                    <div key={city.name} onClick={() => setSelectedCity(index)}
                      style={{
                        padding: 'clamp(12px, 2.5vw, 16px)', background: selectedCity === index ? 'linear-gradient(135deg, #fff3e0, #ffe0b2)' : '#f5f5f5',
                        borderRadius: 12, cursor: 'pointer', textAlign: 'center', border: selectedCity === index ? '2px solid #ff9800' : '2px solid transparent', transition: 'all 0.3s ease',
                        minHeight: '120px',
                        touchAction: 'manipulation',
                        WebkitTapHighlightColor: 'transparent'
                      }}>
                      <div style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', marginBottom: 4 }}>
                        {index === 0 ? '🗽' : index === 1 ? '🏰' : index === 2 ? '🏜️' : index === 3 ? '🕌' : index === 4 ? '🗼' : '🦘'}
                      </div>
                      <div style={{ fontWeight: 700, color: '#1a237e', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>{city.name}</div>
                      <div style={{ fontFamily: 'monospace', fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', fontWeight: 700, color: '#e65100', marginTop: 4 }}>{getTimeInCity(city.timezone)}</div>
                      <div style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)', color: '#9e9e9e' }}>UTC{city.timezone >= 0 ? '+' : ''}{city.timezone}</div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 16, padding: '14px 18px', background: '#e8f5e9', borderRadius: 10 }}>
                  <div style={{ fontWeight: 600, color: '#2e7d32', marginBottom: 4 }}>💡 {ut.didYouKnow}</div>
                  <div style={{ color: '#546e7a', fontSize: '0.9rem' }}>
                    {ut.timeComparison
                      .replace('{t1}', getTimeInCity(cities[selectedCity].timezone))
                      .replace('{c1}', cities[selectedCity].name)
                      .replace('{t2}', getTimeInCity(cities[(selectedCity + 3) % 6].timezone))
                      .replace('{c2}', cities[(selectedCity + 3) % 6].name)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Demo */}
          {activeTopic === 'navigation' && (
            <div style={{ background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: '#1565c0', margin: '0 0 16px 0', fontSize: '1.1rem' }}>🧭 {ut.gpsCoriolis}</h3>

              <div style={{ background: '#fff', borderRadius: 12, padding: 20, textAlign: 'center' }}>
                <div style={{ width: 200, height: 200, margin: '0 auto 20px', borderRadius: '50%', background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)', position: 'relative', border: '3px solid #4caf50' }}>
                  <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(0,0,0,0.1)' }} />
                  <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(0,0,0,0.1)' }} />
                  <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '1.5rem' }}>🎯</div>
                  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                    <path d="M 100 180 Q 130 100, 115 65" fill="none" stroke="#f44336" strokeWidth="2" strokeDasharray="5,5" />
                    <path d="M 100 180 Q 90 100, 100 60" fill="none" stroke="#4caf50" strokeWidth="2" />
                  </svg>
                  <div style={{ position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)', fontSize: '1.5rem' }}>🚀</div>
                  <div style={{ position: 'absolute', top: '30%', right: '35%', fontSize: '0.8rem', color: '#f44336' }}>✗</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 20, height: 3, background: '#f44336' }} /><span style={{ fontSize: '0.85rem', color: '#546e7a' }}>{ut.withoutCorrection}</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 20, height: 3, background: '#4caf50' }} /><span style={{ fontSize: '0.85rem', color: '#546e7a' }}>{ut.withCorrection}</span></div>
                </div>

                <div style={{ padding: '14px', background: '#e3f2fd', borderRadius: 10, color: '#1565c0', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {ut.gpsExplanation}
                </div>
              </div>
            </div>
          )}

          {/* Sports Demo */}
          {activeTopic === 'sports' && (
            <div style={{ background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: '#2e7d32', margin: '0 0 16px 0', fontSize: '1.1rem' }}>⚽ {ut.sportsRotation}</h3>

              <div style={{ background: '#fff', borderRadius: 12, padding: 20 }}>
                <div className="sports-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
                  <div style={{ padding: 16, background: '#f1f8e9', borderRadius: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>⛳</div>
                    <div style={{ fontWeight: 700, color: '#33691e', marginBottom: 4 }}>{ut.golf}</div>
                    <div style={{ color: '#546e7a', fontSize: '0.85rem' }}>{ut.golfEffect}</div>
                  </div>
                  <div style={{ padding: 16, background: '#e3f2fd', borderRadius: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>⚾</div>
                    <div style={{ fontWeight: 700, color: '#1565c0', marginBottom: 4 }}>{ut.baseball}</div>
                    <div style={{ color: '#546e7a', fontSize: '0.85rem' }}>{ut.baseballEffect}</div>
                  </div>
                  <div style={{ padding: 16, background: '#fce4ec', borderRadius: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🎯</div>
                    <div style={{ fontWeight: 700, color: '#c2185b', marginBottom: 4 }}>{ut.shooting}</div>
                    <div style={{ color: '#546e7a', fontSize: '0.85rem' }}>{ut.shootingEffect}</div>
                  </div>
                  <div style={{ padding: 16, background: '#fff3e0', borderRadius: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>⚽</div>
                    <div style={{ fontWeight: 700, color: '#e65100', marginBottom: 4 }}>{ut.soccer}</div>
                    <div style={{ color: '#546e7a', fontSize: '0.85rem' }}>{ut.soccerEffect}</div>
                  </div>
                </div>

                <div style={{ marginTop: 16, padding: '14px', background: '#e8f5e9', borderRadius: 10, textAlign: 'center' }}>
                  <span style={{ color: '#2e7d32', fontWeight: 500 }}>{ut.sportsConclusion}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Facts Section */}
        <div style={{ background: '#ffffff', borderRadius: 'clamp(16px, 3vw, 24px)', padding: 'clamp(20px, 4vw, 28px)', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1a237e', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>📚 {ut.keyFacts}</h2>

          <p style={{ color: '#546e7a', lineHeight: 1.7, marginBottom: 24, padding: '16px', background: 'linear-gradient(135deg, #f5f5f5, #eeeeee)', borderRadius: 12 }}>
            {currentTopic.description}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {currentTopic.facts.map((fact, index) => (
              <div key={index} style={{ padding: '18px 20px', background: 'linear-gradient(135deg, #f8f9fa, #ffffff)', borderRadius: 14, borderLeft: '4px solid #1976d2', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: '1.5rem' }}>{fact.icon}</span>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#1a237e' }}>{fact.title}</h3>
                </div>
                <p style={{ margin: 0, color: '#546e7a', lineHeight: 1.7, fontSize: '0.95rem' }}>{fact.content}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, padding: 20, background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)', borderRadius: 16 }}>
            <h3 style={{ color: '#2e7d32', margin: '0 0 12px 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 8 }}>💡 {ut.thinkAboutIt}</h3>
            <p style={{ color: '#37474f', margin: 0, lineHeight: 1.7 }}>
              {activeTopic === 'aviation' && 'Why do you think most major airports are built in the eastern parts of continents?'}
              {activeTopic === 'navigation' && 'How would GPS work differently if Earth rotated twice as fast?'}
              {activeTopic === 'weather' && 'Would hurricanes exist on a planet that doesn\'t rotate?'}
              {activeTopic === 'satellites' && 'Why are most rocket launch sites located near the equator?'}
              {activeTopic === 'daily-life' && 'What would happen to time zones if Earth rotated in the opposite direction?'}
              {activeTopic === 'sports' && 'Would snipers need to adjust their aim more at the equator or near the poles?'}
            </p>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spinCCW { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes spinCW { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        /* Main Grid Responsive Layout */
        @media (min-width: 1024px) {
          .realworld-main-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        
        @media (max-width: 1023px) {
          .realworld-main-grid {
            grid-template-columns: 1fr !important;
          }
        }
        
        /* City Grid Responsive */
        @media (min-width: 768px) {
          .city-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        
        @media (min-width: 480px) and (max-width: 767px) {
          .city-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        
        @media (max-width: 479px) {
          .city-grid {
            grid-template-columns: 1fr !important;
          }
        }
        
        /* Sports Grid Responsive */
        @media (min-width: 768px) {
          .sports-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        
        @media (max-width: 767px) {
          .sports-grid {
            grid-template-columns: 1fr !important;
          }
        }
        
        /* Touch-friendly buttons */
        @media (max-width: 768px) {
          button {
            min-height: 48px !important;
            padding: 14px 18px !important;
            font-size: clamp(0.85rem, 2.5vw, 1rem) !important;
          }
        }
        
        /* Responsive demo containers */
        @media (max-width: 640px) {
          .realworld-main-grid > div {
            padding: clamp(16px, 4vw, 24px) !important;
          }
        }
        
        /* Flight simulator responsive */
        @media (max-width: 480px) {
          .flight-demo {
            height: 50px !important;
          }
        }
        
        /* Hurricane demo responsive */
        @media (max-width: 640px) {
          .hurricane-demo {
            width: 120px !important;
            height: 120px !important;
          }
        }
        
        /* Satellite demo responsive */
        @media (max-width: 640px) {
          .satellite-demo {
            min-height: 200px !important;
          }
        }
        
        /* Responsive spacing */
        @media (max-width: 768px) {
          main {
            padding: 0 12px !important;
          }
          
          h1 {
            font-size: clamp(1.5rem, 5vw, 2rem) !important;
          }
          
          h2, h3 {
            font-size: clamp(1rem, 3vw, 1.3rem) !important;
          }
        }
        
        /* Landscape mode for tablets */
        @media (min-width: 640px) and (max-width: 1024px) and (orientation: landscape) {
          .realworld-main-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          
          .city-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        
        /* Extra small devices optimization */
        @media (max-width: 360px) {
          .realworld-main-grid > div {
            padding: 12px !important;
            border-radius: 12px !important;
          }
          
          button {
            font-size: 0.8rem !important;
            padding: 12px 14px !important;
          }
        }
        
        /* Prevent horizontal scroll */
        @media (max-width: 768px) {
          * {
            max-width: 100%;
            overflow-wrap: break-word;
            word-wrap: break-word;
          }
        }
        
        /* Hover effects only on devices that support hover */
        @media (hover: hover) and (pointer: fine) {
          button:hover {
            transform: translateY(-2px);
            filter: brightness(1.05);
          }
        }
        
        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          button {
            min-height: 44px !important;
            min-width: 44px !important;
            -webkit-tap-highlight-color: transparent;
          }
        }
        
        /* Tablet portrait mode */
        @media (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {
          .city-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          
          .sports-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// Main RotationLearning Component (Router)
// ============================================================================
interface RotationLearningProps {
  mode: "learn" | "practice" | "applications";
  setMode: (mode: "learn" | "practice" | "applications") => void;
}

const RotationLearning: React.FC<RotationLearningProps> = ({
  mode,
  setMode,
}) => {
  return (
    <>
      <Navbar mode={mode} setMode={setMode} />
      <div className="pt-14 sm:pt-16 md:pt-18 px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8 pb-4 sm:pb-6 md:pb-8 overflow-x-hidden" style={{ minHeight: '100vh', width: '100%', maxWidth: '100vw' }}>
        {mode === "learn" && <RotationLearnMode />}
        {mode === "practice" && <RotationPracticeMode />}
        {mode === "applications" && <RotationRealWorld />}
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Global responsive resets */
          * {
            box-sizing: border-box;
          }
          
          body {
            margin: 0;
            padding: 0;
            overflow-x: hidden;
          }
          
          /* Responsive container */
          @media (max-width: 640px) {
            .pt-14 { padding-top: 56px !important; }
          }
          
          @media (min-width: 641px) and (max-width: 768px) {
            .pt-14 { padding-top: 64px !important; }
          }
          
          @media (min-width: 769px) {
            .pt-14 { padding-top: 72px !important; }
          }
          
          /* Prevent zoom on input focus on iOS */
          @media screen and (max-width: 768px) {
            input, select, textarea {
              font-size: 16px !important;
            }
          }
          
          /* Safe area insets for notched devices */
          @supports (padding: max(0px)) {
            .pt-14 {
              padding-top: max(56px, env(safe-area-inset-top)) !important;
            }
            
            .px-2 {
              padding-left: max(8px, env(safe-area-inset-left)) !important;
              padding-right: max(8px, env(safe-area-inset-right)) !important;
            }
          }
          
          /* Smooth scrolling */
          html {
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
          }
          
          /* Prevent pull-to-refresh on mobile */
          @media (max-width: 768px) {
            body {
              overscroll-behavior-y: contain;
            }
          }
        `
      }} />
    </>
  );
};

// Main App Component with Language Provider
const App: React.FC = () => {
  const [mode, setMode] = useState<"learn" | "practice" | "applications">("learn");
  
  return (
    <LanguageProvider>
      <RotationLearning mode={mode} setMode={setMode} />
    </LanguageProvider>
  );
};

// Export as named exports
export { RotationLearnMode, RotationPracticeMode, RotationRealWorld, RotationLearning };

// Default export for main component
export default App;