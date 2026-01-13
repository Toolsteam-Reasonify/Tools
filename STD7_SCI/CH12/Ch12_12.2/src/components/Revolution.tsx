import React, {
    useState,
    useEffect,
    useRef,
    createContext,
    useContext,
    useCallback,
} from "react";
import type { ReactNode } from "react";
import {
    Globe, Target,
    Play, Pause, RotateCcw,
    ChevronLeft, ChevronRight, BookOpen, Lightbulb, Globe2, Sun, Moon, Eye, Thermometer,
    CheckCircle, XCircle, Award, ArrowRight, Star, Trophy,
    Info, Zap
} from "lucide-react";

// ============================================================================
// Language Context & Translations
// ============================================================================

// Simple useTranslation stub
const useTranslation = () => {
    return {
        t: (key: string, _options?: Record<string, unknown>): string => {
            return key;
        },
    };
};

export type Language = "en" | "hi" | "gu";

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
            placeholder: 'Revolution Learn Content Coming Soon...'
        },
        practice: {
            header: 'Practice Revolution',
            subtitle: 'Test your knowledge',
            placeholder: 'Revolution Practice Quiz Coming Soon...'
        },
        realWorld: {
            header: 'Real World Revolution',
            subtitle: 'Revolution impacts our lives',
            placeholder: 'Revolution Real World Examples Coming Soon...'
        },
        common: {
            comingSoon: "Coming Soon",
            stayTuned: "Stay tuned for exciting interactive content!"
        }
    },
    hi: {
        nav: {
            logo: "à¤ªà¥ƒà¤¥à¥à¤µà¥€ à¤•à¤¾ à¤ªà¤°à¤¿à¤•à¥à¤°à¤®à¤£",
            tabs: {
                learn: "à¤¸à¥€à¤–à¥‡à¤‚",
                practice: "à¤…à¤­à«àª¯àª¾àª¸",
                applications: "à¤µà¤¾à¤¸à¥à¤¤à¤µà¤¿à¤• à¤¦à¥à¤¨à¤¿à¤¯à¤¾",
            },
        },
        learn: {
            header: 'à¤ªà¥ƒà¤¥à¥à¤µà¥€ à¤•à¤¾ à¤ªà¤°à¤¿à¤•à¥à¤°à¤®à¤£',
            subtitle: 'à¤¸à¥‚à¤°à¥à¤¯ à¤•à¥‡ à¤šà¤¾à¤°à¥‹à¤‚ à¤“à¤° à¤ªà¥ƒà¤¥à¥à¤µà¥€ à¤•à¥€ à¤¯à¤¾à¤¤à¥à¤°à¤¾',
            placeholder: 'à¤ªà¤°à¤¿à¤•à¥à¤°à¤®à¤£ à¤¸à¥€à¤–à¤¨à¥‡ à¤•à¥€ à¤¸à¤¾à¤®à¤—à¥à¤°à¥€ à¤œà¤²à¥à¤¦ à¤¹à¥€ à¤† à¤°à¤¹à¥€ à¤¹à¥ˆ...'
        },
        practice: {
            header: 'à¤ªà¤°à¤¿à¤•à¥à¤°à¤®à¤£ à¤•à¤¾ à¤…à¤­à¥à¤¯à¤¾à¤¸ à¤•à¤°à¥‡à¤‚',
            subtitle: 'à¤…à¤ªà¤¨à¥‡ à¤œà¥à¤žà¤¾à¤¨ à¤•à¤¾ à¤ªà¤°à¥€à¤•à¥à¤·à¤£ à¤•à¤°à¥‡à¤‚',
            placeholder: 'à¤ªà¤°à¤¿à¤•à¥à¤°à¤®à¤£ à¤…à¤­à¥à¤¯à¤¾à¤¸ à¤ªà¥à¤°à¤¶à¥à¤¨à¥‹à¤¤à¥à¤¤à¤°à¥€ à¤œà¤²à¥à¤¦ à¤¹à¥€ à¤† à¤°à¤¹à¥€ à¤¹à¥ˆ...'
        },
        realWorld: {
            header: 'à¤µà¤¾à¤¸à¥à¤¤à¤µà¤¿à¤• à¤¦à¥à¤¨à¤¿à¤¯à¤¾ à¤ªà¤°à¤¿à¤•à¥à¤°à¤®à¤£',
            subtitle: 'à¤ªà¤°à¤¿à¤•à¥à¤°à¤®à¤£ à¤¹à¤®à¤¾à¤°à¥‡ à¤œà¥€à¤µà¤¨ à¤•à¥‹ à¤ªà¥à¤°à¤­à¤¾à¤µà¤¿à¤¤ à¤•à¤°à¤¤à¤¾ à¤¹à¥ˆ',
            placeholder: 'à¤ªà¤°à¤¿à¤•à¥à¤°à¤®à¤£ à¤µà¤¾à¤¸à¥à¤¤à¤µà¤¿à¤• à¤¦à¥à¤¨à¤¿à¤¯à¤¾ à¤•à¥‡ à¤‰à¤¦à¤¾à¤¹à¤°à¤£ à¤œà¤²à¥à¤¦ à¤¹à¥€ à¤† à¤°à¤¹à¥‡ à¤¹à¥ˆà¤‚...'
        },
        common: {
            comingSoon: "à¤œà¤²à¥à¤¦ à¤¹à¥€ à¤† à¤°à¤¹à¤¾ à¤¹à¥ˆ",
            stayTuned: "à¤°à¥‹à¤®à¤¾àª‚àªšàª• à¤‡à¤‚à¤Ÿà¤°à¥ˆà¤•à¥à¤Ÿà¤¿à¤µ à¤¸à¤¾à¤®à¤—à¥à¤°à¥€ à¤•à¥‡ à¤²à¤¿à¤ à¤¬à¤¨à¥‡ à¤°à¤¹à¥‡à¤‚!"
        }
    },
    gu: {
        nav: {
            logo: "àªªà«ƒàª¥à«àªµà«€àª¨à«àª‚ àªªàª°àª¿àª•à«àª°àª®àª£",
            tabs: {
                learn: "àª¸à«€àª–à«€àª",
                practice: "àª…àª­à«àª¯àª¾àª¸",
                applications: "àªµàª¾àª¸à«àª¤àªµàª¿àª• àªµàª¿àª¶à«àªµ",
            },
        },
        learn: {
            header: 'àªªà«ƒàª¥à«àªµà«€àª¨à«àª‚ àªªàª°àª¿àª•à«àª°àª®àª£',
            subtitle: 'àª¸à«‚àª°à«àª¯àª¨à«€ àª†àª¸àªªàª¾àª¸ àªªà«ƒàª¥à«àªµà«€àª¨à«€ àª¯àª¾àª¤à«àª°àª¾',
            placeholder: 'àªªàª°àª¿àª•à«àª°àª®àª£ àª¶à«€àª–àªµàª¾àª¨à«€ àª¸àª¾àª®àª—à«àª°à«€ àªŸà«‚àª‚àª• àª¸àª®àª¯àª®àª¾àª‚ àª†àªµà«€ àª°àª¹à«€ àª›à«‡...'
        },
        practice: {
            header: 'àªªàª°àª¿àª•à«àª°àª®àª£àª¨à«‹ àª…àª­à«àª¯àª¾àª¸ àª•àª°à«‹',
            subtitle: 'àª¤àª®àª¾àª°àª¾ àªœà«àªžàª¾àª¨àª¨à«àª‚ àªªàª°à«€àª•à«àª·àª£ àª•àª°à«‹',
            placeholder: 'àªªàª°àª¿àª•à«àª°àª®àª£ àª…àª­à«àª¯àª¾àª¸ àª•à«àªµàª¿àª àªŸà«‚àª‚àª• àª¸àª®àª¯àª®àª¾àª‚ àª†àªµà«€ àª°àª¹à«€ àª›à«‡...'
        },
        realWorld: {
            header: 'àªµàª¾àª¸à«àª¤àªµàª¿àª• àªµàª¿àª¶à«àªµ àªªàª°àª¿àª•à«àª°àª®àª£',
            subtitle: 'àªªàª°àª¿àª•à«àª°àª®àª£ àª†àªªàª£àª¾ àªœà«€àªµàª¨àª¨à«‡ àª…àª¸àª° àª•àª°à«‡ àª›à«‡',
            placeholder: 'àªªàª°àª¿àª•à«àª°àª®àª£ àªµàª¾àª¸à«àª¤àªµàª¿àª• àªµàª¿àª¶à«àªµàª¨àª¾ àª‡àª²à«‡àª•à«àªŸà«àª°à«‹àª¨àª¿àª• àª‰àª¦àª¾àª¹àª°àª£à«‹ àªŸà«‚àª‚àª• àª¸àª®àª¯àª®àª¾àª‚ àª†àªµà«€ àª°àª¹à«àª¯àª¾ àª›à«‡...'
        },
        common: {
            comingSoon: "àªŸà«‚àª‚àª• àª¸àª®àª¯àª®àª¾àª‚ àª†àªµà«€ àª°àª¹à«àª¯à«àª‚ àª›à«‡",
            stayTuned: "àª‰àª¤à«àª¤à«‡àªœàª• àª‡àª¨à«àªŸàª°à«‡àª•à«àªŸàª¿àªµ àª¸àª¾àª®àª—à«àª°à«€ àª®àª¾àªŸà«‡ àªŸà«àª¯à«àª¨ àª°àª¹à«‹!"
        }
    }
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>("en");
    const { t: i18nT } = useTranslation();

    const t = useCallback((key: string): string => {
        const keys = key.split(".");
        let value = translationsData[language];
        for (const k of keys) {
            if (value && value[k]) value = value[k];
            else return i18nT(key);
        }
        return typeof value === "string" ? value : i18nT(key);
    }, [language, i18nT]);

    const handleSetLanguage = (lang: Language) => {
        setLanguageState(lang);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error("useLanguage must be used within LanguageProvider");
    return context;
};

