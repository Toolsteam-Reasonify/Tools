// @ts-nocheck
import React, {
    useState,
    useEffect,
    useRef,
    createContext,
    useContext,
    useCallback,
} from "react";
import type { ReactNode } from "react";

// ============================================================================
// EASING FUNCTIONS
// ============================================================================
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeInOutQuad = (t: number): number => 
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const easeOutElastic = (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 
        : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
export type Language = "en" | "hi" | "es" | "fr";
export type ModeType = "learn" | "practice" | "applications";
type Season = 'spring' | 'summer' | 'autumn' | 'winter';

interface OrbitPosition {
  angle: number;
  x: number;
  y: number;
  season: Season;
  month: string;
  tilt: number;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: 'rotation' | 'revolution' | 'seasons' | 'eclipses';
}

interface RealWorldExample {
  id: number;
  title: string;
  icon: string;
  difficulty: string;
  context: string;
  question: string;
  realWorldConnection: string;
  solution: string;
  explanation: string;
  tips: string[];
}

interface StepDetails {
    currentStep: number;
    totalSteps: number;
    mode: ModeType;
}

interface RevolutionOfEarthToolProps {
    props?: {
        // Dimensions
        width?: number;
        height?: number;
        
        // Mode Configuration
        initialMode?: ModeType;
        showModeSelector?: boolean;
        enabledModes?: ModeType[];
        
        // Language
        language?: Language;
        
        // Theme
        themeColor?: string;
        darkMode?: boolean;
        
        // Animation
        animationSpeed?: number;
        autoPlayDuration?: number;
        
        // Additional Props - Tool-specific dynamic content
        additionalProps?: {
            customSeasonData?: any;
            customQuestions?: Question[];
            customScenarios?: RealWorldExample[];
            orbitStartAngle?: number;
            enableAutoPlay?: boolean;
            [key: string]: any;
        };
    };
    
    // External Controls
    setStepDetails?: (stepDetails: StepDetails) => void;
    stopAutoNext?: boolean;
    setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ============================================================================
// TRANSLATION DATA
// ============================================================================
export const translationsData: { [key: string]: any } = {
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
            header: 'Revolution of the Earth',
            subtitle: 'Earth\'s Journey Around the Sun',
        },
        practice: {
            header: 'Practice Revolution',
            subtitle: 'Test your knowledge',
        },
        common: {
            comingSoon: "Coming Soon",
            stayTuned: "Stay tuned for exciting interactive content!"
        },
        learnMode: {
            header: "Learn Mode",
            progress: "Progress",
            previous: "Previous",
            next: "Next",
            complete: "Complete! 🎉"
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
            description: "See how Earth's rotation and revolution affect our daily lives",
            backToScenarios: "Back to Scenarios",
            scenario: "Scenario",
            context: "Context",
            question: "Question:",
            realWorldConnection: "Real-World Connection",
            yourAnswer: "Your Answer:",
            answerPlaceholder: "Type your answer here... Explain your reasoning.",
            checkSolution: "Check Solution",
            quickAnswer: "Quick Answer",
            detailedExplanation: "Detailed Explanation:",
            keyTakeaways: "💡 Key Takeaways",
            previous: "← Previous",
            nextScenario: "Next Scenario →",
            complete: "Complete! 🎉"
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
                    name: 'Spring',
                    months: 'March - May',
                    description: 'Days get longer and warmer. Plants begin to grow.',
                    hemisphere: 'Northern Hemisphere tilts toward Sun',
                    event: 'Spring Equinox (March 21) - Day = Night'
                },
                summer: {
                    name: 'Summer',
                    months: 'June - August',
                    description: 'Longest days and warmest weather of the year.',
                    hemisphere: 'Northern Hemisphere most tilted toward Sun',
                    event: 'Summer Solstice (June 21) - Longest Day'
                },
                autumn: {
                    name: 'Autumn',
                    months: 'September - November',
                    description: 'Days get shorter and cooler. Leaves change color.',
                    hemisphere: 'Northern Hemisphere tilts away from Sun',
                    event: 'Autumn Equinox (Sept 23) - Day = Night'
                },
                winter: {
                    name: 'Winter',
                    months: 'December - February',
                    description: 'Shortest days and coldest weather of the year.',
                    hemisphere: 'Northern Hemisphere most tilted away from Sun',
                    event: 'Winter Solstice (Dec 22) - Shortest Day'
                }
            },
            seasonMarkers: {
                springEquinox: 'Spring Equinox',
                summerSolstice: 'Summer Solstice',
                autumnEquinox: 'Autumn Equinox',
                winterSolstice: 'Winter Solstice'
            },
            keyFacts: {
                revolutionPeriod: {
                    title: 'Revolution Period',
                    fact: '365¼ days (1 year)',
                    detail: 'This extra ¼ day is why we have a leap year every 4 years!'
                },
                orbitalShape: {
                    title: 'Orbital Shape',
                    fact: 'Elliptical (oval-shaped)',
                    detail: 'Earth is sometimes closer to the Sun and sometimes farther.'
                },
                axialTilt: {
                    title: 'Axial Tilt',
                    fact: '23.5 degrees',
                    detail: 'This tilt is the main reason we have different seasons!'
                },
                orbitalSpeed: {
                    title: 'Orbital Speed',
                    fact: '~30 km/s (108,000 km/h)',
                    detail: 'That\'s about 30 times faster than a bullet!'
                },
                distanceFromSun: {
                    title: 'Distance from Sun',
                    fact: '~150 million km (average)',
                    detail: 'Light from the Sun takes about 8 minutes to reach Earth.'
                }
            }
        },
        practiceContent: {
            practiceQuestions: {
                q1: {
                    question: "In which direction does the Earth rotate on its axis?",
                    options: ["East to West", "West to East", "North to South", "South to North"],
                    explanation: "Earth rotates from West to East. This is why the Sun appears to rise in the East and set in the West."
                },
                q2: {
                    question: "How long does it take for Earth to complete one rotation on its axis?",
                    options: ["12 hours", "24 hours", "365 days", "30 days"],
                    explanation: "Earth completes one full rotation on its axis in approximately 24 hours."
                },
                q3: {
                    question: "What causes day and night on Earth?",
                    options: [
                        "Earth's revolution around the Sun",
                        "Earth's rotation on its axis",
                        "The Moon blocking sunlight",
                        "Clouds covering the Sun"
                    ],
                    explanation: "Day and night are caused by Earth's rotation on its axis."
                },
                q4: {
                    question: "How long does it take for Earth to complete one revolution around the Sun?",
                    options: ["24 hours", "30 days", "365 days and 6 hours", "12 months exactly"],
                    explanation: "Earth takes approximately 365 days and 6 hours to complete one revolution."
                },
                q5: {
                    question: "What is the main reason for seasons on Earth?",
                    options: [
                        "Distance from the Sun changes",
                        "Earth's tilted axis and spherical shape",
                        "The Moon's gravitational pull",
                        "Solar flares from the Sun"
                    ],
                    explanation: "Seasons occur due to Earth's axis being tilted at 23.5° relative to its orbit."
                }
            }
        }
    }
};

// ============================================================================
// LANGUAGE CONTEXT
// ============================================================================
interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    translations: any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error("useLanguage must be used within LanguageProvider");
    return context;
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
const getSeasonData = (season: Season, translations: any) => {
  const baseData = {
    spring: { 
      color: '#86efac',
      bgGradient: 'linear-gradient(135deg, #fef9c3 0%, #bbf7d0 50%, #a7f3d0 100%)',
      icon: '🌸'
    },
    summer: { 
      color: '#fbbf24',
      bgGradient: 'linear-gradient(135deg, #fef08a 0%, #fdba74 50%, #fb923c 100%)',
      icon: '☀️'
    },
    autumn: { 
      color: '#f97316',
      bgGradient: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 50%, #fb923c 100%)',
      icon: '🍂'
    },
    winter: { 
      color: '#60a5fa',
      bgGradient: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%)',
      icon: '❄️'
    }
  };
  
  const safeTranslations = translations?.learnContent?.seasons 
    ? translations 
    : translationsData["en"];
  
  const seasonData = safeTranslations?.learnContent?.seasons?.[season];
  
  const englishSeasonNames: { [key: string]: string } = {
    spring: 'Spring',
    summer: 'Summer',
    autumn: 'Autumn',
    winter: 'Winter'
  };
  
  return {
    ...baseData[season],
    name: seasonData?.name || englishSeasonNames[season] || baseData[season].icon + ' Season',
    months: seasonData?.months || '',
    description: seasonData?.description || '',
    hemisphere: seasonData?.hemisphere || '',
    event: seasonData?.event || ''
  };
};

