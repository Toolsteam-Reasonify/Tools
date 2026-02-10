// @ts-ignore - React types may not be found but React is available at runtime
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import React, {
    useState,
    useEffect,
    useRef,
    createContext,
    useContext,
    useCallback,
// @ts-ignore
} from "react";
// @ts-ignore - React types may not be found but React is available at runtime
import type { ReactNode } from "react";
// Globe icon removed - using inline SVG instead

// ============================================================================
// Language Context & Translations
// ============================================================================

export type Language = "en";

export const translationsData: { [key: string]: any } = {
    en: {
        nav: {
            logo: "Eclipses of the Earth",
            tabs: {
                learn: "Learn",
                practice: "Practice",
                applications: "Real World",
            },
        },
        learn: {
            header: 'Eclipses of the Earth',
            subtitle: 'Earth\'s Journey Around the Sun',
            placeholder: 'Eclipses Learn Content Coming Soon...'
        },
        practice: {
            header: 'Practice Eclipses',
            subtitle: 'Test your knowledge',
            placeholder: 'Eclipses Practice Quiz Coming Soon...'
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
            questionNavigator: "Question Navigator"
        },
        realWorld: {
            header: "Real World Applications",
            subtitle: "Apply your knowledge to solve real-life scenarios!",
            description: "See how Earth's rotation and eclipses affect our daily lives",
            howItWorks: "How It Works",
            howItWorks1: "Read each real-world scenario carefully",
            howItWorks2: "Think about how Earth's motion creates these situations",
            howItWorks3: "Write your answer based on what you learned",
            howItWorks4: "Check the detailed explanation to learn more",
            totalScenarios: "Total Scenarios",
            topicsCovered: "Topics Covered",
            realWorldSkills: "Real-World Skills",
            backToScenarios: "Back to Scenarios",
            scenario: "Scenario",
            context: "Context",
            question: "Question:",
            realWorldConnection: "Real-World Connection",
            yourAnswer: "Your Answer:",
            answerPlaceholder: "Type your answer here... Explain your reasoning using what you learned about Earth's rotation and eclipses.",
            checkSolution: "Check Solution",
            quickAnswer: "Quick Answer",
            detailedExplanation: "Detailed Explanation:",
            keyTakeaways: "💡 Key Takeaways",
            previous: "← Previous",
            nextScenario: "Next Scenario →",
            complete: "Complete! 🎉"
        },
        eclipseLearnContent: {
            title: "ECLIPSES",
            subtitle: "Chapter 12.3 — Earth, Moon, and the Sun",
            solarEclipse: "Solar Eclipse",
            lunarEclipse: "Lunar Eclipse",
            solarEclipseDesc: "A solar eclipse occurs when the Moon comes between the Sun and Earth, blocking sunlight from reaching us. This celestial alignment creates one of nature's most spectacular phenomena, turning day into an eerie twilight.",
            apparentSizeTitle: "The Science of Apparent Size",
            apparentSizeDesc: "Though the Moon is much smaller than the Sun, it can completely block the Sun because of apparent size. The Moon is about 400 times smaller than the Sun, but it's also about 400 times closer to Earth. This remarkable cosmic coincidence makes both celestial bodies appear nearly the same size in our sky!",
            totalSolarEclipse: "Total Solar Eclipse",
            totalSolarEclipseDesc: "The Moon completely blocks the Sun. Observers in the Moon's shadow (umbra) experience complete darkness for a few minutes. The Sun's beautiful corona becomes visible as a glowing halo around the dark Moon.",
            partialSolarEclipse: "Partial Solar Eclipse",
            partialSolarEclipseDesc: "The Moon only partially blocks the Sun. Observers in the penumbra see a portion of the Sun still visible, appearing as if a bite has been taken out of the solar disk.",
            safetyWarning: "⚠️ Safety Warning",
            safetyWarningText: "Never look directly at a solar eclipse! Even during an eclipse, the Sun is intense enough to damage your eyes permanently and cause blindness. Do not view through regular sunglasses, binoculars, or telescopes. Always use specialized ISO-certified solar eclipse glasses or attend organized viewing events at planetariums and astronomy clubs.",
            lunarEclipseDesc: "A lunar eclipse occurs when Earth comes between the Sun and Moon, blocking sunlight from reaching the lunar surface. The Earth's shadow falls upon the Moon, creating a dramatic celestial display visible to everyone on the night side of Earth.",
            bloodMoonTitle: "The Blood Moon Phenomenon",
            bloodMoonDesc: "During a total lunar eclipse, the Moon doesn't go completely dark. Instead, it transforms into a striking dark red color, earning it the dramatic name \"Blood Moon.\" This happens because Earth's atmosphere bends some sunlight around our planet, filtering out blue wavelengths and allowing only red light to reach and illuminate the Moon.",
            totalLunarEclipse: "Total Lunar Eclipse",
            totalLunarEclipseDesc: "The Moon is completely within Earth's umbra (full shadow). The entire Moon takes on a reddish-copper color, creating the famous \"Blood Moon\" effect that can last for over an hour.",
            partialLunarEclipse: "Partial Lunar Eclipse",
            partialLunarEclipseDesc: "Only part of the Moon passes through Earth's umbra. You can observe both the shadowed (dark/reddish) portion and the brightly illuminated portion of the Moon simultaneously.",
            safeToView: "✅ Safe to View",
            safeToViewText: "Unlike solar eclipses, lunar eclipses are completely safe to view with the naked eye! You can observe the entire event without any special protective equipment. Lunar eclipses can also be seen from a much larger area of Earth compared to solar eclipses, making them more accessible to observe.",
            historicalTitle: "Historical and Cultural Significance",
            historicalText1: "People have observed and recorded eclipses since ancient times. When the reasons for eclipses were unknown, they were often feared. Many ancient civilizations attached superstitions to these events. However, ancient Indian astronomers developed sophisticated mathematical methods to accurately predict eclipses centuries ago.",
            historicalText2: "The Kodaikanal Solar Observatory, established in 1899 in the beautiful Palani hills of southern India, has been studying the Sun for over 125 years. It is operated by the Indian Institute of Astrophysics (IIA), Bengaluru, and continues to contribute valuable data to our understanding of solar phenomena.",
            keyFactsTitle: "Key Facts to Remember",
            sunDiameter: "Sun Diameter",
            earthDiameter: "Earth Diameter",
            moonDiameter: "Moon Diameter",
            sunEarthDistance: "Sun-Earth Distance",
            moonEarthDistance: "Moon-Earth Distance",
            eclipseDuration: "Total Eclipse Duration",
            footerText: "Based on NCERT Curiosity Textbook of Science — Grade 7",
            footerQuote: "Your curiosity is the spark that lights the flame of exploration"
        },
        eclipsePracticeContent: {
            title: "PRACTICE MODE",
            subtitle: "Eclipses — Test Your Knowledge",
            questionOf: "Question",
            of: "of",
            score: "Score",
            nextQuestion: "Next Question →",
            seeResults: "See Results",
            correct: "✓ Correct!",
            incorrect: "✗ Incorrect",
            quizCompleted: "Quiz Completed!",
            yourScore: "Your Score",
            excellent: "Excellent! You have mastered eclipses!",
            goodJob: "Good job! Keep learning!",
            keepPracticing: "Keep practicing to improve!",
            tryAgain: "Try Again",
            footerText: "NCERT Curiosity Science — Grade 7 — Chapter 12.3",
            questions: {
                q1: {
                    question: "What causes a solar eclipse?",
                    options: [
                        "Earth comes between Sun and Moon",
                        "Moon comes between Sun and Earth",
                        "Sun comes between Earth and Moon",
                        "Stars block the sunlight"
                    ],
                    explanation: "A solar eclipse occurs when the Moon comes between the Sun and Earth, blocking sunlight from reaching us."
                },
                q2: {
                    question: "Why can the Moon block the Sun despite being much smaller?",
                    options: [
                        "The Moon is actually larger than the Sun",
                        "The Sun shrinks during an eclipse",
                        "The Moon is much closer, making their apparent sizes similar",
                        "Earth's atmosphere magnifies the Moon"
                    ],
                    explanation: "The apparent size depends on both actual size and distance. The Moon is about 400 times smaller than the Sun but also about 400 times closer to Earth."
                },
                q3: {
                    question: "True or False: Lunar eclipses are safe to view with the naked eye.",
                    options: ["True", "False"],
                    explanation: "Unlike solar eclipses, lunar eclipses are completely safe to view with the naked eye without any special equipment."
                },
                q4: {
                    question: "What color does the Moon appear during a total lunar eclipse?",
                    options: ["Bright white", "Dark red", "Blue", "Yellow"],
                    explanation: "During a total lunar eclipse, the Moon appears dark red (called 'Blood Moon') because Earth's atmosphere filters out blue light and bends red light toward the Moon."
                },
                q5: {
                    question: "True or False: You should use regular sunglasses to view a solar eclipse.",
                    options: ["True", "False"],
                    explanation: "Regular sunglasses are NOT safe for viewing solar eclipses. You need specialized ISO-certified solar eclipse glasses or indirect viewing methods."
                },
                q6: {
                    question: "The darkest part of the shadow during an eclipse is called the:",
                    options: ["Penumbra", "Corona", "Umbra", "Atmosphere"],
                    explanation: "The umbra is the darkest, central part of the shadow where all direct light is blocked. The penumbra is the lighter outer shadow."
                },
                q7: {
                    question: "Which Indian observatory has been studying the Sun for over 125 years?",
                    options: [
                        "Mount Abu Observatory",
                        "Kodaikanal Solar Observatory",
                        "Ooty Radio Telescope",
                        "Vainu Bappu Observatory"
                    ],
                    explanation: "The Kodaikanal Solar Observatory, established in 1899 in the Palani hills, has been studying the Sun for over 125 years."
                },
                q8: {
                    question: "True or False: A total solar eclipse can be seen from anywhere on Earth when it occurs.",
                    options: ["True", "False"],
                    explanation: "A total solar eclipse is only visible from a narrow path on Earth where the Moon's umbra falls. Most areas see a partial eclipse or none at all."
                },
                q9: {
                    question: "During a solar eclipse, the glowing halo visible around the blocked Sun is called:",
                    options: ["Umbra", "Penumbra", "Corona", "Photosphere"],
                    explanation: "The corona is the Sun's outer atmosphere, which becomes visible as a beautiful glowing halo during a total solar eclipse."
                },
                q10: {
                    question: "Why does a lunar eclipse last longer than a solar eclipse?",
                    options: [
                        "The Moon moves slower",
                        "Earth's shadow is much larger than the Moon's shadow",
                        "The Sun is farther away",
                        "The Moon is larger than Earth"
                    ],
                    explanation: "Earth's shadow is much larger than the Moon's shadow, so the Moon takes longer to pass through it, making lunar eclipses last longer."
                },
                q11: {
                    question: "What is the approximate ratio of the Moon's size to the Sun's size?",
                    options: [
                        "1:100",
                        "1:400",
                        "1:1000",
                        "1:10000"
                    ],
                    explanation: "The Moon is about 400 times smaller than the Sun in actual size, but appears the same size because it's also about 400 times closer to Earth."
                },
                q12: {
                    question: "During a total solar eclipse, what becomes visible around the blocked Sun?",
                    options: [
                        "The Moon's surface",
                        "The Sun's corona",
                        "Earth's atmosphere",
                        "Stars in the sky"
                    ],
                    explanation: "The Sun's corona, which is the outer atmosphere of the Sun, becomes visible as a beautiful glowing halo during a total solar eclipse."
                },
                q13: {
                    question: "What is the maximum duration of a total solar eclipse?",
                    options: [
                        "2 minutes",
                        "5 minutes",
                        "7.5 minutes",
                        "10 minutes"
                    ],
                    explanation: "A total solar eclipse can last up to 7.5 minutes, though most are shorter. The duration depends on the alignment and distances of the celestial bodies."
                },
                q14: {
                    question: "Which part of the shadow during an eclipse allows partial visibility of the Sun or Moon?",
                    options: [
                        "Umbra",
                        "Penumbra",
                        "Corona",
                        "Atmosphere"
                    ],
                    explanation: "The penumbra is the lighter outer part of the shadow where only part of the light source is blocked, allowing partial visibility."
                },
                q15: {
                    question: "What ancient Indian text contains methods for calculating eclipse times?",
                    options: [
                        "Vedas",
                        "Surya Siddhanta",
                        "Bhagavad Gita",
                        "Ramayana"
                    ],
                    explanation: "The Surya Siddhanta is an ancient Indian astronomical text that contains detailed methods for calculating eclipse times, demonstrating advanced understanding of celestial mechanics."
                },
                q16: {
                    question: "True or False: The Moon appears the same size as the Sun in our sky because they are the same actual size.",
                    options: ["True", "False"],
                    explanation: "False. The Moon appears the same size as the Sun because of apparent size - the Moon is 400 times smaller but also 400 times closer, making them appear similar in size from Earth."
                },
                q17: {
                    question: "What is the approximate distance from Earth to the Sun?",
                    options: [
                        "15 million km",
                        "150 million km",
                        "1.5 billion km",
                        "15 billion km"
                    ],
                    explanation: "The average distance from Earth to the Sun is approximately 150 million kilometers (93 million miles)."
                },
                q18: {
                    question: "During which phase of the Moon can a solar eclipse occur?",
                    options: [
                        "Full Moon",
                        "New Moon",
                        "First Quarter",
                        "Last Quarter"
                    ],
                    explanation: "A solar eclipse occurs during a New Moon phase, when the Moon is positioned between the Earth and the Sun."
                },
                q19: {
                    question: "What causes the red color of the Moon during a total lunar eclipse?",
                    options: [
                        "The Moon's surface turns red",
                        "Earth's atmosphere filters and bends red light",
                        "The Sun appears red during eclipse",
                        "Dust in space reflects red light"
                    ],
                    explanation: "Earth's atmosphere filters out blue wavelengths and bends (refracts) red light around the planet, illuminating the Moon with red light during a total lunar eclipse."
                },
                q20: {
                    question: "True or False: You can safely view a partial solar eclipse with regular sunglasses.",
                    options: ["True", "False"],
                    explanation: "False. Even during a partial solar eclipse, you must use specialized ISO-certified solar eclipse glasses. Regular sunglasses do not provide adequate protection."
                }
            }
        },
        eclipseRealWorldContent: {
            title: "REAL WORLD",
            subtitle: "Eclipses — Real-World Examples and Applications",
            example: "Example",
            of: "of",
            previous: "← Previous",
            next: "Next →",
            realWorldExamples: "Real-World Examples",
            footerText: "NCERT Curiosity Science — Grade 7 — Chapter 12.3",
            examples: {
                example1: {
                    title: "Eclipse Tourism and Travel",
                    description: "People travel thousands of kilometers to witness total solar eclipses. The path of totality (where the eclipse is fully visible) is only about 100-200 km wide, creating a unique travel opportunity.",
                    details: "During the 2017 total solar eclipse in the United States, millions of people traveled to the path of totality. Hotels were booked months in advance, and special viewing events were organized. This shows how eclipses create real-world economic and social impacts.",
                    connection: "Understanding eclipse paths helps us plan safe viewing experiences and appreciate why some locations are better for observing eclipses than others."
                },
                example2: {
                    title: "Eclipse Photography and Science",
                    description: "Scientists and photographers use eclipses to study the Sun's corona and capture stunning images. The corona is normally invisible but becomes visible during total solar eclipses.",
                    details: "During eclipses, scientists can study the Sun's outer atmosphere, measure solar activity, and understand space weather. The 1919 solar eclipse helped prove Einstein's theory of general relativity by showing how starlight bends around the Sun.",
                    connection: "Eclipses provide unique opportunities for scientific research that cannot be done at any other time, advancing our understanding of the Sun and space."
                },
                example3: {
                    title: "Historical Eclipse Predictions",
                    description: "Ancient civilizations used eclipse predictions for calendars, agriculture, and religious ceremonies. Accurate predictions required deep understanding of celestial mechanics.",
                    details: "The ancient Mayans, Babylonians, and Indians all developed methods to predict eclipses. Indian astronomers using the Surya Siddhanta could predict eclipses with remarkable accuracy centuries before modern astronomy.",
                    connection: "Eclipse prediction demonstrates how understanding Earth-Moon-Sun relationships has practical applications in timekeeping, agriculture, and cultural practices."
                },
                example4: {
                    title: "Eclipse Safety and Public Health",
                    description: "During solar eclipses, public health campaigns educate people about eye safety. Many people are unaware that looking at the Sun during an eclipse can cause permanent blindness.",
                    details: "Health organizations worldwide issue warnings before solar eclipses. In 1999, during a solar eclipse visible in Europe, extensive public education campaigns prevented thousands of potential eye injuries. Schools and organizations distribute special eclipse glasses.",
                    connection: "Understanding eclipse safety is crucial for public health. This knowledge helps protect millions of people from permanent eye damage during these rare events."
                },
                example5: {
                    title: "Eclipse Impact on Wildlife",
                    description: "Animals react to solar eclipses in fascinating ways. Birds may stop singing, nocturnal animals may become active, and some animals may return to their nests, thinking night has fallen.",
                    details: "During the 2017 solar eclipse, researchers observed that bees stopped buzzing, spiders dismantled their webs, and chickens returned to roost. This shows how celestial events affect Earth's ecosystems and animal behavior.",
                    connection: "Eclipses demonstrate the interconnectedness of celestial events and life on Earth, showing how changes in sunlight affect all living things."
                },
                example6: {
                    title: "Eclipse in Navigation and Timekeeping",
                    description: "Historically, eclipses were used for navigation and timekeeping. Sailors and explorers used eclipse predictions to determine their location and keep accurate time.",
                    details: "Before modern GPS, sailors used eclipse predictions to calculate longitude. The precise timing of eclipses helped navigators determine their position at sea. Ancient calendars were also based on eclipse cycles.",
                    connection: "Eclipse knowledge has practical applications in navigation and timekeeping, showing how understanding celestial mechanics helps us navigate our world."
                },
                example7: {
                    title: "Solar Eclipse and Renewable Energy",
                    description: "During solar eclipses, solar power generation drops significantly. Power grid operators must prepare for this temporary loss of solar energy.",
                    details: "In 2015, during a solar eclipse in Europe, solar power generation dropped by about 75% in Germany. Power grid operators had to quickly switch to other energy sources to maintain electricity supply. This demonstrates how eclipses affect modern technology.",
                    connection: "Understanding eclipse timing helps renewable energy systems prepare for temporary power loss, showing the practical importance of eclipse predictions in modern society."
                },
                example8: {
                    title: "Lunar Eclipse and Cultural Celebrations",
                    description: "Many cultures celebrate lunar eclipses with festivals and ceremonies. The Blood Moon has special significance in various traditions around the world.",
                    details: "In India, lunar eclipses (Chandra Grahan) are observed with religious ceremonies. In some Native American cultures, lunar eclipses are seen as times of renewal. These cultural practices show how eclipses connect science with human traditions.",
                    connection: "Eclipses bridge science and culture, demonstrating how natural phenomena inspire art, religion, and community celebrations across different societies."
                }
            },
            upcomingEvents: "📅 Upcoming Eclipse Events",
            markCalendars: "Mark your calendars for these celestial events",
            total: "Total",
            partial: "Partial",
            eclipsesAndIndia: "🇮🇳 Eclipses and India",
            events: {
                event1: {
                    date: "March 14, 2025",
                    type: "Total Lunar Eclipse",
                    visibility: "Americas, Western Europe, Western Africa",
                    description: "A total lunar eclipse where the Moon will pass through Earth's umbra, creating a stunning Blood Moon visible for about 65 minutes."
                },
                event2: {
                    date: "March 29, 2025",
                    type: "Partial Solar Eclipse",
                    visibility: "Northwest Africa, Europe, Northern Russia",
                    description: "A partial solar eclipse where up to 93% of the Sun will be covered by the Moon in some regions."
                },
                event3: {
                    date: "September 7, 2025",
                    type: "Total Lunar Eclipse",
                    visibility: "Europe, Africa, Asia, Australia",
                    description: "Another total lunar eclipse offering excellent viewing opportunities across multiple continents."
                },
                event4: {
                    date: "September 21, 2025",
                    type: "Partial Solar Eclipse",
                    visibility: "South Pacific, New Zealand, Antarctica",
                    description: "A partial solar eclipse visible primarily from the southern hemisphere."
                },
                event5: {
                    date: "August 12, 2026",
                    type: "Total Solar Eclipse",
                    visibility: "Arctic, Greenland, Iceland, Spain",
                    description: "A spectacular total solar eclipse with the path of totality crossing the Arctic region and parts of Europe."
                }
            },
            indiaFacts: {
                fact1: {
                    title: "Kodaikanal Solar Observatory",
                    content: "Established in 1899, this observatory in Tamil Nadu's Palani hills has been studying the Sun for over 125 years, making it one of the oldest solar observatories still in operation.",
                    icon: "🔭"
                },
                fact2: {
                    title: "Vainu Bappu Observatory",
                    content: "Located in Kavalur, Tamil Nadu, this observatory houses one of Asia's largest telescopes and is named after M.K. Vainu Bappu, the father of modern Indian astronomy.",
                    icon: "🌟"
                },
                fact3: {
                    title: "Surya Siddhanta",
                    content: "This ancient Indian astronomical text contains detailed methods for calculating eclipse times. It demonstrates that Indian astronomers understood eclipse mechanics centuries ago.",
                    icon: "📜"
                },
                fact4: {
                    title: "Total Solar Eclipse 2031",
                    content: "On November 14, 2031, a total solar eclipse path will cross through southern India including parts of Kerala, Tamil Nadu, and Andhra Pradesh - a rare opportunity!",
                    icon: "🇮🇳"
                }
            }
        }
    }
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    translations: any; // Direct access to current language translations
}


interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    translations: any; // Direct access to current language translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>("en");

    const t = useCallback((key: string): string => {
        const keys = key.split(".");
        let value = translationsData[language];
        for (const k of keys) {
            if (value && value[k]) value = value[k];
            else {
                // Fallback to English if translation not found
                let fallbackValue = translationsData["en"];
                for (const k2 of keys) {
                    if (fallbackValue && fallbackValue[k2]) fallbackValue = fallbackValue[k2];
                    else return key; // Return key only if English also fails
                }
                return typeof fallbackValue === "string" ? fallbackValue : key;
            }
        }
        return typeof value === "string" ? value : key;
    }, [language]);

    const handleSetLanguage = (lang: Language) => {
        setLanguageState(lang);
    };

    // Get current language translations object
    const translations = translationsData[language] || translationsData["en"];

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, translations }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error("useLanguage must be used within LanguageProvider");
    return context;
};

// Helper function to get translated content for arrays
export const getTranslatedContent = (language: Language, key: string, index: number, field: string): string => {
    const langData = translationsData[language];
    if (langData && langData[key] && langData[key][index] && langData[key][index][field]) {
        return langData[key][index][field];
    }
    // Fallback to English
    const enData = translationsData.en;
    if (enData && enData[key] && enData[key][index] && enData[key][index][field]) {
        return enData[key][index][field];
    }
    return '';
};

// ============================================================================
// Font Family Helper
// ============================================================================
export const getFontFamilyForLanguage = (lang: Language | string): string => {
    const language = lang as Language;
    switch (language) {
        case "en":
        default:
            return 'Poppins, "Noto Sans", sans-serif';
    }
};


// ============================================================================
// Type Definitions (Following AGENT_PROMPT Guidelines)
// ============================================================================

type ModeType = "learn" | "practice" | "applications";

interface StepDetails {
    currentStep: number;
    totalSteps: number;
    isPaused: boolean;
    currentMode: ModeType;
}

interface BaseDataInterface {
    themeColor?: string;
    autoPlayDuration?: number;
}

interface StepDataInterface {
    id: number;
    title: string;
    description: string;
    type: 'intro' | 'explanation' | 'practice' | 'real_world' | 'hands_on';
    mode: ModeType;
    data?: any;
}

// Additional Props for Eclipses Tool
interface EclipsesAdditionalProps {
    eclipseType?: 'solar' | 'lunar' | 'both';
    animationSpeed?: number;
    showLabels?: boolean;
    highlightPhase?: number;
    customColors?: {
        sun?: string;
        earth?: string;
        moon?: string;
        shadow?: string;
    };
    [key: string]: any;
}