// ============================================================================
// Navbar Component
// ============================================================================
const Navbar: React.FC<{ mode: string; setMode: (m: any) => void }> = ({ mode, setMode }) => {
    const { language, setLanguage, t } = useLanguage();

    const navItems = [
        { id: 'learn', label: t("nav.tabs.learn"), color: '#0d9488' },
        { id: 'practice', label: t("nav.tabs.practice"), color: '#7c3aed' },
        { id: 'applications', label: t("nav.tabs.applications"), color: '#1e293b' }
    ];

    return (
        <nav style={{
            position: "fixed", top: 0, left: 0, right: 0, height: "72px",
            background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(12px)",
            borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center",
            justifyContent: "space-between", padding: "0 4vw", zIndex: 1000
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ background: 'linear-gradient(135deg, #0d9488, #7c3aed)', padding: '8px', borderRadius: '12px' }}>
                    <Globe size={24} color="white" />
                </div>
                <span style={{
                    fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
                    fontWeight: "800",
                    background: "linear-gradient(to right, #0d9488, #7c3aed)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: '-0.02em'
                }}>
                    {t("nav.logo")}
                </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{
                    display: "flex",
                    background: "#f1f5f9",
                    padding: "4px",
                    borderRadius: "12px",
                    marginRight: '16px'
                }}>
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setMode(item.id)}
                            style={{
                                padding: "8px 16px",
                                borderRadius: "8px",
                                border: "none",
                                background: mode === item.id ? "white" : "transparent",
                                color: mode === item.id ? item.color : "#64748b",
                                boxShadow: mode === item.id ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
                                fontWeight: "700",
                                fontSize: '14px',
                                cursor: "pointer",
                                transition: "all 0.2s ease"
                            }}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    style={{
                        padding: "8px 12px",
                        borderRadius: "10px",
                        border: "1px solid #e2e8f0",
                        background: "white",
                        color: "#475569",
                        fontWeight: "600",
                        fontSize: '14px',
                        outline: "none",
                        cursor: "pointer"
                    }}
                >
                    <option value="en">English</option>
                    <option value="hi">à¤¹à¤¿à¤‚à¤¦à¥€</option>
                    <option value="gu">àª—à«àªœàª°àª¾àª¤à«€</option>
                </select>
            </div>
        </nav>
    );
};

// ============================================================================
// Mode Components
// ============================================================================
interface Section {
    id: number;
    title: string;
    icon: React.ReactNode;
    content: React.ReactNode;
}