// ============================================================================
// ICON COMPONENTS (Pure React)
// ============================================================================
const GlobeIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const CheckCircleIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const XCircleIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="15" y1="9" x2="9" y2="15"/>
    <line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
);

const TrophyIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </svg>
);

const TargetIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const StarIcon = ({ size = 24, color = "currentColor", filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const ArrowLeftIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const RotateCcwIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
  </svg>
);

const ChevronRightIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const InfoIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="16" x2="12" y2="12"/>
    <line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

const AwardIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7"/>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
  </svg>
);

// ============================================================================
const RevolutionLearnMode: React.FC<{ additionalProps: any }> = ({ additionalProps }) => {
  const { translations } = useLanguage();
  const safeTranslations = translations || translationsData["en"];
  
  const [orbitAngle, setOrbitAngle] = useState(additionalProps?.orbitStartAngle || 90);
  const [isPlaying, setIsPlaying] = useState(additionalProps?.enableAutoPlay !== false);
  const [speed, setSpeed] = useState(1);
  const [currentSeason, setCurrentSeason] = useState<Season>('summer');
  const [earthRotation, setEarthRotation] = useState(0);
  const [hoveredFact, setHoveredFact] = useState<number | null>(null);
  const animationRef = useRef<number | null>(null);
  const speedRef = useRef(speed);
  const isPlayingRef = useRef(isPlaying);
  const previousQuadrantRef = useRef<number>(Math.floor(orbitAngle / 90));
  
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);
  
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const getOrbitPosition = useCallback((angle: number): OrbitPosition => {
    const a = 180;
    const b = 120;
    const rad = (angle * Math.PI) / 180;
    const x = a * Math.cos(rad);
    const y = b * Math.sin(rad);
    
    let season: Season;
    let month: string;
    let tilt: number;
    
    if (angle >= 0 && angle < 90) {
      season = 'spring';
      month = 'March - May';
      tilt = 23.5 * (angle / 90);
    } else if (angle >= 90 && angle < 180) {
      season = 'summer';
      month = 'June - August';
      tilt = 23.5;
    } else if (angle >= 180 && angle < 270) {
      season = 'autumn';
      month = 'September - November';
      tilt = 23.5 * (1 - (angle - 180) / 90);
    } else {
      season = 'winter';
      month = 'December - February';
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
      
      setOrbitAngle(prev => ((prev - 0.3 * speedRef.current) + 360) % 360);
      setEarthRotation(prev => (prev + 2 * speedRef.current) % 360);
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
    const currentQuadrant = Math.floor(orbitAngle / 90);
    
    if (currentQuadrant !== previousQuadrantRef.current) {
      previousQuadrantRef.current = currentQuadrant;
      const pos = getOrbitPosition(orbitAngle);
      setCurrentSeason(pos.season);
    }
  }, [orbitAngle, getOrbitPosition]);

  const position = getOrbitPosition(orbitAngle);
  const seasonInfo = getSeasonData(currentSeason, safeTranslations);

  const keyFacts = [
    { 
      icon: '⏱️', 
      title: safeTranslations?.learnContent?.keyFacts?.revolutionPeriod?.title || 'Revolution Period',
      fact: safeTranslations?.learnContent?.keyFacts?.revolutionPeriod?.fact || '365¼ days (1 year)',
      detail: safeTranslations?.learnContent?.keyFacts?.revolutionPeriod?.detail || 'This extra ¼ day is why we have a leap year every 4 years!'
    },
    { 
      icon: '🛤️', 
      title: safeTranslations?.learnContent?.keyFacts?.orbitalShape?.title || 'Orbital Shape',
      fact: safeTranslations?.learnContent?.keyFacts?.orbitalShape?.fact || 'Elliptical (oval-shaped)',
      detail: safeTranslations?.learnContent?.keyFacts?.orbitalShape?.detail || 'Earth is sometimes closer to the Sun and sometimes farther.'
    },
    { 
      icon: '📐', 
      title: safeTranslations?.learnContent?.keyFacts?.axialTilt?.title || 'Axial Tilt',
      fact: safeTranslations?.learnContent?.keyFacts?.axialTilt?.fact || '23.5 degrees',
      detail: safeTranslations?.learnContent?.keyFacts?.axialTilt?.detail || 'This tilt is the main reason we have different seasons!'
    },
    { 
      icon: '🚀', 
      title: safeTranslations?.learnContent?.keyFacts?.orbitalSpeed?.title || 'Orbital Speed',
      fact: safeTranslations?.learnContent?.keyFacts?.orbitalSpeed?.fact || '~30 km/s (108,000 km/h)',
      detail: safeTranslations?.learnContent?.keyFacts?.orbitalSpeed?.detail || 'That\'s about 30 times faster than a bullet!'
    },
    { 
      icon: '📏', 
      title: safeTranslations?.learnContent?.keyFacts?.distanceFromSun?.title || 'Distance from Sun',
      fact: safeTranslations?.learnContent?.keyFacts?.distanceFromSun?.fact || '~150 million km (average)',
      detail: safeTranslations?.learnContent?.keyFacts?.distanceFromSun?.detail || 'Light from the Sun takes about 8 minutes to reach Earth.'
    }
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #020617, #1e1b4b, #0f172a)',
      color: 'white',
      position: 'relative' as const,
      overflow: 'hidden',
    },
    header: {
      padding: '1rem',
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(40px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    },
    title: {
      fontSize: 'clamp(1.25rem, 4vw, 2rem)',
      fontWeight: 'bold' as const,
      marginBottom: '0.5rem',
      background: 'linear-gradient(to right, #60a5fa, #a78bfa, #ec4899)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      flexWrap: 'wrap' as const,
    },
    main: {
      padding: '1rem',
      maxWidth: '90rem',
      margin: '0 auto',
    },
    animationSection: {
      background: 'rgba(30, 41, 59, 0.5)',
      backdropFilter: 'blur(8px)',
      borderRadius: '1rem',
      padding: '1rem',
      border: '1px solid rgba(168, 85, 247, 0.3)',
      marginBottom: '1rem',
    },
    contentSection: {
      background: 'rgba(30, 41, 59, 0.5)',
      backdropFilter: 'blur(8px)',
      borderRadius: '1rem',
      padding: '1rem',
      border: '1px solid rgba(168, 85, 247, 0.3)',
    },
    button: {
      padding: '0.625rem 1rem',
      borderRadius: '0.75rem',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600' as const,
      fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
    },
    seasonCard: {
      borderRadius: '1rem',
      padding: '1rem',
      color: '#1f2937',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      transition: 'all 0.5s',
      marginBottom: '1rem',
    },
  };

  return (
    <div style={styles.container}>
      {/* Starfield */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(120)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              background: 'white',
              borderRadius: '50%',
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
              animation: `pulse ${Math.random() * 2 + 1}s infinite`,
            }}
          />
        ))}
      </div>

      <header style={styles.header}>
        <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
          <h1 style={styles.title}>
            <span style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>🌍</span>
            <span style={{ wordBreak: 'break-word' }}>
              {safeTranslations?.learn?.header || 'Revolution of the Earth'}
            </span>
          </h1>
          <p style={{ marginTop: '0.5rem', opacity: 0.7, fontSize: 'clamp(0.75rem, 2vw, 1rem)' }}>
            {safeTranslations?.learn?.subtitle || 'Earth\'s Journey Around the Sun'}
          </p>
        </div>
      </header>

      <main style={styles.main}>
        {/* PART 1: Animation Section */}
        <div style={styles.animationSection}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h2 style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>{seasonInfo.icon}</span>
                <span style={{ wordBreak: 'break-word' }}>
                  {safeTranslations?.learnContent?.earthInSolarSystem || 'Earth in the Solar System'}
                </span>
              </h2>
              <div 
                style={{
                  color: '#1f2937',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.75rem',
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                  fontWeight: '600',
                  background: seasonInfo.bgGradient,
                  whiteSpace: 'nowrap' as const,
                }}
              >
                {safeTranslations?.learnContent?.current || 'Current'}: {seasonInfo.name}
              </div>
            </div>
            
            {/* SVG Solar System - Same as before but with responsive sizing */}
            <div style={{ width: '100%', height: 'clamp(250px, 50vw, 500px)' }}>
              <svg viewBox="-250 -180 500 360" style={{ width: '100%', height: '100%' }}>
                {/* SVG content remains the same */}
                <defs>
                  <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="40%" stopColor="#fbbf24" />
                    <stop offset="70%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#dc2626" />
                  </radialGradient>
                  <radialGradient id="earthGradient" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1e40af" />
                  </radialGradient>
                </defs>
                
                <ellipse cx="0" cy="0" rx="180" ry="120" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="8 4" />
                
                {[
                  { angle: 0, label: safeTranslations?.learnContent?.seasonMarkers?.springEquinox || 'Spring Equinox', date: 'March 21', color: '#86efac' },
                  { angle: 90, label: safeTranslations?.learnContent?.seasonMarkers?.summerSolstice || 'Summer Solstice', date: 'June 21', color: '#fbbf24' },
                  { angle: 180, label: safeTranslations?.learnContent?.seasonMarkers?.autumnEquinox || 'Autumn Equinox', date: 'Sept 23', color: '#f97316' },
                  { angle: 270, label: safeTranslations?.learnContent?.seasonMarkers?.winterSolstice || 'Winter Solstice', date: 'Dec 22', color: '#60a5fa' }
                ].map(({ angle, label, date, color }) => {
                  const pos = getOrbitPosition(angle);
                  const isActive = Math.abs(orbitAngle - angle) < 20 || Math.abs(orbitAngle - angle) > 340;
                  return (
                    <g key={angle}>
                      <circle cx={pos.x} cy={pos.y} r={isActive ? 6 : 4} fill={color} style={{ transition: 'all 0.3s' }} />
                      <text x={pos.x + (angle === 90 || angle === 270 ? 0 : (pos.x > 0 ? 18 : -18))} y={pos.y + (angle === 90 ? -25 : angle === 270 ? 35 : 5)} fill="white" fontSize="11" fontWeight={isActive ? '700' : '400'} textAnchor={angle === 90 || angle === 270 ? 'middle' : (pos.x > 0 ? 'start' : 'end')} opacity={isActive ? 1 : 0.7}>{label}</text>
                      <text x={pos.x + (angle === 90 || angle === 270 ? 0 : (pos.x > 0 ? 18 : -18))} y={pos.y + (angle === 90 ? -12 : angle === 270 ? 48 : 18)} fill={color} fontSize="10" textAnchor={angle === 90 || angle === 270 ? 'middle' : (pos.x > 0 ? 'start' : 'end')}>{date}</text>
                    </g>
                  );
                })}
                
                <circle cx="0" cy="0" r="35" fill="url(#sunGlow)" />
                <text x="0" y="58" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">{safeTranslations?.learnContent?.sun || 'Sun'} ☀️</text>
                
                <g transform={`translate(${position.x}, ${position.y})`}>
                  <line x1="0" y1="-40" x2="0" y2="40" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="4 3" transform={`rotate(${position.tilt})`} />
                  <g transform={`rotate(${position.tilt})`}>
                    <circle r="24" fill="url(#earthGradient)" />
                    <g transform={`rotate(${earthRotation})`}>
                      <ellipse cx="-6" cy="-6" rx="9" ry="7" fill="#22c55e" opacity="0.75" />
                      <ellipse cx="9" cy="4" rx="7" ry="9" fill="#22c55e" opacity="0.75" />
                      <ellipse cx="-8" cy="10" rx="5" ry="4" fill="#22c55e" opacity="0.6" />
                    </g>
                    <ellipse cx="0" cy="0" rx="24" ry="7" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
                    <ellipse cx="0" cy="-22" rx="8" ry="3" fill="rgba(255,255,255,0.8)" />
                    <ellipse cx="0" cy="22" rx="6" ry="2" fill="rgba(255,255,255,0.8)" />
                  </g>
                  <text y="45" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">{safeTranslations?.learnContent?.earth || 'Earth'} 🌍</text>
                  {Math.abs(position.tilt) > 5 && (
                    <text x={position.tilt > 0 ? 20 : -20} y="-20" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="600">{Math.abs(position.tilt).toFixed(1)}°</text>
                  )}
                </g>
              </svg>
            </div>
            
            {/* Controls - Responsive */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
              <button onClick={() => setIsPlaying(!isPlaying)} style={{ ...styles.button, background: isPlaying ? 'linear-gradient(to right, #dc2626, #b91c1c)' : 'linear-gradient(to right, #22c55e, #16a34a)', color: 'white' }}>
                {isPlaying ? (safeTranslations?.learnContent?.pause || '⏸️ Pause') : (safeTranslations?.learnContent?.play || '▶️ Play')}
              </button>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(255,255,255,0.1)', padding: '0.5rem 0.75rem', borderRadius: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', fontWeight: '500', color: 'black', whiteSpace: 'nowrap' }}>{safeTranslations?.learnContent?.speed || 'Speed'}:</span>
                {[0.5, 1, 2, 3].map(s => (
                  <button key={s} onClick={() => setSpeed(s)} style={{ padding: '0.375rem 0.625rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', fontWeight: '600', transition: 'all 0.3s', background: speed === s ? 'linear-gradient(to right, #6366f1, #9333ea)' : 'rgba(255,255,255,0.15)', color: speed === s ? 'white' : 'black' }}>{s}x</button>
                ))}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(255,255,255,0.1)', padding: '0.5rem 0.75rem', borderRadius: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', fontWeight: '500', color: 'black', whiteSpace: 'nowrap' }}>{safeTranslations?.learnContent?.jumpTo || 'Jump to'}:</span>
                {[
                  { season: 'spring', angle: 45, icon: '🌸' },
                  { season: 'summer', angle: 135, icon: '☀️' },
                  { season: 'autumn', angle: 225, icon: '🍂' },
                  { season: 'winter', angle: 315, icon: '❄️' }
                ].map(({ season, angle, icon }) => (
                  <button key={season} onClick={() => { setOrbitAngle(angle); setIsPlaying(false); }} title={season.charAt(0).toUpperCase() + season.slice(1)} style={{ padding: '0.375rem 0.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: 'clamp(1rem, 3vw, 1.125rem)', transition: 'all 0.3s', background: currentSeason === season ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)' }}>{icon}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* PART 2: Season Content Section */}
        <div style={styles.contentSection}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Current Season Card */}
            <div style={{ ...styles.seasonCard, background: seasonInfo.bgGradient }}>
              <div style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', marginBottom: '0.5rem' }}>{seasonInfo.icon}</div>
              <h3 style={{ fontSize: 'clamp(1.25rem, 4vw, 2rem)', fontWeight: 'bold', marginBottom: '0.5rem', wordBreak: 'break-word' }}>{seasonInfo.name}</h3>
              <p style={{ marginBottom: '0.75rem', opacity: 0.8, fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>{seasonInfo.months}</p>
              <p style={{ marginBottom: '0.75rem', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', lineHeight: '1.6' }}>{seasonInfo.description}</p>
              
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.55)', borderRadius: '0.75rem', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', lineHeight: '1.6' }}>
                <div style={{ marginBottom: '0.5rem', wordBreak: 'break-word' }}><strong>🎯 {safeTranslations?.learnContent?.keyEvent || 'Key Event'}:</strong> {seasonInfo.event}</div>
                <div style={{ marginBottom: '0.5rem', wordBreak: 'break-word' }}><strong>🌐 {safeTranslations?.learnContent?.hemisphere || 'Hemisphere'}:</strong> {seasonInfo.hemisphere}</div>
                <div style={{ wordBreak: 'break-word' }}><strong>📍 {safeTranslations?.learnContent?.orbitPosition || 'Orbit Position'}:</strong> {Math.round(orbitAngle)}°</div>
              </div>
            </div>
            
            {/* Key Facts */}
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>{safeTranslations?.learnContent?.keyFactsAboutRevolution || '📚 Key Facts About Revolution'}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {keyFacts.map(({ icon, title, fact, detail }, i) => (
                  <div key={i} style={{ padding: '0.75rem', borderRadius: '0.75rem', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', cursor: 'pointer', transition: 'all 0.3s', background: hoveredFact === i ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.05)', border: hoveredFact === i ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent' }} onMouseEnter={() => setHoveredFact(i)} onMouseLeave={() => setHoveredFact(null)} onTouchStart={() => setHoveredFact(i)}>
                    <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                      <span style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', flexShrink: 0 }}>{icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem', wordBreak: 'break-word' }}>{title}</div>
                        <div style={{ opacity: 0.85, wordBreak: 'break-word' }}>{fact}</div>
                      </div>
                    </div>
                    {hoveredFact === i && (
                      <div style={{ marginTop: '0.625rem', paddingTop: '0.625rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: 'clamp(0.7rem, 2vw, 0.75rem)', opacity: 0.8, lineHeight: '1.6', animation: 'fadeIn 0.3s ease-out', wordBreak: 'break-word' }}>💡 {detail}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <style>{`
        @keyframes pulse {
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
// PRACTICE MODE COMPONENT (Simplified for brevity)
// ============================================================================
// ============================================================================
const RevolutionPracticeMode: React.FC<{ additionalProps: any }> = ({ additionalProps }) => {
  const { translations } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const questions: Question[] = additionalProps?.customQuestions || [
    {
      id: 1,
      question: "In which direction does the Earth rotate on its axis?",
      options: ["East to West", "West to East", "North to South", "South to North"],
      correctAnswer: 1,
      explanation: "Earth rotates from West to East. This is why the Sun appears to rise in the East and set in the West. When viewed from above the North Pole, Earth rotates in a counter-clockwise direction.",
      difficulty: 'easy',
      topic: 'rotation'
    },
    {
      id: 2,
      question: "How long does it take for Earth to complete one rotation on its axis?",
      options: ["12 hours", "24 hours", "365 days", "30 days"],
      correctAnswer: 1,
      explanation: "Earth completes one full rotation on its axis in approximately 24 hours. This rotation causes the day-night cycle we experience. More precisely, it takes 23 hours, 56 minutes, and 4 seconds for one complete rotation.",
      difficulty: 'easy',
      topic: 'rotation'
    },
    {
      id: 3,
      question: "What causes day and night on Earth?",
      options: [
        "Earth's revolution around the Sun",
        "Earth's rotation on its axis",
        "The Moon blocking sunlight",
        "Clouds covering the Sun"
      ],
      correctAnswer: 1,
      explanation: "Day and night are caused by Earth's rotation on its axis. As Earth spins, the side facing the Sun experiences daytime with sunlight, while the side facing away from the Sun experiences nighttime with darkness.",
      difficulty: 'easy',
      topic: 'rotation'
    },
    {
      id: 4,
      question: "How long does it take for Earth to complete one revolution around the Sun?",
      options: ["24 hours", "30 days", "365 days and 6 hours", "12 months exactly"],
      correctAnswer: 2,
      explanation: "Earth takes approximately 365 days and 6 hours (365.25 days) to complete one revolution around the Sun. The extra 6 hours accumulate over four years to create a leap year with 366 days, which helps keep our calendar aligned with Earth's orbit.",
      difficulty: 'easy',
      topic: 'revolution'
    },
    {
      id: 5,
      question: "What is the main reason for seasons on Earth?",
      options: [
        "Distance from the Sun changes",
        "Earth's tilted axis and revolution around the Sun",
        "The Moon's gravitational pull",
        "Solar flares from the Sun"
      ],
      correctAnswer: 1,
      explanation: "Seasons occur primarily due to Earth's axis being tilted at 23.5° relative to its orbital plane. As Earth revolves around the Sun, different hemispheres receive varying amounts of direct sunlight throughout the year, creating the seasons.",
      difficulty: 'medium',
      topic: 'seasons'
    },
    {
      id: 6,
      question: "At what angle is Earth's axis tilted?",
      options: ["0 degrees", "23.5 degrees", "45 degrees", "90 degrees"],
      correctAnswer: 1,
      explanation: "Earth's axis is tilted at approximately 23.5 degrees from perpendicular to its orbital plane. This tilt remains constant as Earth orbits the Sun and is the primary cause of seasonal changes on our planet.",
      difficulty: 'medium',
      topic: 'seasons'
    },
    {
      id: 7,
      question: "Which statement about Earth's orbit is correct?",
      options: [
        "Earth's orbit is a perfect circle",
        "Earth's orbit is elliptical (oval-shaped)",
        "Earth's orbit is square-shaped",
        "Earth's orbit changes shape every year"
      ],
      correctAnswer: 1,
      explanation: "Earth's orbit around the Sun is elliptical, meaning it's oval-shaped rather than a perfect circle. However, the orbit is very close to circular. At its closest point (perihelion), Earth is about 147 million km from the Sun, and at its farthest (aphelion), it's about 152 million km away.",
      difficulty: 'medium',
      topic: 'revolution'
    },
    {
      id: 8,
      question: "Why do we have leap years?",
      options: [
        "To celebrate special events",
        "To account for Earth's extra ¼ day per orbit",
        "Because of the Moon's orbit",
        "To match other planet's calendars"
      ],
      correctAnswer: 1,
      explanation: "We have leap years because Earth takes 365.25 days (365 days and 6 hours) to orbit the Sun, not exactly 365 days. Every four years, these extra 6 hours per year add up to 24 hours (one full day), so we add February 29th to keep our calendar synchronized with Earth's actual position in its orbit.",
      difficulty: 'easy',
      topic: 'revolution'
    },
    {
      id: 9,
      question: "When the Northern Hemisphere experiences summer, what season is it in the Southern Hemisphere?",
      options: ["Summer", "Winter", "Spring", "Autumn"],
      correctAnswer: 1,
      explanation: "When the Northern Hemisphere experiences summer, the Southern Hemisphere experiences winter. This is because when the Northern Hemisphere is tilted toward the Sun (receiving more direct sunlight), the Southern Hemisphere is tilted away from the Sun (receiving less direct sunlight).",
      difficulty: 'medium',
      topic: 'seasons'
    },
    {
      id: 10,
      question: "What happens during an equinox?",
      options: [
        "Day is longer than night everywhere",
        "Night is longer than day everywhere",
        "Day and night are approximately equal in length",
        "The Sun doesn't rise at all"
      ],
      correctAnswer: 2,
      explanation: "During an equinox (spring or autumn), day and night are approximately equal in length everywhere on Earth - about 12 hours each. This happens when the Sun is directly above the equator, and neither hemisphere is tilted toward or away from the Sun.",
      difficulty: 'medium',
      topic: 'seasons'
    },
    {
      id: 11,
      question: "What is the summer solstice in the Northern Hemisphere?",
      options: [
        "The shortest day of the year",
        "The longest day of the year",
        "When day equals night",
        "The start of spring"
      ],
      correctAnswer: 1,
      explanation: "The summer solstice (around June 21st) is the longest day of the year in the Northern Hemisphere. On this day, the Northern Hemisphere is tilted most directly toward the Sun, resulting in the maximum amount of daylight and the shortest night of the year.",
      difficulty: 'easy',
      topic: 'seasons'
    },
    {
      id: 12,
      question: "At approximately what speed does Earth orbit the Sun?",
      options: ["30 km/s", "3 km/s", "300 km/s", "3,000 km/s"],
      correctAnswer: 0,
      explanation: "Earth orbits the Sun at an average speed of approximately 30 kilometers per second (or about 108,000 km/h). That's roughly 30 times faster than a speeding bullet! Despite this incredible speed, we don't feel the motion because everything on Earth is moving along with it.",
      difficulty: 'hard',
      topic: 'revolution'
    },
    {
      id: 13,
      question: "How far is Earth from the Sun on average?",
      options: [
        "50 million kilometers",
        "150 million kilometers",
        "500 million kilometers",
        "1 billion kilometers"
      ],
      correctAnswer: 1,
      explanation: "Earth is approximately 150 million kilometers (93 million miles) from the Sun on average. This distance is called an Astronomical Unit (AU) and is used to measure distances in our solar system. Light from the Sun takes about 8 minutes and 20 seconds to reach Earth at this distance.",
      difficulty: 'medium',
      topic: 'revolution'
    },
    {
      id: 14,
      question: "What would happen if Earth's axis was not tilted?",
      options: [
        "We would have more seasons",
        "We would have no seasons",
        "Days would be longer",
        "Earth would stop rotating"
      ],
      correctAnswer: 1,
      explanation: "If Earth's axis was not tilted (perpendicular to its orbit), we would have no seasons. Every location on Earth would experience the same amount of daylight throughout the year, and temperatures would remain relatively constant. The equator would always be hot, and the poles would always be cold.",
      difficulty: 'hard',
      topic: 'seasons'
    },
    {
      id: 15,
      question: "Which of these is NOT caused by Earth's rotation?",
      options: [
        "Day and night cycle",
        "Apparent movement of stars across the sky",
        "The four seasons",
        "Time zones"
      ],
      correctAnswer: 2,
      explanation: "The four seasons are NOT caused by Earth's rotation on its axis. Seasons are caused by Earth's tilted axis combined with its revolution around the Sun. Earth's rotation causes day/night, the apparent movement of celestial objects, and the need for time zones.",
      difficulty: 'hard',
      topic: 'rotation'
    }
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #0f172a, #581c87, #1e293b)',
      color: 'white',
      padding: '2rem',
    },
    card: {
      background: 'rgba(30, 41, 59, 0.5)',
      backdropFilter: 'blur(8px)',
      borderRadius: '1.5rem',
      padding: '2rem',
      border: '1px solid rgba(168, 85, 247, 0.3)',
      marginBottom: '1.5rem',
    },
  };

  if (quizCompleted) {
    return (
      <div style={styles.container}>
        <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
          <div style={styles.card}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '6rem', margin: '0 auto 1rem' }}>
                <TrophyIcon size={96} color="#facc15" />
              </div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {translations?.practiceMode?.quizCompleted || "Quiz Completed!"}
              </h1>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4ade80' }}>
                {translations?.practiceMode?.excellent || "Excellent Work! 🌟"}
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                {translations?.practiceMode?.finalScore || "Final Score"}: {score}/{questions.length}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div style={styles.container}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div style={styles.card}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
            {currentQ.question}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {currentQ.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = index === currentQ.correctAnswer;
              const showCorrect = showExplanation && isCorrectAnswer;
              const showIncorrect = showExplanation && isSelected && !isCorrectAnswer;

              return (
                <button
                  key={index}
                  onClick={() => !showExplanation && setSelectedAnswer(index)}
                  disabled={showExplanation}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    border: `2px solid ${showCorrect ? '#22c55e' : showIncorrect ? '#ef4444' : isSelected ? '#a78bfa' : '#475569'}`,
                    background: 'rgba(255,255,255,0.9)',
                    color: 'black',
                    cursor: showExplanation ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '2rem',
                      height: '2rem',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      border: '2px solid',
                      background: showCorrect ? '#22c55e' : showIncorrect ? '#ef4444' : isSelected ? '#a78bfa' : '#64748b',
                      color: 'white',
                    }}>
                      {showCorrect ? <CheckCircleIcon size={20} color="white" /> : showIncorrect ? <XCircleIcon size={20} color="white" /> : String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div style={{
              borderRadius: '0.75rem',
              padding: '1.25rem',
              border: '2px solid',
              borderColor: selectedAnswer === currentQ.correctAnswer ? '#22c55e' : '#ef4444',
              background: selectedAnswer === currentQ.correctAnswer ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              marginBottom: '1.5rem',
              animation: 'fadeIn 0.3s ease-out',
            }}>
              <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                {selectedAnswer === currentQ.correctAnswer ? (
                  <CheckCircleIcon size={24} color="#22c55e" />
                ) : (
                  <XCircleIcon size={24} color="#ef4444" />
                )}
                <div>
                  <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.5rem', color: selectedAnswer === currentQ.correctAnswer ? '#22c55e' : '#ef4444' }}>
                    {selectedAnswer === currentQ.correctAnswer ? (translations?.practiceMode?.correct || 'Correct! 🎉') : (translations?.practiceMode?.notQuiteRight || 'Not quite right')}
                  </h3>
                  <p style={{ lineHeight: '1.6' }}>{currentQ.explanation}</p>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {!showExplanation ? (
              <button
                onClick={() => {
                  if (selectedAnswer === null) return;
                  setShowExplanation(true);
                  if (selectedAnswer === currentQ.correctAnswer) {
                    setScore(score + 1);
                    setStreak(streak + 1);
                  } else {
                    setStreak(0);
                  }
                }}
                disabled={selectedAnswer === null}
                style={{
                  flex: 1,
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  border: 'none',
                  cursor: selectedAnswer === null ? 'not-allowed' : 'pointer',
                  background: selectedAnswer === null ? '#64748b' : 'linear-gradient(to right, #a855f7, #ec4899)',
                  color: selectedAnswer === null ? '#94a3b8' : 'white',
                }}
              >
                <CheckCircleIcon size={20} />
                {translations?.practiceMode?.submitAnswer || "Submit Answer"}
              </button>
            ) : (
              <button
                onClick={() => {
                  if (currentQuestion < questions.length - 1) {
                    setCurrentQuestion(currentQuestion + 1);
                    setSelectedAnswer(null);
                    setShowExplanation(false);
                  } else {
                    setQuizCompleted(true);
                  }
                }}
                style={{
                  flex: 1,
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  background: 'linear-gradient(to right, #3b82f6, #a855f7)',
                  color: 'white',
                }}
              >
                {currentQuestion < questions.length - 1 
                  ? (translations?.practiceMode?.nextQuestion || 'Next Question')
                  : (translations?.practiceMode?.viewResults || 'View Results')}
              </button>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// REAL WORLD MODE COMPONENT (Simplified for brevity)
// ============================================================================
const RevolutionRealWorld: React.FC<{ additionalProps: any }> = ({ additionalProps }) => {
  const { translations } = useLanguage();
  const [currentScenario, setCurrentScenario] = useState<number>(0);

  const scenarios: RealWorldExample[] = additionalProps?.customScenarios || [
    {
      id: 1,
      title: "Planning an International Cricket Match",
      icon: "🏏",
      difficulty: "Easy",
      context: "India is playing a cricket match against Australia. The match in Sydney starts at 10:00 AM local time.",
      question: "If Sydney is 4.5 hours ahead of India (IST), what time should Indian fans wake up to watch the live match?",
      realWorldConnection: "Time zones exist because Earth rotates from West to East. Countries in the east experience sunrise earlier than those in the west.",
      solution: "Indian fans should wake up at 5:30 AM IST to watch the match live.",
      explanation: "Since Sydney is 4.5 hours ahead of India: When it's 10:00 AM in Sydney, it's 5:30 AM in India. This happens because Earth rotates from West to East, so eastern locations experience sunrise and sunset earlier.",
      tips: [
        "Countries east of India have later times",
        "Time zones are created by Earth's rotation"
      ]
    },
    {
      id: 2,
      title: "Farmer's Planting Season",
      icon: "🌾",
      difficulty: "Medium",
      context: "Ravi is a farmer in Punjab. He knows that wheat grows best when planted after the monsoon rains, during the cooler months with shorter days.",
      question: "Should Ravi plant wheat in June (summer) or November (after monsoon)? Explain using your knowledge of seasons.",
      realWorldConnection: "Seasons occur due to Earth's tilted axis. Different crops grow better in different seasons based on temperature and daylight hours.",
      solution: "Ravi should plant wheat in November (after monsoon).",
      explanation: "Wheat should be planted in November because:\n\n1. Temperature: November marks the beginning of winter in Northern India. Wheat grows best in cooler temperatures (15-20°C).\n\n2. Day Length: In November, days are getting shorter. Wheat requires shorter day length for optimal growth.\n\n3. Season Cycle: Due to Earth's tilted axis, in June the Northern Hemisphere experiences longer, hotter days. In November, temperatures cool down and days shorten - perfect for wheat.\n\n4. Monsoon Benefits: The soil retains moisture from monsoon rains.",
      tips: [
        "Summer (June): Hot, long days - not suitable for wheat",
        "Winter (November): Cool, shorter days - perfect for wheat",
        "Seasons affect crop growth patterns"
      ]
    },
    {
      id: 3,
      title: "Solar Panel Installation",
      icon: "☀️",
      difficulty: "Medium",
      context: "A family in Delhi wants to install solar panels on their roof. They want to know which direction to face the panels and whether panels will generate the same energy in summer and winter.",
      question: "In which direction should they install the panels, and will energy generation be different in summer vs winter?",
      realWorldConnection: "The Sun's apparent path changes with seasons due to Earth's tilt. This affects solar energy potential throughout the year.",
      solution: "Panels should face South. Summer will generate more energy than winter.",
      explanation: "Direction: Solar panels should face South in the Northern Hemisphere.\n\nWhy South? In Northern Hemisphere, the Sun's path is through the southern part of the sky. South-facing panels receive maximum sunlight throughout the day.\n\nSeasonal Variation:\n\nSummer (June): Northern Hemisphere tilts towards the Sun. Sun is higher in the sky, longer days (14-15 hours), more intense sunlight. Higher energy generation.\n\nWinter (December): Northern Hemisphere tilts away from the Sun. Sun is lower in the sky, shorter days (10-11 hours), less intense sunlight. Lower energy generation.\n\nThe difference can be 40-60% less energy in winter compared to summer.",
      tips: [
        "North faces panels away from Sun's path",
        "Summer has ~4 hours more sunlight than winter",
        "Earth's tilt causes seasonal variation"
      ]
    },
    {
      id: 4,
      title: "Planning a Solar Eclipse Trip",
      icon: "🌑",
      difficulty: "Hard",
      context: "A total solar eclipse will be visible from a narrow path across India on April 20th. Your family wants to travel from Mumbai to witness it. The path of totality passes through Varanasi.",
      question: "Your flight lands in Varanasi at 11:00 AM, and the eclipse totality lasts from 11:45 AM to 11:48 AM (3 minutes). Is this enough time? What precautions should you take?",
      realWorldConnection: "Solar eclipses occur when the Moon passes between Earth and the Sun. The shadow moves across Earth due to both Earth's rotation and the Moon's motion.",
      solution: "Yes, there's enough time, but it's tight. Proper planning and safety equipment are essential.",
      explanation: "Timing Analysis: Flight lands at 11:00 AM, totality at 11:45 AM gives 45 minutes. However, airport exit (15-20 min) plus travel (20-30 min) leaves only 5-10 minutes buffer - RISKY! Recommendation: Arrive the night before.\n\nWhy Totality is Short: The Moon's shadow moves at ~2,000 km/h across Earth. The shadow is only 100-200 km wide.\n\nSafety Precautions:\nBefore Totality: NEVER look directly at the Sun. Use certified solar eclipse glasses (ISO 12312-2).\n\nDuring Totality: Safe to look directly when Sun is completely covered. Remove eclipse glasses to see corona.\n\nAfter Totality: Immediately put eclipse glasses back on. Even 1% of the Sun visible can permanently damage your eyes.",
      tips: [
        "Plan to arrive a day early",
        "Eclipse glasses are MANDATORY",
        "Never look at partial phases without protection",
        "Totality is the only safe time to look directly",
        "Moon's shadow moves at ~2,000 km/h"
      ]
    },
    {
      id: 5,
      title: "Stargazing Adventure Planning",
      icon: "⭐",
      difficulty: "Medium",
      context: "You want to see the Orion constellation, which is prominent in the northern winter sky. You're planning a stargazing trip from Bangalore.",
      question: "In which months will Orion be best visible in the evening sky? Why does this change?",
      realWorldConnection: "Different constellations are visible in different months because Earth revolves around the Sun, changing our nighttime view of space.",
      solution: "Orion is best visible in December and January evenings.",
      explanation: "Best Viewing: Orion is most visible during December and January.\n\nWhy Visibility Changes: As Earth revolves around the Sun (365 days), our nighttime view points toward different parts of space.\n\nDecember-January (BEST): Earth's nightside faces the direction of Orion. Orion rises in the East around sunset and is visible throughout the night.\n\nJune (WORST): Earth has revolved to opposite side of Sun. Orion is in the daytime sky, completely invisible at night.\n\nThe Science: Earth completes 360° in 365 days (~1° per day). Each month, our nighttime view shifts by about 30°. Each constellation has a ~6-month visibility season.",
      tips: [
        "Orion is a winter constellation",
        "Each constellation is best visible for ~3-4 months",
        "Use a stargazing app for exact times",
        "New moon nights provide darkest skies"
      ]
    },
    {
      id: 6,
      title: "Choosing Holiday Destination",
      icon: "✈️",
      difficulty: "Easy",
      context: "Your family wants to take a winter vacation in December to escape the cold weather in Delhi and enjoy warm, sunny beaches.",
      question: "Should you go to Australia or Sri Lanka? Explain using your knowledge of seasons in different hemispheres.",
      realWorldConnection: "Seasons are opposite in Northern and Southern Hemispheres due to Earth's axial tilt as it revolves around the Sun.",
      solution: "Go to Australia! It will be summer there in December.",
      explanation: "Best Choice: Australia will be perfect for a warm beach vacation in December!\n\nAustralia (Southern Hemisphere): December = SUMMER. Temperature: 25-35°C (warm and sunny). Perfect beach weather. Why? Southern Hemisphere tilts TOWARDS the Sun in December.\n\nSri Lanka (Near Equator): December = Pleasant weather (26-30°C). However, it's monsoon season on east coast. Not as dramatic temperature difference.\n\nThe Science: In December, North Pole tilts AWAY from Sun → Winter in Northern Hemisphere. South Pole tilts TOWARDS Sun → Summer in Southern Hemisphere.\n\nPractical Application: Escaping Northern winter? Go South (Australia, New Zealand, Argentina). Want consistent weather? Go near Equator.",
      tips: [
        "December = Summer in Australia, Winter in India",
        "Countries near equator have less seasonal variation",
        "This happens due to Earth's 23.5° tilt",
        "Seasons are reversed across hemispheres"
      ]
    },
    {
      id: 7,
      title: "Scheduling International Business Meeting",
      icon: "💼",
      difficulty: "Medium",
      context: "Your company needs to schedule a video conference with teams in New York (USA), London (UK), Mumbai (India), and Tokyo (Japan). Everyone needs to attend during working hours (9 AM - 6 PM local time).",
      question: "What time should the meeting be scheduled? Is there a time that works for everyone during their working hours?",
      realWorldConnection: "Time zones exist because Earth rotates continuously. As different parts of Earth face the Sun, they experience different times of day.",
      solution: "There's NO perfect time for all four cities during standard working hours due to Earth's rotation.",
      explanation: "Time Zone Analysis:\n\nTime Differences from Mumbai (IST):\n- London: 5.5 hours behind Mumbai\n- New York: 10.5 hours behind Mumbai\n- Tokyo: 3.5 hours ahead of Mumbai\n\nTrying 2:30 PM Mumbai time:\n- Mumbai: 2:30 PM ✓ (working hours)\n- London: 9:00 AM ✓ (working hours)\n- Tokyo: 6:00 PM ✓ (end of work day)\n- New York: 4:00 AM ✗ (too early!)\n\nThe Challenge: NO perfect time for all four cities!\n\nWhy? Earth rotates 360° in 24 hours. Mumbai and New York are separated by ~10.5 hours. When it's mid-afternoon in Mumbai, it's still nighttime in New York.\n\nReality: Companies often rotate meeting times to share the inconvenience, or split into two meetings.",
      tips: [
        "Earth's rotation creates time zones",
        "Full rotation = 24 hours = 360°",
        "15° longitude = 1 hour time difference",
        "International collaboration requires compromise"
      ]
    },
    {
      id: 8,
      title: "Photography - Golden Hour Planning",
      icon: "📸",
      difficulty: "Medium",
      context: "You're a photographer planning to capture the Taj Mahal during 'golden hour' - the period shortly after sunrise when the light is warm and soft. You want to do this in both summer and winter.",
      question: "Will golden hour be at the same time in summer and winter? How should you plan differently for each season?",
      realWorldConnection: "Sunrise time changes throughout the year due to Earth's tilted axis and revolution around the Sun, affecting the length of days.",
      solution: "No, golden hour timing changes significantly. Summer sunrise is earlier (~5:30 AM), winter sunrise is later (~7:00 AM).",
      explanation: "Golden Hour Timing Changes:\n\nSummer (June): Sunrise: ~5:30 AM, Golden hour: 5:30-6:30 AM. Northern Hemisphere tilts toward Sun. Longer days (14+ hours of daylight).\n\nWinter (December): Sunrise: ~7:00 AM, Golden hour: 7:00-8:00 AM. Northern Hemisphere tilts away from Sun. Shorter days (10-11 hours of daylight).\n\nTime Difference: About 1.5 hours difference in sunrise time!\n\nPlanning Considerations:\nSummer: Need to wake up very early (5:00 AM), less crowded, different shadows, can be hot and hazy.\nWinter: More reasonable wake-up time (6:30 AM), clearer air, better visibility, different lighting angle.\n\nWhy This Happens: Earth's 23.5° tilt means the Sun's path changes throughout the year. In summer, the Sun rises earlier and travels a higher arc. In winter, it rises later and travels a lower arc.",
      tips: [
        "Sunrise time varies by ~1-2 hours through the year",
        "Use apps like PhotoPills to plan exact timing",
        "Winter light is often clearer",
        "Summer provides longer shooting windows",
        "Sun position affects shadow direction"
      ]
    },
    {
      id: 9,
      title: "Understanding Midnight Sun",
      icon: "🌞",
      difficulty: "Hard",
      context: "Your friend is traveling to Norway in June and sends you a photo at 11:00 PM showing full daylight outside. They're confused about why the Sun hasn't set.",
      question: "Explain the 'Midnight Sun' phenomenon. Why does this happen in places like Norway during summer?",
      realWorldConnection: "The Midnight Sun occurs in polar regions due to Earth's axial tilt. During summer, regions near the poles experience 24-hour daylight.",
      solution: "The Midnight Sun happens because Earth's tilt keeps polar regions facing the Sun continuously during their summer.",
      explanation: "The Midnight Sun Explained:\n\nWhat Happens: In summer, locations above the Arctic Circle (66.5°N) experience continuous daylight for weeks or months. The Sun never sets completely.\n\nWhy This Happens:\n1. Earth's Tilt: Earth's axis is tilted at 23.5°\n2. Summer Position: During Northern summer (June), the North Pole tilts toward the Sun\n3. Continuous Exposure: As Earth rotates, the Arctic region remains in sunlight for the entire 24-hour rotation\n4. Sun's Path: Instead of rising and setting, the Sun circles around the horizon\n\nLocations & Duration:\n- Arctic Circle (66.5°N): At least 1 day of continuous sun\n- Tromsø, Norway (69°N): ~2 months of midnight sun\n- North Pole (90°N): ~6 months of continuous daylight!\n\nThe Opposite - Polar Night: In winter (December), the same regions experience continuous darkness.\n\nPractical Effects: Sleep disruption, unique tourism opportunity, affects wildlife and plant growth.",
      tips: [
        "Only occurs above Arctic/Antarctic Circles (66.5°)",
        "Duration increases closer to poles",
        "Winter brings opposite: continuous darkness",
        "Caused by Earth's 23.5° tilt",
        "Native populations have adapted over millennia"
      ]
    },
    {
      id: 10,
      title: "Optimizing Satellite Communication",
      icon: "🛰️",
      difficulty: "Hard",
      context: "A telecommunications company wants to position a geostationary satellite to provide continuous communication coverage for India. The satellite needs to appear stationary from Earth's surface.",
      question: "Why must the satellite orbit at exactly 35,786 km altitude above the equator? What does this have to do with Earth's rotation?",
      realWorldConnection: "Geostationary satellites orbit at the exact speed matching Earth's rotation, appearing fixed in the sky. This is crucial for communications, weather monitoring, and GPS.",
      solution: "At 35,786 km, the satellite's orbital period exactly matches Earth's 24-hour rotation, keeping it fixed over one location.",
      explanation: "Geostationary Orbit Explained:\n\nThe Magic Number: 35,786 km\nAt this specific altitude:\n- Orbital period = 24 hours (same as Earth's rotation)\n- Satellite orbits at ~3.07 km/s\n- Appears stationary from Earth's surface\n\nThe Physics:\n1. Orbital Mechanics: The farther from Earth, the slower a satellite orbits. Low orbit (400 km): 90 minutes. Geostationary (35,786 km): 24 hours.\n\n2. Matching Earth's Rotation: Earth rotates 360° in 24 hours. At 35,786 km, gravity and centrifugal force balance perfectly. Satellite completes one orbit in exactly 24 hours. Both rotate together - satellite appears fixed.\n\n3. Must Be Above Equator: If not, it would appear to move north-south.\n\nPractical Applications:\n- Communication: Dish antennas can point at fixed position\n- Weather Satellites: INSAT monitors India continuously\n- Broadcasting: TV satellites (Tata Sky, Dish TV)\n\nLimitations: Polar regions not covered well, signal delay (~0.24 seconds), limited slots available.",
      tips: [
        "Only ONE altitude works for geostationary orbit",
        "Must orbit above the equator",
        "Appears motionless from Earth's surface",
        "Matches Earth's 24-hour rotation exactly",
        "Critical for telecommunications and weather"
      ]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Hard': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
    }
  };

  const handlePrevious = () => {
    if (currentScenario > 0) {
      setCurrentScenario(currentScenario - 1);
    }
  };

  const scenario = scenarios[currentScenario];

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #020617, #1e1b4b, #0f172a)',
      color: 'white',
      padding: '2rem',
    },
    card: {
      background: 'rgba(30, 41, 59, 0.5)',
      backdropFilter: 'blur(8px)',
      borderRadius: '1.5rem',
      padding: '2rem',
      border: '1px solid rgba(168, 85, 247, 0.3)',
      marginBottom: '1.5rem',
    },
  };

  return (
    <div style={styles.container}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', background: 'linear-gradient(to right, #60a5fa, #a78bfa, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {translations?.realWorld?.header || "Real World Applications"}
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#93c5fd', marginBottom: '0.5rem' }}>
            {translations?.realWorld?.subtitle || "Apply your knowledge to solve real-life scenarios!"}
          </p>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.5rem' }}>
            Scenario {currentScenario + 1} of {scenarios.length}
          </p>
        </div>

        {/* Scenario Card */}
        <div style={styles.card}>
          {/* Icon, Title and Difficulty */}
          <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '4rem' }}>{scenario.icon}</div>
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#c4b5fd', marginBottom: '0.5rem' }}>{scenario.title}</h2>
              </div>
            </div>
            <span style={{ 
              fontSize: '0.875rem', 
              padding: '0.5rem 1rem', 
              borderRadius: '9999px', 
              background: scenario.difficulty === 'Easy' ? 'rgba(34, 197, 94, 0.2)' : scenario.difficulty === 'Medium' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(239, 68, 68, 0.2)', 
              color: scenario.difficulty === 'Easy' ? '#86efac' : scenario.difficulty === 'Medium' ? '#fde047' : '#fca5a5', 
              border: scenario.difficulty === 'Easy' ? '1px solid rgba(34, 197, 94, 0.3)' : scenario.difficulty === 'Medium' ? '1px solid rgba(234, 179, 8, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
              whiteSpace: 'nowrap' as const,
            }}>
              {scenario.difficulty}
            </span>
          </div>

          {/* Context */}
          <div style={{ background: 'rgba(59, 130, 246, 0.2)', borderRadius: '1rem', padding: '1.25rem', border: '1px solid rgba(59, 130, 246, 0.3)', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.5rem', color: '#93c5fd', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <InfoIcon size={20} color="#93c5fd" />
              {translations?.realWorld?.context || 'Context'}
            </h3>
            <p style={{ color: '#bfdbfe', lineHeight: '1.6' }}>{scenario.context}</p>
          </div>

          {/* Real World Connection */}
          <div style={{ background: 'rgba(34, 197, 94, 0.2)', borderRadius: '1rem', padding: '1.25rem', border: '1px solid rgba(34, 197, 94, 0.3)', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.5rem', color: '#86efac', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GlobeIcon size={20} color="#86efac" />
              {translations?.realWorld?.realWorldConnection || 'Real-World Connection'}
            </h3>
            <p style={{ color: '#bbf7d0', lineHeight: '1.6' }}>{scenario.realWorldConnection}</p>
          </div>

          {/* Solution - Always visible */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.5s ease-out' }}>
              {/* Quick Answer */}
              <div style={{ background: 'linear-gradient(to right, rgba(251, 191, 36, 0.3), rgba(249, 115, 22, 0.3))', borderRadius: '1rem', padding: '1.25rem', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.75rem', color: '#fde047', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  ✓ {translations?.realWorld?.quickAnswer || 'Quick Answer'}
                </h3>
                <p style={{ color: '#fef3c7', fontSize: '1.125rem', fontWeight: '600' }}>{scenario.solution}</p>
              </div>

              {/* Detailed Explanation */}
              <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(71, 85, 105, 0.3)' }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '1rem', color: '#e2e8f0' }}>
                  {translations?.realWorld?.detailedExplanation || 'Detailed Explanation:'}
                </h3>
                <div style={{ color: '#cbd5e1', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                  {scenario.explanation}
                </div>
              </div>

              {/* Tips */}
              <div style={{ background: 'linear-gradient(to right, rgba(6, 182, 212, 0.3), rgba(59, 130, 246, 0.3))', borderRadius: '1rem', padding: '1.25rem', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.75rem', color: '#67e8f9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {translations?.realWorld?.keyTakeaways || '💡 Key Takeaways'}
                </h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: 0, paddingLeft: 0, listStyle: 'none' }}>
                  {scenario.tips.map((tip: string, index: number) => (
                    <li key={index} style={{ color: '#a5f3fc', display: 'flex', alignItems: 'start', gap: '0.5rem' }}>
                      <span style={{ color: '#22d3ee', marginTop: '0.25rem' }}>•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
          <button
            onClick={handlePrevious}
            disabled={currentScenario === 0}
            style={{
              flex: 1,
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              transition: 'all 0.3s',
              border: 'none',
              cursor: currentScenario === 0 ? 'not-allowed' : 'pointer',
              background: currentScenario === 0 
                ? 'rgba(71, 85, 105, 1)' 
                : 'rgba(71, 85, 105, 1)',
              color: currentScenario === 0 ? '#94a3b8' : 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
            onMouseEnter={(e) => {
              if (currentScenario !== 0) {
                e.currentTarget.style.background = 'rgba(51, 65, 85, 1)';
              }
            }}
            onMouseLeave={(e) => {
              if (currentScenario !== 0) {
                e.currentTarget.style.background = 'rgba(71, 85, 105, 1)';
              }
            }}
          >
            {translations?.realWorld?.previous || '← Previous'}
          </button>

          <button
            onClick={handleNext}
            disabled={currentScenario === scenarios.length - 1}
            style={{
              flex: 1,
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              transition: 'all 0.3s',
              border: 'none',
              cursor: currentScenario === scenarios.length - 1 ? 'not-allowed' : 'pointer',
              background: currentScenario === scenarios.length - 1
                ? 'rgba(71, 85, 105, 1)'
                : 'linear-gradient(to right, #a855f7, #ec4899)',
              color: currentScenario === scenarios.length - 1 ? '#94a3b8' : 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
            onMouseEnter={(e) => {
              if (currentScenario !== scenarios.length - 1) {
                e.currentTarget.style.background = 'linear-gradient(to right, #9333ea, #db2777)';
              }
            }}
            onMouseLeave={(e) => {
              if (currentScenario !== scenarios.length - 1) {
                e.currentTarget.style.background = 'linear-gradient(to right, #a855f7, #ec4899)';
              }
            }}
          >
            {currentScenario === scenarios.length - 1 
              ? (translations?.realWorld?.complete || 'Complete! 🎉')
              : (translations?.realWorld?.nextScenario || 'Next Scenario →')}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// NAVBAR COMPONENT
// ============================================================================
interface NavbarProps {
    mode: ModeType;
    setMode: (mode: ModeType) => void;
    showModeSelector?: boolean;
    enabledModes?: ModeType[];
}

const Navbar: React.FC<NavbarProps> = ({ mode, setMode, showModeSelector = true, enabledModes = ["learn", "practice", "applications"] }) => {
    const { translations } = useLanguage();
    const safeTranslations = translations || translationsData["en"];

    if (!showModeSelector) return null;

    const styles = {
        nav: {
            position: 'fixed' as const,
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            background: 'linear-gradient(to right, #f0fdfa, #faf5ff, #f0fdfa)',
            borderBottom: '1px solid rgba(20, 184, 166, 0.2)',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(8px)',
        },
        container: {
            maxWidth: '90rem',
            margin: '0 auto',
            padding: '0 1rem',
        },
        content: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '4rem',
        },
        logo: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
        },
        buttons: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
        },
        button: {
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'all 0.2s',
            border: 'none',
            cursor: 'pointer',
            minHeight: '40px',
        },
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.container}>
                <div style={styles.content}>
                    <div style={styles.logo}>
                        <GlobeIcon size={24} color="#14b8a6" />
                        <span style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#0f766e' }}>
                            {safeTranslations?.nav?.logo || 'Revolution of the Earth'}
                        </span>
                    </div>

                    <div style={styles.buttons}>
                        {enabledModes.includes("learn") && (
                            <button
                                onClick={() => setMode("learn")}
                                style={{
                                    ...styles.button,
                                    background: mode === "learn" 
                                        ? 'linear-gradient(to right, #14b8a6, #a855f7)' 
                                        : 'transparent',
                                    color: mode === "learn" ? 'white' : '#0f766e',
                                }}
                            >
                                {safeTranslations?.nav?.tabs?.learn || 'Learn'}
                            </button>
                        )}

                        {enabledModes.includes("practice") && (
                            <button
                                onClick={() => setMode("practice")}
                                style={{
                                    ...styles.button,
                                    background: mode === "practice" 
                                        ? 'linear-gradient(to right, #14b8a6, #a855f7)' 
                                        : 'transparent',
                                    color: mode === "practice" ? 'white' : '#7c3aed',
                                }}
                            >
                                {safeTranslations?.nav?.tabs?.practice || 'Practice'}
                            </button>
                        )}

                        {enabledModes.includes("applications") && (
                            <button
                                onClick={() => setMode("applications")}
                                style={{
                                    ...styles.button,
                                    background: mode === "applications" 
                                        ? 'linear-gradient(to right, #14b8a6, #a855f7)' 
                                        : 'transparent',
                                    color: mode === "applications" ? 'white' : '#374151',
                                }}
                            >
                                {safeTranslations?.nav?.tabs?.applications || 'Real World'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const RevolutionOfEarthTool: React.FC<RevolutionOfEarthToolProps> = ({ 
    props = {},
    setStepDetails,
    stopAutoNext,
    setStopAutoNext 
}) => {
    // Extract props with defaults
    const {
        initialMode = "learn",
        showModeSelector = true,
        enabledModes = ["learn", "practice", "applications"],
        language = "en",
        additionalProps = {},
    } = props;

    const [mode, setMode] = useState<ModeType>(initialMode);
    const [currentLanguage, setCurrentLanguage] = useState<Language>(language);

    const t = useCallback((key: string): string => {
        const keys = key.split(".");
        let value = translationsData[currentLanguage];
        for (const k of keys) {
            if (value && value[k]) value = value[k];
            else {
                let fallbackValue = translationsData["en"];
                for (const k2 of keys) {
                    if (fallbackValue && fallbackValue[k2]) fallbackValue = fallbackValue[k2];
                    else return key;
                }
                return typeof fallbackValue === "string" ? fallbackValue : key;
            }
        }
        return typeof value === "string" ? value : key;
    }, [currentLanguage]);

    const translations = translationsData[currentLanguage] || translationsData["en"];

    const languageContextValue: LanguageContextType = {
        language: currentLanguage,
        setLanguage: setCurrentLanguage,
        t,
        translations,
    };

    // Update step details
    useEffect(() => {
        if (setStepDetails) {
            setStepDetails({
                currentStep: 1,
                totalSteps: 1,
                mode,
            });
        }
    }, [mode, setStepDetails]);

    return (
        <LanguageContext.Provider value={languageContextValue}>
            <div style={{ fontFamily: 'Poppins, "Noto Sans", sans-serif' }}>
                <Navbar 
                    mode={mode} 
                    setMode={setMode} 
                    showModeSelector={showModeSelector}
                    enabledModes={enabledModes}
                />
                <div style={{ paddingTop: showModeSelector ? '4rem' : '0' }}>
                    {mode === "learn" && <RevolutionLearnMode additionalProps={additionalProps} />}
                    {mode === "practice" && <RevolutionPracticeMode additionalProps={additionalProps} />}
                    {mode === "applications" && <RevolutionRealWorld additionalProps={additionalProps} />}
                </div>
            </div>
        </LanguageContext.Provider>
    );
};

export default RevolutionOfEarthTool;