// Standardized Props Interface (Following Guidelines)
interface EclipsesLearningProps {
    props?: {
        // DIMENSIONS
        width?: number;
        height?: number;
        
        // DATA CONFIGURATION
        data?: BaseDataInterface;
        steps?: StepDataInterface[];
        
        // MODE CONFIGURATION
        initialMode?: ModeType;
        showModeSelector?: boolean;
        enabledModes?: ModeType[];
        
        // NAVIGATION CONFIGURATION
        showNavigation?: boolean;
        showPlayPause?: boolean;
        showStepIndicator?: boolean;
        
        // STEP FILTERING
        initialStep?: number;
        filterSteps?: number[];
        
        // ANIMATION CONFIGURATION
        animationSpeed?: number;
        autoPlayDuration?: number;
        
        // THEME
        themeColor?: string;
        darkMode?: boolean;
        
        // ADDITIONAL PROPS - TOOL-SPECIFIC DYNAMIC CONTENT
        additionalProps?: EclipsesAdditionalProps;
    };
    
    // EXTERNAL CONTROLS
    setStepDetails?: (stepDetails: StepDetails) => void;
    stopAutoNext?: boolean;
    setStopAutoNext?: (stopAutoNext: boolean) => void;
    
    // Legacy props for backward compatibility (using different names to avoid conflicts)
    mode?: ModeType;
    setMode?: (mode: ModeType) => void;
}

// ============================================================================
// Navbar Component
// ============================================================================
interface NavbarProps {
    mode: ModeType;
    setMode: (mode: ModeType) => void;
}