const RevolutionLearnMode: React.FC = () => {
    const [currentSection, setCurrentSection] = useState(0);
    const [rotationAngle, setRotationAngle] = useState(0);
    const [revolutionAngle, setRevolutionAngle] = useState(0);
    const [isRotating, setIsRotating] = useState(false);
    const [isRevolving, setIsRevolving] = useState(false);
    const [showNightSky, setShowNightSky] = useState(false);
    const animationRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        const animate = () => {
            if (isRotating) {
                setRotationAngle((prev) => (prev + 1) % 360);
            }
            if (isRevolving) {
                setRevolutionAngle((prev) => (prev + 0.3) % 360);
            }
            animationRef.current = requestAnimationFrame(animate);
        };
        animationRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isRotating, isRevolving]);

    const sections: Section[] = [
        {
            id: 1,
            title: "Introduction: Earth's Movements",
            icon: <Globe2 className="w-6 h-6" />,
            content: (
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-2xl p-6 border border-blue-500/30">
                        <h3 className="text-2xl font-bold mb-4 text-blue-300">Welcome to Earth's Amazing Journey! ðŸŒ</h3>
                        <p className="text-lg text-blue-100 leading-relaxed mb-4">
                            Have you ever wondered why we have day and night? Or why summers are hot and winters are cold?
                            The answer lies in how Earth moves through space!
                        </p>
                        <p className="text-blue-100 leading-relaxed">
                            Earth performs two main types of motion simultaneously:
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl p-6 border border-cyan-500/30 transform hover:scale-105 transition-all">
                            <div className="text-4xl mb-4">ðŸ”„</div>
                            <h4 className="text-xl font-bold mb-3 text-cyan-300">1. Rotation</h4>
                            <p className="text-cyan-100 mb-3">Earth spinning on its own axis, like a top!</p>
                            <div className="bg-cyan-800/30 rounded-lg p-3 mb-3">
                                <div className="text-sm text-cyan-200 mb-1">Duration:</div>
                                <div className="text-2xl font-bold text-cyan-100">24 Hours</div>
                            </div>
                            <div className="bg-cyan-800/30 rounded-lg p-3">
                                <div className="text-sm text-cyan-200 mb-1">Result:</div>
                                <div className="text-lg font-bold text-cyan-100">Day & Night</div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-500/30 transform hover:scale-105 transition-all">
                            <div className="text-4xl mb-4">ðŸŒ</div>
                            <h4 className="text-xl font-bold mb-3 text-purple-300">2. Revolution</h4>
                            <p className="text-purple-100 mb-3">Earth orbiting around the Sun!</p>
                            <div className="bg-purple-800/30 rounded-lg p-3 mb-3">
                                <div className="text-sm text-purple-200 mb-1">Duration:</div>
                                <div className="text-2xl font-bold text-purple-100">365 Days</div>
                            </div>
                            <div className="bg-purple-800/30 rounded-lg p-3">
                                <div className="text-sm text-purple-200 mb-1">Result:</div>
                                <div className="text-lg font-bold text-purple-100">Seasons</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-xl p-5 border border-yellow-500/30">
                        <div className="flex items-start gap-3">
                            <Lightbulb className="text-yellow-400 flex-shrink-0 mt-1" size={24} />
                            <div>
                                <h4 className="font-bold text-lg mb-2 text-yellow-300">Did You Know?</h4>
                                <p className="text-yellow-100">
                                    Both motions happen at the same time! Right now, as you read this, Earth is spinning
                                    on its axis AND traveling around the Sun at incredible speeds!
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-500/30">
                        <h4 className="font-bold text-xl mb-4 text-slate-200">In This Learning Journey, You'll Discover:</h4>
                        <div className="space-y-3">
                            {[
                                "Why the Sun appears to move across the sky",
                                "How Earth's rotation creates day and night",
                                "Why different stars appear throughout the year",
                                "What causes the four seasons",
                                "How Earth's tilt affects sunlight and temperature",
                                "What are solar and lunar eclipses"
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-slate-300">
                                    <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 2,
            title: "Earth's Rotation",
            icon: <RotateCcw className="w-6 h-6" />,
            content: (
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 rounded-2xl p-6 border border-blue-500/30">
                        <h3 className="text-2xl font-bold mb-4 text-blue-300">Understanding Earth's Spin ðŸ”„</h3>
                        <p className="text-lg text-blue-100 leading-relaxed">
                            Just like a spinning top, Earth rotates on an imaginary line called its <strong>axis</strong>.
                            This axis runs through the North Pole and South Pole.
                        </p>
                    </div>

                    {/* Interactive Rotation Demo */}
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-blue-500/30">
                        <h4 className="text-xl font-bold mb-4 text-blue-300">Interactive Demo: See Earth Rotate!</h4>

                        <div className="relative w-full aspect-square max-w-md mx-auto bg-gradient-to-b from-black to-slate-900 rounded-2xl overflow-hidden border-4 border-blue-500/30 mb-6">
                            {/* Stars */}
                            <div className="absolute inset-0">
                                {[...Array(30)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                                        style={{
                                            top: `${Math.random() * 100}%`,
                                            left: `${Math.random() * 100}%`,
                                            animationDelay: `${Math.random() * 2}s`,
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Sun */}
                            <div className="absolute left-8 top-1/2 -translate-y-1/2">
                                <div className="relative">
                                    <div className="w-12 h-12 bg-yellow-400 rounded-full shadow-lg shadow-yellow-500/50" />
                                    <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-60" />
                                </div>
                            </div>

                            {/* Sun Rays */}
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute left-8 top-1/2 w-40 h-0.5 bg-gradient-to-r from-yellow-400/80 to-transparent"
                                    style={{
                                        transform: `translateY(-50%) rotate(${i * 45}deg)`,
                                        transformOrigin: 'left center',
                                    }}
                                />
                            ))}

                            {/* Earth */}
                            <div
                                className="absolute inset-16 rounded-full transition-transform duration-100"
                                style={{
                                    transform: `rotate(${rotationAngle}deg)`,
                                    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #1e3a8a 100%)',
                                    boxShadow: 'inset -20px 0 40px rgba(0,0,0,0.8), 0 0 40px rgba(59, 130, 246, 0.5)',
                                }}
                            >
                                {/* Axis */}
                                <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-white/70" />

                                {/* Poles */}
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full border-2 border-blue-300" />
                                <div className="absolute top-6 left-1/2 -translate-x-1/2 text-xs font-bold">NP</div>
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full border-2 border-blue-300" />
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold">SP</div>

                                {/* Continents */}
                                <div className="absolute top-1/3 right-1/4 w-10 h-12 bg-green-600/70 rounded-lg" />
                                <div className="absolute top-1/2 left-1/4 w-8 h-10 bg-green-600/70 rounded-lg" />

                                {/* India Marker */}
                                <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                <div className="absolute top-1/3 right-1/3 -mt-6 text-[10px] font-bold text-red-300 whitespace-nowrap">
                                    India
                                </div>
                            </div>

                            {/* Direction Indicator */}
                            <div className="absolute top-4 right-4 bg-blue-900/80 px-3 py-2 rounded-lg backdrop-blur-sm">
                                <div className="text-xs text-blue-300 mb-1">Direction</div>
                                <div className="text-sm font-bold text-yellow-300">West â†’ East</div>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center mb-4">
                            <button
                                onClick={() => setIsRotating(!isRotating)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${isRotating
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'bg-green-600 hover:bg-green-700'
                                    }`}
                            >
                                {isRotating ? <Pause size={20} /> : <Play size={20} />}
                                {isRotating ? 'Pause' : 'Start'} Rotation
                            </button>
                            <button
                                onClick={() => setRotationAngle(0)}
                                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all"
                            >
                                <RotateCcw size={20} />
                                Reset
                            </button>
                        </div>

                        <div className="text-center text-sm text-blue-300">
                            Rotation Angle: <span className="font-bold text-yellow-300">{rotationAngle.toFixed(0)}Â°</span>
                        </div>
                    </div>

                    {/* Key Concepts */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-green-900/30 to-teal-900/30 rounded-xl p-6 border border-green-500/30">
                            <h4 className="font-bold text-lg mb-3 text-green-300">â±ï¸ How Long Does It Take?</h4>
                            <p className="text-green-100 mb-3">
                                Earth completes one full rotation in approximately <strong>24 hours</strong>.
                            </p>
                            <div className="bg-green-800/30 rounded-lg p-3 text-center">
                                <div className="text-3xl font-bold text-green-200">1 Rotation = 1 Day</div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-500/30">
                            <h4 className="font-bold text-lg mb-3 text-purple-300">ðŸ§­ Which Direction?</h4>
                            <p className="text-purple-100 mb-3">
                                When viewed from above the North Pole, Earth rotates <strong>counter-clockwise</strong>.
                            </p>
                            <div className="bg-purple-800/30 rounded-lg p-3 text-center">
                                <div className="text-2xl font-bold text-purple-200">West â†’ East</div>
                            </div>
                        </div>
                    </div>

                    {/* Merry-Go-Round Analogy */}
                    <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-xl p-6 border border-orange-500/30">
                        <h4 className="font-bold text-xl mb-4 text-orange-300">ðŸŽ  Understanding with a Merry-Go-Round</h4>
                        <p className="text-orange-100 mb-4 leading-relaxed">
                            Imagine you're sitting on a merry-go-round that's turning counter-clockwise.
                            Objects around you (trees, buildings) appear to move in the opposite directionâ€”clockwise!
                        </p>
                        <div className="bg-orange-800/30 rounded-lg p-4">
                            <p className="text-orange-100">
                                <strong>Similarly:</strong> As Earth rotates West to East, the Sun appears to move East to West across the sky!
                            </p>
                        </div>
                    </div>

                    {/* Historical Note */}
                    <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-xl p-6 border border-indigo-500/30">
                        <h4 className="font-bold text-xl mb-4 text-indigo-300">ðŸ“š Ancient Wisdom: Aryabhata</h4>
                        <div className="flex items-start gap-4">
                            <div className="text-5xl">ðŸ§‘â€ðŸ«</div>
                            <div>
                                <p className="text-indigo-100 mb-3 leading-relaxed">
                                    In the 5th century CE, the great Indian mathematician and astronomer <strong>Aryabhata</strong> calculated
                                    Earth's rotation period as approximately 23 hours, 56 minutes, and 4.1 seconds!
                                </p>
                                <div className="bg-indigo-800/30 rounded-lg p-3">
                                    <p className="text-indigo-200 text-sm">
                                        This value is <strong>remarkably close</strong> to the modern accepted value.
                                        He made this calculation over 1,500 years ago without modern technology!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 3,
            title: "Day and Night",
            icon: <Sun className="w-6 h-6" />,
            content: (
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-yellow-900/40 to-blue-900/40 rounded-2xl p-6 border border-yellow-500/30">
                        <h3 className="text-2xl font-bold mb-4 text-yellow-300">How Day and Night Occur ðŸŒžðŸŒ™</h3>
                        <p className="text-lg text-yellow-100 leading-relaxed">
                            As Earth rotates, only half of it faces the Sun at any time. The side facing the Sun experiences
                            <strong> daytime</strong>, while the side facing away experiences <strong>nighttime</strong>.
                        </p>
                    </div>

                    {/* Interactive Day/Night Demo */}
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-yellow-500/30">
                        <h4 className="text-xl font-bold mb-4 text-yellow-300">Interactive Demo: Day & Night Cycle</h4>

                        <div className="relative w-full aspect-video max-w-2xl mx-auto bg-gradient-to-b from-slate-950 to-black rounded-2xl overflow-hidden border-4 border-yellow-500/30 mb-6">
                            {/* Stars in night side */}
                            {showNightSky && (
                                <div className="absolute inset-0">
                                    {[...Array(50)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                                            style={{
                                                top: `${Math.random() * 100}%`,
                                                left: `${50 + Math.random() * 50}%`,
                                                animationDelay: `${Math.random() * 2}s`,
                                            }}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Sun */}
                            <div className="absolute -left-10 top-1/2 -translate-y-1/2 z-10">
                                <div className="relative">
                                    <div className="w-20 h-20 bg-yellow-400 rounded-full shadow-2xl shadow-yellow-500/60" />
                                    <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-50" />
                                </div>
                            </div>

                            {/* Sun Rays */}
                            {[...Array(12)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute left-0 top-1/2 w-1/2 h-1 bg-gradient-to-r from-yellow-400/60 via-yellow-300/30 to-transparent"
                                    style={{
                                        transform: `translateY(-50%) rotate(${(i * 30) - 90}deg)`,
                                        transformOrigin: 'left center',
                                    }}
                                />
                            ))}

                            {/* Earth */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <div
                                    className="w-48 h-48 rounded-full relative"
                                    style={{
                                        background: 'linear-gradient(90deg, #1e40af 0%, #1e40af 50%, #0f172a 50%, #0f172a 100%)',
                                        boxShadow: 'inset -40px 0 60px rgba(0,0,0,0.9), 0 0 60px rgba(59, 130, 246, 0.4)',
                                    }}
                                >
                                    {/* Day side label */}
                                    <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 text-center">
                                        <Sun className="w-8 h-8 mx-auto mb-1 text-yellow-400" />
                                        <div className="text-xs font-bold text-yellow-300">DAY</div>
                                    </div>

                                    {/* Night side label */}
                                    <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 text-center">
                                        <Moon className="w-8 h-8 mx-auto mb-1 text-blue-300" />
                                        <div className="text-xs font-bold text-blue-300">NIGHT</div>
                                    </div>

                                    {/* Terminator line */}
                                    <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-white/30" />

                                    {/* Location markers */}
                                    <div className="absolute top-1/3 left-1/3 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                                    <div className="absolute top-1/3 left-1/3 -mt-8 text-[10px] font-bold text-red-300 whitespace-nowrap">
                                        You are here
                                    </div>
                                </div>
                            </div>

                            {/* Time indicator */}
                            <div className="absolute top-4 right-4 bg-slate-900/80 px-4 py-2 rounded-lg backdrop-blur-sm border border-slate-600">
                                <div className="text-xs text-slate-400 mb-1">Time of Day</div>
                                <div className="text-lg font-bold text-yellow-300">
                                    {((rotationAngle / 15) % 24).toFixed(0).padStart(2, '0')}:00 hrs
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center mb-4">
                            <button
                                onClick={() => {
                                    setIsRotating(!isRotating);
                                    setShowNightSky(!showNightSky);
                                }}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${isRotating
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                            >
                                {isRotating ? <Pause size={20} /> : <Play size={20} />}
                                {isRotating ? 'Stop' : 'Watch'} Day/Night Cycle
                            </button>
                        </div>
                    </div>

                    {/* Explanation Cards */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-xl p-6 border border-yellow-500/30">
                            <div className="flex items-center gap-3 mb-4">
                                <Sun className="w-10 h-10 text-yellow-400" />
                                <h4 className="font-bold text-xl text-yellow-300">Daytime</h4>
                            </div>
                            <div className="space-y-3 text-yellow-100">
                                <p>When your location on Earth faces the Sun:</p>
                                <ul className="space-y-2 ml-4">
                                    <li>â€¢ Sunlight directly reaches your location</li>
                                    <li>â€¢ The sky appears bright and blue</li>
                                    <li>â€¢ You can see the Sun in the sky</li>
                                    <li>â€¢ Temperature rises</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/30">
                            <div className="flex items-center gap-3 mb-4">
                                <Moon className="w-10 h-10 text-blue-300" />
                                <h4 className="font-bold text-xl text-blue-300">Nighttime</h4>
                            </div>
                            <div className="space-y-3 text-blue-100">
                                <p>When your location faces away from the Sun:</p>
                                <ul className="space-y-2 ml-4">
                                    <li>â€¢ No direct sunlight reaches you</li>
                                    <li>â€¢ The sky appears dark</li>
                                    <li>â€¢ Stars and Moon become visible</li>
                                    <li>â€¢ Temperature drops</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Sunrise and Sunset */}
                    <div className="bg-gradient-to-r from-orange-900/30 to-pink-900/30 rounded-xl p-6 border border-orange-500/30">
                        <h4 className="font-bold text-xl mb-4 text-orange-300">ðŸŒ… Why Does the Sun "Rise" and "Set"?</h4>
                        <div className="space-y-4">
                            <div className="bg-orange-800/30 rounded-lg p-4">
                                <h5 className="font-bold text-orange-300 mb-2">Sunrise (Morning)</h5>
                                <p className="text-orange-100">
                                    As Earth rotates from West to East, your location turns towards the Sun.
                                    The Sun appears to "rise" from the <strong>Eastern horizon</strong>.
                                </p>
                            </div>
                            <div className="bg-pink-800/30 rounded-lg p-4">
                                <h5 className="font-bold text-pink-300 mb-2">Sunset (Evening)</h5>
                                <p className="text-pink-100">
                                    As your location continues rotating, it turns away from the Sun.
                                    The Sun appears to "set" in the <strong>Western horizon</strong>.
                                </p>
                            </div>
                            <div className="bg-purple-800/30 rounded-lg p-4">
                                <p className="text-purple-100">
                                    <strong>Important:</strong> The Sun doesn't actually move! It's Earth's rotation that
                                    creates the illusion of the Sun moving across our sky.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* India Example */}
                    <div className="bg-gradient-to-r from-green-900/30 to-teal-900/30 rounded-xl p-6 border border-green-500/30">
                        <h4 className="font-bold text-xl mb-4 text-green-300">ðŸ‡®ðŸ‡³ Sunrise Across India</h4>
                        <p className="text-green-100 mb-4">
                            Because Earth rotates West to East, sunrise occurs at different times across India:
                        </p>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-green-800/30 rounded-lg p-4 text-center">
                                <div className="text-2xl mb-2">ðŸŒ…</div>
                                <div className="font-bold text-green-300 mb-1">First</div>
                                <div className="text-sm text-green-100">Arunachal Pradesh (East)</div>
                            </div>
                            <div className="bg-green-700/30 rounded-lg p-4 text-center">
                                <div className="text-2xl mb-2">ðŸŒ„</div>
                                <div className="font-bold text-green-300 mb-1">Middle</div>
                                <div className="text-sm text-green-100">Madhya Pradesh (Central)</div>
                            </div>
                            <div className="bg-green-600/30 rounded-lg p-4 text-center">
                                <div className="text-2xl mb-2">ðŸŒ‡</div>
                                <div className="font-bold text-green-300 mb-1">Last</div>
                                <div className="text-sm text-green-100">Gujarat (West)</div>
                            </div>
                        </div>
                        <p className="text-green-100 mt-4 text-sm">
                            The time difference between easternmost and westernmost points of India is about 2 hours!
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 4,
            title: "Earth's Revolution",
            icon: <Globe2 className="w-6 h-6" />,
            content: (
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-2xl p-6 border border-blue-500/30">
                        <h3 className="text-2xl font-bold mb-4 text-purple-300">The Yearly Journey ðŸŒ</h3>
                        <p className="text-lg text-purple-100 leading-relaxed">
                            While Earth rotates on its axis, it also travels around the Sun in a nearly circular path called an
                            <strong> orbit</strong>. This movement is called <strong>revolution</strong>.
                        </p>
                    </div>

                    {/* Interactive Revolution Demo */}
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-purple-500/30">
                        <h4 className="text-xl font-bold mb-4 text-purple-300">Interactive Demo: Earth's Orbit</h4>

                        <div className="relative w-full aspect-square max-w-lg mx-auto bg-gradient-radial from-yellow-900/20 via-slate-950 to-black rounded-2xl overflow-hidden border-4 border-purple-500/30 mb-6">
                            {/* Stars */}
                            <div className="absolute inset-0 overflow-hidden">
                                {[...Array(60)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute w-1 h-1 bg-white rounded-full"
                                        style={{
                                            top: `${Math.random() * 100}%`,
                                            left: `${Math.random() * 100}%`,
                                            opacity: Math.random() * 0.8 + 0.2,
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Orbit Path */}
                            <div className="absolute inset-20 border-2 border-dashed border-purple-500/30 rounded-full" />

                            {/* Sun */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <div className="relative">
                                    <div className="w-16 h-16 bg-yellow-400 rounded-full shadow-2xl shadow-yellow-500/50" />
                                    <div className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl opacity-60 scale-150" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold text-black">
                                        SUN
                                    </div>
                                </div>
                            </div>

                            {/* Earth orbiting */}
                            <div
                                className="absolute inset-20 pointer-events-none"
                                style={{ transform: `rotate(${revolutionAngle}deg)` }}
                            >
                                <div
                                    className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full"
                                    style={{
                                        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #1e3a8a 100%)',
                                        boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
                                    }}
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-blue-900/80 px-2 py-1 rounded text-[10px] font-bold text-white whitespace-nowrap">
                                        EARTH
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center mb-4">
                            <button
                                onClick={() => setIsRevolving(!isRevolving)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${isRevolving
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'bg-purple-600 hover:bg-purple-700'
                                    }`}
                            >
                                {isRevolving ? <Pause size={20} /> : <Play size={20} />}
                                {isRevolving ? 'Pause' : 'Start'} Revolution
                            </button>
                            <button
                                onClick={() => setRevolutionAngle(0)}
                                className="flex items-center gap-2 px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg font-semibold transition-all"
                            >
                                <RotateCcw size={20} />
                                Reset
                            </button>
                        </div>

                        <div className="text-center text-sm text-purple-300">
                            Revolution Progress: <span className="font-bold text-yellow-300">{((revolutionAngle / 360) * 100).toFixed(1)}% of a year</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl p-6 border border-blue-500/30">
                            <h4 className="font-bold text-lg mb-3 text-blue-300">â±ï¸ Duration</h4>
                            <p className="text-blue-100 mb-3">
                                Earth takes approximately <strong>365 days and 6 hours</strong> to complete one revolution.
                            </p>
                            <div className="bg-blue-800/30 rounded-lg p-3 text-center">
                                <div className="text-2xl font-bold text-blue-200">1 Revolution = 1 Year</div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 rounded-xl p-6 border border-pink-500/30">
                            <h4 className="font-bold text-lg mb-3 text-pink-300">ðŸ›£ï¸ The Path (Orbit)</h4>
                            <p className="text-pink-100 mb-2">
                                Earth's orbit is nearly circular but slightly <strong>elliptical</strong> (oval-shaped).
                            </p>
                            <p className="text-pink-100 text-sm italic">
                                Interesting fact: Earth is actually closer to the Sun in January than in July!
                            </p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-teal-900/30 to-blue-900/30 rounded-xl p-6 border border-teal-500/30">
                        <h4 className="font-bold text-xl mb-4 text-teal-300">ðŸ“… Why do we have Leap Years?</h4>
                        <p className="text-teal-100 leading-relaxed mb-4">
                            Since it takes 365 1/4 days for one revolution, we add an extra day (Feb 29) every 4 years
                            (4 Ã— 1/4 = 1 day) to keep our calendar in sync with Earth's motion!
                        </p>
                        <div className="bg-teal-800/30 rounded-lg p-4 text-center">
                            <div className="text-xl font-bold text-teal-200">2020, 2024, 2028 are Leap Years</div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 5,
            title: "Seasons on Earth",
            icon: <Thermometer className="w-6 h-6" />,
            content: (
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-orange-900/40 to-blue-900/40 rounded-2xl p-6 border border-orange-500/30">
                        <h3 className="text-2xl font-bold mb-4 text-orange-300">The Power of the Tilt ðŸŒ¡ï¸</h3>
                        <p className="text-lg text-orange-100 leading-relaxed mb-4">
                            Seasons <strong>do not</strong> occur because Earth is closer to the Sun at certain times.
                            Instead, they are caused by two main things:
                        </p>
                        <div className="grid md:grid-cols-2 gap-4 text-center">
                            <div className="bg-orange-800/40 p-4 rounded-xl border border-orange-400/30">
                                <div className="text-3xl mb-2">ðŸ“</div>
                                <div className="font-bold text-orange-200">Earth's Tilt (23.5Â°)</div>
                            </div>
                            <div className="bg-blue-800/40 p-4 rounded-xl border border-blue-400/30">
                                <div className="text-3xl mb-2">ðŸŒ</div>
                                <div className="font-bold text-blue-200">Earth's Revolution</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-500/30">
                        <h4 className="font-bold text-xl mb-4 text-slate-200">How Humidity and Temperature Change</h4>
                        <div className="space-y-4">
                            <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 p-5 rounded-xl border border-yellow-500/20">
                                <h5 className="font-bold text-lg text-yellow-300 mb-3 flex items-center gap-2">
                                    <Sun size={20} /> Summer
                                </h5>
                                <p className="text-yellow-100">
                                    When a hemisphere tilts <strong>towards</strong> the Sun, it receives more direct sunlight for longer hours.
                                    This leads to higher temperatures and summer.
                                </p>
                            </div>

                            <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 p-5 rounded-xl border border-blue-500/20">
                                <h5 className="font-bold text-lg text-blue-300 mb-3 flex items-center gap-2">
                                    <Moon size={20} /> Winter
                                </h5>
                                <p className="text-blue-100">
                                    When a hemisphere tilts <strong>away</strong> from the Sun, it receives slanted sunlight for fewer hours.
                                    This leads to lower temperatures and winter.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl p-6 border border-green-500/30">
                        <h4 className="font-bold text-xl mb-4 text-green-300">ðŸŒ± Spring and Autumn (Equinoxes)</h4>
                        <p className="text-green-100 leading-relaxed">
                            Twice a year, the tilt is neither towards nor away from the Sun.
                            These are called <strong>Equinoxes</strong>, where day and night are almost equal everywhere on Earth!
                            In India, we experience pleasant weather during these times.
                        </p>
                    </div>

                    <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/30">
                        <h4 className="font-bold text-xl mb-4 text-purple-300">ðŸ’¡ Important Conclusion</h4>
                        <div className="bg-purple-900/30 p-4 rounded-lg">
                            <p className="text-purple-100 text-center font-bold">
                                While one hemisphere has Summer, the other has Winter!
                                Seasons are always opposite in the Northern and Southern Hemispheres.
                            </p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 6,
            title: "Changing Night Sky",
            icon: <Eye className="w-6 h-6" />,
            content: (
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 rounded-2xl p-6 border border-indigo-500/30">
                        <h3 className="text-2xl font-bold mb-4 text-indigo-300">The Ever-Changing Stars â­</h3>
                        <p className="text-lg text-indigo-100 leading-relaxed mb-4">
                            Have you noticed that some constellations are visible in winter but not in summer?
                            This is another amazing result of <strong>Earth's Revolution</strong>!
                        </p>
                    </div>

                    <div className="bg-slate-900/50 rounded-2xl p-6 border border-indigo-500/30 overflow-hidden relative">
                        <h4 className="font-bold text-xl mb-6 text-indigo-300">Why the Stars Change</h4>

                        <div className="relative aspect-video max-w-lg mx-auto bg-black rounded-xl border-2 border-indigo-500/20 p-4 overflow-hidden">
                            {/* Static Star Field */}
                            {[...Array(100)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-40"
                                    style={{
                                        top: `${Math.random() * 100}%`,
                                        left: `${Math.random() * 100}%`,
                                    }}
                                />
                            ))}

                            {/* Orbit and Sun */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-slate-700/50 rounded-full" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-yellow-500 rounded-full shadow-lg shadow-yellow-500/50" />

                            {/* Earth and View Angle */}
                            <div
                                className="absolute inset-x-0 inset-y-0 transition-transform duration-1000"
                                style={{ transform: `rotate(${revolutionAngle}deg)` }}
                            >
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 text-center">
                                    <div className="w-6 h-6 bg-blue-500 rounded-full mx-auto" />
                                    <div className="w-0.5 h-20 bg-gradient-to-t from-blue-400/50 to-transparent mx-auto mt-2" />
                                    <div className="text-[10px] text-blue-300 font-bold mt-1">NIGHT SIDE VIEW</div>
                                </div>
                            </div>

                            {/* Different Star Groups */}
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-yellow-300/60 font-bold text-xs">Group A Stars</div>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-purple-300/60 font-bold text-xs">Group B Stars</div>
                            <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-cyan-300/60 font-bold text-xs">Group C Stars</div>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-pink-300/60 font-bold text-xs">Group D Stars</div>
                        </div>

                        <p className="text-indigo-200 mt-6 text-center text-sm leading-relaxed">
                            As Earth revolves around the Sun, our nighttime "window" points towards different parts of
                            the universe. That's why we see different stars at different times of the year!
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-green-900/30 to-teal-900/30 rounded-xl p-6 border border-green-500/30">
                        <h4 className="font-bold text-xl mb-4 text-green-300">ðŸ“– Cultural Observation</h4>
                        <p className="text-green-100 leading-relaxed italic">
                            "The Bhil and Pawara indigenous communities used the appearance of certain star patterns
                            as markers for the arrival of monsoon rain."
                        </p>
                        <p className="text-green-100 mt-3 text-sm">
                            This shows how closely people have observed the changing night sky for centuries to manage their farming and lives!
                        </p>
                    </div>

                    <div className="bg-indigo-600 hover:bg-indigo-700 p-6 rounded-2xl text-center transition-all cursor-pointer group shadow-xl">
                        <h4 className="text-2xl font-bold mb-2">Ready for the Quiz? ðŸš€</h4>
                        <p className="text-indigo-100 group-hover:scale-105 transition-transform">
                            You've completed the learning journey! Test your knowledge in Practice Mode.
                        </p>
                    </div>
                </div>
            )
        }
    ];

    const goToSection = (index: number) => {
        setCurrentSection(index);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const nextSection = () => {
        if (currentSection < sections.length - 1) {
            goToSection(currentSection + 1);
        }
    };

    const previousSection = () => {
        if (currentSection > 0) {
            goToSection(currentSection - 1);
        }
    };

    const currentSectionData = sections[currentSection];
    const progress = sections.length > 0 ? ((currentSection + 1) / sections.length) * 100 : 0;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                            Learn Mode
                        </h1>
                        <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-purple-500/30">
                            <BookOpen className="text-purple-400" size={20} />
                            <span className="text-sm text-purple-300">
                                {currentSection + 1} / {sections.length}
                            </span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-slate-800/50 rounded-full h-3 overflow-hidden mb-2">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="text-sm text-slate-400 text-center">
                        Progress: {progress.toFixed(0)}%
                    </div>
                </div>

                {/* Section Navigation Tabs */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/30 mb-8">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                        {sections.map((section, index) => (
                            <button
                                key={section.id}
                                onClick={() => goToSection(index)}
                                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all text-sm
                  ${index === currentSection
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                        : index < currentSection
                                            ? 'bg-green-900/30 text-green-300 hover:bg-green-900/50'
                                            : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                                    }
                `}
                            >
                                {section.icon}
                                <span className="hidden md:inline">{index + 1}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Current Section Content */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-purple-500/30 mb-8">
                    {currentSectionData && (
                        <>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl">
                                    {currentSectionData.icon}
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                    {currentSectionData.title}
                                </h2>
                            </div>

                            <div className="prose prose-invert max-w-none">
                                {currentSectionData.content}
                            </div>
                        </>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={previousSection}
                        disabled={currentSection === 0}
                        className={`
              flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold transition-all
              ${currentSection === 0
                                ? 'bg-slate-700 cursor-not-allowed text-slate-500'
                                : 'bg-slate-700 hover:bg-slate-600 text-white shadow-lg hover:shadow-slate-500/50'
                            }
            `}
                    >
                        <ChevronLeft size={20} />
                        Previous
                    </button>
                    <button
                        onClick={nextSection}
                        disabled={currentSection === sections.length - 1}
                        className={`
              flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold transition-all
              ${currentSection === sections.length - 1
                                ? 'bg-green-700 text-white shadow-lg hover:shadow-green-500/50'
                                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/50'
                            }
            `}
                    >
                        {currentSection === sections.length - 1 ? 'Complete! ðŸŽ‰' : 'Next'}
                        {currentSection < sections.length - 1 && <ChevronRight size={20} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
    topic: 'rotation' | 'revolution' | 'seasons' | 'eclipses';
}

interface Scenario {
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

const questions: Question[] = [
    {
        id: 1,
        question: "In which direction does the Earth rotate on its axis?",
        options: ["East to West", "West to East", "North to South", "South to North"],
        correctAnswer: 1,
        explanation: "Earth rotates from West to East. This is why the Sun appears to rise in the East and set in the West. When viewed from above the North Pole, Earth rotates in an anti-clockwise direction.",
        difficulty: 'easy',
        topic: 'rotation'
    },
    {
        id: 2,
        question: "How long does it take for Earth to complete one rotation on its axis?",
        options: ["12 hours", "24 hours", "365 days", "30 days"],
        correctAnswer: 1,
        explanation: "Earth completes one full rotation on its axis in approximately 24 hours. This rotation causes the day-night cycle we experience.",
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
        explanation: "Day and night are caused by Earth's rotation on its axis. As Earth spins, the side facing the Sun experiences daytime, while the side facing away experiences nighttime.",
        difficulty: 'easy',
        topic: 'rotation'
    },
    {
        id: 4,
        question: "How long does it take for Earth to complete one revolution around the Sun?",
        options: ["24 hours", "30 days", "365 days and 6 hours", "12 months exactly"],
        correctAnswer: 2,
        explanation: "Earth takes approximately 365 days and 6 hours to complete one revolution around the Sun. The extra 6 hours accumulate over four years to create a leap year with 366 days.",
        difficulty: 'easy',
        topic: 'revolution'
    },
    {
        id: 5,
        question: "What is the main reason for seasons on Earth?",
        options: [
            "Distance from the Sun changes",
            "Earth's tilted axis and spherical shape",
            "The Moon's gravitational pull",
            "Solar flares from the Sun"
        ],
        correctAnswer: 1,
        explanation: "Seasons occur primarily due to Earth's axis being tilted at 23.5Â° relative to its orbit, combined with Earth's spherical shape. This causes different hemispheres to receive varying amounts of sunlight throughout the year.",
        difficulty: 'medium',
        topic: 'seasons'
    },
    {
        id: 6,
        question: "When it is summer in the Northern Hemisphere, what season is it in the Southern Hemisphere?",
        options: ["Summer", "Winter", "Spring", "Autumn"],
        correctAnswer: 1,
        explanation: "When it's summer in the Northern Hemisphere (around June), it's winter in the Southern Hemisphere. The seasons are opposite because when one hemisphere tilts towards the Sun, the other tilts away.",
        difficulty: 'medium',
        topic: 'seasons'
    },
    {
        id: 7,
        question: "At what angle is Earth's axis tilted relative to its orbit?",
        options: ["0 degrees", "23.5 degrees", "45 degrees", "90 degrees"],
        correctAnswer: 1,
        explanation: "Earth's axis is tilted at approximately 23.5 degrees relative to its orbital plane. This tilt is maintained as Earth revolves around the Sun and is the primary cause of seasons.",
        difficulty: 'medium',
        topic: 'seasons'
    },
    {
        id: 8,
        question: "Why does the Sun appear to move across the sky during the day?",
        options: [
            "The Sun actually moves around Earth",
            "Earth rotates on its axis",
            "The Moon pushes the Sun",
            "Clouds move the Sun's image"
        ],
        correctAnswer: 1,
        explanation: "The Sun appears to move across the sky because we observe it from Earth, which is rotating on its axis from West to East. The Sun is actually stationary relative to Earth's daily motion.",
        difficulty: 'easy',
        topic: 'rotation'
    },
    {
        id: 9,
        question: "During which event is daytime equal to nighttime (12 hours each)?",
        options: ["Summer Solstice", "Winter Solstice", "Equinox", "Full Moon"],
        correctAnswer: 2,
        explanation: "During the equinoxes (Spring Equinox around March 21 and Autumn Equinox around September 23), day and night are approximately equal in lengthâ€”about 12 hours each worldwide.",
        difficulty: 'medium',
        topic: 'seasons'
    },
    {
        id: 10,
        question: "What happens at the North Pole during the summer solstice?",
        options: [
            "24 hours of darkness",
            "24 hours of sunlight",
            "12 hours day and night",
            "The Sun never rises"
        ],
        correctAnswer: 1,
        explanation: "At the North Pole during the summer solstice (around June 21), the Sun remains visible for 24 hours continuously. This is because the North Pole is tilted towards the Sun at this time.",
        difficulty: 'hard',
        topic: 'seasons'
    },
    {
        id: 11,
        question: "What is a solar eclipse?",
        options: [
            "When Earth blocks sunlight from reaching the Moon",
            "When the Moon blocks sunlight from reaching Earth",
            "When the Sun explodes",
            "When Earth blocks sunlight from reaching Mars"
        ],
        correctAnswer: 1,
        explanation: "A solar eclipse occurs when the Moon passes between the Sun and Earth, blocking sunlight from reaching certain parts of Earth. This creates the Moon' shadow on Earth's surface.",
        difficulty: 'easy',
        topic: 'eclipses'
    },
    {
        id: 12,
        question: "Why do different stars appear in the night sky throughout the year?",
        options: [
            "Stars move around Earth",
            "Earth's revolution around the Sun changes our view",
            "Stars die and new ones appear",
            "The Moon blocks different stars"
        ],
        correctAnswer: 1,
        explanation: "As Earth revolves around the Sun, the night sky becomes visible in different directions at different times of the year, allowing us to see different constellations and stars.",
        difficulty: 'medium',
        topic: 'revolution'
    },
    {
        id: 13,
        question: "In India, where does sunrise occur first?",
        options: [
            "Western part (Gujarat)",
            "Eastern part (Arunachal Pradesh)",
            "Southern part (Tamil Nadu)",
            "Central part (Madhya Pradesh)"
        ],
        correctAnswer: 1,
        explanation: "Sunrise occurs first in the eastern part of India (like Arunachal Pradesh) because Earth rotates from West to East. This means eastern locations face the Sun before western locations.",
        difficulty: 'medium',
        topic: 'rotation'
    },
    {
        id: 14,
        question: "What is a lunar eclipse?",
        options: [
            "When the Moon blocks sunlight from reaching Earth",
            "When Earth blocks sunlight from reaching the Moon",
            "When the Moon disappears",
            "When the Sun blocks light from reaching the Moon"
        ],
        correctAnswer: 1,
        explanation: "A lunar eclipse occurs when Earth comes between the Sun and the Moon, blocking sunlight from reaching the Moon. This causes Earth's shadow to fall on the Moon.",
        difficulty: 'easy',
        topic: 'eclipses'
    },
    {
        id: 15,
        question: "Which ancient Indian astronomer calculated Earth's rotation period very accurately?",
        options: ["Brahmagupta", "Aryabhata", "Varahamihira", "Bhaskara"],
        correctAnswer: 1,
        explanation: "Aryabhata, a famous mathematician and astronomer from ancient India (5th century CE), calculated Earth's rotation period as approximately 23 hours 56 minutes 4.1 secondsâ€”remarkably close to the modern accepted value.",
        difficulty: 'hard',
        topic: 'rotation'
    },
    {
        id: 16,
        question: "Why can't we see a solar eclipse every month?",
        options: [
            "The Moon is too small",
            "The Moon's orbit is tilted relative to Earth's orbit",
            "The Sun is too far away",
            "Earth rotates too fast"
        ],
        correctAnswer: 1,
        explanation: "Solar eclipses don't occur every month because the Moon's orbit around Earth is tilted about 5Â° relative to Earth's orbit around the Sun. The Moon usually passes above or below the Sun as seen from Earth.",
        difficulty: 'hard',
        topic: 'eclipses'
    },
    {
        id: 17,
        question: "What is the path Earth takes while revolving around the Sun called?",
        options: ["Axis", "Orbit", "Trajectory", "Revolution path"],
        correctAnswer: 1,
        explanation: "The path that Earth (or any object) takes while revolving around another object is called its orbit. Earth's orbit around the Sun is nearly circular.",
        difficulty: 'easy',
        topic: 'revolution'
    },
    {
        id: 18,
        question: "During which month is Earth closest to the Sun?",
        options: ["June", "December", "January", "July"],
        correctAnswer: 2,
        explanation: "Earth is actually closest to the Sun in January (perihelion), not during Northern Hemisphere summer. This proves that seasons are NOT caused by Earth's distance from the Sun, but by the tilt of Earth's axis.",
        difficulty: 'hard',
        topic: 'revolution'
    },
    {
        id: 19,
        question: "The Pole Star appears nearly stationary in the sky because:",
        options: [
            "It doesn't move at all",
            "Earth's axis of rotation points very close to it",
            "It's the closest star to Earth",
            "The Moon keeps it in place"
        ],
        correctAnswer: 1,
        explanation: "The Pole Star (Dhruva Tara) appears nearly stationary because Earth's axis of rotation points very close to it. As Earth rotates, all other stars appear to move around the Pole Star.",
        difficulty: 'medium',
        topic: 'rotation'
    },
    {
        id: 20,
        question: "On the equator, how do day and night lengths vary throughout the year?",
        options: [
            "Days are always longer than nights",
            "Nights are always longer than days",
            "Day and night are always about 12 hours each",
            "It varies dramatically with seasons"
        ],
        correctAnswer: 2,
        explanation: "On the equator, day and night are always approximately 12 hours each throughout the year. This is because the equator receives sunlight at a fairly constant angle year-round.",
        difficulty: 'medium',
        topic: 'seasons'
    }
];

const RevolutionPracticeMode: React.FC = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState(0);
    const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [streak, setStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);
    const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);

    useEffect(() => {
        setAnsweredQuestions(new Array(questions.length).fill(false));
        setUserAnswers(new Array(questions.length).fill(null));
    }, []);

    const handleAnswerSelect = (answerIndex: number) => {
        if (showExplanation) return;
        setSelectedAnswer(answerIndex);
    };

    const handleSubmit = () => {
        if (selectedAnswer === null) return;

        setShowExplanation(true);
        const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;

        if (isCorrect) {
            setScore(score + 1);
            setStreak(streak + 1);
            if (streak + 1 > bestStreak) {
                setBestStreak(streak + 1);
            }
        } else {
            setStreak(0);
        }

        const newAnswered = [...answeredQuestions];
        newAnswered[currentQuestion] = true;
        setAnsweredQuestions(newAnswered);

        const newUserAnswers = [...userAnswers];
        newUserAnswers[currentQuestion] = selectedAnswer;
        setUserAnswers(newUserAnswers);
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        } else {
            setQuizCompleted(true);
        }
    };

    const handleRestart = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setScore(0);
        setStreak(0);
        setQuizCompleted(false);
        setAnsweredQuestions(new Array(questions.length).fill(false));
        setUserAnswers(new Array(questions.length).fill(null));
    };

    const getScorePercentage = () => {
        return Math.round((score / questions.length) * 100);
    };

    const getScoreMessage = () => {
        const percentage = getScorePercentage();
        if (percentage >= 90) return { text: "Outstanding! ðŸŽ‰", color: "text-yellow-300" };
        if (percentage >= 75) return { text: "Excellent Work! ðŸŒŸ", color: "text-green-300" };
        if (percentage >= 60) return { text: "Good Job! ðŸ‘", color: "text-blue-300" };
        if (percentage >= 50) return { text: "Keep Practicing! ðŸ’ª", color: "text-purple-300" };
        return { text: "Don't Give Up! ðŸŒ±", color: "text-orange-300" };
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            case 'hard': return 'bg-red-500/20 text-red-300 border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        }
    };

    const getTopicIcon = (topic: string) => {
        switch (topic) {
            case 'rotation': return 'ðŸ”„';
            case 'revolution': return 'ðŸŒ';
            case 'seasons': return 'ðŸŒ¡ï¸';
            case 'eclipses': return 'ðŸŒ‘';
            default: return 'ðŸ“š';
        }
    };

    if (quizCompleted) {
        const scoreMsg = getScoreMessage();
        const percentage = getScorePercentage();

        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-800 text-white p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
                        <div className="text-center mb-8">
                            <Trophy className="w-24 h-24 mx-auto mb-4 text-yellow-400" />
                            <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                                Quiz Completed!
                            </h1>
                            <p className={`text-2xl font-bold ${scoreMsg.color}`}>{scoreMsg.text}</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-xl p-6 border border-blue-400/30 text-center">
                                <Target className="w-12 h-12 mx-auto mb-3 text-blue-400" />
                                <div className="text-sm text-blue-300 mb-1">Final Score</div>
                                <div className="text-3xl font-bold text-blue-100">
                                    {score}/{questions.length}
                                </div>
                                <div className="text-lg text-blue-200 mt-1">{percentage}%</div>
                            </div>

                            <div className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 rounded-xl p-6 border border-orange-400/30 text-center">
                                <Star className="w-12 h-12 mx-auto mb-3 text-orange-400" />
                                <div className="text-sm text-orange-300 mb-1">Best Streak</div>
                                <div className="text-3xl font-bold text-orange-100">{bestStreak}</div>
                                <div className="text-sm text-orange-200 mt-1">in a row</div>
                            </div>

                            <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-xl p-6 border border-purple-400/30 text-center">
                                <Award className="w-12 h-12 mx-auto mb-3 text-purple-400" />
                                <div className="text-sm text-purple-300 mb-1">Questions</div>
                                <div className="text-3xl font-bold text-purple-100">{questions.length}</div>
                                <div className="text-sm text-purple-200 mt-1">completed</div>
                            </div>
                        </div>

                        {/* Performance breakdown */}
                        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-500/30 mb-6">
                            <h3 className="text-xl font-bold mb-4 text-purple-300">Performance Breakdown</h3>
                            <div className="space-y-3">
                                {['easy', 'medium', 'hard'].map((difficulty) => {
                                    const diffQuestions = questions.filter(q => q.difficulty === difficulty);
                                    const correctAnswers = diffQuestions.filter((q) => {
                                        const qIndex = questions.indexOf(q);
                                        return userAnswers[qIndex] === q.correctAnswer;
                                    }).length;

                                    return (
                                        <div key={difficulty} className="flex items-center justify-between">
                                            <span className={`capitalize px-3 py-1 rounded-full text-sm ${getDifficultyColor(difficulty)}`}>
                                                {difficulty}
                                            </span>
                                            <div className="flex-1 mx-4 bg-slate-700 rounded-full h-3 overflow-hidden">
                                                <div
                                                    className={`h-full ${difficulty === 'easy' ? 'bg-green-500' :
                                                        difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                                                        }`}
                                                    style={{ width: `${diffQuestions.length > 0 ? (correctAnswers / diffQuestions.length) : 0 * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-sm text-slate-300">
                                                {correctAnswers}/{diffQuestions.length}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={handleRestart}
                                className="flex items-center gap-2 px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all shadow-lg hover:shadow-purple-500/50"
                            >
                                <RotateCcw size={20} />
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentQuestion];
    const isCorrect = selectedAnswer === currentQ.correctAnswer;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-800 text-white p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                            Practice Mode
                        </h1>
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-900/50 px-4 py-2 rounded-lg border border-purple-500/30">
                                <div className="text-xs text-purple-300">Streak</div>
                                <div className="text-xl font-bold text-yellow-400 flex items-center gap-1">
                                    <Star size={16} className="fill-current" />
                                    {streak}
                                </div>
                            </div>
                            <div className="bg-blue-900/50 px-4 py-2 rounded-lg border border-blue-500/30">
                                <div className="text-xs text-blue-300">Score</div>
                                <div className="text-xl font-bold text-blue-200">
                                    {score}/{questions.length}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-slate-800/50 rounded-full h-3 overflow-hidden mb-2">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        />
                    </div>
                    <div className="text-sm text-slate-400 text-center">
                        Question {currentQuestion + 1} of {questions.length}
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-purple-500/30 mb-6">
                    {/* Question Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-3xl">{getTopicIcon(currentQ.topic)}</span>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(currentQ.difficulty)}`}>
                                    {currentQ.difficulty.toUpperCase()}
                                </span>
                                <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-300 capitalize">
                                    {currentQ.topic}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Question Text */}
                    <h2 className="text-xl md:text-2xl font-bold mb-6 text-purple-100 leading-relaxed">
                        {currentQ.question}
                    </h2>

                    {/* Options */}
                    <div className="space-y-3 mb-6">
                        {currentQ.options.map((option, index) => {
                            const isSelected = selectedAnswer === index;
                            const isCorrectAnswer = index === currentQ.correctAnswer;
                            const showCorrect = showExplanation && isCorrectAnswer;
                            const showIncorrect = showExplanation && isSelected && !isCorrect;

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerSelect(index)}
                                    disabled={showExplanation}
                                    className={`
                    w-full text-left p-4 rounded-xl border-2 transition-all
                    ${showCorrect
                                            ? 'bg-green-900/30 border-green-500 text-green-100'
                                            : showIncorrect
                                                ? 'bg-red-900/30 border-red-500 text-red-100'
                                                : isSelected
                                                    ? 'bg-purple-900/50 border-purple-400 text-purple-100'
                                                    : 'bg-slate-700/30 border-slate-600 text-slate-200 hover:bg-slate-700/50 hover:border-slate-500'
                                        }
                    ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}
                  `}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center font-bold border-2
                      ${showCorrect
                                                ? 'bg-green-500 border-green-400 text-white'
                                                : showIncorrect
                                                    ? 'bg-red-500 border-red-400 text-white'
                                                    : isSelected
                                                        ? 'bg-purple-500 border-purple-400 text-white'
                                                        : 'bg-slate-600 border-slate-500 text-slate-300'
                                            }
                    `}>
                                            {showCorrect ? <CheckCircle size={20} /> : showIncorrect ? <XCircle size={20} /> : String.fromCharCode(65 + index)}
                                        </div>
                                        <span className="flex-1">{option}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Explanation */}
                    {showExplanation && (
                        <div className={`
              rounded-xl p-5 border-2 mb-6 animate-fadeIn
              ${isCorrect
                                ? 'bg-green-900/20 border-green-500/50'
                                : 'bg-red-900/20 border-red-500/50'
                            }
            `}>
                            <div className="flex items-start gap-3">
                                {isCorrect ? (
                                    <CheckCircle className="text-green-400 flex-shrink-0 mt-1" size={24} />
                                ) : (
                                    <XCircle className="text-red-400 flex-shrink-0 mt-1" size={24} />
                                )}
                                <div>
                                    <h3 className={`font-bold text-lg mb-2 ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                                        {isCorrect ? 'Correct! ðŸŽ‰' : 'Not quite right'}
                                    </h3>
                                    <p className={`leading-relaxed ${isCorrect ? 'text-green-100' : 'text-red-100'}`}>
                                        {currentQ.explanation}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        {!showExplanation ? (
                            <button
                                onClick={handleSubmit}
                                disabled={selectedAnswer === null}
                                className={`
                  flex-1 py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2
                  ${selectedAnswer === null
                                        ? 'bg-slate-600 cursor-not-allowed text-slate-400'
                                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/50'
                                    }
                `}
                            >
                                <CheckCircle size={20} />
                                Submit Answer
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                className="flex-1 py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/50"
                            >
                                {currentQuestion < questions.length - 1 ? 'Next Question' : 'View Results'}
                                <ArrowRight size={20} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Question Navigator */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/30">
                    <div className="text-sm text-slate-400 mb-2">Question Navigator</div>
                    <div className="grid grid-cols-10 gap-2">
                        {questions.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    if (answeredQuestions[index]) {
                                        setCurrentQuestion(index);
                                        setSelectedAnswer(null);
                                        setShowExplanation(false);
                                    }
                                }}
                                className={`
                  aspect-square rounded-lg font-bold text-sm transition-all
                  ${index === currentQuestion
                                        ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                                        : answeredQuestions[index]
                                            ? 'bg-green-600/30 text-green-300 hover:bg-green-600/50'
                                            : 'bg-slate-700 text-slate-400'
                                    }
                  ${answeredQuestions[index] && index !== currentQuestion ? 'cursor-pointer' : ''}
                `}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
        </div>
    );
};

const scenarios: Scenario[] = [
    {
        id: 1,
        title: "Planning an International Cricket Match",
        icon: "ðŸ",
        difficulty: "Easy",
        context: "India is playing a cricket match against Australia. The match in Sydney starts at 10:00 AM local time.",
        question: "If Sydney is 4.5 hours ahead of India (IST), what time should Indian fans wake up to watch the live match?",
        realWorldConnection: "Time zones exist because Earth rotates from West to East. Countries in the east experience sunrise earlier than those in the west.",
        solution: "Indian fans should wake up at 5:30 AM IST to watch the match live.",
        explanation: "Since Sydney is 4.5 hours ahead of India:\nâ€¢ When it's 10:00 AM in Sydney\nâ€¢ It's 10:00 AM - 4.5 hours = 5:30 AM in India\n\nThis time difference exists because Earth rotates from West to East. Sydney, being further east, experiences sunrise earlier and is ahead in time.",
        tips: [
            "Countries east of India have later times",
            "Countries west of India have earlier times",
            "Time zones are created by Earth's rotation"
        ]
    },
    {
        id: 2,
        title: "Farmer's Planting Season",
        icon: "ðŸŒ¾",
        difficulty: "Medium",
        context: "Ravi is a farmer in Punjab. He knows that wheat grows best when planted after the monsoon rains, during the cooler months with shorter days.",
        question: "Should Ravi plant wheat in June (summer) or November (after monsoon)? Explain using your knowledge of seasons.",
        realWorldConnection: "Seasons occur due to Earth's tilted axis. Different crops grow better in different seasons based on temperature and daylight hours.",
        solution: "Ravi should plant wheat in November (after monsoon).",
        explanation: "Wheat should be planted in November because:\n\n1. **Temperature**: November marks the beginning of winter in Northern India. Wheat is a rabi crop that grows best in cooler temperatures (15-20Â°C).\n\n2. **Day Length**: In November, days are getting shorter (less than 12 hours). Wheat requires this shorter day length for optimal growth.\n\n3. **Season Cycle**: Due to Earth's tilted axis:\n   â€¢ In June (summer solstice), Northern Hemisphere experiences longer, hotter days\n   â€¢ In November, temperatures cool down and days shorten\n   â€¢ This cooling period is ideal for wheat germination\n\n4. **Monsoon Benefits**: The soil retains moisture from monsoon rains, providing good conditions for planting.",
        tips: [
            "Summer (June): Hot, long days - not suitable for wheat",
            "Winter (November): Cool, shorter days - perfect for wheat",
            "Seasons affect crop growth patterns"
        ]
    },
    {
        id: 3,
        title: "Solar Panel Installation",
        icon: "â˜€ï¸",
        difficulty: "Medium",
        context: "A family in Delhi wants to install solar panels on their roof. They want to know which direction to face the panels and whether panels will generate the same energy in summer and winter.",
        question: "In which direction should they install the panels, and will energy generation be different in summer vs winter?",
        realWorldConnection: "The Sun's apparent path changes with seasons due to Earth's tilt. This affects solar energy potential throughout the year.",
        solution: "Panels should face South. Summer will generate more energy than winter.",
        explanation: "**Direction**: Solar panels should face **South** in the Northern Hemisphere (like Delhi).\n\n**Why South?**\nâ€¢ As Earth rotates West to East, the Sun appears to move from East to West\nâ€¢ In Northern Hemisphere, the Sun's path is through the southern part of the sky\nâ€¢ South-facing panels receive maximum sunlight throughout the day\n\n**Seasonal Variation**:\n\n**Summer (June)**:\nâ€¢ Northern Hemisphere tilts towards the Sun\nâ€¢ Sun is higher in the sky\nâ€¢ Longer days (14-15 hours of daylight)\nâ€¢ More intense sunlight\nâ€¢ **Higher energy generation**\n\n**Winter (December)**:\nâ€¢ Northern Hemisphere tilts away from the Sun\nâ€¢ Sun is lower in the sky\nâ€¢ Shorter days (10-11 hours of daylight)\nâ€¢ Less intense sunlight\nâ€¢ **Lower energy generation**\n\nThe difference can be 40-60% less energy in winter compared to summer due to Earth's axial tilt and revolution around the Sun.",
        tips: [
            "North faces panels away from Sun's path",
            "Summer has ~4 hours more sunlight than winter in Delhi",
            "Earth's tilt causes this seasonal variation"
        ]
    },
    {
        id: 4,
        title: "Planning a Solar Eclipse Trip",
        icon: "ðŸŒ‘",
        difficulty: "Hard",
        context: "A total solar eclipse will be visible from a narrow path across India on April 20th. Your family wants to travel from Mumbai to witness it. The path of totality passes through Varanasi.",
        question: "Your flight lands in Varanasi at 11:00 AM, and the eclipse totality lasts from 11:45 AM to 11:48 AM (3 minutes). Is this enough time? What precautions should you take?",
        realWorldConnection: "Solar eclipses occur when the Moon passes between Earth and the Sun. The shadow moves across Earth due to both Earth's rotation and the Moon's motion.",
        solution: "Yes, there's enough time, but it's tight. Proper planning and safety equipment are essential.",
        explanation: "**Timing Analysis**:\nâ€¢ Flight lands: 11:00 AM\nâ€¢ Totality begins: 11:45 AM\nâ€¢ Time available: 45 minutes\nâ€¢ This is theoretically enough time, BUT consider:\n  - Airport exit time: 15-20 minutes\n  - Travel to viewing location: 20-30 minutes\n  - This leaves only 5-10 minutes buffer - RISKY!\n\n**Recommendation**: Arrive the night before to ensure you don't miss this rare event.\n\n**Why Totality is So Short (3 minutes)**:\n1. **Moon's Shadow Speed**: The Moon's shadow moves across Earth at ~2,000 km/h due to:\n   - Earth's rotation (1,670 km/h at equator)\n   - Moon's orbital motion around Earth\n\n2. **Narrow Path**: The Moon's shadow on Earth is only ~100-200 km wide\n\n3. **Relative Motion**: The shadow sweeps across the surface quickly\n\n**Essential Safety Precautions**:\n\n**Before Totality (Partial Phase)**:\nâœ— NEVER look directly at the Sun\nâœ— Regular sunglasses are NOT safe\nâœ“ Use certified solar eclipse glasses (ISO 12312-2)\nâœ“ Use pinhole projection method\n\n**During Totality (2-3 minutes)**:\nâœ“ Safe to look directly (Sun is completely covered)\nâœ“ Remove eclipse glasses to see corona\nâœ“ Amazing sight - the sky darkens, stars appear\n\n**After Totality**:\nâœ— Immediately put eclipse glasses back on\nâœ— The Sun is dangerous again\n\n**Why So Dangerous?**\nEven 1% of the Sun visible can permanently damage your eyes. The Sun is intense enough to cause blindness even during an eclipse.",
        tips: [
            "Plan to arrive a day early",
            "Eclipse glasses are MANDATORY",
            "Never look at partial phases without protection",
            "Totality is the only safe time to look directly",
            "Moon's shadow moves at ~2,000 km/h across Earth"
        ]
    },
    {
        id: 5,
        title: "Stargazing Adventure Planning",
        icon: "â­",
        difficulty: "Medium",
        context: "You want to see the Orion constellation, which is prominent in the northern winter sky. You're planning a stargazing trip from Bangalore.",
        question: "In which months (March, June, September, or December) will Orion be best visible in the evening sky? Why does this change?",
        realWorldConnection: "Different constellations are visible in different months because Earth revolves around the Sun, changing our nighttime view of space.",
        solution: "Orion is best visible in December and January evenings.",
        explanation: "**Best Viewing**: Orion is most prominently visible in the evening sky during **December and January**.\n\n**Why Visibility Changes Through the Year**:\n\nAs Earth revolves around the Sun (365 days), our nighttime view points toward different parts of space:\n\n**December-January** (BEST):\nâ€¢ Earth's nightside faces the direction of Orion\nâ€¢ Orion rises in the East around sunset\nâ€¢ Visible throughout the night\nâ€¢ Highest in the sky around midnight\nâ€¢ Perfect viewing conditions\n\n**March**:\nâ€¢ Orion visible in evening but setting earlier\nâ€¢ Best viewing in early evening\nâ€¢ By late night, it's too low on horizon\n\n**June** (WORST):\nâ€¢ Earth has revolved to opposite side of Sun\nâ€¢ Orion is in the daytime sky\nâ€¢ Completely invisible at night\nâ€¢ Sun is in the same direction as Orion\n\n**September**:\nâ€¢ Orion starts becoming visible again\nâ€¢ Rises just before dawn\nâ€¢ Not good for evening stargazing\n\n**The Science Behind It**:\n\n1. **Earth's Revolution**: As we orbit the Sun, we complete 360Â° in 365 days (~1Â° per day)\n\n2. **Changing View**: Each month, our nighttime view shifts by about 30Â°\n\n3. **Constellation Cycle**: Each constellation has a ~6-month \"visibility season\"\n   - 3 months before peak: Rising before dawn\n   - Peak months: Visible all night\n   - 3 months after peak: Setting after sunset\n   - Opposite 6 months: In daytime sky\n\n**Practical Tips for Bangalore**:\nâ€¢ Best months: November - February\nâ€¢ Look towards the East in early evening\nâ€¢ Orion will be high in the southern sky by 9-10 PM\nâ€¢ Easily identifiable by three stars in a row (Orion's belt)\nâ€¢ Best after moonset for darker skies",
        tips: [
            "Orion is a winter constellation in Northern Hemisphere",
            "Each constellation is best visible for ~3-4 months",
            "Use a stargazing app to find exact rising times",
            "Moon phases affect visibility - new moon is best"
        ]
    },
    {
        id: 6,
        title: "Choosing Holiday Destination",
        icon: "âœˆï¸",
        difficulty: "Easy",
        context: "Your family wants to take a winter vacation in December to escape the cold weather in Delhi and enjoy warm, sunny beaches.",
        question: "Should you go to Australia or Sri Lanka? Explain using your knowledge of seasons in different hemispheres.",
        realWorldConnection: "Seasons are opposite in Northern and Southern Hemispheres due to Earth's axial tilt as it revolves around the Sun.",
        solution: "Go to Australia! It will be summer there in December.",
        explanation: "**Best Choice**: **Australia** will be perfect for a warm beach vacation in December!\n\n**Reasoning**:\n\n**Australia (Southern Hemisphere)**:\nâ€¢ December = **SUMMER** â˜€ï¸\nâ€¢ Temperature: 25-35Â°C (warm and sunny)\nâ€¢ Perfect beach weather\nâ€¢ Long days, short nights\nâ€¢ Why? Southern Hemisphere tilts TOWARDS the Sun in December\n\n**Sri Lanka (Near Equator)**:\nâ€¢ December = Pleasant weather (26-30Â°C)\nâ€¢ However, it's monsoon season on east coast\nâ€¢ West coast is better in December\nâ€¢ Not as dramatic temperature difference since it's near equator\n\n**The Science - Why Seasons are Opposite**:\n\n**In December**:\nâ€¢ Earth's North Pole tilts AWAY from Sun â†’ Winter in Northern Hemisphere\nâ€¢ Earth's South Pole tilts TOWARDS Sun â†’ Summer in Southern Hemisphere\n\n**In June** (opposite situation):\nâ€¢ Earth's North Pole tilts TOWARDS Sun â†’ Summer in Northern Hemisphere  \nâ€¢ Earth's South Pole tilts AWAY from Sun â†’ Winter in Southern Hemisphere\n\n**Understanding the Tilt**:\n1. Earth's axis is tilted at 23.5Â°\n2. This tilt remains constant as Earth revolves around Sun\n3. For 6 months, Northern Hemisphere tilts toward Sun (March-September)\n4. For 6 months, Southern Hemisphere tilts toward Sun (September-March)\n\n**Practical Application**:\nâ€¢ Escaping Northern winter? â†’ Go South (Australia, New Zealand, Argentina)\nâ€¢ Escaping Northern summer heat? â†’ Go South for cooler weather\nâ€¢ Want consistent weather year-round? â†’ Go near Equator (Sri Lanka, Singapore)",
        tips: [
            "December = Summer in Australia, Winter in India",
            "Countries near equator have less seasonal variation",
            "This happens due to Earth's 23.5Â° tilt",
            "Seasons are reversed across the equator"
        ]
    }
];

const RevolutionRealWorld: React.FC = () => {
    const [selectedScenario, setSelectedScenario] = useState<number | null>(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [showSolution, setShowSolution] = useState(false);

    const currentScenario = selectedScenario !== null ? scenarios[selectedScenario] : null;

    const handleSubmit = () => {
        if (userAnswer.trim().length > 0) {
            setShowSolution(true);
        }
    };

    const handleNext = () => {
        if (selectedScenario !== null && selectedScenario < scenarios.length - 1) {
            setSelectedScenario(selectedScenario + 1);
            setUserAnswer('');
            setShowSolution(false);
        }
    };

    const handlePrevious = () => {
        if (selectedScenario !== null && selectedScenario > 0) {
            setSelectedScenario(selectedScenario - 1);
            setUserAnswer('');
            setShowSolution(false);
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'Medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            case 'Hard': return 'bg-red-500/20 text-red-300 border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        }
    };

    if (currentScenario === null) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white p-4 md:p-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                            Real World Applications
                        </h1>
                        <p className="text-lg text-blue-200 mb-2">
                            Apply your knowledge to solve real-life scenarios!
                        </p>
                        <p className="text-sm text-slate-400">
                            See how Earth's rotation and revolution affect our daily lives
                        </p>
                    </div>

                    {/* Info Box */}
                    <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30 mb-8">
                        <div className="flex items-start gap-4">
                            <Info className="text-blue-400 flex-shrink-0 mt-1" size={24} />
                            <div>
                                <h3 className="font-bold text-lg mb-2 text-blue-300">How It Works</h3>
                                <ul className="space-y-2 text-blue-100 text-sm">
                                    <li>â€¢ Read each real-world scenario carefully</li>
                                    <li>â€¢ Think about how Earth's motion creates these situations</li>
                                    <li>â€¢ Write your answer based on what you learned</li>
                                    <li>â€¢ Check the detailed explanation to learn more</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Scenario Cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {scenarios.map((scenario, index) => (
                            <div
                                key={scenario.id}
                                onClick={() => setSelectedScenario(index)}
                                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                            >
                                <div className="text-5xl mb-4">{scenario.icon}</div>
                                <h3 className="text-xl font-bold mb-2 text-purple-200">{scenario.title}</h3>
                                <p className="text-sm text-slate-400 mb-4 line-clamp-3">{scenario.context}</p>
                                <div className="flex items-center justify-between">
                                    <span className={`text-xs px-3 py-1 rounded-full border ${getDifficultyColor(scenario.difficulty)}`}>
                                        {scenario.difficulty}
                                    </span>
                                    <ChevronRight className="text-purple-400" size={20} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="grid md:grid-cols-3 gap-4 mt-8">
                        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-xl p-4 border border-blue-400/30 text-center">
                            <Globe className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                            <div className="text-sm text-blue-300">Total Scenarios</div>
                            <div className="text-2xl font-bold text-blue-100">{scenarios.length}</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-xl p-4 border border-purple-400/30 text-center">
                            <Star className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                            <div className="text-sm text-purple-300">Topics Covered</div>
                            <div className="text-2xl font-bold text-purple-100">4</div>
                        </div>
                        <div className="bg-gradient-to-br from-pink-600/20 to-pink-800/20 rounded-xl p-4 border border-pink-400/30 text-center">
                            <Zap className="w-8 h-8 mx-auto mb-2 text-pink-400" />
                            <div className="text-sm text-pink-300">Real-World Skills</div>
                            <div className="text-2xl font-bold text-pink-100">100%</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header with back button */}
                <div className="mb-6">
                    <button
                        onClick={() => {
                            setSelectedScenario(null);
                            setUserAnswer('');
                            setShowSolution(false);
                        }}
                        className="text-purple-400 hover:text-purple-300 mb-4 flex items-center gap-2"
                    >
                        â† Back to Scenarios
                    </button>
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                            Scenario {(selectedScenario ?? 0) + 1} of {scenarios.length}
                        </h1>
                        <span className={`text-sm px-3 py-1 rounded-full border ${getDifficultyColor(currentScenario.difficulty)}`}>
                            {currentScenario.difficulty}
                        </span>
                    </div>
                </div>

                {/* Scenario Card */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-purple-500/30 mb-6">
                    {/* Icon and Title */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="text-6xl">{currentScenario.icon}</div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-purple-200">{currentScenario.title}</h2>
                        </div>
                    </div>

                    {/* Context */}
                    <div className="bg-blue-900/20 rounded-xl p-5 border border-blue-500/30 mb-6">
                        <h3 className="font-bold text-lg mb-2 text-blue-300 flex items-center gap-2">
                            <Info size={20} />
                            Context
                        </h3>
                        <p className="text-blue-100 leading-relaxed">{currentScenario.context}</p>
                    </div>

                    {/* Question */}
                    <div className="bg-purple-900/20 rounded-xl p-5 border border-purple-500/30 mb-6">
                        <h3 className="font-bold text-lg mb-2 text-purple-300">Question:</h3>
                        <p className="text-purple-100 leading-relaxed text-lg">{currentScenario.question}</p>
                    </div>

                    {/* Real World Connection */}
                    <div className="bg-green-900/20 rounded-xl p-5 border border-green-500/30 mb-6">
                        <h3 className="font-bold text-lg mb-2 text-green-300 flex items-center gap-2">
                            <Globe size={20} />
                            Real-World Connection
                        </h3>
                        <p className="text-green-100 leading-relaxed">{currentScenario.realWorldConnection}</p>
                    </div>

                    {/* Answer Input */}
                    {!showSolution && (
                        <div className="mb-6">
                            <label className="block text-sm font-semibold mb-2 text-slate-300">
                                Your Answer:
                            </label>
                            <textarea
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                placeholder="Type your answer here... Explain your reasoning using what you learned about Earth's rotation and revolution."
                                className="w-full p-4 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[150px]"
                            />
                            <button
                                onClick={handleSubmit}
                                disabled={userAnswer.trim().length === 0}
                                className={`
                  mt-4 w-full py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2
                  ${userAnswer.trim().length === 0
                                        ? 'bg-slate-600 cursor-not-allowed text-slate-400'
                                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/50'
                                    }
                `}
                            >
                                Check Solution
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}

                    {/* Solution */}
                    {showSolution && (
                        <div className="space-y-6 animate-fadeIn">
                            {/* Quick Answer */}
                            <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-xl p-5 border border-yellow-500/30">
                                <h3 className="font-bold text-lg mb-3 text-yellow-300 flex items-center gap-2">
                                    âœ“ Quick Answer
                                </h3>
                                <p className="text-yellow-100 text-lg font-semibold">{currentScenario.solution}</p>
                            </div>

                            {/* Detailed Explanation */}
                            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-500/30">
                                <h3 className="font-bold text-xl mb-4 text-slate-200">Detailed Explanation:</h3>
                                <div className="text-slate-100 leading-relaxed whitespace-pre-line">
                                    {currentScenario.explanation}
                                </div>
                            </div>

                            {/* Tips */}
                            <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-xl p-5 border border-cyan-500/30">
                                <h3 className="font-bold text-lg mb-3 text-cyan-300 flex items-center gap-2">
                                    ðŸ’¡ Key Takeaways
                                </h3>
                                <ul className="space-y-2">
                                    {currentScenario.tips.map((tip, index) => (
                                        <li key={index} className="text-cyan-100 flex items-start gap-2">
                                            <span className="text-cyan-400 mt-1">â€¢</span>
                                            <span>{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                {showSolution && (
                    <div className="flex gap-4">
                        <button
                            onClick={handlePrevious}
                            disabled={selectedScenario === 0}
                            className={`
                flex-1 py-3 px-6 rounded-lg font-semibold transition-all
                ${selectedScenario === 0
                                    ? 'bg-slate-700 cursor-not-allowed text-slate-500'
                                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                                }
              `}
                        >
                            â† Previous
                        </button>
                        {selectedScenario !== null && selectedScenario < scenarios.length - 1 ? (
                            <button
                                onClick={handleNext}
                                className="flex-1 py-3 px-6 rounded-lg font-semibold transition-all bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/50"
                            >
                                Next Scenario â†’
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setSelectedScenario(null);
                                    setUserAnswer('');
                                    setShowSolution(false);
                                }}
                                className="flex-1 py-3 px-6 rounded-lg font-semibold transition-all bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-lg hover:shadow-green-500/50"
                            >
                                Complete! ðŸŽ‰
                            </button>
                        )}
                    </div>
                )}
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
        </div>
    );
};

// ============================================================================
// Main Component
// ============================================================================
interface RevolutionLearningProps {
    mode: "learn" | "practice" | "applications";
    setMode: (mode: "learn" | "practice" | "applications") => void;
}

const RevolutionLearning: React.FC<RevolutionLearningProps> = ({ mode, setMode }) => {
    return (
        <LanguageProvider>
            <div style={{
                minHeight: "100vh",
                width: "100%",
                background: "#ffffff",
                paddingTop: "100px",
                paddingBottom: "60px",
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
            }}>
                <Navbar mode={mode} setMode={setMode} />
                <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
                    {mode === "learn" && <RevolutionLearnMode />}
                    {mode === "practice" && <RevolutionPracticeMode />}
                    {mode === "applications" && <RevolutionRealWorld />}
                </div>
            </div>
        </LanguageProvider>
    );
};

export { RevolutionLearnMode, RevolutionPracticeMode, RevolutionRealWorld };
export default RevolutionLearning;