const Navbar: React.FC<NavbarProps> = ({ mode, setMode }) => {
    const { translations } = useLanguage();
    const safeTranslations = translations || translationsData["en"];

    const isLearn = mode === "learn";
    const isPractice = mode === "practice";
    const isApplications = mode === "applications";

    const navStyles: { [key: string]: React.CSSProperties } = {
        nav: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            background: 'linear-gradient(to right, #f0fdfa, #faf5ff, #f0fdfa)',
            borderBottom: '1px solid rgba(20, 184, 166, 0.5)',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(4px)',
        },
        container: {
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 8px',
        },
        inner: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '56px',
            flexWrap: 'wrap',
        },
        logoContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minWidth: 0,
            flex: '1 1 auto',
        },
        logoText: {
            fontSize: '18px',
            fontWeight: 700,
            color: '#0f766e',
            wordBreak: 'break-word',
            overflowWrap: 'anywhere',
        },
        buttonsContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            flexWrap: 'wrap',
        },
        button: {
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'all 0.2s ease',
            minHeight: '36px',
            border: 'none',
            cursor: 'pointer',
            touchAction: 'manipulation',
        },
        buttonActive: {
            background: 'linear-gradient(to right, #14b8a6, #a855f7)',
            color: 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        },
        buttonInactive: {
            color: '#0f766e',
        },
    };

    return (
        <>
            <style>{`
                @media (max-width: 640px) {
                    .navbar-logo-text {
                        font-size: 14px !important;
                    }
                    .navbar-button {
                        padding: 5px 8px !important;
                        font-size: 12px !important;
                        min-height: 32px !important;
                    }
                    .navbar-inner {
                        height: auto !important;
                        min-height: 56px !important;
                        padding: 8px 0 !important;
                    }
                    .navbar-buttons {
                        width: 100% !important;
                        justify-content: center !important;
                        margin-top: 8px !important;
                    }
                }
                @media (max-width: 480px) {
                    .navbar-logo-text {
                        font-size: 12px !important;
                    }
                    .navbar-button {
                        padding: 4px 6px !important;
                        font-size: 11px !important;
                        flex: 1 1 0 !important;
                    }
                }
            `}</style>
            <nav style={navStyles.nav}>
                <div style={navStyles.container}>
                    <div className="navbar-inner" style={navStyles.inner}>
                        <div style={navStyles.logoContainer}>
                            <svg
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    color: '#0d9488',
                                    flexShrink: 0,
                                }}
                                aria-hidden="true"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 002 2h2.945M15 10.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zM12 2a10 10 0 1010 10A10 10 0 0012 2z"
                                />
                            </svg>
                            <span className="navbar-logo-text" style={navStyles.logoText}>
                                {safeTranslations?.nav?.logo || 'Eclipses of the Earth'}
                            </span>
                        </div>

                        <div className="navbar-buttons" style={navStyles.buttonsContainer}>
                        <button
                            type="button"
                            onClick={() => setMode("learn")}
                            className="navbar-button"
                            style={{
                                ...navStyles.button,
                                ...(isLearn ? navStyles.buttonActive : navStyles.buttonInactive),
                                backgroundColor: isLearn ? undefined : 'transparent',
                            }}
                            onMouseEnter={(e) => {
                                if (!isLearn) {
                                    e.currentTarget.style.backgroundColor = 'rgba(20, 184, 166, 0.1)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isLearn) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            {safeTranslations?.nav?.tabs?.learn || 'Learn'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setMode("practice")}
                            className="navbar-button"
                            style={{
                                ...navStyles.button,
                                ...(isPractice ? navStyles.buttonActive : { color: '#7e22ce' }),
                                backgroundColor: isPractice ? undefined : 'transparent',
                            }}
                            onMouseEnter={(e) => {
                                if (!isPractice) {
                                    e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.1)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isPractice) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            {safeTranslations?.nav?.tabs?.practice || 'Practice'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setMode("applications")}
                            className="navbar-button"
                            style={{
                                ...navStyles.button,
                                ...(isApplications ? navStyles.buttonActive : { color: '#374151' }),
                                backgroundColor: isApplications ? undefined : 'transparent',
                            }}
                            onMouseEnter={(e) => {
                                if (!isApplications) {
                                    e.currentTarget.style.backgroundColor = 'rgba(156, 163, 175, 0.1)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isApplications) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            {safeTranslations?.nav?.tabs?.applications || 'Real World'}
                        </button>

                    </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

// ============================================================================
// Mode Components
// ============================================================================


type EclipseType = 'solar' | 'lunar';

const EclipsesLearnMode: React.FC = () => {
  const { translations } = useLanguage();
  const [activeEclipse, setActiveEclipse] = useState<EclipseType>('solar');
  const [animationPhase, setAnimationPhase] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  
  const t = translations?.eclipseLearnContent || {};

  // Smooth animation loop
  useEffect(() => {
    const animate = () => {
      setAnimationPhase(prev => (prev + 0.5) % 360);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Canvas rendering
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw starfield background
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width / 2);
    gradient.addColorStop(0, '#0d0d1a');
    gradient.addColorStop(1, '#050510');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw twinkling stars
    for (let i = 0; i < 80; i++) {
      const x = (Math.sin(i * 123.456 + 100) * 0.5 + 0.5) * width;
      const y = (Math.cos(i * 789.012 + 50) * 0.5 + 0.5) * height;
      const twinkle = 0.3 + Math.sin(animationPhase * 0.03 + i * 0.5) * 0.3;
      const size = 0.5 + (i % 3) * 0.5;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
      ctx.fill();
    }

    if (activeEclipse === 'solar') {
      drawSolarEclipse(ctx, width, height, animationPhase);
    } else {
      drawLunarEclipse(ctx, width, height, animationPhase);
    }

  }, [activeEclipse, animationPhase]);

  const drawSolarEclipse = (ctx: CanvasRenderingContext2D, width: number, height: number, phase: number) => {
    const centerY = height / 2;
    
    // Positions
    const sunX = 120;
    const sunY = centerY;
    const sunRadius = 55;
    
    const earthX = width - 100;
    const earthY = centerY;
    const earthRadius = 28;
    
    // Moon moves smoothly across
    const moonProgress = (Math.sin(phase * 0.015) + 1) / 2; // 0 to 1
    const moonX = 200 + moonProgress * 280;
    const moonY = centerY + Math.sin(phase * 0.02) * 15;
    const moonRadius = 18;

    // Draw sun rays (animated)
    ctx.save();
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2 + phase * 0.005;
      const rayLength = 25 + Math.sin(phase * 0.04 + i * 0.8) * 10;
      
      const rayGradient = ctx.createLinearGradient(
        sunX + Math.cos(angle) * sunRadius,
        sunY + Math.sin(angle) * sunRadius,
        sunX + Math.cos(angle) * (sunRadius + rayLength),
        sunY + Math.sin(angle) * (sunRadius + rayLength)
      );
      rayGradient.addColorStop(0, 'rgba(255, 220, 100, 0.6)');
      rayGradient.addColorStop(1, 'rgba(255, 180, 50, 0)');
      
      ctx.strokeStyle = rayGradient;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(sunX + Math.cos(angle) * sunRadius, sunY + Math.sin(angle) * sunRadius);
      ctx.lineTo(sunX + Math.cos(angle) * (sunRadius + rayLength), sunY + Math.sin(angle) * (sunRadius + rayLength));
      ctx.stroke();
    }
    ctx.restore();

    // Sun glow
    const sunGlow = ctx.createRadialGradient(sunX, sunY, sunRadius * 0.5, sunX, sunY, sunRadius * 2.5);
    sunGlow.addColorStop(0, 'rgba(255, 240, 200, 0.8)');
    sunGlow.addColorStop(0.4, 'rgba(255, 200, 100, 0.4)');
    sunGlow.addColorStop(0.7, 'rgba(255, 150, 50, 0.15)');
    sunGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius * 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Sun body
    const sunGradient = ctx.createRadialGradient(sunX - 15, sunY - 15, 0, sunX, sunY, sunRadius);
    sunGradient.addColorStop(0, '#fffef0');
    sunGradient.addColorStop(0.5, '#ffdd44');
    sunGradient.addColorStop(1, '#ff9500');
    ctx.fillStyle = sunGradient;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw shadow cone from Moon to Earth
    const shadowOpacity = Math.max(0, 0.4 - Math.abs(moonX - 350) / 400);
    if (shadowOpacity > 0.05) {
      ctx.fillStyle = `rgba(0, 0, 0, ${shadowOpacity})`;
      ctx.beginPath();
      ctx.moveTo(moonX + moonRadius, moonY - moonRadius * 0.8);
      ctx.lineTo(earthX - earthRadius, earthY - 20);
      ctx.lineTo(earthX - earthRadius, earthY + 20);
      ctx.lineTo(moonX + moonRadius, moonY + moonRadius * 0.8);
      ctx.closePath();
      ctx.fill();
    }

    // Earth
    const earthGradient = ctx.createRadialGradient(earthX - 8, earthY - 8, 0, earthX, earthY, earthRadius);
    earthGradient.addColorStop(0, '#6eb5ff');
    earthGradient.addColorStop(0.4, '#4a9eff');
    earthGradient.addColorStop(0.6, '#2d8a4e');
    earthGradient.addColorStop(0.85, '#1a5c32');
    earthGradient.addColorStop(1, '#0d3d1f');
    ctx.fillStyle = earthGradient;
    ctx.beginPath();
    ctx.arc(earthX, earthY, earthRadius, 0, Math.PI * 2);
    ctx.fill();

    // Earth atmosphere
    const atmosGradient = ctx.createRadialGradient(earthX, earthY, earthRadius, earthX, earthY, earthRadius + 6);
    atmosGradient.addColorStop(0, 'rgba(100, 180, 255, 0.3)');
    atmosGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = atmosGradient;
    ctx.beginPath();
    ctx.arc(earthX, earthY, earthRadius + 6, 0, Math.PI * 2);
    ctx.fill();

    // Moon
    const moonGradient = ctx.createRadialGradient(moonX - 5, moonY - 5, 0, moonX, moonY, moonRadius);
    moonGradient.addColorStop(0, '#f0f0f0');
    moonGradient.addColorStop(0.6, '#b8b8b8');
    moonGradient.addColorStop(1, '#707070');
    ctx.fillStyle = moonGradient;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    ctx.fill();

    // Moon craters
    ctx.fillStyle = 'rgba(90, 90, 90, 0.4)';
    ctx.beginPath();
    ctx.arc(moonX - 5, moonY - 4, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(moonX + 4, moonY + 5, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(moonX + 6, moonY - 3, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 14px "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Sun', sunX, sunY + sunRadius + 22);
    ctx.fillText('Moon', moonX, moonY - moonRadius - 12);
    ctx.fillText('Earth', earthX, earthY + earthRadius + 22);

    // Direction arrow and label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '12px "Segoe UI", system-ui, sans-serif';
    ctx.fillText('Moon\'s path →', 350, height - 20);
  };

  const drawLunarEclipse = (ctx: CanvasRenderingContext2D, width: number, height: number, phase: number) => {
    const centerY = height / 2;
    
    // Positions
    const sunX = 80;
    const sunY = centerY;
    const sunRadius = 45;
    
    const earthX = width / 2 - 40;
    const earthY = centerY;
    const earthRadius = 32;
    
    // Moon orbits around Earth
    const moonOrbitRadius = 140;
    const moonAngle = phase * 0.012;
    const moonX = earthX + Math.cos(moonAngle) * moonOrbitRadius;
    const moonY = earthY + Math.sin(moonAngle) * 35;
    const moonRadius = 16;

    // Sun rays
    ctx.save();
    for (let i = 0; i < 14; i++) {
      const angle = (i / 14) * Math.PI * 2 + phase * 0.004;
      const rayLength = 20 + Math.sin(phase * 0.035 + i * 0.7) * 8;
      
      const rayGradient = ctx.createLinearGradient(
        sunX + Math.cos(angle) * sunRadius,
        sunY + Math.sin(angle) * sunRadius,
        sunX + Math.cos(angle) * (sunRadius + rayLength),
        sunY + Math.sin(angle) * (sunRadius + rayLength)
      );
      rayGradient.addColorStop(0, 'rgba(255, 220, 100, 0.5)');
      rayGradient.addColorStop(1, 'rgba(255, 180, 50, 0)');
      
      ctx.strokeStyle = rayGradient;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(sunX + Math.cos(angle) * sunRadius, sunY + Math.sin(angle) * sunRadius);
      ctx.lineTo(sunX + Math.cos(angle) * (sunRadius + rayLength), sunY + Math.sin(angle) * (sunRadius + rayLength));
      ctx.stroke();
    }
    ctx.restore();

    // Sun glow
    const sunGlow = ctx.createRadialGradient(sunX, sunY, sunRadius * 0.5, sunX, sunY, sunRadius * 2.2);
    sunGlow.addColorStop(0, 'rgba(255, 240, 200, 0.7)');
    sunGlow.addColorStop(0.4, 'rgba(255, 200, 100, 0.35)');
    sunGlow.addColorStop(0.7, 'rgba(255, 150, 50, 0.1)');
    sunGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius * 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Sun body
    const sunGradient = ctx.createRadialGradient(sunX - 12, sunY - 12, 0, sunX, sunY, sunRadius);
    sunGradient.addColorStop(0, '#fffef0');
    sunGradient.addColorStop(0.5, '#ffdd44');
    sunGradient.addColorStop(1, '#ff9500');
    ctx.fillStyle = sunGradient;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
    ctx.fill();

    // Earth's shadow (umbra)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.moveTo(earthX + earthRadius, earthY - earthRadius * 0.9);
    ctx.quadraticCurveTo(width + 50, earthY, earthX + earthRadius, earthY + earthRadius * 0.9);
    ctx.closePath();
    ctx.fill();

    // Penumbra (lighter shadow)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.moveTo(earthX + earthRadius, earthY - earthRadius * 1.3);
    ctx.quadraticCurveTo(width + 100, earthY - 30, width, earthY - 70);
    ctx.lineTo(width, earthY - 50);
    ctx.quadraticCurveTo(width + 50, earthY, earthX + earthRadius, earthY - earthRadius * 0.9);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(earthX + earthRadius, earthY + earthRadius * 1.3);
    ctx.quadraticCurveTo(width + 100, earthY + 30, width, earthY + 70);
    ctx.lineTo(width, earthY + 50);
    ctx.quadraticCurveTo(width + 50, earthY, earthX + earthRadius, earthY + earthRadius * 0.9);
    ctx.closePath();
    ctx.fill();

    // Earth
    const earthGradient = ctx.createRadialGradient(earthX - 10, earthY - 10, 0, earthX, earthY, earthRadius);
    earthGradient.addColorStop(0, '#6eb5ff');
    earthGradient.addColorStop(0.4, '#4a9eff');
    earthGradient.addColorStop(0.6, '#2d8a4e');
    earthGradient.addColorStop(0.85, '#1a5c32');
    earthGradient.addColorStop(1, '#0d3d1f');
    ctx.fillStyle = earthGradient;
    ctx.beginPath();
    ctx.arc(earthX, earthY, earthRadius, 0, Math.PI * 2);
    ctx.fill();

    // Earth atmosphere
    const atmosGradient = ctx.createRadialGradient(earthX, earthY, earthRadius, earthX, earthY, earthRadius + 8);
    atmosGradient.addColorStop(0, 'rgba(100, 180, 255, 0.35)');
    atmosGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = atmosGradient;
    ctx.beginPath();
    ctx.arc(earthX, earthY, earthRadius + 8, 0, Math.PI * 2);
    ctx.fill();

    // Moon orbit path (dashed)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.setLineDash([4, 6]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(earthX, earthY, moonOrbitRadius, 35, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Determine if moon is in shadow
    const inUmbra = moonX > earthX + earthRadius && Math.abs(moonY - earthY) < 35;
    const inPenumbra = moonX > earthX && Math.abs(moonY - earthY) < 55;

    // Moon with blood red tint if in shadow
    let moonGradient;
    if (inUmbra) {
      moonGradient = ctx.createRadialGradient(moonX - 4, moonY - 4, 0, moonX, moonY, moonRadius);
      moonGradient.addColorStop(0, '#a04040');
      moonGradient.addColorStop(0.5, '#802020');
      moonGradient.addColorStop(1, '#501515');
    } else if (inPenumbra) {
      moonGradient = ctx.createRadialGradient(moonX - 4, moonY - 4, 0, moonX, moonY, moonRadius);
      moonGradient.addColorStop(0, '#c8a0a0');
      moonGradient.addColorStop(0.5, '#a07070');
      moonGradient.addColorStop(1, '#705050');
    } else {
      moonGradient = ctx.createRadialGradient(moonX - 4, moonY - 4, 0, moonX, moonY, moonRadius);
      moonGradient.addColorStop(0, '#f0f0f0');
      moonGradient.addColorStop(0.6, '#b8b8b8');
      moonGradient.addColorStop(1, '#707070');
    }
    
    ctx.fillStyle = moonGradient;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    ctx.fill();

    // Moon craters
    const craterColor = inUmbra ? 'rgba(60, 30, 30, 0.4)' : inPenumbra ? 'rgba(80, 50, 50, 0.4)' : 'rgba(90, 90, 90, 0.4)';
    ctx.fillStyle = craterColor;
    ctx.beginPath();
    ctx.arc(moonX - 4, moonY - 3, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(moonX + 3, moonY + 4, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 14px "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Sun', sunX, sunY + sunRadius + 20);
    ctx.fillText('Earth', earthX, earthY + earthRadius + 24);
    
    let moonLabel = 'Moon';
    if (inUmbra) moonLabel = 'Moon (Blood Moon)';
    else if (inPenumbra) moonLabel = 'Moon (Partial Shadow)';
    ctx.fillText(moonLabel, moonX, moonY - moonRadius - 10);

    // Shadow labels
    ctx.font = '11px "Segoe UI", system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText('Umbra', width - 60, earthY);
    ctx.fillText('Penumbra', width - 60, earthY - 55);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #0a0a18 0%, #12122a 50%, #0a0a1a 100%)',
      fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif',
      color: '#e8e8f0',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background stars */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.6), transparent),
          radial-gradient(1px 1px at 30% 60%, rgba(255,255,255,0.4), transparent),
          radial-gradient(2px 2px at 50% 30%, rgba(255,255,255,0.5), transparent),
          radial-gradient(1px 1px at 70% 80%, rgba(255,255,255,0.3), transparent),
          radial-gradient(1px 1px at 90% 40%, rgba(255,255,255,0.5), transparent)
        `,
        pointerEvents: 'none',
        opacity: 0.7
      }} />

      <style>{`
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes pulse {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(255, 180, 80, 0.3); 
          }
          50% { 
            box-shadow: 0 0 35px rgba(255, 180, 80, 0.5); 
          }
        }
        
        @keyframes subtleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @media (max-width: 768px) {
          .learn-header h1 {
            font-size: 32px !important;
            letter-spacing: 1px !important;
          }
          .learn-header p {
            font-size: 14px !important;
          }
          .learn-content-card {
            padding: 20px !important;
          }
          .learn-eclipse-button {
            padding: 14px 24px !important;
            font-size: 13px !important;
            min-width: 140px !important;
          }
          .learn-canvas-container {
            margin-bottom: 16px !important;
          }
          .learn-canvas {
            height: 200px !important;
          }
        }
        
        @media (max-width: 480px) {
          .learn-header h1 {
            font-size: 24px !important;
            letter-spacing: 0.5px !important;
          }
          .learn-header p {
            font-size: 12px !important;
          }
          .learn-content-card {
            padding: 16px !important;
            border-radius: 16px !important;
          }
          .learn-eclipse-button {
            padding: 12px 18px !important;
            font-size: 12px !important;
            min-width: 120px !important;
            flex: 1 1 0 !important;
          }
          .learn-eclipse-buttons {
            flex-direction: column !important;
            gap: 12px !important;
          }
          .learn-section-title {
            font-size: 18px !important;
          }
          .learn-section-text {
            font-size: 14px !important;
          }
          .learn-fact-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          .learn-fact-item {
            padding: 10px 12px !important;
          }
          .learn-fact-icon {
            font-size: 20px !important;
          }
          .learn-fact-label {
            font-size: 10px !important;
          }
          .learn-fact-value {
            font-size: 12px !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1, padding: '0 16px' }}>
        {/* Header */}
        <header className="learn-header" style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #ffcc00, #ff9500, #ffb860)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px',
            letterSpacing: '2px',
            animation: 'subtleFloat 4s ease-in-out infinite'
          }}>
            {t.title || "ECLIPSES"}
          </h1>
          <p style={{
            fontSize: '17px',
            color: 'rgba(255, 200, 130, 0.85)',
            fontWeight: 400
          }}>
            {t.subtitle || "Chapter 12.3 — Earth, Moon, and the Sun"}
          </p>
        </header>

        {/* Eclipse Type Selector */}
        <div className="learn-eclipse-buttons" style={{ 
          display: 'flex', 
          gap: '20px', 
          justifyContent: 'center', 
          marginBottom: '36px',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => setActiveEclipse('solar')}
            className="learn-eclipse-button"
            style={{
              padding: '18px 36px',
              borderRadius: '14px',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              fontFamily: 'inherit',
              fontWeight: 600,
              fontSize: '15px',
              letterSpacing: '0.5px',
              minWidth: '180px',
              background: activeEclipse === 'solar' 
                ? 'linear-gradient(135deg, #ff9500, #ffcc00)'
                : 'linear-gradient(135deg, #ff9500, #ffcc00)',
              border: '2px solid #ffcc00',
              color: '#1a1a1a',
              animation: activeEclipse === 'solar' ? 'pulse 2s ease-in-out infinite' : 'none',
              transform: 'translateY(0)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 180, 50, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '6px', position: 'relative', zIndex: 1 }}>☀️</div>
            <div style={{ position: 'relative', zIndex: 1 }}>{t.solarEclipse || "Solar Eclipse"}</div>
          </button>
          <button 
            onClick={() => setActiveEclipse('lunar')}
            className="learn-eclipse-button"
            style={{
              padding: '18px 36px',
              borderRadius: '14px',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              fontFamily: 'inherit',
              fontWeight: 600,
              fontSize: '15px',
              letterSpacing: '0.5px',
              minWidth: '180px',
              background: activeEclipse === 'lunar'
                ? 'linear-gradient(135deg, #8b4040, #a05050)'
                : 'linear-gradient(135deg, #4a4a70, #6a6a90)',
              border: activeEclipse === 'lunar' ? '2px solid #b06060' : '2px solid #7a7aa0',
              color: '#ffffff',
              boxShadow: activeEclipse === 'lunar' ? '0 0 30px rgba(160, 80, 80, 0.5)' : 'none',
              transform: 'translateY(0)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(100, 100, 150, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = activeEclipse === 'lunar' ? '0 0 30px rgba(160, 80, 80, 0.5)' : 'none';
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '6px', position: 'relative', zIndex: 1 }}>🌙</div>
            <div style={{ position: 'relative', zIndex: 1 }}>{t.lunarEclipse || "Lunar Eclipse"}</div>
          </button>
        </div>

        {/* Main Content Card */}
        <div className="learn-content-card" style={{
          background: 'linear-gradient(145deg, rgba(25, 25, 50, 0.85), rgba(15, 15, 35, 0.95))',
          border: '1px solid rgba(255, 180, 100, 0.15)',
          borderRadius: '20px',
          padding: '32px',
          backdropFilter: 'blur(15px)',
          animation: 'fadeInUp 0.7s ease-out',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
        }}>
          {/* Animated Canvas */}
          <div className="learn-canvas-container" style={{
            background: 'linear-gradient(145deg, #080815, #0c0c1a)',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '2px solid rgba(255, 180, 100, 0.2)',
            boxShadow: 'inset 0 0 50px rgba(0, 0, 0, 0.5)',
            marginBottom: '24px',
          }}>
            <canvas 
              ref={canvasRef} 
              width={700} 
              height={280}
              className="learn-canvas"
              style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '280px' }}
            />
          </div>

          {/* Content based on eclipse type */}
          {activeEclipse === 'solar' ? (
            <div>
              <h2 className="learn-section-title" style={{ 
                fontSize: '28px', 
                color: '#ffcc00',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontWeight: 600,
                flexWrap: 'wrap'
              }}>
                <span style={{ fontSize: '32px' }}>☀️</span>
                {t.solarEclipse || "Solar Eclipse"}
              </h2>
              
              <p className="learn-section-text" style={{ fontSize: '16px', lineHeight: 1.85, marginBottom: '20px', color: '#d0d0e0' }}>
                {t.solarEclipseDesc || "A solar eclipse occurs when the Moon comes between the Sun and Earth, blocking sunlight from reaching us. This celestial alignment creates one of nature's most spectacular phenomena, turning day into an eerie twilight."}
              </p>

              <div style={{
                background: 'rgba(30, 30, 60, 0.5)',
                borderLeft: '4px solid #ffb860',
                padding: '18px 22px',
                borderRadius: '0 12px 12px 0',
                margin: '20px 0',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(35, 35, 70, 0.6)';
                e.currentTarget.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(30, 30, 60, 0.5)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
              >
                <h3 style={{ color: '#ffb860', marginBottom: '12px', fontSize: '18px', fontWeight: 600 }}>
                  {t.apparentSizeTitle || "The Science of Apparent Size"}
                </h3>
                <p style={{ lineHeight: 1.8, color: '#c8c8d8' }}>
                  {t.apparentSizeDesc || "Though the Moon is much smaller than the Sun, it can completely block the Sun because of apparent size. The Moon is about 400 times smaller than the Sun, but it's also about 400 times closer to Earth. This remarkable cosmic coincidence makes both celestial bodies appear nearly the same size in our sky!"}
                </p>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
                gap: '20px', 
                marginTop: '26px' 
              }}>
                <div style={{
                  background: 'rgba(35, 35, 70, 0.4)',
                  padding: '22px',
                  borderRadius: '14px',
                  transition: 'all 0.3s ease',
                  border: '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(45, 45, 85, 0.5)';
                  e.currentTarget.style.borderColor = 'rgba(255, 180, 100, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(35, 35, 70, 0.4)';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                >
                  <h4 style={{ color: '#ffcc00', marginBottom: '12px', fontSize: '16px' }}>{t.totalSolarEclipse || "Total Solar Eclipse"}</h4>
                  <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#b8b8c8' }}>
                    {t.totalSolarEclipseDesc || "The Moon completely blocks the Sun. Observers in the Moon's shadow (umbra) experience complete darkness for a few minutes. The Sun's beautiful corona becomes visible as a glowing halo around the dark Moon."}
                  </p>
                </div>
                <div style={{
                  background: 'rgba(35, 35, 70, 0.4)',
                  padding: '22px',
                  borderRadius: '14px',
                  transition: 'all 0.3s ease',
                  border: '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(45, 45, 85, 0.5)';
                  e.currentTarget.style.borderColor = 'rgba(255, 180, 100, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(35, 35, 70, 0.4)';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                >
                  <h4 style={{ color: '#ffcc00', marginBottom: '12px', fontSize: '16px' }}>{t.partialSolarEclipse || "Partial Solar Eclipse"}</h4>
                  <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#b8b8c8' }}>
                    {t.partialSolarEclipseDesc || "The Moon only partially blocks the Sun. Observers in the penumbra see a portion of the Sun still visible, appearing as if a bite has been taken out of the solar disk."}
                  </p>
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, rgba(220, 60, 60, 0.15), rgba(180, 40, 40, 0.1))',
                border: '1px solid rgba(220, 80, 80, 0.4)',
                borderRadius: '14px',
                padding: '20px 24px',
                marginTop: '24px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(220, 80, 80, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(220, 80, 80, 0.4)';
              }}
              >
                <h3 style={{ color: '#e85050', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '17px' }}>
                  {t.safetyWarning || "⚠️ Safety Warning"}
                </h3>
                <p style={{ lineHeight: 1.8, color: '#d0d0e0' }}>
                  {t.safetyWarningText || "Never look directly at a solar eclipse! Even during an eclipse, the Sun is intense enough to damage your eyes permanently and cause blindness. Do not view through regular sunglasses, binoculars, or telescopes. Always use specialized ISO-certified solar eclipse glasses or attend organized viewing events at planetariums and astronomy clubs."}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <h2 style={{ 
                fontSize: '28px', 
                color: '#c07070',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontWeight: 600
              }}>
                <span style={{ fontSize: '32px' }}>🌙</span>
                {t.lunarEclipse || "Lunar Eclipse"}
              </h2>
              
              <p style={{ fontSize: '16px', lineHeight: 1.85, marginBottom: '20px', color: '#d0d0e0' }}>
                {t.lunarEclipseDesc || "A lunar eclipse occurs when Earth comes between the Sun and Moon, blocking sunlight from reaching the lunar surface. The Earth's shadow falls upon the Moon, creating a dramatic celestial display visible to everyone on the night side of Earth."}
              </p>

              <div style={{
                background: 'rgba(30, 30, 60, 0.5)',
                borderLeft: '4px solid #c07070',
                padding: '18px 22px',
                borderRadius: '0 12px 12px 0',
                margin: '20px 0',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(35, 35, 70, 0.6)';
                e.currentTarget.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(30, 30, 60, 0.5)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
              >
                <h3 style={{ color: '#c07070', marginBottom: '12px', fontSize: '18px', fontWeight: 600 }}>
                  {t.bloodMoonTitle || "The Blood Moon Phenomenon"}
                </h3>
                <p style={{ lineHeight: 1.8, color: '#c8c8d8' }}>
                  {t.bloodMoonDesc || "During a total lunar eclipse, the Moon doesn't go completely dark. Instead, it transforms into a striking dark red color, earning it the dramatic name \"Blood Moon.\" This happens because Earth's atmosphere bends some sunlight around our planet, filtering out blue wavelengths and allowing only red light to reach and illuminate the Moon."}
                </p>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
                gap: '20px', 
                marginTop: '26px' 
              }}>
                <div style={{
                  background: 'rgba(35, 35, 70, 0.4)',
                  padding: '22px',
                  borderRadius: '14px',
                  transition: 'all 0.3s ease',
                  border: '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(45, 45, 85, 0.5)';
                  e.currentTarget.style.borderColor = 'rgba(192, 112, 112, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(35, 35, 70, 0.4)';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                >
                  <h4 style={{ color: '#c07070', marginBottom: '12px', fontSize: '16px' }}>{t.totalLunarEclipse || "Total Lunar Eclipse"}</h4>
                  <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#b8b8c8' }}>
                    {t.totalLunarEclipseDesc || "The Moon is completely within Earth's umbra (full shadow). The entire Moon takes on a reddish-copper color, creating the famous \"Blood Moon\" effect that can last for over an hour."}
                  </p>
                </div>
                <div style={{
                  background: 'rgba(35, 35, 70, 0.4)',
                  padding: '22px',
                  borderRadius: '14px',
                  transition: 'all 0.3s ease',
                  border: '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(45, 45, 85, 0.5)';
                  e.currentTarget.style.borderColor = 'rgba(192, 112, 112, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(35, 35, 70, 0.4)';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                >
                  <h4 style={{ color: '#c07070', marginBottom: '12px', fontSize: '16px' }}>{t.partialLunarEclipse || "Partial Lunar Eclipse"}</h4>
                  <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#b8b8c8' }}>
                    {t.partialLunarEclipseDesc || "Only part of the Moon passes through Earth's umbra. You can observe both the shadowed (dark/reddish) portion and the brightly illuminated portion of the Moon simultaneously."}
                  </p>
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, rgba(60, 160, 80, 0.15), rgba(40, 140, 60, 0.1))',
                border: '1px solid rgba(80, 180, 100, 0.4)',
                borderRadius: '14px',
                padding: '20px 24px',
                marginTop: '24px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(80, 180, 100, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(80, 180, 100, 0.4)';
              }}
              >
                <h3 style={{ color: '#50c878', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '17px' }}>
                  {t.safeToView || "✅ Safe to View"}
                </h3>
                <p style={{ lineHeight: 1.8, color: '#d0d0e0' }}>
                  {t.safeToViewText || "Unlike solar eclipses, lunar eclipses are completely safe to view with the naked eye! You can observe the entire event without any special protective equipment. Lunar eclipses can also be seen from a much larger area of Earth compared to solar eclipses, making them more accessible to observe."}
                </p>
              </div>
            </div>
          )}

          {/* Historical Context Section */}
          <div style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255, 180, 100, 0.3), transparent)',
            margin: '32px 0',
          }} />
          
          <div>
            <h3 style={{ 
              color: '#ffb860', 
              marginBottom: '16px',
              fontSize: '20px',
              fontWeight: 600
            }}>
              {t.historicalTitle || "Historical and Cultural Significance"}
            </h3>
            <p style={{ lineHeight: 1.85, marginBottom: '16px', color: '#c8c8d8' }}>
              {t.historicalText1 || "People have observed and recorded eclipses since ancient times. When the reasons for eclipses were unknown, they were often feared. Many ancient civilizations attached superstitions to these events. However, ancient Indian astronomers developed sophisticated mathematical methods to accurately predict eclipses centuries ago."}
            </p>
            <p style={{ lineHeight: 1.85, color: '#c8c8d8' }}>
              {t.historicalText2 || "The Kodaikanal Solar Observatory, established in 1899 in the beautiful Palani hills of southern India, has been studying the Sun for over 125 years. It is operated by the Indian Institute of Astrophysics (IIA), Bengaluru, and continues to contribute valuable data to our understanding of solar phenomena."}
            </p>
          </div>

          {/* Key Facts */}
          <div style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255, 180, 100, 0.3), transparent)',
            margin: '32px 0',
          }} />
          
          <div>
            <h3 style={{ 
              color: '#ffb860', 
              marginBottom: '18px',
              fontSize: '20px',
              fontWeight: 600
            }}>
              {t.keyFactsTitle || "Key Facts to Remember"}
            </h3>
            <div className="learn-fact-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '14px'
            }}>
              {[
                { icon: '☀️', label: t.sunDiameter || 'Sun Diameter', value: '1.4 million km' },
                { icon: '🌍', label: t.earthDiameter || 'Earth Diameter', value: '12,742 km' },
                { icon: '🌙', label: t.moonDiameter || 'Moon Diameter', value: '3,474 km' },
                { icon: '📏', label: t.sunEarthDistance || 'Sun-Earth Distance', value: '150 million km' },
                { icon: '🛰️', label: t.moonEarthDistance || 'Moon-Earth Distance', value: '384,400 km' },
                { icon: '⏱️', label: t.eclipseDuration || 'Total Eclipse Duration', value: 'Up to 7.5 minutes' }
              ].map((fact, index) => (
                <div key={index} className="learn-fact-item" style={{ 
                  background: 'rgba(40, 40, 75, 0.4)', 
                  padding: '14px 16px', 
                  borderRadius: '10px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'default'
                }}>
                  <div className="learn-fact-icon" style={{ fontSize: '24px', marginBottom: '6px' }}>{fact.icon}</div>
                  <div className="learn-fact-label" style={{ fontSize: '12px', color: '#9090a0', marginBottom: '4px' }}>{fact.label}</div>
                  <div className="learn-fact-value" style={{ fontSize: '14px', fontWeight: 600, color: '#e8e8f0' }}>{fact.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={{ 
          textAlign: 'center', 
          marginTop: '40px', 
          padding: '24px',
          color: 'rgba(200, 200, 220, 0.5)',
          fontSize: '14px'
        }}>
          <p style={{ marginBottom: '8px' }}>
            {t.footerText || "Based on NCERT Curiosity Textbook of Science — Grade 7"}
          </p>
          <p style={{ fontStyle: 'italic', color: 'rgba(255, 200, 130, 0.5)' }}>
            "{t.footerQuote || "Your curiosity is the spark that lights the flame of exploration"}"
          </p>
        </footer>
      </div>
    </div>
  );
};



interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  type: 'mcq' | 'truefalse';
  difficulty: 'easy' | 'medium' | 'hard';
}

const EclipsesPracticeMode: React.FC = () => {
  const { translations } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  const t = translations?.eclipsePracticeContent || {};
  const q = t.questions || {};

  const questions: Question[] = [
    {
      id: 1,
      question: q.q1?.question || "What causes a solar eclipse?",
      options: q.q1?.options || [
        "Earth comes between Sun and Moon",
        "Moon comes between Sun and Earth",
        "Sun comes between Earth and Moon",
        "Stars block the sunlight"
      ],
      correct: 1,
      explanation: q.q1?.explanation || "A solar eclipse occurs when the Moon comes between the Sun and Earth, blocking sunlight from reaching us.",
      type: 'mcq',
      difficulty: 'easy'
    },
    {
      id: 2,
      question: q.q2?.question || "Why can the Moon block the Sun despite being much smaller?",
      options: q.q2?.options || [
        "The Moon is actually larger than the Sun",
        "The Sun shrinks during an eclipse",
        "The Moon is much closer, making their apparent sizes similar",
        "Earth's atmosphere magnifies the Moon"
      ],
      correct: 2,
      explanation: q.q2?.explanation || "The apparent size depends on both actual size and distance. The Moon is about 400 times smaller than the Sun but also about 400 times closer to Earth.",
      type: 'mcq',
      difficulty: 'medium'
    },
    {
      id: 3,
      question: q.q3?.question || "True or False: Lunar eclipses are safe to view with the naked eye.",
      options: q.q3?.options || ["True", "False"],
      correct: 0,
      explanation: q.q3?.explanation || "Unlike solar eclipses, lunar eclipses are completely safe to view with the naked eye without any special equipment.",
      type: 'truefalse',
      difficulty: 'easy'
    },
    {
      id: 4,
      question: q.q4?.question || "What color does the Moon appear during a total lunar eclipse?",
      options: q.q4?.options || ["Bright white", "Dark red", "Blue", "Yellow"],
      correct: 1,
      explanation: q.q4?.explanation || "During a total lunar eclipse, the Moon appears dark red (called 'Blood Moon') because Earth's atmosphere filters out blue light and bends red light toward the Moon.",
      type: 'mcq',
      difficulty: 'easy'
    },
    {
      id: 5,
      question: q.q5?.question || "True or False: You should use regular sunglasses to view a solar eclipse.",
      options: q.q5?.options || ["True", "False"],
      correct: 1,
      explanation: q.q5?.explanation || "Regular sunglasses are NOT safe for viewing solar eclipses. You need specialized ISO-certified solar eclipse glasses or indirect viewing methods.",
      type: 'truefalse',
      difficulty: 'easy'
    },
    {
      id: 6,
      question: q.q6?.question || "The darkest part of the shadow during an eclipse is called the:",
      options: q.q6?.options || ["Penumbra", "Corona", "Umbra", "Atmosphere"],
      correct: 2,
      explanation: q.q6?.explanation || "The umbra is the darkest, central part of the shadow where all direct light is blocked. The penumbra is the lighter outer shadow.",
      type: 'mcq',
      difficulty: 'medium'
    },
    {
      id: 7,
      question: q.q7?.question || "Which Indian observatory has been studying the Sun for over 125 years?",
      options: q.q7?.options || [
        "Mount Abu Observatory",
        "Kodaikanal Solar Observatory",
        "Ooty Radio Telescope",
        "Vainu Bappu Observatory"
      ],
      correct: 1,
      explanation: q.q7?.explanation || "The Kodaikanal Solar Observatory, established in 1899 in the Palani hills, has been studying the Sun for over 125 years.",
      type: 'mcq',
      difficulty: 'hard'
    },
    {
      id: 8,
      question: q.q8?.question || "True or False: A total solar eclipse can be seen from anywhere on Earth when it occurs.",
      options: q.q8?.options || ["True", "False"],
      correct: 1,
      explanation: q.q8?.explanation || "A total solar eclipse is only visible from a narrow path on Earth where the Moon's umbra falls. Most areas see a partial eclipse or none at all.",
      type: 'truefalse',
      difficulty: 'medium'
    },
    {
      id: 9,
      question: q.q9?.question || "During a solar eclipse, the glowing halo visible around the blocked Sun is called:",
      options: q.q9?.options || ["Umbra", "Penumbra", "Corona", "Photosphere"],
      correct: 2,
      explanation: q.q9?.explanation || "The corona is the Sun's outer atmosphere, which becomes visible as a beautiful glowing halo during a total solar eclipse.",
      type: 'mcq',
      difficulty: 'medium'
    },
    {
      id: 10,
      question: q.q10?.question || "Why does a lunar eclipse last longer than a solar eclipse?",
      options: q.q10?.options || [
        "The Moon moves slower",
        "Earth's shadow is much larger than the Moon's shadow",
        "The Sun is farther away",
        "The Moon is larger than Earth"
      ],
      correct: 1,
      explanation: q.q10?.explanation || "Earth's shadow is much larger than the Moon's shadow, so the Moon takes longer to pass through it, making lunar eclipses last longer.",
      type: 'mcq',
      difficulty: 'hard'
    },
    {
      id: 11,
      question: q.q11?.question || "What is the approximate ratio of the Moon's size to the Sun's size?",
      options: q.q11?.options || [
        "1:100",
        "1:400",
        "1:1000",
        "1:10000"
      ],
      correct: 1,
      explanation: q.q11?.explanation || "The Moon is about 400 times smaller than the Sun in actual size, but appears the same size because it's also about 400 times closer to Earth.",
      type: 'mcq',
      difficulty: 'medium'
    },
    {
      id: 12,
      question: q.q12?.question || "During a total solar eclipse, what becomes visible around the blocked Sun?",
      options: q.q12?.options || [
        "The Moon's surface",
        "The Sun's corona",
        "Earth's atmosphere",
        "Stars in the sky"
      ],
      correct: 1,
      explanation: q.q12?.explanation || "The Sun's corona, which is the outer atmosphere of the Sun, becomes visible as a beautiful glowing halo during a total solar eclipse.",
      type: 'mcq',
      difficulty: 'easy'
    },
    {
      id: 13,
      question: q.q13?.question || "What is the maximum duration of a total solar eclipse?",
      options: q.q13?.options || [
        "2 minutes",
        "5 minutes",
        "7.5 minutes",
        "10 minutes"
      ],
      correct: 2,
      explanation: q.q13?.explanation || "A total solar eclipse can last up to 7.5 minutes, though most are shorter. The duration depends on the alignment and distances of the celestial bodies.",
      type: 'mcq',
      difficulty: 'medium'
    },
    {
      id: 14,
      question: q.q14?.question || "Which part of the shadow during an eclipse allows partial visibility of the Sun or Moon?",
      options: q.q14?.options || [
        "Umbra",
        "Penumbra",
        "Corona",
        "Atmosphere"
      ],
      correct: 1,
      explanation: q.q14?.explanation || "The penumbra is the lighter outer part of the shadow where only part of the light source is blocked, allowing partial visibility.",
      type: 'mcq',
      difficulty: 'medium'
    },
    {
      id: 15,
      question: q.q15?.question || "What ancient Indian text contains methods for calculating eclipse times?",
      options: q.q15?.options || [
        "Vedas",
        "Surya Siddhanta",
        "Bhagavad Gita",
        "Ramayana"
      ],
      correct: 1,
      explanation: q.q15?.explanation || "The Surya Siddhanta is an ancient Indian astronomical text that contains detailed methods for calculating eclipse times, demonstrating advanced understanding of celestial mechanics.",
      type: 'mcq',
      difficulty: 'hard'
    },
    {
      id: 16,
      question: q.q16?.question || "True or False: The Moon appears the same size as the Sun in our sky because they are the same actual size.",
      options: q.q16?.options || ["True", "False"],
      correct: 1,
      explanation: q.q16?.explanation || "False. The Moon appears the same size as the Sun because of apparent size - the Moon is 400 times smaller but also 400 times closer, making them appear similar in size from Earth.",
      type: 'truefalse',
      difficulty: 'medium'
    },
    {
      id: 17,
      question: q.q17?.question || "What is the approximate distance from Earth to the Sun?",
      options: q.q17?.options || [
        "15 million km",
        "150 million km",
        "1.5 billion km",
        "15 billion km"
      ],
      correct: 1,
      explanation: q.q17?.explanation || "The average distance from Earth to the Sun is approximately 150 million kilometers (93 million miles).",
      type: 'mcq',
      difficulty: 'medium'
    },
    {
      id: 18,
      question: q.q18?.question || "During which phase of the Moon can a solar eclipse occur?",
      options: q.q18?.options || [
        "Full Moon",
        "New Moon",
        "First Quarter",
        "Last Quarter"
      ],
      correct: 1,
      explanation: q.q18?.explanation || "A solar eclipse occurs during a New Moon phase, when the Moon is positioned between the Earth and the Sun.",
      type: 'mcq',
      difficulty: 'easy'
    },
    {
      id: 19,
      question: q.q19?.question || "What causes the red color of the Moon during a total lunar eclipse?",
      options: q.q19?.options || [
        "The Moon's surface turns red",
        "Earth's atmosphere filters and bends red light",
        "The Sun appears red during eclipse",
        "Dust in space reflects red light"
      ],
      correct: 1,
      explanation: q.q19?.explanation || "Earth's atmosphere filters out blue wavelengths and bends (refracts) red light around the planet, illuminating the Moon with red light during a total lunar eclipse.",
      type: 'mcq',
      difficulty: 'medium'
    },
    {
      id: 20,
      question: q.q20?.question || "True or False: You can safely view a partial solar eclipse with regular sunglasses.",
      options: q.q20?.options || ["True", "False"],
      correct: 1,
      explanation: q.q20?.explanation || "False. Even during a partial solar eclipse, you must use specialized ISO-certified solar eclipse glasses. Regular sunglasses do not provide adequate protection.",
      type: 'truefalse',
      difficulty: 'easy'
    }
  ];

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    if (index === questions[currentQuestion].correct) {
      setScore(prev => prev + 1);
    }
    setAnsweredQuestions(prev => [...prev, currentQuestion]);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setAnsweredQuestions([]);
    setShowExplanation(false);
    setQuizCompleted(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#50c878';
      case 'medium': return '#ffb860';
      case 'hard': return '#e85050';
      default: return '#888';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #0a0a18 0%, #12122a 50%, #0a0a1a 100%)',
      fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif',
      color: '#e8e8f0',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.5), transparent),
          radial-gradient(1px 1px at 30% 60%, rgba(255,255,255,0.3), transparent),
          radial-gradient(2px 2px at 50% 30%, rgba(255,255,255,0.4), transparent),
          radial-gradient(1px 1px at 70% 80%, rgba(255,255,255,0.3), transparent),
          radial-gradient(1px 1px at 90% 40%, rgba(255,255,255,0.4), transparent)
        `,
        pointerEvents: 'none',
        opacity: 0.6
      }} />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes celebrate {
          0% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(-5deg); }
          50% { transform: scale(1.1) rotate(5deg); }
          75% { transform: scale(1.1) rotate(-5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        
        @media (max-width: 768px) {
          .practice-header h1 {
            font-size: 32px !important;
          }
          .practice-header p {
            font-size: 14px !important;
          }
          .practice-card {
            padding: 20px !important;
          }
          .practice-question {
            font-size: 18px !important;
          }
          .practice-option-button {
            padding: 12px 16px !important;
            font-size: 14px !important;
          }
        }
        
        @media (max-width: 480px) {
          .practice-header h1 {
            font-size: 24px !important;
            letter-spacing: 1px !important;
          }
          .practice-header p {
            font-size: 12px !important;
          }
          .practice-card {
            padding: 16px !important;
            border-radius: 16px !important;
          }
          .practice-question {
            font-size: 16px !important;
            margin-bottom: 16px !important;
          }
          .practice-option-button {
            padding: 10px 14px !important;
            font-size: 13px !important;
          }
          .practice-option-letter {
            width: 24px !important;
            height: 24px !important;
            font-size: 11px !important;
          }
          .practice-progress-info {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1, padding: '0 16px' }}>
        {/* Header */}
        <header className="practice-header" style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '42px',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #ffcc00, #ff9500, #ffb860)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px',
            letterSpacing: '2px'
          }}>
            {t.title || "PRACTICE MODE"}
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255, 200, 130, 0.85)'
          }}>
            {t.subtitle || "Eclipses — Test Your Knowledge"}
          </p>
        </header>

        {/* Quiz Card */}
        <div className="practice-card" style={{
          background: 'linear-gradient(145deg, rgba(25, 25, 50, 0.85), rgba(15, 15, 35, 0.95))',
          border: '1px solid rgba(255, 180, 100, 0.15)',
          borderRadius: '20px',
          padding: '32px',
          backdropFilter: 'blur(15px)',
          animation: 'fadeInUp 0.7s ease-out',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
        }}>
          {!quizCompleted ? (
            <>
              {/* Progress */}
              <div style={{ marginBottom: '24px' }}>
                <div className="practice-progress-info" style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '10px',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '14px', color: '#9090a0' }}>
                    {t.questionOf || "Question"} {currentQuestion + 1} {t.of || "of"} {questions.length}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ 
                      fontSize: '12px', 
                      padding: '4px 10px', 
                      borderRadius: '12px',
                      background: `${getDifficultyColor(questions[currentQuestion].difficulty)}22`,
                      color: getDifficultyColor(questions[currentQuestion].difficulty),
                      border: `1px solid ${getDifficultyColor(questions[currentQuestion].difficulty)}44`
                    }}>
                      {questions[currentQuestion].difficulty.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '14px', color: '#ffb860' }}>
                      {t.score || "Score"}: {score}/{answeredQuestions.length}
                    </span>
                  </div>
                </div>
                <div style={{
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}>
                    <div 
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #ffb860, #ffcc00)',
                      borderRadius: '4px',
                      transition: 'width 0.5s ease',
                      width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Question */}
              <h2 className="practice-question" style={{ 
                fontSize: '20px', 
                fontWeight: 500, 
                marginBottom: '24px',
                lineHeight: 1.6
              }}>
                {questions[currentQuestion].question}
              </h2>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {questions[currentQuestion].options.map((option, index) => {
                  // Only show correct/wrong highlighting AFTER user has selected an answer
                  const isCorrect = selectedAnswer !== null && index === questions[currentQuestion].correct;
                  const isWrong = selectedAnswer !== null && index === selectedAnswer && selectedAnswer !== questions[currentQuestion].correct;
                  const isDisabled = selectedAnswer !== null;
                  
                  const buttonStyle: React.CSSProperties = {
                    width: '100%',
                    padding: '16px 20px',
                    background: isCorrect 
                      ? 'rgba(80, 200, 120, 0.2)'
                      : isWrong
                        ? 'rgba(232, 80, 80, 0.2)'
                        : 'rgba(40, 40, 70, 0.4)',
                    border: isCorrect
                      ? '2px solid #50c878'
                      : isWrong
                        ? '2px solid #e85050'
                        : '2px solid rgba(255, 180, 100, 0.2)',
                    borderRadius: '12px',
                    color: isCorrect
                      ? '#50c878'
                      : isWrong
                        ? '#e85050'
                      : '#e8e8f0',
                    cursor: isDisabled ? 'default' : 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    opacity: isDisabled ? 0.7 : 1,
                    animation: isWrong ? 'shake 0.3s ease' : 'none',
                  };
                  
                  return (
                    <button
                      key={index}
                      className="practice-option-button"
                      style={buttonStyle}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={isDisabled}
                      onMouseEnter={(e) => {
                        if (!isDisabled) {
                          e.currentTarget.style.background = 'rgba(60, 60, 100, 0.6)';
                          e.currentTarget.style.borderColor = 'rgba(255, 180, 100, 0.3)';
                          e.currentTarget.style.transform = 'translateX(5px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isDisabled) {
                          e.currentTarget.style.background = 'rgba(40, 40, 70, 0.4)';
                          e.currentTarget.style.borderColor = 'rgba(255, 180, 100, 0.2)';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }
                      }}
                    >
                      <span className="practice-option-letter" style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: 'rgba(255, 180, 100, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: 600,
                        flexShrink: 0
                      }}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showExplanation && (
                <div style={{
                  background: selectedAnswer === questions[currentQuestion].correct 
                    ? 'rgba(80, 200, 120, 0.1)' 
                    : 'rgba(232, 80, 80, 0.1)',
                  border: `1px solid ${selectedAnswer === questions[currentQuestion].correct ? '#50c878' : '#e85050'}`,
                  borderRadius: '12px',
                  padding: '18px 22px',
                  marginBottom: '20px',
                  animation: 'fadeIn 0.3s ease'
                }}>
                  <div style={{ 
                    fontWeight: 600, 
                    marginBottom: '8px',
                    color: selectedAnswer === questions[currentQuestion].correct ? '#50c878' : '#e85050'
                  }}>
                    {selectedAnswer === questions[currentQuestion].correct ? (t.correct || '✓ Correct!') : (t.incorrect || '✗ Incorrect')}
                  </div>
                  <p style={{ lineHeight: 1.7, color: '#c8c8d8' }}>
                    {questions[currentQuestion].explanation}
                  </p>
                </div>
              )}

              {/* Next Button */}
              {selectedAnswer !== null && (
                <button
                  onClick={handleNextQuestion}
                  style={{
                    padding: '14px 32px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #ffb860, #ff9500)',
                    border: 'none',
                    color: '#1a1a1a',
                    fontWeight: 600,
                    fontSize: '15px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'block',
                    marginLeft: 'auto'
                  }}
                >
                  {currentQuestion < questions.length - 1 ? (t.nextQuestion || 'Next Question →') : (t.seeResults || 'See Results')}
                </button>
              )}
            </>
          ) : (
            /* Quiz Completed */
            <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
              <div style={{ fontSize: '64px', marginBottom: '20px', animation: 'celebrate 0.6s ease' }}>
                {score >= questions.length * 0.8 ? '🏆' : score >= questions.length * 0.5 ? '⭐' : '📚'}
              </div>
              <h2 style={{ fontSize: '28px', color: '#ffcc00', marginBottom: '12px' }}>
                {t.quizCompleted || "Quiz Completed!"}
              </h2>
              <p style={{ fontSize: '20px', marginBottom: '8px' }}>
                {t.yourScore || "Your Score"}: <span style={{ color: '#ffb860', fontWeight: 700 }}>{score}</span> / {questions.length}
              </p>
              <p style={{ fontSize: '16px', color: '#9090a0', marginBottom: '32px' }}>
                {score >= questions.length * 0.8 
                  ? (t.excellent || 'Excellent! You have mastered eclipses!')
                  : score >= questions.length * 0.5 
                    ? (t.goodJob || 'Good job! Keep learning!')
                    : (t.keepPracticing || 'Keep practicing to improve!')}
              </p>
              <button
                onClick={resetQuiz}
                style={{
                  padding: '14px 36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #ffb860, #ff9500)',
                  border: 'none',
                  color: '#1a1a1a',
                  fontWeight: 600,
                  fontSize: '15px',
                  cursor: 'pointer'
                }}
              >
                {t.tryAgain || "Try Again"}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer style={{ 
          textAlign: 'center', 
          marginTop: '40px', 
          padding: '20px',
          color: 'rgba(200, 200, 220, 0.4)',
          fontSize: '13px'
        }}>
          <p>NCERT Curiosity Science — Grade 7 — Chapter 12.3</p>
        </footer>
      </div>
    </div>
  );
};


interface EclipseEvent {
  date: string;
  type: string;
  visibility: string;
  description: string;
}

interface RealWorldExample {
  title: string;
  description: string;
  details: string;
  connection: string;
}

const EclipsesRealWorld: React.FC = () => {
  const { translations } = useLanguage();
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [animationPhase, setAnimationPhase] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const t = translations?.eclipseRealWorldContent || {};
  const examplesData = t.examples || {};
  
  // Build examples array from translations
  const realWorldExamples: RealWorldExample[] = [
    {
      title: examplesData.example1?.title || "Eclipse Tourism and Travel",
      description: examplesData.example1?.description || "People travel thousands of kilometers to witness total solar eclipses. The path of totality (where the eclipse is fully visible) is only about 100-200 km wide, creating a unique travel opportunity.",
      details: examplesData.example1?.details || "During the 2017 total solar eclipse in the United States, millions of people traveled to the path of totality. Hotels were booked months in advance, and special viewing events were organized. This shows how eclipses create real-world economic and social impacts.",
      connection: examplesData.example1?.connection || "Understanding eclipse paths helps us plan safe viewing experiences and appreciate why some locations are better for observing eclipses than others."
    },
    {
      title: examplesData.example2?.title || "Eclipse Photography and Science",
      description: examplesData.example2?.description || "Scientists and photographers use eclipses to study the Sun's corona and capture stunning images. The corona is normally invisible but becomes visible during total solar eclipses.",
      details: examplesData.example2?.details || "During eclipses, scientists can study the Sun's outer atmosphere, measure solar activity, and understand space weather. The 1919 solar eclipse helped prove Einstein's theory of general relativity by showing how starlight bends around the Sun.",
      connection: examplesData.example2?.connection || "Eclipses provide unique opportunities for scientific research that cannot be done at any other time, advancing our understanding of the Sun and space."
    },
    {
      title: examplesData.example3?.title || "Historical Eclipse Predictions",
      description: examplesData.example3?.description || "Ancient civilizations used eclipse predictions for calendars, agriculture, and religious ceremonies. Accurate predictions required deep understanding of celestial mechanics.",
      details: examplesData.example3?.details || "The ancient Mayans, Babylonians, and Indians all developed methods to predict eclipses. Indian astronomers using the Surya Siddhanta could predict eclipses with remarkable accuracy centuries before modern astronomy.",
      connection: examplesData.example3?.connection || "Eclipse prediction demonstrates how understanding Earth-Moon-Sun relationships has practical applications in timekeeping, agriculture, and cultural practices."
    },
    {
      title: examplesData.example4?.title || "Eclipse Safety and Public Health",
      description: examplesData.example4?.description || "During solar eclipses, public health campaigns educate people about eye safety. Many people are unaware that looking at the Sun during an eclipse can cause permanent blindness.",
      details: examplesData.example4?.details || "Health organizations worldwide issue warnings before solar eclipses. In 1999, during a solar eclipse visible in Europe, extensive public education campaigns prevented thousands of potential eye injuries. Schools and organizations distribute special eclipse glasses.",
      connection: examplesData.example4?.connection || "Understanding eclipse safety is crucial for public health. This knowledge helps protect millions of people from permanent eye damage during these rare events."
    },
    {
      title: examplesData.example5?.title || "Eclipse Impact on Wildlife",
      description: examplesData.example5?.description || "Animals react to solar eclipses in fascinating ways. Birds may stop singing, nocturnal animals may become active, and some animals may return to their nests, thinking night has fallen.",
      details: examplesData.example5?.details || "During the 2017 solar eclipse, researchers observed that bees stopped buzzing, spiders dismantled their webs, and chickens returned to roost. This shows how celestial events affect Earth's ecosystems and animal behavior.",
      connection: examplesData.example5?.connection || "Eclipses demonstrate the interconnectedness of celestial events and life on Earth, showing how changes in sunlight affect all living things."
    },
    {
      title: examplesData.example6?.title || "Eclipse in Navigation and Timekeeping",
      description: examplesData.example6?.description || "Historically, eclipses were used for navigation and timekeeping. Sailors and explorers used eclipse predictions to determine their location and keep accurate time.",
      details: examplesData.example6?.details || "Before modern GPS, sailors used eclipse predictions to calculate longitude. The precise timing of eclipses helped navigators determine their position at sea. Ancient calendars were also based on eclipse cycles.",
      connection: examplesData.example6?.connection || "Eclipse knowledge has practical applications in navigation and timekeeping, showing how understanding celestial mechanics helps us navigate our world."
    },
    {
      title: examplesData.example7?.title || "Solar Eclipse and Renewable Energy",
      description: examplesData.example7?.description || "During solar eclipses, solar power generation drops significantly. Power grid operators must prepare for this temporary loss of solar energy.",
      details: examplesData.example7?.details || "In 2015, during a solar eclipse in Europe, solar power generation dropped by about 75% in Germany. Power grid operators had to quickly switch to other energy sources to maintain electricity supply. This demonstrates how eclipses affect modern technology.",
      connection: examplesData.example7?.connection || "Understanding eclipse timing helps renewable energy systems prepare for temporary power loss, showing the practical importance of eclipse predictions in modern society."
    },
    {
      title: examplesData.example8?.title || "Lunar Eclipse and Cultural Celebrations",
      description: examplesData.example8?.description || "Many cultures celebrate lunar eclipses with festivals and ceremonies. The Blood Moon has special significance in various traditions around the world.",
      details: examplesData.example8?.details || "In India, lunar eclipses (Chandra Grahan) are observed with religious ceremonies. In some Native American cultures, lunar eclipses are seen as times of renewal. These cultural practices show how eclipses connect science with human traditions.",
      connection: examplesData.example8?.connection || "Eclipses bridge science and culture, demonstrating how natural phenomena inspire art, religion, and community celebrations across different societies."
    }
  ];
  
  const handlePrevious = () => {
    setCurrentExampleIndex(prev => (prev > 0 ? prev - 1 : realWorldExamples.length - 1));
  };
  
  const handleNext = () => {
    setCurrentExampleIndex(prev => (prev < realWorldExamples.length - 1 ? prev + 1 : 0));
  };
  
  const currentExample = realWorldExamples[currentExampleIndex];

  // Animation loop for decorative canvas
  useEffect(() => {
    const animate = () => {
      setAnimationPhase(prev => (prev + 0.3) % 360);
      requestAnimationFrame(animate);
    };
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Decorative space animation
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw rotating Earth-Moon system
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Earth
    const earthGradient = ctx.createRadialGradient(centerX - 5, centerY - 5, 0, centerX, centerY, 25);
    earthGradient.addColorStop(0, '#6eb5ff');
    earthGradient.addColorStop(0.5, '#2d8a4e');
    earthGradient.addColorStop(1, '#1a5c32');
    ctx.fillStyle = earthGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
    ctx.fill();
    
    // Moon orbiting
    const moonAngle = animationPhase * 0.02;
    const moonX = centerX + Math.cos(moonAngle) * 50;
    const moonY = centerY + Math.sin(moonAngle) * 20;
    
    const moonGradient = ctx.createRadialGradient(moonX - 2, moonY - 2, 0, moonX, moonY, 8);
    moonGradient.addColorStop(0, '#f0f0f0');
    moonGradient.addColorStop(1, '#888');
    ctx.fillStyle = moonGradient;
    ctx.beginPath();
    ctx.arc(moonX, moonY, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Orbit path
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.setLineDash([3, 5]);
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, 50, 20, 0, 0, Math.PI * 2);
    ctx.stroke();
  }, [animationPhase]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #0a0a18 0%, #12122a 50%, #0a0a1a 100%)',
      fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif',
      color: '#e8e8f0',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(1px 1px at 15% 25%, rgba(255,255,255,0.5), transparent),
          radial-gradient(1px 1px at 35% 55%, rgba(255,255,255,0.3), transparent),
          radial-gradient(2px 2px at 55% 35%, rgba(255,255,255,0.4), transparent),
          radial-gradient(1px 1px at 75% 75%, rgba(255,255,255,0.3), transparent),
          radial-gradient(1px 1px at 85% 45%, rgba(255,255,255,0.4), transparent)
        `,
        pointerEvents: 'none',
        opacity: 0.6
      }} />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @media (max-width: 768px) {
          .realworld-header h1 {
            font-size: 32px !important;
          }
          .realworld-header p {
            font-size: 14px !important;
          }
          .realworld-card {
            padding: 20px !important;
          }
          .realworld-example-title {
            font-size: 20px !important;
          }
          .realworld-example-text {
            font-size: 14px !important;
          }
          .realworld-nav-buttons {
            flex-direction: column !important;
            gap: 12px !important;
          }
          .realworld-nav-button {
            width: 100% !important;
          }
          .realworld-canvas {
            display: none !important;
          }
        }
        
        @media (max-width: 480px) {
          .realworld-header h1 {
            font-size: 24px !important;
            letter-spacing: 1px !important;
          }
          .realworld-header p {
            font-size: 12px !important;
          }
          .realworld-card {
            padding: 16px !important;
            border-radius: 16px !important;
          }
          .realworld-example-card {
            padding: 20px !important;
            min-height: auto !important;
          }
          .realworld-example-title {
            font-size: 18px !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
          }
          .realworld-example-text {
            font-size: 13px !important;
            line-height: 1.6 !important;
          }
          .realworld-example-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }
          .realworld-nav-buttons {
            flex-direction: column !important;
          }
          .realworld-dots {
            order: -1 !important;
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1, padding: '0 16px' }}>
        {/* Header with animated canvas */}
        <header className="realworld-header" style={{ textAlign: 'center', marginBottom: '32px', position: 'relative' }}>
          <canvas 
            ref={canvasRef}
            width={140}
            height={80}
            className="realworld-canvas"
            style={{ 
              position: 'absolute',
              top: '-10px',
              right: 'calc(50% - 250px)',
              opacity: 0.8
            }}
          />
          <h1 style={{
            fontSize: '42px',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #ffcc00, #ff9500, #ffb860)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px',
            letterSpacing: '2px'
          }}>
            {t.title || "REAL WORLD"}
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255, 200, 130, 0.85)'
          }}>
            {t.subtitle || "Eclipses — Real-World Examples and Applications"}
          </p>
        </header>

        {/* Main Content */}
        <div className="realworld-card" style={{
          background: 'linear-gradient(145deg, rgba(25, 25, 50, 0.85), rgba(15, 15, 35, 0.95))',
          border: '1px solid rgba(255, 180, 100, 0.15)',
          borderRadius: '20px',
          padding: '28px',
          backdropFilter: 'blur(15px)',
          animation: 'fadeIn 0.5s ease-out',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
        }}>
          <div className="realworld-example-header" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <h2 style={{ fontSize: '24px', color: '#ffcc00', margin: 0 }}>
              {t.realWorldExamples || "Real-World Examples"}
            </h2>
            <div style={{ 
              fontSize: '14px', 
              color: '#9090a0',
              background: 'rgba(255, 180, 100, 0.1)',
              padding: '6px 14px',
              borderRadius: '12px'
            }}>
              {t.example || "Example"} {currentExampleIndex + 1} {t.of || "of"} {realWorldExamples.length}
            </div>
          </div>

          {/* Current Example Card */}
          <div className="realworld-example-card" style={{
            background: 'rgba(35, 35, 70, 0.4)',
            border: '1px solid rgba(255, 180, 100, 0.2)',
            borderRadius: '16px',
            padding: '28px',
            marginBottom: '24px',
            minHeight: '400px',
            animation: 'fadeIn 0.4s ease',
          }}>
            <h3 className="realworld-example-title" style={{ 
              fontSize: '22px', 
              color: '#ffcc00', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <span style={{ fontSize: '28px' }}>🌍</span>
              {currentExample.title}
            </h3>
            
            <div style={{
              background: 'rgba(255, 180, 100, 0.1)',
              borderLeft: '4px solid #ffcc00',
              padding: '16px 20px',
              borderRadius: '0 8px 8px 0',
              marginBottom: '20px',
            }}>
              <p className="realworld-example-text" style={{ 
                fontSize: '16px', 
                lineHeight: 1.7, 
                color: '#e8e8f0',
                margin: 0
              }}>
                {currentExample.description}
              </p>
            </div>

            <div style={{
              background: 'rgba(40, 40, 80, 0.3)',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '20px',
            }}>
              <h4 style={{ 
                fontSize: '16px', 
                color: '#ffb860', 
                marginBottom: '12px',
                fontWeight: 600
              }}>
                📖 Details:
              </h4>
              <p className="realworld-example-text" style={{ 
                fontSize: '15px', 
                lineHeight: 1.8, 
                color: '#c8c8d8',
                margin: 0
              }}>
                {currentExample.details}
              </p>
            </div>

            <div style={{
              background: 'rgba(80, 200, 120, 0.1)',
              borderLeft: '4px solid #50c878',
              padding: '16px 20px',
              borderRadius: '0 8px 8px 0',
            }}>
              <h4 style={{ 
                fontSize: '16px', 
                color: '#50c878', 
                marginBottom: '8px',
                fontWeight: 600
              }}>
                💡 Real-World Connection:
              </h4>
              <p className="realworld-example-text" style={{ 
                fontSize: '15px', 
                lineHeight: 1.7, 
                color: '#c8c8d8',
                margin: 0
              }}>
                {currentExample.connection}
              </p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="realworld-nav-buttons" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}>
            <button
              onClick={handlePrevious}
              className="realworld-nav-button"
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #4a4a70, #6a6a90)',
                border: '2px solid #7a7aa0',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(-3px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(122, 122, 160, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <svg
                style={{ width: '20px', height: '20px' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t.previous || "← Previous"}
            </button>

            <div className="realworld-dots" style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}>
              {realWorldExamples.map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: index === currentExampleIndex ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: index === currentExampleIndex 
                      ? '#ffcc00' 
                      : 'rgba(255, 255, 255, 0.3)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onClick={() => setCurrentExampleIndex(index)}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="realworld-nav-button"
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ffb860, #ff9500)',
                border: 'none',
                color: '#1a1a1a',
                fontWeight: 600,
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(3px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 184, 96, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {t.next || "Next →"}
              <svg
                style={{ width: '20px', height: '20px' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer style={{ 
          textAlign: 'center', 
          marginTop: '40px', 
          padding: '20px',
          color: 'rgba(200, 200, 220, 0.4)',
          fontSize: '13px'
        }}>
          <p>{t.footerText || "NCERT Curiosity Science — Grade 7 — Chapter 12.3"}</p>
        </footer>
      </div>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

const EclipsesLearning: React.FC<EclipsesLearningProps> = ({ 
    props,
    setStepDetails,
    stopAutoNext,
    setStopAutoNext,
    mode: legacyMode,
    setMode: legacySetMode,
}) => {
    // Support both new standardized props and legacy props
    const initialMode = props?.initialMode || legacyMode || "learn";
    const [currentMode, setCurrentModeState] = useState<ModeType>(initialMode);
    
    // Update mode when initialMode prop changes (but only if it's different from current)
    useEffect(() => {
        const newMode = props?.initialMode || legacyMode;
        if (newMode && newMode !== currentMode) {
            setCurrentModeState(newMode);
        }
    }, [props?.initialMode, legacyMode]);
    
    // Create setMode function that updates internal state
    const handleModeChange = useCallback((newMode: ModeType) => {
        setCurrentModeState(newMode);
        if (setStepDetails) {
            setStepDetails({
                currentStep: 0,
                totalSteps: 0,
                isPaused: false,
                currentMode: newMode,
            });
        }
    }, [setStepDetails]);
    
    // Use legacy setMode if provided, otherwise use internal state handler
    const setMode = legacySetMode ? ((newMode: ModeType) => {
        legacySetMode(newMode);
        // Also update internal state to keep it in sync
        setCurrentModeState(newMode);
    }) : handleModeChange;

    return (
        <LanguageProvider>
            <Navbar mode={currentMode} setMode={setMode} />
            <>
                <style>{`
                    @media (max-width: 640px) {
                        .main-content-wrapper {
                            padding-top: 80px !important;
                            padding-left: 4px !important;
                            padding-right: 4px !important;
                            padding-bottom: 16px !important;
                        }
                    }
                `}</style>
                <div className="main-content-wrapper" style={{
                    paddingTop: '56px',
                    paddingLeft: '8px',
                    paddingRight: '8px',
                    paddingBottom: '32px',
                    overflowX: 'hidden',
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere',
                }}>
                    {currentMode === "learn" && <EclipsesLearnMode />}
                    {currentMode === "practice" && <EclipsesPracticeMode />}
                    {currentMode === "applications" && <EclipsesRealWorld />}
                </div>
            </>
        </LanguageProvider>
    );
};

export { EclipsesLearnMode, EclipsesPracticeMode, EclipsesRealWorld };

export default EclipsesLearning;
