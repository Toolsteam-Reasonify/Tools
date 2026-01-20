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
    Globe,
} from "lucide-react";

// ============================================================================
// Language Context & Translations
// ============================================================================

export type Language = "en" | "hi" | "gu";

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
                }
            }
        },
        eclipseRealWorldContent: {
            title: "REAL WORLD",
            subtitle: "Eclipses — Upcoming Events and Facts",
            upcomingEvents: "📅 Upcoming Eclipse Events",
            markCalendars: "Mark your calendars for these celestial events",
            total: "Total",
            partial: "Partial",
            eclipsesAndIndia: "🇮🇳 Eclipses and India",
            footerText: "NCERT Curiosity Science — Grade 7 — Chapter 12.3",
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
    },
    hi: {
        nav: {
            logo: "पृथ्वी की परिक्रमा",
            tabs: {
                learn: "सीखें",
                practice: "अभ्यास",
                applications: "वास्तविक दुनिया",
            },
        },
        learn: {
            header: 'पृथ्वी की परिक्रमा',
            subtitle: 'सूर्य के चारों ओर पृथ्वी की यात्रा',
            placeholder: 'परिक्रमा सीखने की सामग्री जल्द ही आ रही है...'
        },
        practice: {
            header: 'परिक्रमा का अभ्यास करें',
            subtitle: 'अपने ज्ञान का परीक्षण करें',
            placeholder: 'परिक्रमा अभ्यास क्विज़ जल्द ही आ रही है...'
        },
        common: {
            comingSoon: "जल्द ही आ रहा है",
            stayTuned: "रोमांचक इंटरैक्टिव सामग्री के लिए बने रहें!"
        },
        learnMode: {
            header: "सीखने का मोड",
            progress: "प्रगति",
            previous: "पिछला",
            next: "अगला",
            complete: "पूर्ण! 🎉"
        },
        practiceMode: {
            header: "अभ्यास मोड",
            streak: "लगातार",
            score: "स्कोर",
            question: "प्रश्न",
            of: "का",
            submitAnswer: "उत्तर जमा करें",
            nextQuestion: "अगला प्रश्न",
            viewResults: "परिणाम देखें",
            correct: "सही! 🎉",
            notQuiteRight: "बिल्कुल सही नहीं",
            quizCompleted: "क्विज़ पूर्ण!",
            outstanding: "उत्कृष्ट! 🎉",
            excellent: "बेहतरीन काम! 🌟",
            goodJob: "अच्छा काम! 👍",
            keepPracticing: "अभ्यास जारी रखें! 💪",
            dontGiveUp: "हार मत मानो! 🌱",
            finalScore: "अंतिम स्कोर",
            bestStreak: "सर्वश्रेष्ठ लगातार",
            inARow: "लगातार",
            questions: "प्रश्न",
            completed: "पूर्ण",
            performanceBreakdown: "प्रदर्शन विश्लेषण",
            tryAgain: "फिर से कोशिश करें",
            questionNavigator: "प्रश्न नेविगेटर"
        },
        realWorld: {
            header: "वास्तविक दुनिया के अनुप्रयोग",
            subtitle: "अपने ज्ञान को वास्तविक जीवन की स्थितियों में लागू करें!",
            description: "देखें कि पृथ्वी का घूर्णन और परिक्रमण हमारे दैनिक जीवन को कैसे प्रभावित करता है",
            howItWorks: "यह कैसे काम करता है",
            howItWorks1: "प्रत्येक वास्तविक दुनिया की स्थिति को ध्यान से पढ़ें",
            howItWorks2: "सोचें कि पृथ्वी की गति इन स्थितियों को कैसे बनाती है",
            howItWorks3: "जो आपने सीखा है उसके आधार पर अपना उत्तर लिखें",
            howItWorks4: "अधिक जानने के लिए विस्तृत स्पष्टीकरण देखें",
            totalScenarios: "कुल स्थितियाँ",
            topicsCovered: "विषय कवर",
            realWorldSkills: "वास्तविक दुनिया के कौशल",
            backToScenarios: "स्थितियों पर वापस",
            scenario: "स्थिति",
            context: "संदर्भ",
            question: "प्रश्न:",
            realWorldConnection: "वास्तविक दुनिया का संबंध",
            yourAnswer: "आपका उत्तर:",
            answerPlaceholder: "अपना उत्तर यहाँ टाइप करें... पृथ्वी के घूर्णन और परिक्रमण के बारे में जो आपने सीखा है उसका उपयोग करके अपने तर्क की व्याख्या करें।",
            checkSolution: "समाधान देखें",
            quickAnswer: "त्वरित उत्तर",
            detailedExplanation: "विस्तृत स्पष्टीकरण:",
            keyTakeaways: "💡 मुख्य बातें",
            previous: "← पिछला",
            nextScenario: "अगली स्थिति →",
            complete: "पूर्ण! 🎉"
        },
        // Learn Mode Content Translations in Hindi
        learnContent: {
            earthInSolarSystem: "सौर मंडल में पृथ्वी",
            current: "वर्तमान",
            directionOfEclipses: "परिक्रमा की दिशा",
            counterClockwise: "(वामावर्त)",
            sun: "सूर्य",
            earth: "पृथ्वी",
            pause: "⏸️ रोकें",
            play: "▶️ चलाएं",
            speed: "गति",
            jumpTo: "कूदें",
            keyEvent: "🎯 मुख्य घटना",
            hemisphere: "🌐 गोलार्ध",
            orbitPosition: "📍 कक्षा स्थिति",
            keyFactsAboutEclipses: "📚 परिक्रमा के बारे में मुख्य तथ्य",
            whyDoSeasonsChange: "🤔 मौसम क्यों बदलते हैं?",
            hide: "▲ छुपाएं",
            show: "▼ दिखाएं",
            magicOfAxialTilt: "🪄 अक्षीय झुकाव का जादू!",
            axialTiltDescription: "पृथ्वी अपने अक्ष पर 23.5 डिग्री झुकी हुई है। यह झुकाव पृथ्वी के सूर्य के चारों ओर घूमने के दौरान स्थिर रहता है।",
            summerTiltedToward: "गर्मी (सूर्य की ओर झुकी हुई)",
            winterTiltedAway: "सर्दी (सूर्य से दूर झुकी हुई)",
            directSunlight: "सीधी धूप",
            longerDays: "लंबे दिन",
            moreHeatAbsorbed: "अधिक गर्मी अवशोषित",
            slantedSunlight: "तिरछी धूप",
            shorterDays: "छोटे दिन",
            lessHeatAbsorbed: "कम गर्मी अवशोषित",
            funFactTilt: "💡 रोचक तथ्य: यह इसलिए नहीं है कि पृथ्वी सूर्य के करीब या दूर है! वास्तव में, पृथ्वी जनवरी में सूर्य के सबसे करीब होती है (उत्तरी गोलार्ध में सर्दी)!",
            seasons: {
                spring: {
                    name: "वसंत",
                    months: "मार्च - मई",
                    description: "फूल खिलते हैं, पक्षी चहचहाते हैं, प्रकृति जागती है",
                    hemisphere: "दिन और रात लगभग बराबर",
                    event: "वसंत विषुव - 21 मार्च"
                },
                summer: {
                    name: "गर्मी",
                    months: "जून - अगस्त",
                    description: "सबसे लंबे दिन, सबसे गर्म मौसम",
                    hemisphere: "उत्तरी गोलार्ध सूर्य की ओर झुका हुआ",
                    event: "ग्रीष्म संक्रांति - 21 जून"
                },
                autumn: {
                    name: "शरद",
                    months: "सितंबर - नवंबर",
                    description: "पत्ते गिरते हैं, फसल का मौसम शुरू होता है",
                    hemisphere: "दिन और रात लगभग बराबर",
                    event: "शरद विषुव - 23 सितंबर"
                },
                winter: {
                    name: "सर्दी",
                    months: "दिसंबर - फरवरी",
                    description: "सबसे छोटे दिन, सबसे ठंडा मौसम",
                    hemisphere: "उत्तरी गोलार्ध सूर्य से दूर झुका हुआ",
                    event: "शीत संक्रांति - 22 दिसंबर"
                }
            },
            keyFacts: {
                eclipsesPeriod: {
                    title: "परिक्रमा अवधि",
                    fact: "365¼ दिन (1 वर्ष)",
                    detail: "यह अतिरिक्त ¼ दिन ही हर 4 साल में लीप वर्ष का कारण है!"
                },
                orbitalShape: {
                    title: "कक्षीय आकार",
                    fact: "अण्डाकार (अंडाकार)",
                    detail: "पृथ्वी कभी-कभी सूर्य के करीब होती है (उपसौर) और कभी-कभी दूर (अपसौर)।"
                },
                axialTilt: {
                    title: "अक्षीय झुकाव",
                    fact: "23.5 डिग्री",
                    detail: "यह झुकाव ही अलग-अलग मौसमों का मुख्य कारण है!"
                },
                orbitalSpeed: {
                    title: "कक्षीय गति",
                    fact: "~30 km/s (108,000 km/h)",
                    detail: "यह एक गोली से लगभग 30 गुना तेज है!"
                },
                distanceFromSun: {
                    title: "सूर्य से दूरी",
                    fact: "~150 million km (औसत)",
                    detail: "सूर्य से प्रकाश पृथ्वी तक पहुंचने में लगभग 8 मिनट लगते हैं।"
                }
            },
            infoCards: {
                whatIsEclipses: {
                    title: "परिक्रमा क्या है?",
                    content: "परिक्रमा पृथ्वी की सूर्य के चारों ओर अण्डाकार (अंडाकार) कक्षा में गति है। एक पूर्ण परिक्रमा में लगभग 365¼ दिन लगते हैं।"
                },
                effectsOfEclipses: {
                    title: "परिक्रमा के प्रभाव",
                    content: "परिक्रमा मौसमों में परिवर्तन, वर्ष भर दिन/रात की लंबाई में भिन्नता, और रात में दिखने वाले अलग-अलग तारामंडल का कारण बनती है।"
                },
                eclipsesVsRotation: {
                    title: "परिक्रमा बनाम घूर्णन",
                    content: "परिक्रमा सूर्य के चारों ओर गति है (1 वर्ष)। घूर्णन अक्ष पर घूमना है (24 घंटे)। दोनों एक साथ होते हैं!"
                },
                oppositeSeasons: {
                    title: "विपरीत मौसम",
                    content: "जब उत्तरी गोलार्ध में गर्मी होती है, तो दक्षिणी गोलार्ध में सर्दी होती है - और इसके विपरीत! यह इस बात पर निर्भर करता है कि कौन सा गोलार्ध सूर्य की ओर है।"
                }
            },
            seasonMarkers: {
                springEquinox: "वसंत विषुव",
                summerSolstice: "ग्रीष्म संक्रांति",
                autumnEquinox: "शरद विषुव",
                winterSolstice: "शीत संक्रांति"
            }
        },
        // Practice Mode Content Translations in Hindi
        practiceContent: {
            header: "✏️ अभ्यास मोड",
            subtitle: "पृथ्वी की परिक्रमा • कक्षा 7 विज्ञान",
            question: "प्रश्न",
            of: "का",
            needAHint: "💡 संकेत चाहिए?",
            hideHint: "💡 संकेत छुपाएं",
            hint: "💡 संकेत",
            correct: "🎉 सही!",
            notQuiteRight: "💡 बिल्कुल सही नहीं",
            nextQuestion: "अगला प्रश्न →",
            seeResults: "परिणाम देखें 🎯",
            excellent: "उत्कृष्ट!",
            greatJob: "बेहतरीन काम!",
            goodEffort: "अच्छा प्रयास!",
            keepLearning: "सीखना जारी रखें!",
            youAreExpert: "आप परिक्रमा के विशेषज्ञ हैं!",
            solidUnderstanding: "आपकी समझ मजबूत है!",
            keepPracticing: "अभ्यास जारी रखें और सुधार करें!",
            reviewConcepts: "अवधारणाओं की समीक्षा करें और फिर से कोशिश करें!",
            totalPoints: "कुल अंक",
            correctLabel: "सही",
            incorrect: "गलत",
            accuracy: "सटीकता",
            tryAgain: "🔄 फिर से कोशिश करें",
            tryDifficulty: "📈 कोशिश करें",
            easy: "आसान",
            medium: "मध्यम",
            hard: "कठिन",
            perfectScore: "🌟 परफेक्ट स्कोर! आपने इस कठिनाई स्तर में महारत हासिल कर ली है। एक बड़ी चुनौती के लिए तैयार हैं?",
            excellentWork: "💪 उत्कृष्ट काम! बस कुछ और अवधारणाओं की समीक्षा करें और आप इसे पास कर लेंगे!",
            goodProgress: "📚 अच्छी प्रगति! जिन प्रश्नों में आप गलत थे, उनकी व्याख्याओं की समीक्षा करें।",
            keepPracticingMessage: "🎯 अभ्यास जारी रखें! हर प्रयास आपको पृथ्वी की परिक्रमा को बेहतर समझने में मदद करता है।",
            questions: {
                q1: {
                    question: "पृथ्वी को सूर्य के चारों ओर एक पूर्ण परिक्रमा करने में कितना समय लगता है?",
                    options: ["24 घंटे", "30 दिन", "365¼ दिन", "7 दिन"],
                    explanation: "पृथ्वी को सूर्य के चारों ओर एक पूर्ण कक्षा पूरी करने में 365¼ दिन (लगभग एक वर्ष) लगते हैं। यह अतिरिक्त ¼ दिन ही हर 4 साल में लीप वर्ष का कारण है!",
                    hint: "सोचें कि एक वर्ष कितना लंबा है!"
                },
                q2: {
                    question: "सूर्य के चारों ओर पृथ्वी की कक्षा का आकार क्या है?",
                    options: ["पूर्ण वृत्त", "अण्डाकार (अंडाकार)", "वर्ग", "त्रिभुज"],
                    explanation: "पृथ्वी की कक्षा अण्डाकार (अंडाकार) है, पूर्ण वृत्त नहीं। इसका मतलब है कि पृथ्वी कभी-कभी सूर्य के करीब होती है (उपसौर) और कभी-कभी दूर (अपसौर)।",
                    hint: "यह एक खिंचे हुए वृत्त जैसा है।"
                },
                q3: {
                    question: "सूर्य के चारों ओर पृथ्वी की गति को क्या कहा जाता है?",
                    options: ["घूर्णन", "परिक्रमा", "दोलन", "कंपन"],
                    explanation: "परिक्रमा सूर्य के चारों ओर पृथ्वी की गति है। घूर्णन अपने अक्ष पर घूमना है। दोनों को भ्रमित न करें!",
                    hint: "यह 'Rev' से शुरू होता है..."
                },
                q4: {
                    question: "पृथ्वी सूर्य के चारों ओर किस दिशा में घूमती है (उत्तरी ध्रुव के ऊपर से देखने पर)?",
                    options: ["दक्षिणावर्त", "वामावर्त", "यादृच्छिक रूप से", "यह नहीं चलती"],
                    explanation: "पृथ्वी उत्तरी ध्रुव के ऊपर से देखने पर सूर्य के चारों ओर वामावर्त (एंटी-क्लॉकवाइज भी कहा जाता है) घूमती है।",
                    hint: "घड़ी की सुईयों के विपरीत।"
                },
                q5: {
                    question: "पृथ्वी की परिक्रमा से कितने मौसम होते हैं?",
                    options: ["2 मौसम", "3 मौसम", "4 मौसम", "6 मौसम"],
                    explanation: "पृथ्वी की परिक्रमा और अक्षीय झुकाव मिलकर 4 मौसम बनाते हैं: वसंत, गर्मी, शरद (पतझड़), और सर्दी।",
                    hint: "एक वर्ष में अलग-अलग मौसम की अवधि के बारे में सोचें।"
                },
                q6: {
                    question: "पृथ्वी पर मौसमों का मुख्य कारण क्या है?",
                    options: ["सूर्य से दूरी", "पृथ्वी का अक्षीय झुकाव", "चंद्रमा का गुरुत्वाकर्षण", "सूर्य की चमक में परिवर्तन"],
                    explanation: "पृथ्वी का 23.5° अक्षीय झुकाव मौसमों का मुख्य कारण है। जब कोई गोलार्ध सूर्य की ओर झुकता है, तो उसे अधिक सीधी धूप मिलती है और गर्मी का अनुभव होता है।",
                    hint: "पृथ्वी 23.5 डिग्री झुकी हुई है।"
                },
                q7: {
                    question: "उत्तरी गोलार्ध में 21 जून को क्या होता है?",
                    options: ["सर्दी शुरू होती है", "वर्ष का सबसे लंबा दिन", "दिन और रात बराबर होते हैं", "पृथ्वी सूर्य के सबसे करीब होती है"],
                    explanation: "21 जून उत्तरी गोलार्ध में ग्रीष्म संक्रांति है - वर्ष का सबसे लंबा दिन और सबसे छोटी रात। सूर्य आकाश में अपने उच्चतम बिंदु पर होता है।",
                    hint: "यह गर्मी की शुरुआत है!"
                },
                q8: {
                    question: "जब ऑस्ट्रेलिया में गर्मी होती है, तो भारत में कौन सा मौसम होता है?",
                    options: ["गर्मी", "सर्दी", "वसंत", "शरद"],
                    explanation: "ऑस्ट्रेलिया (दक्षिणी गोलार्ध) और भारत (उत्तरी गोलार्ध) में विपरीत मौसम होते हैं। जब ऑस्ट्रेलिया में गर्मी होती है (दिसंबर-फरवरी), तो भारत में सर्दी होती है।",
                    hint: "वे अलग-अलग गोलार्ध में हैं।"
                },
                q9: {
                    question: "विषुव क्या है?",
                    options: ["सबसे लंबा दिन", "सबसे छोटा दिन", "दिन और रात बराबर होते हैं", "जब पृथ्वी सूर्य के सबसे करीब होती है"],
                    explanation: "विषुव तब होता है जब दिन और रात लगभग बराबर लंबाई के होते हैं (लगभग 12 घंटे प्रत्येक)। यह साल में दो बार होता है - लगभग 21 मार्च और 23 सितंबर को।",
                    hint: "'Equi' का अर्थ है बराबर, 'nox' का अर्थ है रात।"
                },
                q10: {
                    question: "पृथ्वी सूर्य के चारों ओर किस गति से यात्रा करती है?",
                    options: ["100 km/h", "1,000 km/h", "30,000 km/h", "108,000 km/h"],
                    explanation: "पृथ्वी सूर्य के चारों ओर लगभग 108,000 km/h (या लगभग 30 km प्रति सेकंड) की गति से यात्रा करती है। यह एक गोली से लगभग 30 गुना तेज है!",
                    hint: "यह अविश्वसनीय रूप से तेज है - 100,000 km/h से अधिक!"
                },
                q11: {
                    question: "पृथ्वी सूर्य के सबसे करीब कब होती है (उपसौर)?",
                    options: ["जून (उत्तरी गर्मी)", "जनवरी (उत्तरी सर्दी)", "मार्च (वसंत विषुव)", "सितंबर (शरद विषुव)"],
                    explanation: "आश्चर्यजनक रूप से, पृथ्वी जनवरी की शुरुआत में सूर्य के सबसे करीब होती है! यह साबित करता है कि मौसम सूर्य से दूरी के कारण नहीं, बल्कि अक्षीय झुकाव के कारण होते हैं।",
                    hint: "यह प्रतिवादात्मक है - सोचें कि मौसम किससे नहीं होते।"
                },
                q12: {
                    question: "यदि पृथ्वी का कोई अक्षीय झुकाव नहीं होता (0 डिग्री), तो क्या होगा?",
                    options: ["कोई दिन या रात नहीं", "कोई मौसम नहीं", "कोई गुरुत्वाकर्षण नहीं", "कोई कक्षा नहीं"],
                    explanation: "अक्षीय झुकाव के बिना, पृथ्वी पर कोई मौसम नहीं होगा। हर जगह साल भर एक जैसा जलवायु होगा, भूमध्य रेखा पर बराबर दिन और रात और ध्रुवों पर लगातार गोधूलि होगी।",
                    hint: "झुकाव मौसमों का कारण है..."
                },
                q13: {
                    question: "हम हर 4 साल में एक लीप दिवस क्यों जोड़ते हैं?",
                    options: ["चंद्रमा का गुरुत्वाकर्षण", "सूर्य बड़ा हो जाता है", "पृथ्वी की परिक्रमा 365.25 दिन है", "अन्य ग्रहों के साथ संरेखित करने के लिए"],
                    explanation: "पृथ्वी को सूर्य की परिक्रमा करने में बिल्कुल 365.25 दिन लगते हैं। अतिरिक्त 0.25 दिन हर 4 साल में 1 पूर्ण दिन बन जाते हैं, इसलिए हम 29 फरवरी जोड़ते हैं ताकि हमारा कैलेंडर पृथ्वी की स्थिति के साथ संरेखित रहे।",
                    hint: "365 + ¼ + ¼ + ¼ + ¼ = ?"
                },
                q14: {
                    question: "एक पूर्ण परिक्रमा में पृथ्वी लगभग कितनी दूरी तय करती है?",
                    options: ["150 million km", "584 million km", "940 million km", "1.5 billion km"],
                    explanation: "पृथ्वी एक वर्ष में लगभग 940 million km यात्रा करती है! यह पृथ्वी की अण्डाकार कक्षा की परिधि से गणना की जाती है (लगभग 2π × सूर्य से औसत दूरी)।",
                    hint: "यह लगभग एक अरब किलोमीटर है!"
                },
                q15: {
                    question: "अपसौर क्या है?",
                    options: ["जब पृथ्वी सबसे तेज घूमती है", "जब पृथ्वी सूर्य से सबसे दूर होती है", "जब दिन रात के बराबर होता है", "जब पृथ्वी घूमना बंद कर देती है"],
                    explanation: "अपसौर पृथ्वी की कक्षा में वह बिंदु है जब यह सूर्य से सबसे दूर होती है (लगभग 152 million km)। यह हर साल लगभग 4 जुलाई को होता है।",
                    hint: "'Apo' का अर्थ है दूर, 'helion' सूर्य को संदर्भित करता है।"
                }
            },
            // Current Practice Mode Questions (5 questions)
            practiceQuestions: {
                q1: {
                    question: "पृथ्वी अपने अक्ष पर किस दिशा में घूमती है?",
                    options: ["पूर्व से पश्चिम", "पश्चिम से पूर्व", "उत्तर से दक्षिण", "दक्षिण से उत्तर"],
                    explanation: "पृथ्वी पश्चिम से पूर्व की ओर घूमती है। इसीलिए सूर्य पूर्व में उदय और पश्चिम में अस्त होता दिखाई देता है। जब उत्तरी ध्रुव के ऊपर से देखा जाता है, तो पृथ्वी वामावर्त दिशा में घूमती है।"
                },
                q2: {
                    question: "पृथ्वी को अपने अक्ष पर एक पूर्ण घूर्णन पूरा करने में कितना समय लगता है?",
                    options: ["12 घंटे", "24 घंटे", "365 दिन", "30 दिन"],
                    explanation: "पृथ्वी लगभग 24 घंटे में अपने अक्ष पर एक पूर्ण घूर्णन पूरी करती है। यह घूर्णन ही दिन-रात के चक्र का कारण है।"
                },
                q3: {
                    question: "पृथ्वी पर दिन और रात का कारण क्या है?",
                    options: [
                        "सूर्य के चारों ओर पृथ्वी की परिक्रमा",
                        "अपने अक्ष पर पृथ्वी का घूर्णन",
                        "चंद्रमा द्वारा सूर्य के प्रकाश को अवरुद्ध करना",
                        "सूर्य को ढकने वाले बादल"
                    ],
                    explanation: "दिन और रात पृथ्वी के अपने अक्ष पर घूर्णन के कारण होते हैं। जैसे-जैसे पृथ्वी घूमती है, सूर्य की ओर वाला भाग दिन का अनुभव करता है, जबकि दूर वाला भाग रात का अनुभव करता है।"
                },
                q4: {
                    question: "पृथ्वी को सूर्य के चारों ओर एक पूर्ण परिक्रमा पूरी करने में कितना समय लगता है?",
                    options: ["24 घंटे", "30 दिन", "365 दिन और 6 घंटे", "बिल्कुल 12 महीने"],
                    explanation: "पृथ्वी को सूर्य के चारों ओर एक पूर्ण परिक्रमा पूरी करने में लगभग 365 दिन और 6 घंटे लगते हैं। यह अतिरिक्त 6 घंटे चार साल में जमा होकर 366 दिनों वाला लीप वर्ष बनाते हैं।"
                },
                q5: {
                    question: "पृथ्वी पर मौसमों का मुख्य कारण क्या है?",
                    options: [
                        "सूर्य से दूरी में परिवर्तन",
                        "पृथ्वी का झुका हुआ अक्ष और गोलाकार आकार",
                        "चंद्रमा का गुरुत्वाकर्षण खिंचाव",
                        "सूर्य से सौर ज्वालाएं"
                    ],
                    explanation: "मौसम मुख्य रूप से पृथ्वी के अक्ष के 23.5° झुके होने के कारण होते हैं, जो इसकी कक्षा के सापेक्ष है, साथ ही पृथ्वी के गोलाकार आकार के संयोजन से। इससे अलग-अलग गोलार्ध वर्ष भर अलग-अलग मात्रा में सूर्य का प्रकाश प्राप्त करते हैं।"
                }
            }
        },
        // Real World Mode Content Translations in Hindi
        realWorldContent: {
            header: "🌍 वास्तविक दुनिया के अनुप्रयोग",
            subtitle: "खोजें कि सूर्य के चारों ओर पृथ्वी की परिक्रमा हमारे दैनिक जीवन के हर पहलू को कैसे प्रभावित करती है!",
            showing: "दिखा रहे हैं",
            of: "का",
            examplesLabel: "उदाहरण",
            for: "के लिए",
            noExamplesFound: "कोई उदाहरण नहीं मिला",
            tryDifferentSearch: "एक अलग खोज शब्द या श्रेणी फ़िल्टर आज़माएं।",
            clearFilters: "फ़िल्टर साफ़ करें",
            keyTakeaway: "🎯 मुख्य बात",
            keyTakeawayText: "पृथ्वी की परिक्रमा केवल पाठ्यपुस्तकों में एक वैज्ञानिक अवधारणा नहीं है — यह हमारे ग्रह पर जीवन के हर पहलू को आकार देती है! हम जो भोजन खाते हैं 🍎 से लेकर जो कपड़े पहनते हैं 👕, जो त्योहार मनाते हैं 🎉 से लेकर जो खेल खेलते हैं ⚽, सूर्य के चारों ओर 365¼ दिन की यात्रा सब कुछ प्रभावित करती है। परिक्रमा को समझना हमें उस अविश्वसनीय ब्रह्मांडीय नृत्य की सराहना करने में मदद करता है जो पृथ्वी पर जीवन को संभव बनाता है।",
            daysPerEclipses: "प्रति परिक्रमा दिन",
            kmhOrbitalSpeed: "km/h कक्षीय गति",
            axialTilt: "अक्षीय झुकाव",
            seasonsCreated: "बनाए गए मौसम",
            examplesByCategory: "📊 श्रेणी के अनुसार उदाहरण",
            clickToExplore: "खोजने के लिए क्लिक करें →",
            howEclipsessAffects: "📋 पृथ्वी की परिक्रमा इसे कैसे प्रभावित करती है:",
            relatedConcept: "🔗 संबंधित अवधारणा",
            funFact: "🌟 रोचक तथ्य",
            examples: {
                farming: {
                    title: "कृषि और खेती",
                    category: "कृषि",
                    description: "किसान पृथ्वी की परिक्रमा और परिणामी मौसमों के आधार पर अपना पूरा वर्ष योजनाबद्ध करते हैं। बुवाई और कटाई का समय मौसमी परिवर्तनों पर निर्भर करता है।",
                    details: [
                        "वसंत (मार्च-मई): मिट्टी गर्म होने पर खेत जोतना और बीज बोना",
                        "गर्मी (जून-अगस्त): लंबे धूप वाले दिनों और गर्मी के साथ फसलें तेजी से बढ़ती हैं",
                        "शरद (सितंबर-नवंबर): चावल, गेहूं, मक्का जैसी अधिकांश फसलों के लिए कटाई का मौसम",
                        "सर्दी (दिसंबर-फरवरी): भूमि आराम करती है, किसान अगले वर्ष के चक्र की योजना बनाते हैं"
                    ],
                    funFact: "भारत में, रबी (सर्दी) और खरीफ (मानसून) फसल चक्र सीधे पृथ्वी की कक्षा में उसकी स्थिति से जुड़े हुए हैं! गेहूं एक रबी फसल है जबकि चावल खरीफ है।",
                    relatedConcept: "परिक्रमा के दौरान अक्षीय झुकाव के कारण मौसम"
                },
                birdMigration: {
                    title: "पक्षी प्रवास",
                    category: "प्रकृति",
                    description: "हर साल लाखों पक्षी हजारों किलोमीटर प्रवास करते हैं, सूर्य के चारों ओर पृथ्वी की परिक्रमा के कारण होने वाले मौसमों का अनुसरण करते हुए।",
                    details: [
                        "पक्षी घटते दिन के उजाले को सर्दी से पहले प्रवास करने के संकेत के रूप में महसूस करते हैं",
                        "वे गर्म क्षेत्रों में उड़ते हैं जहां भोजन उपलब्ध होता है",
                        "आर्कटिक टर्न सालाना 70,000 km से अधिक यात्रा करते हैं - सबसे लंबा प्रवास!",
                        "साइबेरियाई क्रेन हर सर्दी में भारत में केवलादेव राष्ट्रीय उद्यान जैसी जगहों पर आती हैं"
                    ],
                    funFact: "बार-टेल्ड गॉडविट ने सबसे लंबी नॉन-स्टॉप उड़ान का रिकॉर्ड बनाया है - अलास्का से न्यूजीलैंड तक 11,000 km बिना खाए, पिए या आराम किए!",
                    relatedConcept: "परिक्रमा के कारण दिन की लंबाई और तापमान में परिवर्तन"
                },
                schoolCalendar: {
                    title: "स्कूल कैलेंडर",
                    category: "दैनिक जीवन",
                    description: "आपका स्कूल वर्ष, छुट्टियां, और परीक्षा कार्यक्रम सभी सूर्य के चारों ओर पृथ्वी की परिक्रमा से बने मौसमों के आसपास डिज़ाइन किए गए हैं।",
                    details: [
                        "सबसे गर्म महीनों के दौरान गर्मी की छुट्टी (भारत में मई-जून)",
                        "सबसे ठंडी अवधि के दौरान सर्दी की छुट्टी (दिसंबर-जनवरी)",
                        "चरम मौसम की स्थिति से बचने के लिए शैक्षणिक वर्ष की योजना",
                        "सुखद मौसम के लिए खेल दिवस और वार्षिक कार्यक्रम निर्धारित"
                    ],
                    funFact: "ऑस्ट्रेलिया में, गर्मी की छुट्टी दिसंबर-जनवरी में होती है, और स्कूल फरवरी में शुरू होता है - भारत के विपरीत क्योंकि वे दक्षिणी गोलार्ध में हैं!",
                    relatedConcept: "उत्तरी और दक्षिणी गोलार्ध में विपरीत मौसम"
                },
                festivals: {
                    title: "त्योहार और उत्सव",
                    category: "संस्कृति",
                    description: "दुनिया भर के कई त्योहार संक्रांति, विषुव और पृथ्वी की परिक्रमा के कारण होने वाले मौसमी परिवर्तनों से जुड़े हुए हैं।",
                    details: [
                        "मकर संक्रांति (14 जनवरी): शीत संक्रांति के बाद सूर्य की उत्तर की ओर यात्रा का जश्न",
                        "होली (मार्च): वसंत के आगमन का जश्न",
                        "क्रिसमस (25 दिसंबर): उत्तरी गोलार्ध में शीत संक्रांति के निकट पड़ता है",
                        "पोंगल/बिहू: शरद की बहुतायत का जश्न मनाने वाले फसल त्योहार"
                    ],
                    funFact: "इंग्लैंड में स्टोनहेंज 5,000 साल पहले विशेष रूप से ग्रीष्म और शीत संक्रांति को चिह्नित करने के लिए बनाया गया था! प्राचीन लोग पृथ्वी की परिक्रमा को समझते थे।",
                    relatedConcept: "मौसमी संक्रमण को चिह्नित करने वाली संक्रांति और विषुव"
                },
                weather: {
                    title: "मौसम और जलवायु पैटर्न",
                    category: "विज्ञान",
                    description: "पृथ्वी की परिक्रमा निर्धारित करती है कि मानसून कब आता है, कब बर्फ पड़ती है, और वर्ष भर समग्र तापमान पैटर्न।",
                    details: [
                        "भारतीय मानसून जून में आता है जब उत्तरी गोलार्ध सूर्य की ओर झुकता है",
                        "ध्रुवीय क्षेत्र गर्मी में 24-घंटे के दिन का अनुभव करते हैं (मध्यरात्रि सूर्य)",
                        "महासागरीय धाराएं और हवा के पैटर्न पृथ्वी की कक्षीय स्थिति के साथ बदलते हैं",
                        "तूफान/चक्रवात का मौसम पूर्वानुमेय वार्षिक पैटर्न का अनुसरण करता है"
                    ],
                    funFact: "उत्तरी ध्रुव पर, सूर्य लगभग 6 महीने (अप्रैल से सितंबर) तक अस्त नहीं होता है और अन्य 6 महीनों के लिए उदय नहीं होता है! इसे ध्रुवीय दिवस और ध्रुवीय रात कहा जाता है।",
                    relatedConcept: "वर्ष भर विभिन्न सूर्य कोणों का कारण बनने वाला अक्षीय झुकाव"
                },
                sports: {
                    title: "खेल मौसम",
                    category: "खेल",
                    description: "पृथ्वी की परिक्रमा के परिणामस्वरूप मौसम की स्थिति के आधार पर अलग-अलग मौसम में अलग-अलग खेल खेले जाते हैं।",
                    details: [
                        "क्रिकेट: मुख्य रूप से गर्मी में खेला जाता है जब पिचें सूखी होती हैं और दिन लंबे होते हैं",
                        "फुटबॉल/सॉकर: मौसम शरद, सर्दी और वसंत के माध्यम से चलता है",
                        "स्कीइंग और बर्फ के खेल: केवल सर्दी के महीनों के दौरान संभव",
                        "तैराकी और जल खेल: गर्मी में चरम लोकप्रियता"
                    ],
                    funFact: "कतर में फीफा विश्व कप 2022 सामान्य जून-जुलाई के बजाय नवंबर-दिसंबर में आयोजित किया गया था क्योंकि कतर का गर्मी का तापमान 45°C से अधिक हो जाता है!",
                    relatedConcept: "बाहरी गतिविधियों को प्रभावित करने वाले मौसमी तापमान भिन्नताएं"
                },
                clothing: {
                    title: "कपड़े और फैशन",
                    category: "दैनिक जीवन",
                    description: "आप जो कपड़े पहनते हैं वे पूरी तरह से मौसम के आधार पर बदलते हैं, जो पृथ्वी की कक्षा में उसकी स्थिति से निर्धारित होता है।",
                    details: [
                        "सर्दी: भारी ऊनी, स्वेटर, जैकेट और थर्मल वियर",
                        "गर्मी: हल्के सूती कपड़े, शॉर्ट्स और सांस लेने योग्य कपड़े",
                        "मानसून: रेनकोट, छतरियां और वाटरप्रूफ जूते",
                        "फैशन उद्योग प्रत्येक मौसम के लिए 6 महीने पहले संग्रह डिज़ाइन करता है"
                    ],
                    funFact: "जब पेरिस और मिलान फरवरी में अपने 'गर्मी फैशन वीक' की मेजबानी करते हैं, तो वे वास्तव में उस गर्मी के लिए कपड़े दिखा रहे होते हैं जो अभी भी 6 महीने दूर है!",
                    relatedConcept: "अलग-अलग कपड़ों की आवश्यकता वाले मौसमी तापमान परिवर्तन"
                },
                energy: {
                    title: "ऊर्जा और बिजली",
                    category: "प्रौद्योगिकी",
                    description: "पृथ्वी की परिक्रमा के कारण बिजली की खपत और सौर ऊर्जा उत्पादन मौसमों के साथ नाटकीय रूप से भिन्न होता है।",
                    details: [
                        "गर्मी: एसी उपयोग में वृद्धि, लेकिन लंबे दिनों का मतलब अधिक सौर ऊर्जा",
                        "सर्दी: अधिक हीटिंग की आवश्यकता, छोटे दिन सौर उत्पादन को कम करते हैं",
                        "सौर पैनल सर्दी की तुलना में गर्मी में 50% अधिक ऊर्जा उत्पादन करते हैं",
                        "बिजली ग्रिड को मौसमी मांग परिवर्तनों के लिए क्षमता समायोजित करनी चाहिए"
                    ],
                    funFact: "नॉर्वे जैसे आर्कटिक सर्कल के पास के देश गर्मी के दौरान 24 घंटे प्रति दिन सौर ऊर्जा उत्पन्न कर सकते हैं, लेकिन सर्दी के महीनों के दौरान लगभग शून्य सौर ऊर्जा प्राप्त करते हैं!",
                    relatedConcept: "सौर ऊर्जा और तापमान को प्रभावित करने वाली दिन की लंबाई में भिन्नता"
                },
                hibernation: {
                    title: "पशु शीतनिद्रा",
                    category: "प्रकृति",
                    description: "कई जानवर पृथ्वी की परिक्रमा से मौसमी परिवर्तनों के आधार पर शीतनिद्रा में जाते हैं या अपने व्यवहार को काफी बदल देते हैं।",
                    details: [
                        "भालू सर्दी के दौरान ऊर्जा बचाने के लिए 7 महीने तक सोते हैं",
                        "गिलहरी और चिपमंक शरद में सर्दी के महीनों के लिए भोजन जमा करते हैं",
                        "कुछ मेंढक वास्तव में सर्दी में जम सकते हैं और वसंत में पिघल सकते हैं!",
                        "ठंड के मौसम में कीड़े निष्क्रिय हो जाते हैं या मर जाते हैं"
                    ],
                    funFact: "आर्कटिक ग्राउंड गिलहरी का शरीर का तापमान शीतनिद्रा के दौरान -3°C तक गिर जाता है - किसी भी स्तनपायी का सबसे ठंडा शरीर का तापमान! इसका दिल केवल एक मिनट में एक बार धड़कता है।",
                    relatedConcept: "मौसमी भोजन की कमी और तापमान परिवर्तन"
                },
                astronomy: {
                    title: "खगोल विज्ञान और तारा देखना",
                    category: "विज्ञान",
                    description: "पृथ्वी सूर्य के चारों ओर चलती है, अलग-अलग मौसमों में अलग-अलग तारामंडल और खगोलीय वस्तुएं दिखाई देती हैं।",
                    details: [
                        "गर्मी का आकाश: स्कॉर्पियस और धनु तारामंडल हावी होते हैं",
                        "सर्दी का आकाश: ओरियन द हंटर सबसे प्रमुख तारामंडल है",
                        "पृथ्वी की बदलती स्थिति हमें आकाशगंगा के अलग-अलग दृश्य देती है",
                        "उल्का बौछारें हर साल उसी समय होती हैं जब पृथ्वी मलबे के रास्तों को पार करती है"
                    ],
                    funFact: "अगस्त में प्रसिद्ध पर्सिड उल्का बौछार इसलिए होती है क्योंकि पृथ्वी हर साल अपनी कक्षा में बिल्कुल उसी बिंदु पर कॉमेट स्विफ्ट-टटल द्वारा छोड़े गए मलबे से गुजरती है!",
                    relatedConcept: "अंतरिक्ष के हमारे दृश्य को बदलने वाली पृथ्वी की कक्षीय स्थिति"
                },
                calendar: {
                    title: "कैलेंडर प्रणाली",
                    category: "इतिहास",
                    description: "मानव सभ्यताओं ने कृषि और धार्मिक कार्यक्रमों के लिए पृथ्वी की परिक्रमा को ट्रैक करने के लिए विशेष रूप से कैलेंडर का आविष्कार किया।",
                    details: [
                        "365 दिन + लीप वर्ष पृथ्वी की कक्षा को सटीक रूप से ट्रैक करने के लिए गणना की गई थी",
                        "प्राचीन मिस्रवासियों ने लगभग 3000 BCE में पहला 365-दिवसीय कैलेंडर बनाया",
                        "मायाओं ने अविश्वसनीय सटीकता के साथ संक्रांति और विषुव को ट्रैक किया",
                        "हमारे महीने मूल रूप से सौर वर्ष के भीतर चंद्र चक्रों का अनुसरण करने की कोशिश करते थे"
                    ],
                    funFact: "आज हम जिस ग्रेगोरियन कैलेंडर का उपयोग करते हैं, उसे 1582 में पोप ग्रेगरी XIII द्वारा एक 10-दिवसीय त्रुटि को ठीक करने के लिए पेश किया गया था जो जमा हो गई थी क्योंकि पृथ्वी का वर्ष वास्तव में 365.2422 दिन है, बिल्कुल 365.25 नहीं!",
                    relatedConcept: "लीप वर्षों की आवश्यकता पैदा करने वाली 365.25 दिवसीय परिक्रमा अवधि"
                },
                tourism: {
                    title: "पर्यटन और यात्रा",
                    category: "अर्थव्यवस्था",
                    description: "संपूर्ण पर्यटन उद्योग पृथ्वी की परिक्रमा के कारण होने वाले मौसमों के आसपास योजना बनाता है, जिसमें अरबों डॉलर दांव पर लगे होते हैं।",
                    details: [
                        "स्की रिसॉर्ट: केवल सर्दी के बर्फ के मौसम के दौरान लाभदायक",
                        "समुद्र तट गंतव्य: गर्मी के महीनों के दौरान चरम पर्यटन",
                        "जापान में चेरी ब्लॉसम देखना वसंत में लाखों लोगों को आकर्षित करता है",
                        "शरद पत्ती पर्यटन ('लीफ पीपिंग') न्यू इंग्लैंड, यूएसए में बहुत बड़ा है"
                    ],
                    funFact: "कुछ धनी पर्यटक 'अंतहीन गर्मी' का अभ्यास करते हैं - हमेशा गर्मी के मौसम का अनुभव करने के लिए लगातार उत्तरी और दक्षिणी गोलार्ध के बीच यात्रा करना!",
                    relatedConcept: "अलग-अलग गोलार्ध में विपरीत मौसम"
                },
                food: {
                    title: "भोजन की उपलब्धता",
                    category: "दैनिक जीवन",
                    description: "बाजारों में उपलब्ध फल और सब्जियां मौसम के साथ बदलते हैं, सीधे पृथ्वी की परिक्रमा से जुड़े हुए हैं।",
                    details: [
                        "गर्मी: आम, तरबूज और लीची प्रचुर मात्रा में होते हैं",
                        "सर्दी: संतरे, अमरूद और मौसमी सब्जियां पनपती हैं",
                        "मानसून: भिंडी और लौकी जैसी विशिष्ट फसलें अच्छी तरह से बढ़ती हैं",
                        "वैश्विक शिपिंग अब ऑफ-सीजन उत्पाद प्रदान करती है, लेकिन उच्च लागत पर"
                    ],
                    funFact: "रेफ्रिजरेशन और वैश्विक शिपिंग से पहले, लोग केवल उन फलों और सब्जियों को खा सकते थे जो उनके वर्तमान मौसम में उगते थे। दिसंबर में भारत में एक आम असंभव होता!",
                    relatedConcept: "तापमान और दिन के उजाले के आधार पर मौसमी बढ़ती स्थितियां"
                },
                health: {
                    title: "मानव स्वास्थ्य",
                    category: "विज्ञान",
                    description: "हमारा स्वास्थ्य और कल्याण पृथ्वी की परिक्रमा के कारण होने वाले मौसमी परिवर्तनों से काफी प्रभावित होता है।",
                    details: [
                        "सर्दी: ठंडे मौसम के कारण लोगों को घर के अंदर रखने से फ्लू का मौसम चरम पर होता है",
                        "गर्मी: गर्मी से संबंधित बीमारियां बढ़ती हैं; अधिक हाइड्रेशन की आवश्यकता",
                        "मौसमी भावात्मक विकार (SAD): कम सर्दी के दिन के उजाले से जुड़ा अवसाद",
                        "कम सूर्य के संपर्क के कारण सर्दी में विटामिन डी का स्तर गिर जाता है"
                    ],
                    funFact: "फिनलैंड जैसे बहुत लंबी सर्दी की रातों वाले देशों में, लोग मौसमी भावात्मक विकार को रोकने के लिए सूर्य के प्रकाश की नकल करने वाले विशेष प्रकाश चिकित्सा लैंप का उपयोग करते हैं!",
                    relatedConcept: "वर्ष भर दिन की लंबाई और सूर्य के संपर्क में भिन्नता"
                },
                plants: {
                    title: "पौधे जीवन चक्र",
                    category: "प्रकृति",
                    description: "पेड़ और पौधे मौसमी परिवर्तनों के आधार पर वृद्धि, फूलने और निष्क्रियता के वार्षिक चक्र का अनुसरण करते हैं।",
                    details: [
                        "वसंत: दिन लंबे होने और तापमान बढ़ने पर नए पत्ते निकलते हैं",
                        "गर्मी: प्रकाश संश्लेषण के लिए प्रचुर सूर्य के प्रकाश के साथ अधिकतम वृद्धि",
                        "शरद: पत्ते रंग बदलते हैं और गिरते हैं क्योंकि पेड़ सर्दी के लिए तैयार होते हैं",
                        "सर्दी: पर्णपाती पेड़ ठंड से बचने के लिए निष्क्रिय हो जाते हैं"
                    ],
                    funFact: "पत्ते शरद में रंग बदलते हैं क्योंकि पेड़ हरे क्लोरोफिल का उत्पादन बंद कर देते हैं, पीले और नारंगी वर्णक को प्रकट करते हैं जो पहले से ही वहां थे! लाल रंग वास्तव में नए उत्पादित होते हैं।",
                    relatedConcept: "पौधों की प्रतिक्रियाओं को ट्रिगर करने वाले प्रकाश और तापमान परिवर्तन"
                },
                ocean: {
                    title: "महासागर ज्वार और धाराएं",
                    category: "विज्ञान",
                    description: "जबकि ज्वार मुख्य रूप से चंद्रमा के कारण होते हैं, महासागर धाराओं में मौसमी परिवर्तन पृथ्वी की परिक्रमा से प्रभावित होते हैं।",
                    details: [
                        "भारतीय महासागर में मानसून धाराएं मौसमी रूप से दिशा उलट देती हैं",
                        "मछली प्रवास पैटर्न मौसमी तापमान परिवर्तनों का अनुसरण करते हैं",
                        "एल नीनो और ला नीना घटनाएं मौसमी पैटर्न से जुड़ी हुई हैं",
                        "शिपिंग मार्ग मौसमी मौसम और धारा परिवर्तनों के लिए समायोजित होते हैं"
                    ],
                    funFact: "भारतीय महासागर एकमात्र महासागर है जहां धाराएं साल में दो बार पूरी तरह से दिशा उलट देती हैं - गर्मी में उत्तर-पूर्व की ओर और सर्दी में दक्षिण-पश्चिम की ओर मानसून हवाओं के कारण बहती हैं!",
                    relatedConcept: "महासागर व्यवहार को प्रभावित करने वाले मौसमी तापमान अंतर"
                }
            },
            categories: {
                all: "सभी",
                agriculture: "कृषि",
                nature: "प्रकृति",
                dailyLife: "दैनिक जीवन",
                culture: "संस्कृति",
                science: "विज्ञान",
                sports: "खेल",
                technology: "प्रौद्योगिकी",
                economy: "अर्थव्यवस्था",
                history: "इतिहास"
            },
            // Current Real World Scenarios (6 scenarios)
            scenarios: {
                scenario1: {
                    title: "अंतर्राष्ट्रीय क्रिकेट मैच की योजना",
                    context: "भारत ऑस्ट्रेलिया के खिलाफ क्रिकेट मैच खेल रहा है। सिडनी में मैच स्थानीय समयानुसार सुबह 10:00 बजे शुरू होता है।",
                    question: "यदि सिडनी भारत (IST) से 4.5 घंटे आगे है, तो भारतीय प्रशंसकों को लाइव मैच देखने के लिए किस समय उठना चाहिए?",
                    realWorldConnection: "समय क्षेत्र इसलिए मौजूद हैं क्योंकि पृथ्वी पश्चिम से पूर्व की ओर घूमती है। पूर्व में स्थित देश पश्चिम की तुलना में पहले सूर्योदय का अनुभव करते हैं।",
                    solution: "भारतीय प्रशंसकों को लाइव मैच देखने के लिए सुबह 5:30 बजे IST पर उठना चाहिए।",
                    explanation: "चूंकि सिडनी भारत से 4.5 घंटे आगे है:\n• जब सिडनी में सुबह 10:00 बजे होता है\n• भारत में यह सुबह 10:00 बजे - 4.5 घंटे = 5:30 बजे होता है\n\nयह समय अंतर इसलिए मौजूद है क्योंकि पृथ्वी पश्चिम से पूर्व की ओर घूमती है। सिडनी, जो पूर्व में अधिक दूर है, पहले सूर्योदय का अनुभव करता है और समय में आगे है।",
                    tips: [
                        "भारत के पूर्व में स्थित देशों का समय बाद में होता है",
                        "भारत के पश्चिम में स्थित देशों का समय पहले होता है",
                        "समय क्षेत्र पृथ्वी के घूर्णन से बनते हैं"
                    ]
                },
                scenario2: {
                    title: "किसान का बुवाई का मौसम",
                    context: "रवि पंजाब का एक किसान है। वह जानता है कि गेहूं सबसे अच्छा तब उगता है जब मानसून की बारिश के बाद, छोटे दिनों वाले ठंडे महीनों के दौरान बोया जाता है।",
                    question: "क्या रवि को जून (गर्मी) में या नवंबर (मानसून के बाद) में गेहूं बोना चाहिए? मौसमों के अपने ज्ञान का उपयोग करके समझाएं।",
                    realWorldConnection: "मौसम पृथ्वी के झुके हुए अक्ष के कारण होते हैं। अलग-अलग फसलें तापमान और दिन के उजाले के घंटों के आधार पर अलग-अलग मौसमों में बेहतर उगती हैं।",
                    solution: "रवि को नवंबर (मानसून के बाद) में गेहूं बोना चाहिए।",
                    explanation: "गेहूं को नवंबर में बोना चाहिए क्योंकि:\n\n1. **तापमान**: नवंबर उत्तरी भारत में सर्दी की शुरुआत का प्रतीक है। गेहूं एक रबी फसल है जो ठंडे तापमान (15-20°C) में सबसे अच्छा उगता है।\n\n2. **दिन की लंबाई**: नवंबर में, दिन छोटे हो रहे होते हैं (12 घंटे से कम)। गेहूं को इष्टतम वृद्धि के लिए इस छोटी दिन की लंबाई की आवश्यकता होती है।\n\n3. **मौसम चक्र**: पृथ्वी के झुके हुए अक्ष के कारण:\n   • जून (ग्रीष्म संक्रांति) में, उत्तरी गोलार्ध लंबे, गर्म दिनों का अनुभव करता है\n   • नवंबर में, तापमान ठंडा हो जाता है और दिन छोटे हो जाते हैं\n   • यह ठंडा होने का समय गेहूं के अंकुरण के लिए आदर्श है\n\n4. **मानसून लाभ**: मिट्टी मानसून की बारिश से नमी बनाए रखती है, जो बुवाई के लिए अच्छी स्थिति प्रदान करती है।",
                    tips: [
                        "गर्मी (जून): गर्म, लंबे दिन - गेहूं के लिए उपयुक्त नहीं",
                        "सर्दी (नवंबर): ठंडे, छोटे दिन - गेहूं के लिए परफेक्ट",
                        "मौसम फसल वृद्धि पैटर्न को प्रभावित करते हैं"
                    ]
                },
                scenario3: {
                    title: "सौर पैनल स्थापना",
                    context: "दिल्ली में एक परिवार अपनी छत पर सौर पैनल स्थापित करना चाहता है। वे जानना चाहते हैं कि पैनल को किस दिशा में रखना चाहिए और क्या पैनल गर्मी और सर्दी में समान ऊर्जा उत्पन्न करेंगे।",
                    question: "उन्हें पैनल किस दिशा में स्थापित करने चाहिए, और क्या गर्मी बनाम सर्दी में ऊर्जा उत्पादन अलग होगा?",
                    realWorldConnection: "सूर्य का स्पष्ट पथ पृथ्वी के झुकाव के कारण मौसमों के साथ बदलता है। यह पूरे वर्ष सौर ऊर्जा की क्षमता को प्रभावित करता है।",
                    solution: "पैनल दक्षिण की ओर होने चाहिए। गर्मी में सर्दी की तुलना में अधिक ऊर्जा उत्पन्न होगी।",
                    explanation: "**दिशा**: सौर पैनल उत्तरी गोलार्ध (जैसे दिल्ली) में **दक्षिण** की ओर होने चाहिए।\n\n**क्यों दक्षिण?**\n• जैसे पृथ्वी पश्चिम से पूर्व की ओर घूमती है, सूर्य पूर्व से पश्चिम की ओर चलता हुआ दिखाई देता है\n• उत्तरी गोलार्ध में, सूर्य का पथ आकाश के दक्षिणी भाग से होकर गुजरता है\n• दक्षिण की ओर वाले पैनल पूरे दिन अधिकतम सूर्य का प्रकाश प्राप्त करते हैं\n\n**मौसमी भिन्नता**:\n\n**गर्मी (जून)**:\n• उत्तरी गोलार्ध सूर्य की ओर झुका होता है\n• सूर्य आकाश में अधिक ऊंचाई पर होता है\n• लंबे दिन (14-15 घंटे का दिन का उजाला)\n• अधिक तीव्र सूर्य का प्रकाश\n• **अधिक ऊर्जा उत्पादन**\n\n**सर्दी (दिसंबर)**:\n• उत्तरी गोलार्ध सूर्य से दूर झुका होता है\n• सूर्य आकाश में नीचे होता है\n• छोटे दिन (10-11 घंटे का दिन का उजाला)\n• कम तीव्र सूर्य का प्रकाश\n• **कम ऊर्जा उत्पादन**\n\nपृथ्वी के अक्षीय झुकाव और सूर्य के चारों ओर परिक्रमा के कारण सर्दी की तुलना में गर्मी में 40-60% कम ऊर्जा का अंतर हो सकता है।",
                    tips: [
                        "उत्तर पैनल को सूर्य के पथ से दूर करता है",
                        "दिल्ली में गर्मी में सर्दी की तुलना में ~4 घंटे अधिक सूर्य का प्रकाश होता है",
                        "पृथ्वी का झुकाव इस मौसमी भिन्नता का कारण है"
                    ]
                },
                scenario4: {
                    title: "सौर ग्रहण यात्रा की योजना",
                    context: "20 अप्रैल को भारत में एक संकीर्ण पथ से एक पूर्ण सूर्य ग्रहण दिखाई देगा। आपका परिवार इसे देखने के लिए मुंबई से यात्रा करना चाहता है। पूर्णता का पथ वाराणसी से होकर गुजरता है।",
                    question: "आपकी उड़ान सुबह 11:00 बजे वाराणसी में उतरती है, और ग्रहण की पूर्णता सुबह 11:45 बजे से 11:48 बजे तक (3 मिनट) रहती है। क्या यह पर्याप्त समय है? आपको क्या सावधानियां बरतनी चाहिए?",
                    realWorldConnection: "सौर ग्रहण तब होते हैं जब चंद्रमा पृथ्वी और सूर्य के बीच से गुजरता है। छाया पृथ्वी के घूर्णन और चंद्रमा की गति दोनों के कारण पृथ्वी पर चलती है।",
                    solution: "हां, पर्याप्त समय है, लेकिन यह तंग है। उचित योजना और सुरक्षा उपकरण आवश्यक हैं।",
                    explanation: "**समय विश्लेषण**:\n• उड़ान उतरती है: सुबह 11:00 बजे\n• पूर्णता शुरू होती है: सुबह 11:45 बजे\n• उपलब्ध समय: 45 मिनट\n• यह सैद्धांतिक रूप से पर्याप्त समय है, लेकिन विचार करें:\n  - हवाई अड्डे से निकलने का समय: 15-20 मिनट\n  - देखने के स्थान तक यात्रा: 20-30 मिनट\n  - यह केवल 5-10 मिनट का बफर छोड़ता है - जोखिम भरा!\n\n**सिफारिश**: इस दुर्लभ घटना को याद न करने के लिए रात पहले पहुंचें।\n\n**पूर्णता इतनी छोटी क्यों है (3 मिनट)**:\n1. **चंद्रमा की छाया की गति**: चंद्रमा की छाया पृथ्वी पर ~2,000 km/h की गति से चलती है क्योंकि:\n   - पृथ्वी का घूर्णन (भूमध्य रेखा पर 1,670 km/h)\n   - पृथ्वी के चारों ओर चंद्रमा की कक्षीय गति\n\n2. **संकीर्ण पथ**: पृथ्वी पर चंद्रमा की छाया केवल ~100-200 km चौड़ी है\n\n3. **सापेक्ष गति**: छाया सतह पर तेजी से बहती है\n\n**आवश्यक सुरक्षा सावधानियां**:\n\n**पूर्णता से पहले (आंशिक चरण)**:\n✗ कभी भी सीधे सूर्य को न देखें\n✗ नियमित धूप के चश्मे सुरक्षित नहीं हैं\n✓ प्रमाणित सौर ग्रहण चश्मे (ISO 12312-2) का उपयोग करें\n✓ पिनहोल प्रोजेक्शन विधि का उपयोग करें\n\n**पूर्णता के दौरान (2-3 मिनट)**:\n✓ सीधे देखना सुरक्षित है (सूर्य पूरी तरह से ढका हुआ है)\n✓ कोरोना देखने के लिए ग्रहण चश्मे हटाएं\n✓ अद्भुत दृश्य - आकाश अंधेरा हो जाता है, तारे दिखाई देते हैं\n\n**पूर्णता के बाद**:\n✗ तुरंत ग्रहण चश्मे वापस पहनें\n✗ सूर्य फिर से खतरनाक है\n\n**इतना खतरनाक क्यों?**\nसूर्य का केवल 1% दिखाई देने से भी आपकी आंखों को स्थायी नुकसान हो सकता है। सूर्य इतना तीव्र है कि ग्रहण के दौरान भी अंधापन हो सकता है।",
                    tips: [
                        "एक दिन पहले पहुंचने की योजना बनाएं",
                        "ग्रहण चश्मे अनिवार्य हैं",
                        "कभी भी सुरक्षा के बिना आंशिक चरणों को न देखें",
                        "पूर्णता ही सीधे देखने का एकमात्र सुरक्षित समय है",
                        "चंद्रमा की छाया पृथ्वी पर ~2,000 km/h की गति से चलती है"
                    ]
                },
                scenario5: {
                    title: "तारा देखने की साहसिक योजना",
                    context: "आप ओरियन तारामंडल देखना चाहते हैं, जो उत्तरी सर्दी के आकाश में प्रमुख है। आप बैंगलोर से एक तारा देखने की यात्रा की योजना बना रहे हैं।",
                    question: "किस महीनों (मार्च, जून, सितंबर, या दिसंबर) में ओरियन शाम के आकाश में सबसे अच्छा दिखाई देगा? यह क्यों बदलता है?",
                    realWorldConnection: "अलग-अलग तारामंडल अलग-अलग महीनों में दिखाई देते हैं क्योंकि पृथ्वी सूर्य के चारों ओर घूमती है, जिससे अंतरिक्ष के हमारे रात्रिकालीन दृश्य में परिवर्तन होता है।",
                    solution: "ओरियन दिसंबर और जनवरी की शाम में सबसे अच्छा दिखाई देता है।",
                    explanation: "**सबसे अच्छा देखना**: ओरियन **दिसंबर और जनवरी** की शाम के आकाश में सबसे प्रमुख रूप से दिखाई देता है।\n\n**देखने में वर्ष भर क्यों बदलाव होता है**:\n\nजैसे पृथ्वी सूर्य के चारों ओर घूमती है (365 दिन), हमारा रात्रिकालीन दृश्य अंतरिक्ष के अलग-अलग हिस्सों की ओर इशारा करता है:\n\n**दिसंबर-जनवरी** (सबसे अच्छा):\n• पृथ्वी का रात्रिकालीन पक्ष ओरियन की दिशा की ओर होता है\n• ओरियन सूर्यास्त के आसपास पूर्व में उदय होता है\n• पूरी रात दिखाई देता है\n• आधी रात के आसपास आकाश में सबसे ऊंचा\n• परफेक्ट देखने की स्थिति\n\n**मार्च**:\n• ओरियन शाम में दिखाई देता है लेकिन पहले अस्त हो रहा होता है\n• शुरुआती शाम में सबसे अच्छा देखना\n• देर रात तक, यह क्षितिज पर बहुत नीचे होता है\n\n**जून** (सबसे खराब):\n• पृथ्वी सूर्य के विपरीत पक्ष पर घूम चुकी होती है\n• ओरियन दिन के आकाश में होता है\n• रात में पूरी तरह से अदृश्य\n• सूर्य ओरियन की ही दिशा में होता है\n\n**सितंबर**:\n• ओरियन फिर से दिखाई देना शुरू होता है\n• सुबह के ठीक पहले उदय होता है\n• शाम के तारा देखने के लिए अच्छा नहीं\n\n**इसके पीछे का विज्ञान**:\n\n1. **पृथ्वी की परिक्रमा**: जैसे हम सूर्य की परिक्रमा करते हैं, हम 365 दिनों में 360° पूरा करते हैं (~1° प्रति दिन)\n\n2. **बदलता दृश्य**: हर महीने, हमारा रात्रिकालीन दृश्य लगभग 30° बदल जाता है\n\n3. **तारामंडल चक्र**: हर तारामंडल का ~6 महीने का \"देखने का मौसम\" होता है\n   - चरम से 3 महीने पहले: सुबह से पहले उदय\n   - चरम महीने: पूरी रात दिखाई देता है\n   - चरम के 3 महीने बाद: सूर्यास्त के बाद अस्त\n   - विपरीत 6 महीने: दिन के आकाश में\n\n**बैंगलोर के लिए व्यावहारिक सुझाव**:\n• सबसे अच्छे महीने: नवंबर - फरवरी\n• शुरुआती शाम में पूर्व की ओर देखें\n• ओरियन रात 9-10 बजे तक दक्षिणी आकाश में ऊंचा होगा\n• एक पंक्ति में तीन तारों से आसानी से पहचाना जा सकता है (ओरियन का बेल्ट)\n• अंधेरे आकाश के लिए चंद्रमा के अस्त होने के बाद सबसे अच्छा",
                    tips: [
                        "ओरियन उत्तरी गोलार्ध में एक सर्दी का तारामंडल है",
                        "हर तारामंडल ~3-4 महीनों के लिए सबसे अच्छा दिखाई देता है",
                        "सटीक उदय समय खोजने के लिए तारा देखने वाला ऐप उपयोग करें",
                        "चंद्रमा के चरण दृश्यता को प्रभावित करते हैं - नया चंद्रमा सबसे अच्छा है"
                    ]
                },
                scenario6: {
                    title: "छुट्टी के गंतव्य का चयन",
                    context: "आपका परिवार दिल्ली में ठंडे मौसम से बचने और गर्म, धूप वाले समुद्र तटों का आनंद लेने के लिए दिसंबर में सर्दी की छुट्टी लेना चाहता है।",
                    question: "क्या आपको ऑस्ट्रेलिया या श्रीलंका जाना चाहिए? अलग-अलग गोलार्धों में मौसमों के अपने ज्ञान का उपयोग करके समझाएं।",
                    realWorldConnection: "पृथ्वी के झुकाव के कारण उत्तरी और दक्षिणी गोलार्ध में मौसम विपरीत होते हैं क्योंकि यह सूर्य के चारों ओर घूमती है।",
                    solution: "ऑस्ट्रेलिया जाएं! वहां दिसंबर में गर्मी होगी।",
                    explanation: "**सबसे अच्छा विकल्प**: **ऑस्ट्रेलिया** दिसंबर में गर्म समुद्र तट की छुट्टी के लिए परफेक्ट होगा!\n\n**तर्क**:\n\n**ऑस्ट्रेलिया (दक्षिणी गोलार्ध)**:\n• दिसंबर = **गर्मी** ☀️\n• तापमान: 25-35°C (गर्म और धूप वाला)\n• परफेक्ट समुद्र तट का मौसम\n• लंबे दिन, छोटी रातें\n• क्यों? दिसंबर में दक्षिणी गोलार्ध सूर्य की ओर झुका होता है\n\n**श्रीलंका (भूमध्य रेखा के निकट)**:\n• दिसंबर = सुहावना मौसम (26-30°C)\n• हालांकि, पूर्वी तट पर मानसून का मौसम है\n• पश्चिमी तट दिसंबर में बेहतर है\n• चूंकि यह भूमध्य रेखा के निकट है, तापमान में इतना नाटकीय अंतर नहीं है\n\n**विज्ञान - मौसम विपरीत क्यों हैं**:\n\n**दिसंबर में**:\n• पृथ्वी का उत्तरी ध्रुव सूर्य से दूर झुका होता है → उत्तरी गोलार्ध में सर्दी\n• पृथ्वी का दक्षिणी ध्रुव सूर्य की ओर झुका होता है → दक्षिणी गोलार्ध में गर्मी\n\n**जून में** (विपरीत स्थिति):\n• पृथ्वी का उत्तरी ध्रुव सूर्य की ओर झुका होता है → उत्तरी गोलार्ध में गर्मी  \n• पृथ्वी का दक्षिणी ध्रुव सूर्य से दूर झुका होता है → दक्षिणी गोलार्ध में सर्दी\n\n**झुकाव को समझना**:\n1. पृथ्वी का अक्ष 23.5° झुका हुआ है\n2. यह झुकाव पृथ्वी के सूर्य के चारों ओर घूमने के दौरान स्थिर रहता है\n3. 6 महीनों के लिए, उत्तरी गोलार्ध सूर्य की ओर झुका होता है (मार्च-सितंबर)\n4. 6 महीनों के लिए, दक्षिणी गोलार्ध सूर्य की ओर झुका होता है (सितंबर-मार्च)\n\n**व्यावहारिक अनुप्रयोग**:\n• उत्तरी सर्दी से बच रहे हैं? → दक्षिण जाएं (ऑस्ट्रेलिया, न्यूजीलैंड, अर्जेंटीना)\n• उत्तरी गर्मी की गर्मी से बच रहे हैं? → ठंडे मौसम के लिए दक्षिण जाएं\n• साल भर लगातार मौसम चाहते हैं? → भूमध्य रेखा के निकट जाएं (श्रीलंका, सिंगापुर)",
                    tips: [
                        "दिसंबर = ऑस्ट्रेलिया में गर्मी, भारत में सर्दी",
                        "भूमध्य रेखा के निकट देशों में कम मौसमी भिन्नता होती है",
                        "यह पृथ्वी के 23.5° झुकाव के कारण होता है",
                        "भूमध्य रेखा के पार मौसम उलट जाते हैं"
                    ]
                }
            }
        },
        eclipseLearnContent: {
            title: "ग्रहण",
            subtitle: "अध्याय 12.3 — पृथ्वी, चंद्रमा और सूर्य",
            solarEclipse: "सूर्य ग्रहण",
            lunarEclipse: "चंद्र ग्रहण",
            solarEclipseDesc: "सूर्य ग्रहण तब होता है जब चंद्रमा सूर्य और पृथ्वी के बीच आ जाता है, जिससे सूर्य का प्रकाश हम तक नहीं पहुंच पाता। यह खगोलीय संरेखण प्रकृति की सबसे शानदार घटनाओं में से एक है, जो दिन को एक अजीब सी गोधूलि में बदल देता है।",
            apparentSizeTitle: "स्पष्ट आकार का विज्ञान",
            apparentSizeDesc: "हालांकि चंद्रमा सूर्य से बहुत छोटा है, लेकिन स्पष्ट आकार के कारण यह सूर्य को पूरी तरह से ढक सकता है। चंद्रमा सूर्य से लगभग 400 गुना छोटा है, लेकिन यह पृथ्वी से लगभग 400 गुना करीब भी है। यह उल्लेखनीय ब्रह्मांडीय संयोग दोनों खगोलीय पिंडों को हमारे आकाश में लगभग समान आकार का दिखाता है!",
            totalSolarEclipse: "पूर्ण सूर्य ग्रहण",
            totalSolarEclipseDesc: "चंद्रमा सूर्य को पूरी तरह से ढक देता है। चंद्रमा की छाया (अंबरा) में रहने वाले पर्यवेक्षक कुछ मिनटों के लिए पूर्ण अंधकार का अनुभव करते हैं। सूर्य का सुंदर कोरोना अंधेरे चंद्रमा के चारों ओर चमकती हुई प्रभामंडल के रूप में दिखाई देता है।",
            partialSolarEclipse: "आंशिक सूर्य ग्रहण",
            partialSolarEclipseDesc: "चंद्रमा सूर्य को केवल आंशिक रूप से ढकता है। पेनम्ब्रा में रहने वाले पर्यवेक्षक सूर्य का एक हिस्सा अभी भी दिखाई देता है, जैसे कि सूर्य के डिस्क से एक काट लिया गया हो।",
            safetyWarning: "⚠️ सुरक्षा चेतावनी",
            safetyWarningText: "कभी भी सीधे सूर्य ग्रहण को न देखें! ग्रहण के दौरान भी, सूर्य इतना तीव्र है कि यह आपकी आंखों को स्थायी रूप से नुकसान पहुंचा सकता है और अंधापन का कारण बन सकता है। नियमित धूप के चश्मे, दूरबीन या दूरदर्शी के माध्यम से न देखें। हमेशा विशेष ISO-प्रमाणित सूर्य ग्रहण चश्मे का उपयोग करें या तारामंडल और खगोल विज्ञान क्लबों में आयोजित देखने की घटनाओं में भाग लें।",
            lunarEclipseDesc: "चंद्र ग्रहण तब होता है जब पृथ्वी सूर्य और चंद्रमा के बीच आ जाती है, जिससे सूर्य का प्रकाश चंद्रमा की सतह तक नहीं पहुंच पाता। पृथ्वी की छाया चंद्रमा पर पड़ती है, जो पृथ्वी के रात्रि पक्ष पर सभी के लिए एक नाटकीय खगोलीय प्रदर्शन बनाती है।",
            bloodMoonTitle: "ब्लड मून घटना",
            bloodMoonDesc: "पूर्ण चंद्र ग्रहण के दौरान, चंद्रमा पूरी तरह से अंधेरा नहीं होता। इसके बजाय, यह एक आकर्षक गहरे लाल रंग में बदल जाता है, जिससे इसे नाटकीय नाम \"ब्लड मून\" मिलता है। यह इसलिए होता है क्योंकि पृथ्वी का वायुमंडल हमारे ग्रह के चारों ओर कुछ सूर्य के प्रकाश को मोड़ता है, नीले तरंगदैर्ध्य को फ़िल्टर करता है और केवल लाल प्रकाश को चंद्रमा तक पहुंचने और उसे रोशन करने की अनुमति देता है।",
            totalLunarEclipse: "पूर्ण चंद्र ग्रहण",
            totalLunarEclipseDesc: "चंद्रमा पूरी तरह से पृथ्वी के अंबरा (पूर्ण छाया) के भीतर है। पूरा चंद्रमा एक लाल-तांबे के रंग में बदल जाता है, जो प्रसिद्ध \"ब्लड मून\" प्रभाव बनाता है जो एक घंटे से अधिक समय तक रह सकता है।",
            partialLunarEclipse: "आंशिक चंद्र ग्रहण",
            partialLunarEclipseDesc: "चंद्रमा का केवल एक हिस्सा पृथ्वी के अंबरा से गुजरता है। आप चंद्रमा के छायांकित (अंधेरे/लाल) भाग और चमकदार रूप से रोशन भाग दोनों को एक साथ देख सकते हैं।",
            safeToView: "✅ देखने के लिए सुरक्षित",
            safeToViewText: "सूर्य ग्रहण के विपरीत, चंद्र ग्रहण नंगी आंखों से देखने के लिए पूरी तरह से सुरक्षित हैं! आप बिना किसी विशेष सुरक्षात्मक उपकरण के पूरी घटना का निरीक्षण कर सकते हैं। चंद्र ग्रहण सूर्य ग्रहण की तुलना में पृथ्वी के बहुत बड़े क्षेत्र से देखे जा सकते हैं, जिससे उन्हें देखना अधिक सुलभ हो जाता है।",
            historicalTitle: "ऐतिहासिक और सांस्कृतिक महत्व",
            historicalText1: "लोगों ने प्राचीन काल से ही ग्रहणों का अवलोकन और रिकॉर्ड किया है। जब ग्रहणों के कारण अज्ञात थे, तो उनसे अक्सर डर लगता था। कई प्राचीन सभ्यताओं ने इन घटनाओं से अंधविश्वास जोड़े। हालांकि, प्राचीन भारतीय खगोलविदों ने सदियों पहले ग्रहणों की सटीक भविष्यवाणी करने के लिए परिष्कृत गणितीय विधियां विकसित की थीं।",
            historicalText2: "कोडाइकनल सोलर ऑब्जर्वेटरी, जिसकी स्थापना 1899 में दक्षिण भारत की सुंदर पलानी पहाड़ियों में हुई थी, 125 से अधिक वर्षों से सूर्य का अध्ययन कर रही है। यह बेंगलुरु के भारतीय खगोल भौतिकी संस्थान (IIA) द्वारा संचालित है और सौर घटनाओं की हमारी समझ में मूल्यवान डेटा का योगदान जारी रखती है।",
            keyFactsTitle: "याद रखने योग्य मुख्य तथ्य",
            sunDiameter: "सूर्य का व्यास",
            earthDiameter: "पृथ्वी का व्यास",
            moonDiameter: "चंद्रमा का व्यास",
            sunEarthDistance: "सूर्य-पृथ्वी दूरी",
            moonEarthDistance: "चंद्रमा-पृथ्वी दूरी",
            eclipseDuration: "कुल ग्रहण अवधि",
            footerText: "NCERT क्यूरियोसिटी विज्ञान पाठ्यपुस्तक — कक्षा 7 पर आधारित",
            footerQuote: "आपकी जिज्ञासा वह चिंगारी है जो अन्वेषण की लौ को जलाती है"
        },
        eclipsePracticeContent: {
            title: "अभ्यास मोड",
            subtitle: "ग्रहण — अपने ज्ञान का परीक्षण करें",
            questionOf: "प्रश्न",
            of: "का",
            score: "स्कोर",
            nextQuestion: "अगला प्रश्न →",
            seeResults: "परिणाम देखें",
            correct: "✓ सही!",
            incorrect: "✗ गलत",
            quizCompleted: "क्विज़ पूर्ण!",
            yourScore: "आपका स्कोर",
            excellent: "उत्कृष्ट! आपने ग्रहणों में महारत हासिल कर ली है!",
            goodJob: "अच्छा काम! सीखते रहें!",
            keepPracticing: "सुधार के लिए अभ्यास जारी रखें!",
            tryAgain: "फिर से कोशिश करें",
            footerText: "NCERT क्यूरियोसिटी विज्ञान — कक्षा 7 — अध्याय 12.3",
            questions: {
                q1: {
                    question: "सूर्य ग्रहण का कारण क्या है?",
                    options: [
                        "पृथ्वी सूर्य और चंद्रमा के बीच आती है",
                        "चंद्रमा सूर्य और पृथ्वी के बीच आता है",
                        "सूर्य पृथ्वी और चंद्रमा के बीच आता है",
                        "तारे सूर्य के प्रकाश को अवरुद्ध करते हैं"
                    ],
                    explanation: "सूर्य ग्रहण तब होता है जब चंद्रमा सूर्य और पृथ्वी के बीच आ जाता है, जिससे सूर्य का प्रकाश हम तक नहीं पहुंच पाता।"
                },
                q2: {
                    question: "चंद्रमा बहुत छोटा होने के बावजूद सूर्य को क्यों ढक सकता है?",
                    options: [
                        "चंद्रमा वास्तव में सूर्य से बड़ा है",
                        "ग्रहण के दौरान सूर्य सिकुड़ जाता है",
                        "चंद्रमा बहुत करीब है, जिससे उनके स्पष्ट आकार समान हो जाते हैं",
                        "पृथ्वी का वायुमंडल चंद्रमा को बढ़ाता है"
                    ],
                    explanation: "स्पष्ट आकार वास्तविक आकार और दूरी दोनों पर निर्भर करता है। चंद्रमा सूर्य से लगभग 400 गुना छोटा है लेकिन पृथ्वी से लगभग 400 गुना करीब भी है।"
                },
                q3: {
                    question: "सही या गलत: चंद्र ग्रहण नंगी आंखों से देखने के लिए सुरक्षित हैं।",
                    options: ["सही", "गलत"],
                    explanation: "सूर्य ग्रहण के विपरीत, चंद्र ग्रहण बिना किसी विशेष उपकरण के नंगी आंखों से देखने के लिए पूरी तरह से सुरक्षित हैं।"
                },
                q4: {
                    question: "पूर्ण चंद्र ग्रहण के दौरान चंद्रमा किस रंग का दिखाई देता है?",
                    options: ["चमकीला सफेद", "गहरा लाल", "नीला", "पीला"],
                    explanation: "पूर्ण चंद्र ग्रहण के दौरान, चंद्रमा गहरा लाल दिखाई देता है (जिसे 'ब्लड मून' कहा जाता है) क्योंकि पृथ्वी का वायुमंडल नीले प्रकाश को फ़िल्टर करता है और लाल प्रकाश को चंद्रमा की ओर मोड़ता है।"
                },
                q5: {
                    question: "सही या गलत: आपको सूर्य ग्रहण देखने के लिए नियमित धूप के चश्मे का उपयोग करना चाहिए।",
                    options: ["सही", "गलत"],
                    explanation: "नियमित धूप के चश्मे सूर्य ग्रहण देखने के लिए सुरक्षित नहीं हैं। आपको विशेष ISO-प्रमाणित सूर्य ग्रहण चश्मे या अप्रत्यक्ष देखने की विधियों की आवश्यकता है।"
                },
                q6: {
                    question: "ग्रहण के दौरान छाया का सबसे अंधेरा भाग कहलाता है:",
                    options: ["पेनम्ब्रा", "कोरोना", "अंबरा", "वायुमंडल"],
                    explanation: "अंबरा छाया का सबसे अंधेरा, केंद्रीय भाग है जहां सभी प्रत्यक्ष प्रकाश अवरुद्ध हो जाता है। पेनम्ब्रा हल्की बाहरी छाया है।"
                },
                q7: {
                    question: "कौन सा भारतीय वेधशाला 125 से अधिक वर्षों से सूर्य का अध्ययन कर रही है?",
                    options: [
                        "माउंट आबू वेधशाला",
                        "कोडाइकनल सोलर ऑब्जर्वेटरी",
                        "ऊटी रेडियो टेलीस्कोप",
                        "वैनु बप्पू वेधशाला"
                    ],
                    explanation: "कोडाइकनल सोलर ऑब्जर्वेटरी, जिसकी स्थापना 1899 में पलानी पहाड़ियों में हुई थी, 125 से अधिक वर्षों से सूर्य का अध्ययन कर रही है।"
                },
                q8: {
                    question: "सही या गलत: पूर्ण सूर्य ग्रहण पृथ्वी पर कहीं से भी देखा जा सकता है जब यह होता है।",
                    options: ["सही", "गलत"],
                    explanation: "पूर्ण सूर्य ग्रहण केवल पृथ्वी पर एक संकीर्ण पथ से दिखाई देता है जहां चंद्रमा का अंबरा पड़ता है। अधिकांश क्षेत्र आंशिक ग्रहण या बिल्कुल नहीं देखते हैं।"
                },
                q9: {
                    question: "सूर्य ग्रहण के दौरान, अवरुद्ध सूर्य के चारों ओर दिखाई देने वाली चमकदार प्रभामंडल कहलाती है:",
                    options: ["अंबरा", "पेनम्ब्रा", "कोरोना", "फोटोस्फीयर"],
                    explanation: "कोरोना सूर्य का बाहरी वायुमंडल है, जो पूर्ण सूर्य ग्रहण के दौरान एक सुंदर चमकदार प्रभामंडल के रूप में दिखाई देता है।"
                },
                q10: {
                    question: "चंद्र ग्रहण सूर्य ग्रहण से अधिक समय तक क्यों रहता है?",
                    options: [
                        "चंद्रमा धीमी गति से चलता है",
                        "पृथ्वी की छाया चंद्रमा की छाया से बहुत बड़ी है",
                        "सूर्य दूर है",
                        "चंद्रमा पृथ्वी से बड़ा है"
                    ],
                    explanation: "पृथ्वी की छाया चंद्रमा की छाया से बहुत बड़ी है, इसलिए चंद्रमा को इसे पार करने में अधिक समय लगता है, जिससे चंद्र ग्रहण अधिक समय तक रहते हैं।"
                }
            }
        },
        eclipseRealWorldContent: {
            title: "वास्तविक दुनिया",
            subtitle: "ग्रहण — आगामी घटनाएं और तथ्य",
            upcomingEvents: "📅 आगामी ग्रहण घटनाएं",
            markCalendars: "इन खगोलीय घटनाओं के लिए अपने कैलेंडर में निशान लगाएं",
            total: "पूर्ण",
            partial: "आंशिक",
            eclipsesAndIndia: "🇮🇳 ग्रहण और भारत",
            footerText: "NCERT क्यूरियोसिटी विज्ञान — कक्षा 7 — अध्याय 12.3",
            events: {
                event1: {
                    date: "14 मार्च, 2025",
                    type: "पूर्ण चंद्र ग्रहण",
                    visibility: "अमेरिका, पश्चिमी यूरोप, पश्चिमी अफ्रीका",
                    description: "एक पूर्ण चंद्र ग्रहण जहां चंद्रमा पृथ्वी के अंबरा से गुजरेगा, लगभग 65 मिनट के लिए दिखाई देने वाला एक शानदार ब्लड मून बनाएगा।"
                },
                event2: {
                    date: "29 मार्च, 2025",
                    type: "आंशिक सूर्य ग्रहण",
                    visibility: "उत्तर-पश्चिम अफ्रीका, यूरोप, उत्तरी रूस",
                    description: "एक आंशिक सूर्य ग्रहण जहां कुछ क्षेत्रों में सूर्य का 93% तक चंद्रमा द्वारा ढका जाएगा।"
                },
                event3: {
                    date: "7 सितंबर, 2025",
                    type: "पूर्ण चंद्र ग्रहण",
                    visibility: "यूरोप, अफ्रीका, एशिया, ऑस्ट्रेलिया",
                    description: "एक और पूर्ण चंद्र ग्रहण जो कई महाद्वीपों में उत्कृष्ट देखने के अवसर प्रदान करता है।"
                },
                event4: {
                    date: "21 सितंबर, 2025",
                    type: "आंशिक सूर्य ग्रहण",
                    visibility: "दक्षिण प्रशांत, न्यूजीलैंड, अंटार्कटिका",
                    description: "एक आंशिक सूर्य ग्रहण जो मुख्य रूप से दक्षिणी गोलार्ध से दिखाई देता है।"
                },
                event5: {
                    date: "12 अगस्त, 2026",
                    type: "पूर्ण सूर्य ग्रहण",
                    visibility: "आर्कटिक, ग्रीनलैंड, आइसलैंड, स्पेन",
                    description: "आर्कटिक क्षेत्र और यूरोप के कुछ हिस्सों को पार करने वाला एक शानदार पूर्ण सूर्य ग्रहण।"
                }
            },
            indiaFacts: {
                fact1: {
                    title: "कोडाइकनल सोलर ऑब्जर्वेटरी",
                    content: "1899 में स्थापित, तमिलनाडु की पलानी पहाड़ियों में यह वेधशाला 125 से अधिक वर्षों से सूर्य का अध्ययन कर रही है, जिससे यह अभी भी संचालन में सबसे पुरानी सौर वेधशालाओं में से एक है।",
                    icon: "🔭"
                },
                fact2: {
                    title: "वैनु बप्पू वेधशाला",
                    content: "तमिलनाडु के कवलूर में स्थित, यह वेधशाला एशिया के सबसे बड़े दूरदर्शी में से एक है और आधुनिक भारतीय खगोल विज्ञान के जनक एम.के. वैनु बप्पू के नाम पर है।",
                    icon: "🌟"
                },
                fact3: {
                    title: "सूर्य सिद्धांत",
                    content: "इस प्राचीन भारतीय खगोलीय पाठ में ग्रहण समय की गणना के लिए विस्तृत विधियां हैं। यह प्रदर्शित करता है कि भारतीय खगोलविदों ने सदियों पहले ग्रहण यांत्रिकी को समझा था।",
                    icon: "📜"
                },
                fact4: {
                    title: "पूर्ण सूर्य ग्रहण 2031",
                    content: "14 नवंबर, 2031 को, एक पूर्ण सूर्य ग्रहण का पथ दक्षिणी भारत के हिस्सों सहित केरल, तमिलनाडु और आंध्र प्रदेश से होकर गुजरेगा - एक दुर्लभ अवसर!",
                    icon: "🇮🇳"
                }
            }
        }
    },
    gu: {
        nav: {
            logo: "પૃથ્વીની પરિક્રમા",
            tabs: {
                learn: "શીખો",
                practice: "અભ્યાસ",
                applications: "વાસ્તવિક વિશ્વ",
            },
        },
        learn: {
            header: 'પૃથ્વીની પરિક્રમા',
            subtitle: 'સૂર્યની આસપાસ પૃથ્વીની યાત્રા',
            placeholder: 'પરિક્રમા શીખવાની સામગ્રી ટૂંક સમયમાં આવશે...'
        },
        practice: {
            header: 'પરિક્રમાનો અભ્યાસ કરો',
            subtitle: 'તમારા જ્ઞાનની કસોટી કરો',
            placeholder: 'પરિક્રમા અભ્યાસ ક્વિઝ ટૂંક સમયમાં આવશે...'
        },
        common: {
            comingSoon: "ટૂંક સમયમાં આવશે",
            stayTuned: "રોમાંચક ઇન્ટરેક્ટિવ સામગ્રી માટે જોડાયેલા રહો!"
        },
        learnMode: {
            header: "શીખવાનો મોડ",
            progress: "પ્રગતિ",
            previous: "પહેલાનું",
            next: "આગળ",
            complete: "પૂર્ણ! 🎉"
        },
        practiceMode: {
            header: "અભ્યાસ મોડ",
            streak: "સતત",
            score: "સ્કોર",
            question: "પ્રશ્ન",
            of: "ના",
            submitAnswer: "જવાબ સબમિટ કરો",
            nextQuestion: "આગળનો પ્રશ્ન",
            viewResults: "પરિણામો જુઓ",
            correct: "સાચું! 🎉",
            notQuiteRight: "બિલકુલ સાચું નથી",
            quizCompleted: "ક્વિઝ પૂર્ણ!",
            outstanding: "અત્યુત્કૃષ્ટ! 🎉",
            excellent: "ઉત્કૃષ્ટ કામ! 🌟",
            goodJob: "સારું કામ! 👍",
            keepPracticing: "અભ્યાસ ચાલુ રાખો! 💪",
            dontGiveUp: "હાર ન માનો! 🌱",
            finalScore: "અંતિમ સ્કોર",
            bestStreak: "શ્રેષ્ઠ સતત",
            inARow: "સતત",
            questions: "પ્રશ્નો",
            completed: "પૂર્ણ",
            performanceBreakdown: "પ્રદર્શન વિશ્લેષણ",
            tryAgain: "ફરી પ્રયાસ કરો",
            questionNavigator: "પ્રશ્ન નેવિગેટર"
        },
        realWorld: {
            header: "વાસ્તવિક વિશ્વના ઉપયોગો",
            subtitle: "તમારા જ્ઞાનને વાસ્તવિક જીવનની પરિસ્થિતિઓમાં લાગુ કરો!",
            description: "જુઓ કે પૃથ્વીનું પરિભ્રમણ અને પરિક્રમણ આપણા દૈનિક જીવનને કેવી રીતે અસર કરે છે",
            howItWorks: "આ કેવી રીતે કામ કરે છે",
            howItWorks1: "દરેક વાસ્તવિક વિશ્વની પરિસ્થિતિને ધ્યાનથી વાંચો",
            howItWorks2: "વિચારો કે પૃથ્વીની ગતિ આ પરિસ્થિતિઓ કેવી રીતે બનાવે છે",
            howItWorks3: "તમે જે શીખ્યા છો તેના આધારે તમારો જવાબ લખો",
            howItWorks4: "વધુ જાણવા માટે વિગતવાર સમજૂતી જુઓ",
            totalScenarios: "કુલ પરિસ્થિતિઓ",
            topicsCovered: "વિષયો આવરી લેવામાં",
            realWorldSkills: "વાસ્તવિક વિશ્વની કુશળતા",
            backToScenarios: "પરિસ્થિતિઓ પર પાછા",
            scenario: "પરિસ્થિતિ",
            context: "સંદર્ભ",
            question: "પ્રશ્ન:",
            realWorldConnection: "વાસ્તવિક વિશ્વનું જોડાણ",
            yourAnswer: "તમારો જવાબ:",
            answerPlaceholder: "તમારો જવાબ અહીં ટાઇપ કરો... પૃથ્વીના પરિભ્રમણ અને પરિક્રમણ વિશે તમે જે શીખ્યા છો તેનો ઉપયોગ કરીને તમારા તર્કની સમજૂતી કરો.",
            checkSolution: "ઉકેલ જુઓ",
            quickAnswer: "ઝડપી જવાબ",
            detailedExplanation: "વિગતવાર સમજૂતી:",
            keyTakeaways: "💡 મુખ્ય મુદ્દાઓ",
            previous: "← પહેલાનું",
            nextScenario: "આગળની પરિસ્થિતિ →",
            complete: "પૂર્ણ! 🎉"
        },
        // Learn Mode Content Translations in Gujarati
        learnContent: {
            earthInSolarSystem: "સૌર મંડળમાં પૃથ્વી",
            current: "વર્તમાન",
            directionOfEclipses: "પરિક્રમાની દિશા",
            counterClockwise: "(વામાવર્ત)",
            sun: "સૂર્ય",
            earth: "પૃથ્વી",
            pause: "⏸️ રોકો",
            play: "▶️ ચલાવો",
            speed: "ગતિ",
            jumpTo: "કૂદો",
            keyEvent: "🎯 મુખ્ય ઘટના",
            hemisphere: "🌐 ગોળાર્ધ",
            orbitPosition: "📍 કક્ષા સ્થિતિ",
            keyFactsAboutEclipses: "📚 પરિક્રમા વિશે મુખ્ય તથ્યો",
            whyDoSeasonsChange: "🤔 ઋતુઓ કેમ બદલાય છે?",
            hide: "▲ છુપાવો",
            show: "▼ બતાવો",
            magicOfAxialTilt: "🪄 અક્ષીય ઝુકાવનો જાદુ!",
            axialTiltDescription: "પૃથ્વી તેના અક્ષ પર 23.5 ડિગ્રી ઝુકેલી છે. આ ઝુકાવ પૃથ્વી સૂર્યની આસપાસ ફરે છે ત્યારે સ્થિર રહે છે.",
            summerTiltedToward: "ઉનાળો (સૂર્ય તરફ ઝુકેલો)",
            winterTiltedAway: "શિયાળો (સૂર્યથી દૂર ઝુકેલો)",
            directSunlight: "સીધો સૂર્યપ્રકાશ",
            longerDays: "લાંબા દિવસો",
            moreHeatAbsorbed: "વધુ ગરમી શોષાય છે",
            slantedSunlight: "ત્રાંસો સૂર્યપ્રકાશ",
            shorterDays: "ટૂંકા દિવસો",
            lessHeatAbsorbed: "ઓછી ગરમી શોષાય છે",
            funFactTilt: "💡 રસપ્રદ તથ્ય: આ એટલા માટે નથી કે પૃથ્વી સૂર્યની નજીક અથવા દૂર છે! હકીકતમાં, પૃથ્વી જાન્યુઆરીમાં સૂર્યની સૌથી નજીક હોય છે (ઉત્તરી ગોળાર્ધમાં શિયાળો)!",
            seasons: {
                spring: { name: "વસંત", months: "માર્ચ - મે", description: "ફૂલો ખીલે છે, પક્ષીઓ ચહચહાટ કરે છે, પ્રકૃતિ જાગે છે", hemisphere: "દિવસ અને રાત લગભગ સમાન", event: "વસંત વિષુવ - 21 માર્ચ" },
                summer: { name: "ઉનાળો", months: "જૂન - ઑગસ્ટ", description: "સૌથી લાંબા દિવસો, સૌથી ગરમ હવામાન", hemisphere: "ઉત્તરી ગોળાર્ધ સૂર્ય તરફ ઝુકેલો", event: "ઉનાળો સંક્રાંતિ - 21 જૂન" },
                autumn: { name: "શરદ", months: "સપ્ટેમ્બર - નવેમ્બર", description: "પાંદડાં પડે છે, પાકનો મોસમ શરૂ થાય છે", hemisphere: "દિવસ અને રાત લગભગ સમાન", event: "શરદ વિષુવ - 23 સપ્ટેમ્બર" },
                winter: { name: "શિયાળો", months: "ડિસેમ્બર - ફેબ્રુઆરી", description: "સૌથી ટૂંકા દિવસો, સૌથી ઠંડું હવામાન", hemisphere: "ઉત્તરી ગોળાર્ધ સૂર્યથી દૂર ઝુકેલો", event: "શિયાળો સંક્રાંતિ - 22 ડિસેમ્બર" }
            },
            keyFacts: {
                eclipsesPeriod: { title: "પરિક્રમા અવધિ", fact: "365¼ દિવસ (1 વર્ષ)", detail: "આ વધારાનો ¼ દિવસ જ દર 4 વર્ષે લીપ વર્ષનું કારણ છે!" },
                orbitalShape: { title: "કક્ષીય આકાર", fact: "અંડાકાર (ઓવલ-આકારનું)", detail: "પૃથ્વી ક્યારેક સૂર્યની નજીક હોય છે (પેરિહેલિયન) અને ક્યારેક દૂર (એફેલિયન)." },
                axialTilt: { title: "અક્ષીય ઝુકાવ", fact: "23.5 ડિગ્રી", detail: "આ ઝુકાવ જ વિવિધ ઋતુઓનું મુખ્ય કારણ છે!" },
                orbitalSpeed: { title: "કક્ષીય ગતિ", fact: "~30 km/s (108,000 km/h)", detail: "તે ગોળીથી લગભગ 30 ગણી ઝડપી છે!" },
                distanceFromSun: { title: "સૂર્યથી અંતર", fact: "~150 million km (સરેરાશ)", detail: "સૂર્યનો પ્રકાશ પૃથ્વી સુધી પહોંચવામાં લગભગ 8 મિનિટ લાગે છે." }
            },
            infoCards: {
                whatIsEclipses: { title: "પરિક્રમા શું છે?", content: "પરિક્રમા એ પૃથ્વીની સૂર્યની આસપાસ અંડાકાર (ઓવલ) કક્ષામાં ગતિ છે. એક સંપૂર્ણ પરિક્રમામાં લગભગ 365¼ દિવસ લાગે છે." },
                effectsOfEclipses: { title: "પરિક્રમાના પ્રભાવો", content: "પરિક્રમા ઋતુઓમાં પરિવર્તન, વર્ષભર દિવસ/રાતની લંબાઈમાં ભિન્નતા, અને રાત્રે દેખાતા વિવિધ તારા સમૂહોનું કારણ બને છે." },
                eclipsesVsRotation: { title: "પરિક્રમા વિરુદ્ધ પરિભ્રમણ", content: "પરિક્રમા એ સૂર્યની આસપાસ ગતિ છે (1 વર્ષ). પરિભ્રમણ એ અક્ષ પર ફરવું છે (24 કલાક). બંને એકસાથે થાય છે!" },
                oppositeSeasons: { title: "વિપરીત ઋતુઓ", content: "જ્યારે ઉત્તરી ગોળાર્ધમાં ઉનાળો હોય છે, ત્યારે દક્ષિણી ગોળાર્ધમાં શિયાળો હોય છે - અને ઊલટું! આ એટલા માટે છે કે કયો ગોળાર્ધ સૂર્ય તરફ છે." }
            },
            seasonMarkers: {
                springEquinox: "વસંત વિષુવ",
                summerSolstice: "ઉનાળો સંક્રાંતિ",
                autumnEquinox: "શરદ વિષુવ",
                winterSolstice: "શિયાળો સંક્રાંતિ"
            }
        },
        // Practice Mode Content Translations in Gujarati - abbreviated due to length
        practiceContent: {
            header: "✏️ અભ્યાસ મોડ",
            subtitle: "પૃથ્વીની પરિક્રમા • ધોરણ 7 વિજ્ઞાન",
            question: "પ્રશ્ન",
            of: "ના",
            needAHint: "💡 સંકેત જોઈએ?",
            hideHint: "💡 સંકેત છુપાવો",
            hint: "💡 સંકેત",
            correct: "🎉 સાચું!",
            notQuiteRight: "💡 બિલકુલ સાચું નથી",
            nextQuestion: "આગળનો પ્રશ્ન →",
            seeResults: "પરિણામો જુઓ 🎯",
            excellent: "અત્યુત્કૃષ્ટ!",
            greatJob: "ઉત્કૃષ્ટ કામ!",
            goodEffort: "સારો પ્રયાસ!",
            keepLearning: "શીખવાનું ચાલુ રાખો!",
            youAreExpert: "તમે પરિક્રમાના નિષ્ણાત છો!",
            solidUnderstanding: "તમારી સમજ મજબૂત છે!",
            keepPracticing: "અભ્યાસ ચાલુ રાખો અને સુધારો કરો!",
            reviewConcepts: "ખ્યાલોની સમીક્ષા કરો અને ફરી પ્રયાસ કરો!",
            totalPoints: "કુલ પોઈન્ટ્સ",
            correctLabel: "સાચું",
            incorrect: "ખોટું",
            accuracy: "ચોકસાઈ",
            tryAgain: "🔄 ફરી પ્રયાસ કરો",
            tryDifficulty: "📈 પ્રયાસ કરો",
            easy: "સરળ",
            medium: "મધ્યમ",
            hard: "કઠિન",
            perfectScore: "🌟 પરફેક્ટ સ્કોર! તમે આ મુશ્કેલી સ્તરમાં નિપુણતા મેળવી છે. મોટી પડકાર માટે તૈયાર છો?",
            excellentWork: "💪 અત્યુત્કૃષ્ટ કામ! થોડા વધુ ખ્યાલોની સમીક્ષા કરો અને તમે તેને પાસ કરશો!",
            goodProgress: "📚 સારી પ્રગતિ! તમે જે પ્રશ્નોમાં ખોટા હતા તેની સમજૂતીઓની સમીક્ષા કરો.",
            keepPracticingMessage: "🎯 અભ્યાસ ચાલુ રાખો! દરેક પ્રયાસ તમને પૃથ્વીની પરિક્રમાને વધુ સારી રીતે સમજવામાં મદદ કરે છે.",
            questions: {
                q1: { question: "પૃથ્વીને સૂર્યની આસપાસ એક સંપૂર્ણ પરિક્રમા કરવામાં કેટલો સમય લાગે છે?", options: ["24 કલાક", "30 દિવસ", "365¼ દિવસ", "7 દિવસ"], explanation: "પૃથ્વીને સૂર્યની આસપાસ એક સંપૂર્ણ કક્ષા પૂર્ણ કરવામાં 365¼ દિવસ (લગભગ એક વર્ષ) લાગે છે. આ વધારાનો ¼ દિવસ જ દર 4 વર્ષે લીપ વર્ષનું કારણ છે!", hint: "વિચારો કે એક વર્ષ કેટલું લાંબું છે!" },
                q2: { question: "સૂર્યની આસપાસ પૃથ્વીની કક્ષાનો આકાર શું છે?", options: ["સંપૂર્ણ વર્તુળ", "અંડાકાર (ઓવલ)", "ચોરસ", "ત્રિકોણ"], explanation: "પૃથ્વીની કક્ષા અંડાકાર (ઓવલ-આકારની) છે, સંપૂર્ણ વર્તુળ નથી. આનો અર્થ એ છે કે પૃથ્વી ક્યારેક સૂર્યની નજીક હોય છે (પેરિહેલિયન) અને ક્યારેક દૂર (એફેલિયન).", hint: "તે ખેંચાયેલા વર્તુળ જેવું છે." },
                q3: { question: "સૂર્યની આસપાસ પૃથ્વીની ગતિને શું કહેવામાં આવે છે?", options: ["પરિભ્રમણ", "પરિક્રમા", "દોલન", "કંપન"], explanation: "પરિક્રમા એ સૂર્યની આસપાસ પૃથ્વીની ગતિ છે. પરિભ્રમણ એ પોતાના અક્ષ પર ફરવું છે. બંનેને ભૂલશો નહીં!", hint: "તે 'Rev' થી શરૂ થાય છે..." },
                q4: { question: "પૃથ્વી સૂર્યની આસપાસ કઈ દિશામાં ફરે છે (ઉત્તર ધ્રુવની ઉપરથી જોતા)?", options: ["ઘડિયાળની દિશામાં", "ઘડિયાળની વિરુદ્ધ દિશામાં", "રેન્ડમલી", "તે ખસતી નથી"], explanation: "પૃથ્વી ઉત્તર ધ્રુવની ઉપરથી જોતા સૂર્યની આસપાસ ઘડિયાળની વિરુદ્ધ દિશામાં (એન્ટી-ક્લોકવાઇઝ પણ કહેવાય છે) ફરે છે.", hint: "ઘડિયાળની સોયો કેવી રીતે ચાલે છે તેનાથી વિપરીત." },
                q5: { question: "પૃથ્વીની પરિક્રમાથી કેટલી ઋતુઓ થાય છે?", options: ["2 ઋતુઓ", "3 ઋતુઓ", "4 ઋતુઓ", "6 ઋતુઓ"], explanation: "પૃથ્વીની પરિક્રમા અને તેના અક્ષીય ઝુકાવ મળીને 4 ઋતુઓ બનાવે છે: વસંત, ઉનાળો, શરદ (પાનખર), અને શિયાળો.", hint: "વર્ષમાં વિવિધ હવામાન સમયગાળા વિશે વિચારો." },
                q6: { question: "પૃથ્વી પર ઋતુઓનું મુખ્ય કારણ શું છે?", options: ["સૂર્યથી અંતર", "પૃથ્વીનો અક્ષીય ઝુકાવ", "ચંદ્રનું ગુરુત્વાકર્ષણ", "સૂર્યની ચમકમાં પરિવર્તન"], explanation: "પૃથ્વીનો 23.5° અક્ષીય ઝુકાવ ઋતુઓનું મુખ્ય કારણ છે. જ્યારે કોઈ ગોળાર્ધ સૂર્ય તરફ ઝુકે છે, ત્યારે તેને વધુ સીધો સૂર્યપ્રકાશ મળે છે અને ઉનાળાનો અનુભવ થાય છે.", hint: "પૃથ્વી 23.5 ડિગ્રી ઝુકેલી છે." },
                q7: { question: "ઉત્તરી ગોળાર્ધમાં 21 જૂનને શું થાય છે?", options: ["શિયાળો શરૂ થાય છે", "વર્ષનો સૌથી લાંબો દિવસ", "દિવસ અને રાત સમાન હોય છે", "પૃથ્વી સૂર્યની સૌથી નજીક હોય છે"], explanation: "21 જૂન ઉત્તરી ગોળાર્ધમાં ઉનાળો સંક્રાંતિ છે - વર્ષનો સૌથી લાંબો દિવસ અને સૌથી ટૂંકી રાત. સૂર્ય આકાશમાં તેના ઉચ્ચતમ બિંદુ પર હોય છે.", hint: "તે ઉનાળાની શરૂઆત છે!" },
                q8: { question: "જ્યારે ઓસ્ટ્રેલિયામાં ઉનાળો હોય છે, ત્યારે ભારતમાં કઈ ઋતુ હોય છે?", options: ["ઉનાળો", "શિયાળો", "વસંત", "શરદ"], explanation: "ઓસ્ટ્રેલિયા (દક્ષિણી ગોળાર્ધ) અને ભારત (ઉત્તરી ગોળાર્ધ) માં વિપરીત ઋતુઓ હોય છે. જ્યારે ઓસ્ટ્રેલિયામાં ઉનાળો હોય છે (ડિસેમ્બર-ફેબ્રુઆરી), ત્યારે ભારતમાં શિયાળો હોય છે.", hint: "તેઓ અલગ-અલગ ગોળાર્ધમાં છે." },
                q9: { question: "વિષુવ શું છે?", options: ["સૌથી લાંબો દિવસ", "સૌથી ટૂંકો દિવસ", "દિવસ અને રાત સમાન હોય છે", "જ્યારે પૃથ્વી સૂર્યની સૌથી નજીક હોય છે"], explanation: "વિષુવ ત્યારે થાય છે જ્યારે દિવસ અને રાત લગભગ સમાન લંબાઈના હોય છે (લગભગ 12 કલાક દરેક). આ વર્ષમાં બે વખત થાય છે - લગભગ 21 માર્ચ અને 23 સપ્ટેમ્બર.", hint: "'Equi' નો અર્થ છે સમાન, 'nox' નો અર્થ છે રાત." },
                q10: { question: "પૃથ્વી સૂર્યની આસપાસ કઈ ગતિથી મુસાફરી કરે છે?", options: ["100 km/h", "1,000 km/h", "30,000 km/h", "108,000 km/h"], explanation: "પૃથ્વી સૂર્યની આસપાસ લગભગ 108,000 km/h (અથવા લગભગ 30 km પ્રતિ સેકન્ડ) ની ગતિથી મુસાફરી કરે છે. તે ગોળીથી લગભગ 30 ગણી ઝડપી છે!", hint: "તે અવિશ્વસનીય રીતે ઝડપી છે - 100,000 km/h થી વધુ!" },
                q11: { question: "પૃથ્વી સૂર્યની સૌથી નજીક ક્યારે હોય છે (પેરિહેલિયન)?", options: ["જૂન (ઉત્તરી ઉનાળો)", "જાન્યુઆરી (ઉત્તરી શિયાળો)", "માર્ચ (વસંત વિષુવ)", "સપ્ટેમ્બર (શરદ વિષુવ)"], explanation: "આશ્ચર્યજનક રીતે, પૃથ્વી જાન્યુઆરીની શરૂઆતમાં સૂર્યની સૌથી નજીક હોય છે! આ સાબિત કરે છે કે ઋતુઓ સૂર્યથી અંતરના કારણે નથી, પરંતુ અક્ષીય ઝુકાવના કારણે છે.", hint: "તે પ્રતિવાદાત્મક છે - વિચારો કે શું ઋતુઓનું કારણ નથી." },
                q12: { question: "જો પૃથ્વીનો કોઈ અક્ષીય ઝુકાવ ન હોય (0 ડિગ્રી), તો શું થશે?", options: ["કોઈ દિવસ અથવા રાત નહીં", "કોઈ ઋતુઓ નહીં", "કોઈ ગુરુત્વાકર્ષણ નહીં", "કોઈ કક્ષા નહીં"], explanation: "અક્ષીય ઝુકાવ વગર, પૃથ્વી પર કોઈ ઋતુઓ નહીં હોય. દરેક જગ્યા પર વર્ષભર સમાન આબોહવા હશે, વિષુવરેખા પર સમાન દિવસ અને રાત અને ધ્રુવો પર સતત ગોધૂલિ હશે.", hint: "ઝુકાવ ઋતુઓનું કારણ છે..." },
                q13: { question: "આપણે દર 4 વર્ષે એક લીપ દિવસ શા માટે ઉમેરીએ છીએ?", options: ["ચંદ્રનું ગુરુત્વાકર્ષણ", "સૂર્ય મોટું થાય છે", "પૃથ્વીની પરિક્રમા 365.25 દિવસ છે", "અન્ય ગ્રહો સાથે સંરેખિત કરવા માટે"], explanation: "પૃથ્વીને સૂર્યની કક્ષા કરવામાં બિલકુલ 365.25 દિવસ લાગે છે. વધારાના 0.25 દિવસ દર 4 વર્ષે 1 સંપૂર્ણ દિવસ બની જાય છે, તેથી આપણે 29 ફેબ્રુઆરી ઉમેરીએ છીએ તાકે આપણું કેલેન્ડર પૃથ્વીની સ્થિતિ સાથે સંરેખિત રહે.", hint: "365 + ¼ + ¼ + ¼ + ¼ = ?" },
                q14: { question: "એક સંપૂર્ણ પરિક્રમામાં પૃથ્વી લગભગ કેટલું અંતર કાપે છે?", options: ["150 million km", "584 million km", "940 million km", "1.5 billion km"], explanation: "પૃથ્વી એક વર્ષમાં લગભગ 940 million km મુસાફરી કરે છે! આ પૃથ્વીની અંડાકાર કક્ષાની પરિધિમાંથી ગણવામાં આવે છે (લગભગ 2π × સૂર્યથી સરેરાશ અંતર).", hint: "તે લગભગ એક અબજ કિલોમીટર છે!" },
                q15: { question: "એફેલિયન શું છે?", options: ["જ્યારે પૃથ્વી સૌથી ઝડપથી ફરે છે", "જ્યારે પૃથ્વી સૂર્યથી સૌથી દૂર હોય છે", "જ્યારે દિવસ રાત બરાબર હોય છે", "જ્યારે પૃથ્વી ફરવાનું બંધ કરે છે"], explanation: "એફેલિયન એ પૃથ્વીની કક્ષામાં તે બિંદુ છે જ્યારે તે સૂર્યથી સૌથી દૂર હોય છે (લગભગ 152 million km). આ દર વર્ષે લગભગ 4 જુલાઈને થાય છે.", hint: "'Apo' નો અર્થ છે દૂર, 'helion' સૂર્યનો સંદર્ભ આપે છે." }
            },
            // Current Practice Mode Questions (5 questions)
            practiceQuestions: {
                q1: {
                    question: "પૃથ્વી તેના અક્ષ પર કઈ દિશામાં ફરે છે?",
                    options: ["પૂર્વથી પશ્ચિમ", "પશ્ચિમથી પૂર્વ", "ઉત્તરથી દક્ષિણ", "દક્ષિણથી ઉત્તર"],
                    explanation: "પૃથ્વી પશ્ચિમથી પૂર્વ તરફ ફરે છે. આથી જ સૂર્ય પૂર્વમાં ઉદય અને પશ્ચિમમાં અસ્ત થતો દેખાય છે. જ્યારે ઉત્તર ધ્રુવની ઉપરથી જોવામાં આવે છે, ત્યારે પૃથ્વી ઘડિયાળની વિરુદ્ધ દિશામાં ફરે છે."
                },
                q2: {
                    question: "પૃથ્વીને તેના અક્ષ પર એક સંપૂર્ણ પરિભ્રમણ પૂર્ણ કરવામાં કેટલો સમય લાગે છે?",
                    options: ["12 કલાક", "24 કલાક", "365 દિવસ", "30 દિવસ"],
                    explanation: "પૃથ્વી લગભગ 24 કલાકમાં તેના અક્ષ પર એક સંપૂર્ણ પરિભ્રમણ પૂર્ણ કરે છે. આ પરિભ્રમણ જ દિવસ-રાતના ચક્રનું કારણ છે."
                },
                q3: {
                    question: "પૃથ્વી પર દિવસ અને રાતનું કારણ શું છે?",
                    options: [
                        "સૂર્યની આસપાસ પૃથ્વીની પરિક્રમા",
                        "તેના અક્ષ પર પૃથ્વીનું પરિભ્રમણ",
                        "ચંદ્ર દ્વારા સૂર્યપ્રકાશને અવરોધિત કરવું",
                        "સૂર્યને ઢાંકતા વાદળો"
                    ],
                    explanation: "દિવસ અને રાત પૃથ્વીના તેના અક્ષ પર પરિભ્રમણના કારણે થાય છે. જેમ પૃથ્વી ફરે છે, સૂર્ય તરફનો ભાગ દિવસનો અનુભવ કરે છે, જ્યારે દૂરનો ભાગ રાતનો અનુભવ કરે છે."
                },
                q4: {
                    question: "પૃથ્વીને સૂર્યની આસપાસ એક સંપૂર્ણ પરિક્રમા પૂર્ણ કરવામાં કેટલો સમય લાગે છે?",
                    options: ["24 કલાક", "30 દિવસ", "365 દિવસ અને 6 કલાક", "બિલકુલ 12 મહિના"],
                    explanation: "પૃથ્વીને સૂર્યની આસપાસ એક સંપૂર્ણ પરિક્રમા પૂર્ણ કરવામાં લગભગ 365 દિવસ અને 6 કલાક લાગે છે. આ વધારાના 6 કલાક ચાર વર્ષમાં જમા થઈને 366 દિવસનું લીપ વર્ષ બનાવે છે."
                },
                q5: {
                    question: "પૃથ્વી પર ઋતુઓનું મુખ્ય કારણ શું છે?",
                    options: [
                        "સૂર્યથી અંતરમાં પરિવર્તન",
                        "પૃથ્વીનો ઝુકેલો અક્ષ અને ગોળાકાર આકાર",
                        "ચંદ્રનું ગુરુત્વાકર્ષણ ખેંચાણ",
                        "સૂર્યથી સૌર જ્વાલાઓ"
                    ],
                    explanation: "ઋતુઓ મુખ્યત્વે પૃથ્વીના અક્ષના 23.5° ઝુકાવના કારણે થાય છે, જે તેની કક્ષાના સંદર્ભમાં છે, સાથે પૃથ્વીના ગોળાકાર આકારના સંયોજનથી. આના કારણે વિવિધ ગોળાર્ધ વર્ષભર વિવિધ માત્રામાં સૂર્યપ્રકાશ પ્રાપ્ત કરે છે."
                }
            }
        },
        // Real World Mode Content Translations in Gujarati - abbreviated due to length
        realWorldContent: {
            header: "🌍 વાસ્તવિક વિશ્વના ઉપયોગો",
            subtitle: "શોધો કે સૂર્યની આસપાસ પૃથ્વીની પરિક્રમા આપણા દૈનિક જીવનના દરેક પાસાને કેવી રીતે અસર કરે છે!",
            showing: "દર્શાવી રહ્યા છીએ",
            of: "ના",
            examplesLabel: "ઉદાહરણો",
            for: "માટે",
            noExamplesFound: "કોઈ ઉદાહરણો મળ્યા નથી",
            tryDifferentSearch: "વિવિધ શોધ શબ્દ અથવા શ્રેણી ફિલ્ટર અજમાવો.",
            clearFilters: "ફિલ્ટર સાફ કરો",
            keyTakeaway: "🎯 મુખ્ય મુદ્દો",
            keyTakeawayText: "પૃથ્વીની પરિક્રમા માત્ર પાઠ્યપુસ્તકોમાં વૈજ્ઞાનિક ખ્યાલ નથી — તે આપણા ગ્રહ પર જીવનના દરેક પાસાને આકાર આપે છે! આપણે જે ખોરાક ખાય છીએ 🍎 થી લઈને જે કપડાં પહેરીએ છીએ 👕, જે તહેવારો ઉજવીએ છીએ 🎉 થી લઈને જે રમતો રમીએ છીએ ⚽, સૂર્યની આસપાસ 365¼ દિવસની મુસાફરી બધું અસર કરે છે. પરિક્રમાને સમજવાથી આપણને તે અવિશ્વસનીય બ્રહ્માંડીય નૃત્યની પ્રશંસા કરવામાં મદદ મળે છે જે પૃથ્વી પર જીવનને શક્ય બનાવે છે.",
            daysPerEclipses: "પ્રતિ પરિક્રમા દિવસો",
            kmhOrbitalSpeed: "km/h કક્ષીય ગતિ",
            axialTilt: "અક્ષીય ઝુકાવ",
            seasonsCreated: "બનાવેલી ઋતુઓ",
            examplesByCategory: "📊 શ્રેણી દ્વારા ઉદાહરણો",
            clickToExplore: "શોધવા માટે ક્લિક કરો →",
            howEclipsessAffects: "📋 પૃથ્વીની પરિક્રમા આને કેવી રીતે અસર કરે છે:",
            relatedConcept: "🔗 સંબંધિત ખ્યાલ",
            funFact: "🌟 રસપ્રદ તથ્ય",
            examples: {
                farming: { title: "ખેતી અને કૃષિ", category: "કૃષિ", description: "કૃષકો પૃથ્વીની પરિક્રમા અને પરિણામી ઋતુઓના આધારે તેમનો સંપૂર્ણ વર્ષ યોજના બનાવે છે. વાવણી અને કાપણીનો સમય મોસમી પરિવર્તનો પર આધારિત છે.", details: ["વસંત (માર્ચ-મે): માટી ગરમ થાય છે ત્યારે ખેતરો જુતવા અને બીજ વાવવા", "ઉનાળો (જૂન-ઑગસ્ટ): લાંબા સૂર્યપ્રકાશવાળા દિવસો અને ગરમી સાથે પાક ઝડપથી વધે છે", "શરદ (સપ્ટેમ્બર-નવેમ્બર): ચોખા, ઘઉં, મકાઈ જેવા મોટાભાગના પાક માટે કાપણીનો મોસમ", "શિયાળો (ડિસેમ્બર-ફેબ્રુઆરી): જમીન આરામ કરે છે, કૃષકો આગામી વર્ષના ચક્ર માટે યોજના બનાવે છે"], funFact: "ભારતમાં, રબી (શિયાળો) અને ખરીફ (મોસમ) પાક ચક્ર સીધા પૃથ્વીની કક્ષામાં તેની સ્થિતિ સાથે જોડાયેલા છે! ઘઉં એક રબી પાક છે જ્યારે ચોખા ખરીફ છે.", relatedConcept: "પરિક્રમા દરમિયાન અક્ષીય ઝુકાવના કારણે ઋતુઓ" },
                birdMigration: { title: "પક્ષી પ્રવાસ", category: "પ્રકૃતિ", description: "લાખો પક્ષીઓ દર વર્ષે હજારો કિલોમીટર પ્રવાસ કરે છે, સૂર્યની આસપાસ પૃથ્વીની પરિક્રમાના કારણે થતી ઋતુઓનો અનુસરણ કરીને.", details: ["પક્ષીઓ ઘટતા દિવસના પ્રકાશને શિયાળા પહેલાં પ્રવાસ કરવાના સંકેત તરીકે અનુભવે છે", "તેઓ ગરમ પ્રદેશોમાં ઉડે છે જ્યાં ખોરાક ઉપલબ્ધ હોય છે", "આર્કટિક ટર્ન્સ વાર્ષિક 70,000 km થી વધુ મુસાફરી કરે છે - સૌથી લાંબો પ્રવાસ!", "સાઇબેરિયન ક્રેન્સ દરેક શિયાળામાં ભારતમાં કેવલાદેવ રાષ્ટ્રીય ઉદ્યાન જેવી જગ્યાઓની મુલાકાત લે છે"], funFact: "બાર-ટેઇલ્ડ ગોડવિટે સૌથી લાંબી નોન-સ્ટોપ ઉડાનનો રેકોર્ડ બનાવ્યો છે - અલાસ્કાથી ન્યૂઝીલેન્ડ સુધી 11,000 km ખાયા, પીધા અથવા આરામ કર્યા વગર!", relatedConcept: "પરિક્રમાના કારણે દિવસની લંબાઈ અને તાપમાનમાં પરિવર્તન" },
                schoolCalendar: { title: "શાળા કેલેન્ડર", category: "દૈનિક જીવન", description: "તમારું શાળા વર્ષ, રજાઓ, અને પરીક્ષા કાર્યક્રમો બધા સૂર્યની આસપાસ પૃથ્વીની પરિક્રમાથી બનેલી ઋતુઓની આસપાસ ડિઝાઇન કરવામાં આવ્યા છે.", details: ["સૌથી ગરમ મહિનાઓ દરમિયાન ઉનાળાની રજા (ભારતમાં મે-જૂન)", "સૌથી ઠંડી અવધિ દરમિયાન શિયાળાની રજા (ડિસેમ્બર-જાન્યુઆરી)", "આત્યંતિક હવામાન સ્થિતિઓથી બચવા માટે શૈક્ષણિક વર્ષની યોજના", "સુખદ હવામાન માટે રમત દિવસો અને વાર્ષિક કાર્યો શેડ્યૂલ કરવામાં આવ્યા"], funFact: "ઓસ્ટ્રેલિયામાં, ઉનાળાની રજા ડિસેમ્બર-જાન્યુઆરીમાં હોય છે, અને શાળા ફેબ્રુઆરીમાં શરૂ થાય છે - ભારતથી સંપૂર્ણ વિપરીત કારણ કે તેઓ દક્ષિણી ગોળાર્ધમાં છે!", relatedConcept: "ઉત્તરી અને દક્ષિણી ગોળાર્ધમાં વિપરીત ઋતુઓ" },
                festivals: { title: "તહેવારો અને ઉજવણીઓ", category: "સંસ્કૃતિ", description: "દુનિયાભરના ઘણા તહેવારો સંક્રાંતિ, વિષુવ અને પૃથ્વીની પરિક્રમાના કારણે થતા મોસમી પરિવર્તનો સાથે જોડાયેલા છે.", details: ["મકર સંક્રાંતિ (14 જાન્યુઆરી): શિયાળાની સંક્રાંતિ પછી સૂર્યની ઉત્તર તરફની મુસાફરીનો ઉત્સવ", "હોળી (માર્ચ): વસંતના આગમનનો ઉત્સવ", "ક્રિસમસ (25 ડિસેમ્બર): ઉત્તરી ગોળાર્ધમાં શિયાળાની સંક્રાંતિની નજીક આવે છે", "પોંગલ/બિહુ: શરદની પુષ્કળતાનો ઉત્સવ મનાવતા પાક તહેવારો"], funFact: "ઇંગ્લેન્ડમાં સ્ટોનહેન્જ 5,000 વર્ષ પહેલાં ખાસ કરીને ઉનાળો અને શિયાળાની સંક્રાંતિને ચિહ્નિત કરવા માટે બનાવવામાં આવ્યું હતું! પ્રાચીન લોકો પૃથ્વીની પરિક્રમાને સમજતા હતા.", relatedConcept: "મોસમી સંક્રમણને ચિહ્નિત કરતી સંક્રાંતિ અને વિષુવ" },
                weather: { title: "હવામાન અને આબોહવા પેટર્ન", category: "વિજ્ઞાન", description: "પૃથ્વીની પરિક્રમા નિર્ધારિત કરે છે કે મોસમ ક્યારે આવે છે, ક્યારે બરફ પડે છે, અને વર્ષભર સમગ્ર તાપમાન પેટર્ન.", details: ["ભારતીય મોસમ જૂનમાં આવે છે જ્યારે ઉત્તરી ગોળાર્ધ સૂર્ય તરફ ઝુકે છે", "ધ્રુવીય પ્રદેશો ઉનાળામાં 24-કલાકના દિવસનો અનુભવ કરે છે (મધ્યરાત્રિ સૂર્ય)", "મહાસાગરીય પ્રવાહો અને પવન પેટર્ન પૃથ્વીની કક્ષીય સ્થિતિ સાથે બદલાય છે", "તુફાન/ચક્રવાતનો મોસમ પૂર્વાનુમાનિત વાર્ષિક પેટર્નનો અનુસરણ કરે છે"], funFact: "ઉત્તર ધ્રુવ પર, સૂર્ય લગભગ 6 મહિના (એપ્રિલથી સપ્ટેમ્બર) માટે અસ્ત નથી થતો અને અન્ય 6 મહિના માટે ઉદય નથી થતો! આને ધ્રુવીય દિવસ અને ધ્રુવીય રાત કહેવામાં આવે છે.", relatedConcept: "વર્ષભર વિવિધ સૂર્ય કોણોનું કારણ બનતું અક્ષીય ઝુકાવ" },
                sports: { title: "રમત મોસમ", category: "રમતો", description: "પૃથ્વીની પરિક્રમાના પરિણામે મોસમી સ્થિતિઓના આધારે વિવિધ મોસમમાં વિવિધ રમતો રમાય છે.", details: ["ક્રિકેટ: મુખ્યત્વે ઉનાળામાં રમાય છે જ્યારે પિચો સૂકી હોય છે અને દિવસો લાંબા હોય છે", "ફુટબોલ/સોકર: મોસમ શરદ, શિયાળો અને વસંત દરમિયાન ચાલે છે", "સ્કીિંગ અને બરફની રમતો: ફક્ત શિયાળાના મહિનાઓ દરમિયાન શક્ય", "તરાકી અને પાણીની રમતો: ઉનાળામાં ચરમ લોકપ્રિયતા"], funFact: "કતારમાં ફિફા વિશ્વ કપ 2022 સામાન્ય જૂન-જુલાઈના બદલે નવેમ્બર-ડિસેમ્બરમાં આયોજિત કરવામાં આવ્યો હતો કારણ કે કતારનું ઉનાળાનું તાપમાન 45°C થી વધી જાય છે!", relatedConcept: "બહારની પ્રવૃત્તિઓને અસર કરતા મોસમી તાપમાન ભિન્નતાઓ" },
                clothing: { title: "કપડાં અને ફેશન", category: "દૈનિક જીવન", description: "તમે જે કપડાં પહેરો છો તે સંપૂર્ણપણે મોસમના આધારે બદલાય છે, જે પૃથ્વીની કક્ષામાં તેની સ્થિતિ દ્વારા નિર્ધારિત થાય છે.", details: ["શિયાળો: ભારે ઊની, સ્વેટર, જેકેટ અને થર્મલ વિયર", "ઉનાળો: હળવા સૂતી કપડાં, શોર્ટ્સ અને શ્વાસ લઈ શકાય તેવા કાપડ", "મોસમ: રેઇનકોટ, છત્રીઓ અને વોટરપ્રૂફ જૂતા", "ફેશન ઉદ્યોગ દરેક મોસમ માટે 6 મહિના અગાઉ સંગ્રહ ડિઝાઇન કરે છે"], funFact: "જ્યારે પેરિસ અને મિલાન ફેબ્રુઆરીમાં તેમના 'ઉનાળો ફેશન વીક'ની યજમાની કરે છે, ત્યારે તેઓ ખરેખર તે ઉનાળા માટે કપડાં દર્શાવી રહ્યા હોય છે જે હજુ પણ 6 મહિના દૂર છે!", relatedConcept: "વિવિધ કપડાંની જરૂરિયાતવાળા મોસમી તાપમાન પરિવર્તનો" },
                energy: { title: "ઊર્જા અને વીજળી", category: "ટેકનોલોજી", description: "પૃથ્વીની પરિક્રમાના કારણે વીજળીનો વપરાશ અને સૌર ઊર્જા ઉત્પાદન મોસમો સાથે નાટકીય રીતે બદલાય છે.", details: ["ઉનાળો: એસી વપરાશમાં વધારો, પરંતુ લાંબા દિવસોનો અર્થ વધુ સૌર ઊર્જા", "શિયાળો: વધુ હીટિંગ જરૂરી, ટૂંકા દિવસો સૌર ઉત્પાદન ઘટાડે છે", "સૌર પેનલો શિયાળાની તુલનામાં ઉનાળામાં 50% વધુ ઊર્જા ઉત્પાદન કરે છે", "વીજળી ગ્રિડને મોસમી માંગ પરિવર્તનો માટે ક્ષમતા સમાયોજિત કરવી જોઈએ"], funFact: "નોર્વે જેવા આર્કટિક સર્કલની નજીકના દેશો ઉનાળા દરમિયાન 24 કલાક પ્રતિ દિવસ સૌર ઊર્જા ઉત્પન્ન કરી શકે છે, પરંતુ શિયાળાના મહિનાઓ દરમિયાન લગભગ શૂન્ય સૌર ઊર્જા મેળવે છે!", relatedConcept: "સૌર ઊર્જા અને તાપમાનને અસર કરતી દિવસની લંબાઈમાં ભિન્નતા" },
                hibernation: { title: "પશુ શિયાળાની ઊંઘ", category: "પ્રકૃતિ", description: "ઘણા પશુઓ પૃથ્વીની પરિક્રમાથી મોસમી પરિવર્તનોના આધારે શિયાળાની ઊંઘમાં જાય છે અથવા તેમના વર્તનને નાટકીય રીતે બદલે છે.", details: ["રીંછ શિયાળા દરમિયાન ઊર્જા બચાવવા માટે 7 મહિના સુધી સૂએ છે", "સ્ક્વિરલ્સ અને ચિપમંક્સ શરદમાં શિયાળાના મહિનાઓ માટે ખોરાક સંગ્રહિત કરે છે", "કેટલાક દેડકા ખરેખર શિયાળામાં જમી શકે છે અને વસંતમાં પીગળી શકે છે!", "ઠંડા હવામાનમાં જંતુઓ નિષ્ક્રિય થઈ જાય છે અથવા મરી જાય છે"], funFact: "આર્કટિક ગ્રાઉન્ડ સ્ક્વિરલનું શરીરનું તાપમાન શિયાળાની ઊંઘ દરમિયાન -3°C સુધી ઘટી જાય છે - કોઈપણ સસ્તનનું સૌથી ઠંડું શરીરનું તાપમાન! તેનું હૃદય માત્ર એક મિનિટમાં એક વખત ધબકે છે.", relatedConcept: "મોસમી ખોરાકની ઉણપ અને તાપમાન પરિવર્તનો" },
                astronomy: { title: "ખગોળશાસ્ત્ર અને તારા જોવા", category: "વિજ્ઞાન", description: "પૃથ્વી સૂર્યની આસપાસ ફરે છે, વિવિધ મોસમમાં વિવિધ તારા સમૂહો અને ખગોળીય વસ્તુઓ દેખાય છે.", details: ["ઉનાળાનું આકાશ: સ્કોર્પિયસ અને ધનુ તારા સમૂહો પ્રભુત્વ ધરાવે છે", "શિયાળાનું આકાશ: ઓરિયન ધ હન્ટર સૌથી પ્રમુખ તારા સમૂહ છે", "પૃથ્વીની બદલતી સ્થિતિ આપણને આકાશગંગાના વિવિધ દૃશ્યો આપે છે", "ઉલ્કા વર્ષાએ દર વર્ષે તે જ સમયે થાય છે જ્યારે પૃથ્વી કચરાના માર્ગોને પાર કરે છે"], funFact: "ઓગસ્ટમાં પ્રખ્યાત પર્સિડ ઉલ્કા વર્ષા એટલા માટે થાય છે કારણ કે પૃથ્વી દર વર્ષે તેની કક્ષામાં બિલકુલ તે જ બિંદુ પર કોમેટ સ્વિફ્ટ-ટટલ દ્વારા છોડવામાં આવેલા કચરામાંથી પસાર થાય છે!", relatedConcept: "અવકાશના આપણા દૃશ્યને બદલતી પૃથ્વીની કક્ષીય સ્થિતિ" },
                calendar: { title: "કેલેન્ડર સિસ્ટમો", category: "ઇતિહાસ", description: "માનવ સભ્યતાઓએ કૃષિ અને ધાર્મિક કાર્યક્રમો માટે પૃથ્વીની પરિક્રમાને ટ્રેક કરવા માટે ખાસ કરીને કેલેન્ડરની શોધ કરી.", details: ["365 દિવસ + લીપ વર્ષો પૃથ્વીની કક્ષાને સચોટ રીતે ટ્રેક કરવા માટે ગણવામાં આવ્યા હતા", "પ્રાચીન ઇજિપ્તીયનોએ લગભગ 3000 BCE ની આસપાસ પ્રથમ 365-દિવસી કેલેન્ડર બનાવ્યો", "માયાનોએ અવિશ્વસનીય સચોટતા સાથે સંક્રાંતિ અને વિષુવને ટ્રેક કર્યા", "આપણા મહિનાઓ મૂળભૂત રીતે સૌર વર્ષની અંદર ચંદ્ર ચક્રોનો અનુસરણ કરવાનો પ્રયાસ કરતા હતા"], funFact: "આજે આપણે જે ગ્રેગોરિયન કેલેન્ડરનો ઉપયોગ કરીએ છીએ તે 1582 માં પોપ ગ્રેગરી XIII દ્વારા 10-દિવસી ભૂલને ઠીક કરવા માટે રજૂ કરવામાં આવ્યો હતો જે જમા થઈ હતી કારણ કે પૃથ્વીનું વર્ષ ખરેખર 365.2422 દિવસ છે, બિલકુલ 365.25 નથી!", relatedConcept: "લીપ વર્ષોની જરૂરિયાત બનાવતી 365.25 દિવસી પરિક્રમા અવધિ" },
                tourism: { title: "પ્રવાસન અને મુસાફરી", category: "અર્થતંત્ર", description: "સંપૂર્ણ પ્રવાસન ઉદ્યોગ પૃથ્વીની પરિક્રમાના કારણે થતી મોસમોની આસપાસ યોજના બનાવે છે, જેમાં અબજો ડોલર જોખમમાં હોય છે.", details: ["સ્કી રિસોર્ટ્સ: ફક્ત શિયાળાના બરફના મોસમ દરમિયાન નફાકારક", "બીચ ગંતવ્યો: ઉનાળાના મહિનાઓ દરમિયાન ચરમ પ્રવાસન", "જાપાનમાં ચેરી બ્લોસમ જોવાનું વસંતમાં લાખો લોકોને આકર્ષે છે", "શરદ પાનખર પ્રવાસન ('લીફ પીપિંગ') ન્યૂ ઇંગ્લેન્ડ, યુએસએમાં ખૂબ મોટું છે"], funFact: "કેટલાક ધનિક પ્રવાસીઓ 'અનંત ઉનાળો' નો અભ્યાસ કરે છે - હંમેશા ઉનાળાના હવામાનનો અનુભવ કરવા માટે સતત ઉત્તરી અને દક્ષિણી ગોળાર્ધ વચ્ચે મુસાફરી કરવી!", relatedConcept: "વિવિધ ગોળાર્ધમાં વિપરીત મોસમો" },
                food: { title: "ખોરાકની ઉપલબ્ધતા", category: "દૈનિક જીવન", description: "બજારોમાં ઉપલબ્ધ ફળો અને શાકભાજી મોસમો સાથે બદલાય છે, સીધા પૃથ્વીની પરિક્રમા સાથે જોડાયેલા છે.", details: ["ઉનાળો: કેરી, તરબૂચ અને લીચી પ્રચુર માત્રામાં હોય છે", "શિયાળો: સંતરા, જાંબુ અને મોસમી શાકભાજી પનપે છે", "મોસમ: ભિંડી અને દુધી જેવી વિશિષ્ટ પાક સારી રીતે વધે છે", "વૈશ્વિક શિપિંગ હવે ઓફ-મોસમ ઉત્પાદન પ્રદાન કરે છે, પરંતુ ઉચ્ચ ખર્ચે"], funFact: "રેફ્રિજરેશન અને વૈશ્વિક શિપિંગ પહેલાં, લોકો ફક્ત તે ફળો અને શાકભાજી ખાઈ શકતા હતા જે તેમના વર્તમાન મોસમમાં ઉગતા હતા. ડિસેમ્બરમાં ભારતમાં કેરી અશક્ય હોત!", relatedConcept: "તાપમાન અને દિવસના પ્રકાશના આધારે મોસમી વધતી પરિસ્થિતિઓ" },
                health: { title: "માનવ સ્વાસ્થ્ય", category: "વિજ્ઞાન", description: "આપણું સ્વાસ્થ્ય અને સુખાકારી પૃથ્વીની પરિક્રમાના કારણે થતા મોસમી પરિવર્તનોથી નોંધપાત્ર રીતે પ્રભાવિત થાય છે.", details: ["શિયાળો: ઠંડા હવામાનના કારણે લોકોને ઘરની અંદર રાખવાથી ફ્લુનો મોસમ ચરમ પર હોય છે", "ઉનાળો: ગરમી સંબંધિત બીમારીઓ વધે છે; વધુ હાઇડ્રેશનની જરૂરિયાત", "મોસમી ભાવનાત્મક વિકાર (SAD): ઘટેલા શિયાળાના દિવસના પ્રકાશ સાથે જોડાયેલા હતાશા", "ઓછા સૂર્યના સંપર્કના કારણે શિયાળામાં વિટામિન D નું સ્તર ઘટે છે"], funFact: "ફિનલેન્ડ જેવા ખૂબ લાંબી શિયાળાની રાતોવાળા દેશોમાં, લોકો મોસમી ભાવનાત્મક વિકારને રોકવા માટે સૂર્યપ્રકાશની નકલ કરતા વિશેષ પ્રકાશ ચિકિત્સા લેમ્પનો ઉપયોગ કરે છે!", relatedConcept: "વર્ષભર દિવસની લંબાઈ અને સૂર્યના સંપર્કમાં ભિન્નતા" },
                plants: { title: "વનસ્પતિ જીવન ચક્ર", category: "પ્રકૃતિ", description: "વૃક્ષો અને છોડ મોસમી પરિવર્તનોના આધારે વૃદ્ધિ, ફૂલો અને નિષ્ક્રિયતાના વાર્ષિક ચક્રનો અનુસરણ કરે છે.", details: ["વસંત: દિવસો લાંબા થાય છે અને તાપમાન વધે છે ત્યારે નવા પાંદડાં ઉભરે છે", "ઉનાળો: પ્રકાશસંશ્લેષણ માટે પ્રચુર સૂર્યપ્રકાશ સાથે મહત્તમ વૃદ્ધિ", "શરદ: પાંદડાં રંગ બદલે છે અને પડે છે કારણ કે વૃક્ષો શિયાળા માટે તૈયાર થાય છે", "શિયાળો: પર્ણપાતી વૃક્ષો ઠંડાથી બચવા માટે નિષ્ક્રિય થઈ જાય છે"], funFact: "પાંદડાં શરદમાં રંગ બદલે છે કારણ કે વૃક્ષો લીલા ક્લોરોફિલનું ઉત્પાદન બંધ કરે છે, પીળા અને નારંગી રંગદ્રવ્યોને પ્રકટ કરે છે જે ત્યાં હતા! લાલ રંગો ખરેખર નવા ઉત્પાદિત થાય છે.", relatedConcept: "વનસ્પતિ પ્રતિભાવોને ટ્રિગર કરતા પ્રકાશ અને તાપમાન પરિવર્તનો" },
                ocean: { title: "મહાસાગર જુવાર અને પ્રવાહો", category: "વિજ્ઞાન", description: "જ્યારે જુવાર મુખ્યત્વે ચંદ્રના કારણે થાય છે, મહાસાગર પ્રવાહોમાં મોસમી પરિવર્તનો પૃથ્વીની પરિક્રમાથી પ્રભાવિત થાય છે.", details: ["ભારતીય મહાસાગરમાં મોસમ પ્રવાહો મોસમી રીતે દિશા ઉલટાવે છે", "માછલી પ્રવાસ પેટર્ન મોસમી તાપમાન પરિવર્તનોનો અનુસરણ કરે છે", "એલ નીનો અને લા નીના ઘટનાઓ મોસમી પેટર્ન સાથે જોડાયેલી છે", "શિપિંગ માર્ગો મોસમી હવામાન અને પ્રવાહ પરિવર્તનો માટે સમાયોજિત થાય છે"], funFact: "ભારતીય મહાસાગર એકમાત્ર મહાસાગર છે જ્યાં પ્રવાહો વર્ષમાં બે વખત સંપૂર્ણપણે દિશા ઉલટાવે છે - ઉનાળામાં ઉત્તર-પૂર્વ તરફ અને શિયાળામાં દક્ષિણ-પશ્ચિમ તરફ મોસમ પવનોના કારણે વહે છે!", relatedConcept: "મહાસાગર વર્તનને અસર કરતા મોસમી તાપમાન તફાવતો" }
            },
            categories: {
                all: "બધા",
                agriculture: "કૃષિ",
                nature: "પ્રકૃતિ",
                dailyLife: "દૈનિક જીવન",
                culture: "સંસ્કૃતિ",
                science: "વિજ્ઞાન",
                sports: "રમતો",
                technology: "ટેકનોલોજી",
                economy: "અર્થતંત્ર",
                history: "ઇતિહાસ"
            },
            // Current Real World Scenarios (6 scenarios)
            scenarios: {
                scenario1: {
                    title: "આંતરરાષ્ટ્રીય ક્રિકેટ મેચની યોજના",
                    context: "ભારત ઓસ્ટ્રેલિયા સામે ક્રિકેટ મેચ રમી રહ્યું છે. સિડનીમાં મેચ સ્થાનિક સમયે સવારે 10:00 વાગ્યે શરૂ થાય છે.",
                    question: "જો સિડની ભારત (IST) કરતાં 4.5 કલાક આગળ છે, તો ભારતીય પ્રશંસકોએ લાઇવ મેચ જોવા માટે કયા સમયે જાગવું જોઈએ?",
                    realWorldConnection: "સમય ક્ષેત્રો અસ્તિત્વમાં છે કારણ કે પૃથ્વી પશ્ચિમથી પૂર્વ તરફ ફરે છે. પૂર્વમાં સ્થિત દેશો પશ્ચિમની તુલનામાં પહેલા સૂર્યોદયનો અનુભવ કરે છે.",
                    solution: "ભારતીય પ્રશંસકોએ લાઇવ મેચ જોવા માટે સવારે 5:30 IST વાગ્યે જાગવું જોઈએ.",
                    explanation: "સિડની ભારતથી 4.5 કલાક આગળ હોવાથી:\n• જ્યારે સિડનીમાં સવારે 10:00 વાગ્યે હોય\n• ભારતમાં તે સવારે 10:00 વાગ્યે - 4.5 કલાક = 5:30 વાગ્યે હોય\n\nઆ સમય તફાવત અસ્તિત્વમાં છે કારણ કે પૃથ્વી પશ્ચિમથી પૂર્વ તરફ ફરે છે. સિડની, જે પૂર્વમાં વધુ દૂર છે, પહેલા સૂર્યોદયનો અનુભવ કરે છે અને સમયમાં આગળ છે.",
                    tips: [
                        "ભારતના પૂર્વમાં સ્થિત દેશોનો સમય પછી હોય છે",
                        "ભારતના પશ્ચિમમાં સ્થિત દેશોનો સમય પહેલા હોય છે",
                        "સમય ક્ષેત્રો પૃથ્વીના પરિભ્રમણથી બનાવવામાં આવે છે"
                    ]
                },
                scenario2: {
                    title: "કૃષકનો વાવણીનો મોસમ",
                    context: "રવિ પંજાબનો કૃષક છે. તે જાણે છે કે ઘઉં સૌથી સારી રીતે ત્યારે ઉગે છે જ્યારે મોસમની વરસાદ પછી, ટૂંકા દિવસો સાથે ઠંડા મહિનાઓ દરમિયાન વાવવામાં આવે છે.",
                    question: "શું રવિએ જૂન (ઉનાળો) અથવા નવેમ્બર (મોસમ પછી) માં ઘઉં વાવવું જોઈએ? ઋતુઓના તમારા જ્ઞાનનો ઉપયોગ કરીને સમજાવો.",
                    realWorldConnection: "ઋતુઓ પૃથ્વીના ઝુકેલા અક્ષના કારણે થાય છે. વિવિધ પાક તાપમાન અને દિવસના પ્રકાશના કલાકોના આધારે વિવિધ ઋતુઓમાં વધુ સારી રીતે ઉગે છે.",
                    solution: "રવિએ નવેમ્બર (મોસમ પછી) માં ઘઉં વાવવું જોઈએ.",
                    explanation: "ઘઉં નવેમ્બરમાં વાવવું જોઈએ કારણ કે:\n\n1. **તાપમાન**: નવેમ્બર ઉત્તરી ભારતમાં શિયાળાની શરૂઆતનું પ્રતીક છે. ઘઉં એક રબી પાક છે જે ઠંડા તાપમાન (15-20°C) માં સૌથી સારી રીતે ઉગે છે.\n\n2. **દિવસની લંબાઈ**: નવેમ્બરમાં, દિવસો ટૂંકા થઈ રહ્યા છે (12 કલાકથી ઓછા). ઘઉંને શ્રેષ્ઠ વૃદ્ધિ માટે આ ટૂંકી દિવસની લંબાઈની જરૂર છે.\n\n3. **ઋતુ ચક્ર**: પૃથ્વીના ઝુકેલા અક્ષના કારણે:\n   • જૂન (ઉનાળો સંક્રાંતિ) માં, ઉત્તરી ગોળાર્ધ લાંબા, ગરમ દિવસોનો અનુભવ કરે છે\n   • નવેમ્બરમાં, તાપમાન ઠંડું થાય છે અને દિવસો ટૂંકા થાય છે\n   • આ ઠંડકનો સમય ઘઉંના અંકુરણ માટે આદર્શ છે\n\n4. **મોસમ લાભો**: માટી મોસમની વરસાદથી ભેજ જાળવી રાખે છે, જે વાવણી માટે સારી પરિસ્થિતિ પ્રદાન કરે છે.",
                    tips: [
                        "ઉનાળો (જૂન): ગરમ, લાંબા દિવસો - ઘઉં માટે યોગ્ય નથી",
                        "શિયાળો (નવેમ્બર): ઠંડા, ટૂંકા દિવસો - ઘઉં માટે પરફેક્ટ",
                        "ઋતુઓ પાક વૃદ્ધિ પેટર્નને અસર કરે છે"
                    ]
                },
                scenario3: {
                    title: "સૌર પેનલ સ્થાપના",
                    context: "દિલ્હીમાં એક પરિવાર તેમની છત પર સૌર પેનલ સ્થાપિત કરવા માંગે છે. તેઓ જાણવા માંગે છે કે પેનલ કઈ દિશામાં રાખવી જોઈએ અને શું પેનલ ઉનાળા અને શિયાળામાં સમાન ઊર્જા ઉત્પન્ન કરશે.",
                    question: "તેઓએ પેનલ કઈ દિશામાં સ્થાપિત કરવી જોઈએ, અને શું ઉનાળા વિરુદ્ધ શિયાળામાં ઊર્જા ઉત્પાદન અલગ હશે?",
                    realWorldConnection: "સૂર્યનો સ્પષ્ટ માર્ગ પૃથ્વીના ઝુકાવના કારણે ઋતુઓ સાથે બદલાય છે. આ આખા વર્ષ દરમિયાન સૌર ઊર્જા સંભવિતતાને અસર કરે છે.",
                    solution: "પેનલ દક્ષિણ તરફ હોવી જોઈએ. ઉનાળામાં શિયાળા કરતાં વધુ ઊર્જા ઉત્પન્ન થશે.",
                    explanation: "**દિશા**: સૌર પેનલ ઉત્તરી ગોળાર્ધ (જેમ કે દિલ્હી) માં **દક્ષિણ** તરફ હોવી જોઈએ.\n\n**શા માટે દક્ષિણ?**\n• જેમ પૃથ્વી પશ્ચિમથી પૂર્વ તરફ ફરે છે, સૂર્ય પૂર્વથી પશ્ચિમ તરફ ફરતો દેખાય છે\n• ઉત્તરી ગોળાર્ધમાં, સૂર્યનો માર્ગ આકાશના દક્ષિણ ભાગમાંથી પસાર થાય છે\n• દક્ષિણ તરફની પેનલ પૂરા દિવસ દરમિયાન મહત્તમ સૂર્યપ્રકાશ પ્રાપ્ત કરે છે\n\n**મોસમી ભિન્નતા**:\n\n**ઉનાળો (જૂન)**:\n• ઉત્તરી ગોળાર્ધ સૂર્ય તરફ ઝુકે છે\n• સૂર્ય આકાશમાં ઊંચો હોય છે\n• લાંબા દિવસો (14-15 કલાક દિવસનો પ્રકાશ)\n• વધુ તીવ્ર સૂર્યપ્રકાશ\n• **વધુ ઊર્જા ઉત્પાદન**\n\n**શિયાળો (ડિસેમ્બર)**:\n• ઉત્તરી ગોળાર્ધ સૂર્યથી દૂર ઝુકે છે\n• સૂર્ય આકાશમાં નીચો હોય છે\n• ટૂંકા દિવસો (10-11 કલાક દિવસનો પ્રકાશ)\n• ઓછો તીવ્ર સૂર્યપ્રકાશ\n• **ઓછું ઊર્જા ઉત્પાદન**\n\nપૃથ્વીના અક્ષીય ઝુકાવ અને સૂર્યની આસપાસ પરિક્રમાના કારણે શિયાળા કરતાં ઉનાળામાં 40-60% ઓછી ઊર્જાનો તફાવત હોઈ શકે છે.",
                    tips: [
                        "ઉત્તર પેનલને સૂર્યના માર્ગથી દૂર કરે છે",
                        "દિલ્હીમાં ઉનાળામાં શિયાળા કરતાં ~4 કલાક વધુ સૂર્યપ્રકાશ હોય છે",
                        "પૃથ્વીનો ઝુકાવ આ મોસમી ભિન્નતાનું કારણ છે"
                    ]
                },
                scenario4: {
                    title: "સૌર ગ્રહણ યાત્રાની યોજના",
                    context: "20 એપ્રિલે ભારતમાં એક સાંકડા માર્ગથી એક કુલ સૌર ગ્રહણ દેખાશે. તમારો પરિવાર તેને જોવા માટે મુંબઈથી મુસાફરી કરવા માંગે છે. કુલતાનો માર્ગ વારાણસીથી પસાર થાય છે.",
                    question: "તમારી ઉડાન સવારે 11:00 વાગ્યે વારાણસીમાં ઉતરે છે, અને ગ્રહણની કુલતા સવારે 11:45 વાગ્યેથી 11:48 વાગ્યે સુધી (3 મિનિટ) રહે છે. શું આ પૂરતો સમય છે? તમારે કઈ સાવધાનીઓ લેવી જોઈએ?",
                    realWorldConnection: "સૌર ગ્રહણ ત્યારે થાય છે જ્યારે ચંદ્ર પૃથ્વી અને સૂર્ય વચ્ચેથી પસાર થાય છે. છાયા પૃથ્વીના પરિભ્રમણ અને ચંદ્રની ગતિ બંનેના કારણે પૃથ્વી પર ફરે છે.",
                    solution: "હા, પૂરતો સમય છે, પરંતુ તે ટાઇટ છે. યોગ્ય યોજના અને સલામતી સાધનો આવશ્યક છે.",
                    explanation: "**સમય વિશ્લેષણ**:\n• ઉડાન ઉતરે છે: સવારે 11:00 વાગ્યે\n• કુલતા શરૂ થાય છે: સવારે 11:45 વાગ્યે\n• ઉપલબ્ધ સમય: 45 મિનિટ\n• આ સૈદ્ધાંતિક રીતે પૂરતો સમય છે, પરંતુ ધ્યાનમાં લો:\n  - એરપોર્ટ બહાર નીકળવાનો સમય: 15-20 મિનિટ\n  - જોવાના સ્થાને મુસાફરી: 20-30 મિનિટ\n  - આ માત્ર 5-10 મિનિટનો બફર છોડે છે - જોખમી!\n\n**ભલામણ**: આ દુર્લભ ઘટના ચૂકી ન જાય તે માટે રાત પહેલાં પહોંચો.\n\n**કુલતા આટલી ટૂંકી કેમ છે (3 મિનિટ)**:\n1. **ચંદ્રની છાયાની ગતિ**: ચંદ્રની છાયા પૃથ્વી પર ~2,000 km/h ની ગતિથી ફરે છે કારણ કે:\n   - પૃથ્વીનું પરિભ્રમણ (વિષુવરેખા પર 1,670 km/h)\n   - પૃથ્વીની આસપાસ ચંદ્રની કક્ષીય ગતિ\n\n2. **સાંકડો માર્ગ**: પૃથ્વી પર ચંદ્રની છાયા માત્ર ~100-200 km પહોળી છે\n\n3. **સંબંધિત ગતિ**: છાયા સપાટી પર ઝડપથી ફરે છે\n\n**આવશ્યક સલામતી સાવધાનીઓ**:\n\n**કુલતા પહેલાં (આંશિક તબક્કો)**:\n✗ ક્યારેય સીધા સૂર્યને ન જુઓ\n✗ નિયમિત ધૂપછાંયદાર ચશ્મા સલામત નથી\n✓ પ્રમાણિત સૌર ગ્રહણ ચશ્મા (ISO 12312-2) નો ઉપયોગ કરો\n✓ પિનહોલ પ્રક્ષેપણ પદ્ધતિનો ઉપયોગ કરો\n\n**કુલતા દરમિયાન (2-3 મિનિટ)**:\n✓ સીધા જોવું સલામત છે (સૂર્ય સંપૂર્ણપણે ઢંકાયેલો છે)\n✓ કોરોના જોવા માટે ગ્રહણ ચશ્મા દૂર કરો\n✓ અદ્ભુત દૃશ્ય - આકાશ અંધકારમય થાય છે, તારા દેખાય છે\n\n**કુલતા પછી**:\n✗ તરત જ ગ્રહણ ચશ્મા પાછા પહેરો\n✗ સૂર્ય ફરીથી જોખમી છે\n\n**આટલું જોખમી કેમ?**\nસૂર્યનો માત્ર 1% દેખાતો હોવાથી પણ તમારી આંખોને સ્થાયી નુકસાન થઈ શકે છે. સૂર્ય એટલો તીવ્ર છે કે ગ્રહણ દરમિયાન પણ અંધત્વ થઈ શકે છે.",
                    tips: [
                        "એક દિવસ પહેલાં પહોંચવાની યોજના બનાવો",
                        "ગ્રહણ ચશ્મા ફરજિયાત છે",
                        "ક્યારેય સુરક્ષા વગર આંશિક તબક્કાઓને ન જુઓ",
                        "કુલતા એ સીધા જોવાનો એકમાત્ર સલામત સમય છે",
                        "ચંદ્રની છાયા પૃથ્વી પર ~2,000 km/h ની ગતિથી ફરે છે"
                    ]
                },
                scenario5: {
                    title: "તારા જોવાની સાહસિક યોજના",
                    context: "તમે ઓરિયન તારા સમૂહ જોવા માંગો છો, જે ઉત્તરી શિયાળાના આકાશમાં પ્રમુખ છે. તમે બેંગલોરથી તારા જોવાની યાત્રાની યોજના બનાવી રહ્યા છો.",
                    question: "કયા મહિનાઓમાં (માર્ચ, જૂન, સપ્ટેમ્બર, અથવા ડિસેમ્બર) ઓરિયન સાંજના આકાશમાં સૌથી સારી રીતે દેખાશે? આ કેમ બદલાય છે?",
                    realWorldConnection: "વિવિધ તારા સમૂહો વિવિધ મહિનાઓમાં દેખાય છે કારણ કે પૃથ્વી સૂર્યની આસપાસ ફરે છે, જે અવકાશના આપણા રાત્રિકાળીન દૃશ્યમાં પરિવર્તન કરે છે.",
                    solution: "ઓરિયન ડિસેમ્બર અને જાન્યુઆરીની સાંજમાં સૌથી સારી રીતે દેખાય છે.",
                    explanation: "**સૌથી સારું જોવું**: ઓરિયન **ડિસેમ્બર અને જાન્યુઆરી** ની સાંજના આકાશમાં સૌથી પ્રમુખ રીતે દેખાય છે.\n\n**વર્ષભર દેખાવમાં કેમ બદલાવ થાય છે**:\n\nજેમ પૃથ્વી સૂર્યની આસપાસ ફરે છે (365 દિવસ), આપણું રાત્રિકાળીન દૃશ્ય અવકાશના વિવિધ ભાગો તરફ નિર્દેશ કરે છે:\n\n**ડિસેમ્બર-જાન્યુઆરી** (સૌથી સારું):\n• પૃથ્વીનો રાત્રિકાળીન પક્ષ ઓરિયનની દિશા તરફ હોય છે\n• ઓરિયન સૂર્યાસ્તની આસપાસ પૂર્વમાં ઉદય થાય છે\n• આખી રાત દેખાય છે\n• મધ્યરાત્રિની આસપાસ આકાશમાં સૌથી ઊંચો\n• પરફેક્ટ જોવાની પરિસ્થિતિ\n\n**માર્ચ**:\n• ઓરિયન સાંજે દેખાય છે પરંતુ પહેલા અસ્ત થઈ રહ્યો હોય છે\n• શરૂઆતી સાંજમાં સૌથી સારું જોવું\n• મોડી રાત સુધી, તે ક્ષિતિજ પર ખૂબ નીચો હોય છે\n\n**જૂન** (સૌથી ખરાબ):\n• પૃથ્વી સૂર્યની વિપરીત બાજુએ ફરી ચુકી હોય છે\n• ઓરિયન દિવસના આકાશમાં હોય છે\n• રાત્રે સંપૂર્ણપણે અદૃશ્ય\n• સૂર્ય ઓરિયનની જ દિશામાં હોય છે\n\n**સપ્ટેમ્બર**:\n• ઓરિયન ફરીથી દેખાતું શરૂ થાય છે\n• પરોઢ પહેલાં ઉદય થાય છે\n• સાંજના તારા જોવા માટે સારું નથી\n\n**તેની પાછળનું વિજ્ઞાન**:\n\n1. **પૃથ્વીની પરિક્રમા**: જેમ આપણે સૂર્યની પરિક્રમા કરીએ છીએ, આપણે 365 દિવસમાં 360° પૂર્ણ કરીએ છીએ (~1° પ્રતિ દિવસ)\n\n2. **બદલતું દૃશ્ય**: દરેક મહિને, આપણું રાત્રિકાળીન દૃશ્ય લગભગ 30° બદલાય છે\n\n3. **તારા સમૂહ ચક્ર**: દરેક તારા સમૂહનો ~6 મહિનાનો \"દેખાવનો મોસમ\" હોય છે\n   - ચરમોચ્ચથી 3 મહિના પહેલાં: પરોઢ પહેલાં ઉદય\n   - ચરમોચ્ચ મહિના: આખી રાત દેખાય છે\n   - ચરમોચ્ચના 3 મહિના પછી: સૂર્યાસ્ત પછી અસ્ત\n   - વિપરીત 6 મહિના: દિવસના આકાશમાં\n\n**બેંગલોર માટે વ્યવહારિક સૂચનો**:\n• સૌથી સારા મહિના: નવેમ્બર - ફેબ્રુઆરી\n• શરૂઆતી સાંજમાં પૂર્વ તરફ જુઓ\n• ઓરિયન રાત 9-10 વાગ્યે સુધી દક્ષિણી આકાશમાં ઊંચો હશે\n• એક પંક્તિમાં ત્રણ તારાઓ દ્વારા સરળતાથી ઓળખી શકાય છે (ઓરિયનનો બેલ્ટ)\n• અંધકારમય આકાશ માટે ચંદ્રના અસ્ત પછી સૌથી સારું",
                    tips: [
                        "ઓરિયન ઉત્તરી ગોળાર્ધમાં એક શિયાળાનો તારા સમૂહ છે",
                        "દરેક તારા સમૂહ ~3-4 મહિના માટે સૌથી સારી રીતે દેખાય છે",
                        "ચોક્કસ ઉદય સમય શોધવા માટે તારા જોવાના એપનો ઉપયોગ કરો",
                        "ચંદ્રના તબક્કાઓ દેખાવને અસર કરે છે - નવો ચંદ્ર સૌથી સારું છે"
                    ]
                },
                scenario6: {
                    title: "રજાના ગંતવ્યની પસંદગી",
                    context: "તમારો પરિવાર દિલ્હીમાં ઠંડા હવામાનથી બચવા અને ગરમ, ધૂપછાંયદાર સમુદ્ર કિનારાનો આનંદ લેવા માટે ડિસેમ્બરમાં શિયાળાની રજા લેવા માંગે છે.",
                    question: "શું તમારે ઓસ્ટ્રેલિયા અથવા શ્રીલંકા જવું જોઈએ? વિવિધ ગોળાર્ધમાં ઋતુઓના તમારા જ્ઞાનનો ઉપયોગ કરીને સમજાવો.",
                    realWorldConnection: "પૃથ્વીના ઝુકાવના કારણે ઉત્તરી અને દક્ષિણી ગોળાર્ધમાં ઋતુઓ વિપરીત હોય છે કારણ કે તે સૂર્યની આસપાસ ફરે છે.",
                    solution: "ઓસ્ટ્રેલિયા જાઓ! ત્યાં ડિસેમ્બરમાં ઉનાળો હશે.",
                    explanation: "**સૌથી સારો વિકલ્પ**: **ઓસ્ટ્રેલિયા** ડિસેમ્બરમાં ગરમ સમુદ્ર કિનારાની રજા માટે પરફેક્ટ હશે!\n\n**તર્ક**:\n\n**ઓસ્ટ્રેલિયા (દક્ષિણી ગોળાર્ધ)**:\n• ડિસેમ્બર = **ઉનાળો** ☀️\n• તાપમાન: 25-35°C (ગરમ અને ધૂપછાંયદાર)\n• પરફેક્ટ સમુદ્ર કિનારાનું હવામાન\n• લાંબા દિવસો, ટૂંકી રાતો\n• શા માટે? ડિસેમ્બરમાં દક્ષિણી ગોળાર્ધ સૂર્ય તરફ ઝુકે છે\n\n**શ્રીલંકા (વિષુવરેખાની નજીક)**:\n• ડિસેમ્બર = સુખદ હવામાન (26-30°C)\n• જો કે, પૂર્વી કિનારે મોસમનો મોસમ છે\n• પશ્ચિમી કિનારો ડિસેમ્બરમાં વધુ સારો છે\n• કારણ કે તે વિષુવરેખાની નજીક છે, તાપમાનમાં એટલો નાટકીય તફાવત નથી\n\n**વિજ્ઞાન - ઋતુઓ વિપરીત કેમ છે**:\n\n**ડિસેમ્બરમાં**:\n• પૃથ્વીનો ઉત્તર ધ્રુવ સૂર્યથી દૂર ઝુકે છે → ઉત્તરી ગોળાર્ધમાં શિયાળો\n• પૃથ્વીનો દક્ષિણ ધ્રુવ સૂર્ય તરફ ઝુકે છે → દક્ષિણી ગોળાર્ધમાં ઉનાળો\n\n**જૂનમાં** (વિપરીત સ્થિતિ):\n• પૃથ્વીનો ઉત્તર ધ્રુવ સૂર્ય તરફ ઝુકે છે → ઉત્તરી ગોળાર્ધમાં ઉનાળો  \n• પૃથ્વીનો દક્ષિણ ધ્રુવ સૂર્યથી દૂર ઝુકે છે → દક્ષિણી ગોળાર્ધમાં શિયાળો\n\n**ઝુકાવને સમજવું**:\n1. પૃથ્વીનો અક્ષ 23.5° ઝુકેલો છે\n2. આ ઝુકાવ પૃથ્વીના સૂર્યની આસપાસ ફરવા દરમિયાન સ્થિર રહે છે\n3. 6 મહિના માટે, ઉત્તરી ગોળાર્ધ સૂર્ય તરફ ઝુકે છે (માર્ચ-સપ્ટેમ્બર)\n4. 6 મહિના માટે, દક્ષિણી ગોળાર્ધ સૂર્ય તરફ ઝુકે છે (સપ્ટેમ્બર-માર્ચ)\n\n**વ્યવહારિક ઉપયોગ**:\n• ઉત્તરી શિયાળાથી બચી રહ્યા છો? → દક્ષિણ જાઓ (ઓસ્ટ્રેલિયા, ન્યૂઝીલેન્ડ, અર્જેન્ટીના)\n• ઉત્તરી ઉનાળાની ગરમીથી બચી રહ્યા છો? → ઠંડા હવામાન માટે દક્ષિણ જાઓ\n• વર્ષભર સતત હવામાન ઇચ્છો છો? → વિષુવરેખાની નજીક જાઓ (શ્રીલંકા, સિંગાપુર)",
                    tips: [
                        "ડિસેમ્બર = ઓસ્ટ્રેલિયામાં ઉનાળો, ભારતમાં શિયાળો",
                        "વિષુવરેખાની નજીકના દેશોમાં ઓછી મોસમી ભિન્નતા હોય છે",
                        "આ પૃથ્વીના 23.5° ઝુકાવના કારણે થાય છે",
                        "વિષુવરેખા પાર ઋતુઓ ઉલટાઈ જાય છે"
                    ]
                }
            }
        },
        eclipseLearnContent: {
            title: "ગ્રહણ",
            subtitle: "અધ્યાય 12.3 — પૃથ્વી, ચંદ્ર અને સૂર્ય",
            solarEclipse: "સૂર્ય ગ્રહણ",
            lunarEclipse: "ચંદ્ર ગ્રહણ",
            solarEclipseDesc: "સૂર્ય ગ્રહણ ત્યારે થાય છે જ્યારે ચંદ્ર સૂર્ય અને પૃથ્વી વચ્ચે આવે છે, જે સૂર્યપ્રકાશને આપણી પાસે પહોંચતા અટકાવે છે. આ ખગોળીય સંરેખણ પ્રકૃતિની સૌથી શાનદાર ઘટનાઓમાંથી એક બનાવે છે, જે દિવસને એક વિચિત્ર ગોધૂલિમાં ફેરવે છે.",
            apparentSizeTitle: "સ્પષ્ટ કદનું વિજ્ઞાન",
            apparentSizeDesc: "જોકે ચંદ્ર સૂર્ય કરતાં ખૂબ નાનો છે, પરંતુ સ્પષ્ટ કદના કારણે તે સૂર્યને સંપૂર્ણપણે અવરોધિત કરી શકે છે. ચંદ્ર સૂર્ય કરતાં લગભગ 400 ગણો નાનો છે, પરંતુ તે પૃથ્વીથી લગભગ 400 ગણો નજીક પણ છે. આ નોંધપાત્ર બ્રહ્માંડીય સંયોગ બંને ખગોળીય પદાર્થોને આપણા આકાશમાં લગભગ સમાન કદનો દેખાડે છે!",
            totalSolarEclipse: "કુલ સૂર્ય ગ્રહણ",
            totalSolarEclipseDesc: "ચંદ્ર સૂર્યને સંપૂર્ણપણે અવરોધિત કરે છે. ચંદ્રની છાયા (અંબરા) માં રહેલા નિરીક્ષકો થોડી મિનિટો માટે સંપૂર્ણ અંધકારનો અનુભવ કરે છે. સૂર્યનું સુંદર કોરોના અંધકારી ચંદ્રની આસપાસ ચમકતા હેલો તરીકે દેખાય છે.",
            partialSolarEclipse: "આંશિક સૂર્ય ગ્રહણ",
            partialSolarEclipseDesc: "ચંદ્ર સૂર્યને માત્ર આંશિક રીતે અવરોધિત કરે છે. પેનમ્બ્રામાં રહેલા નિરીક્ષકો સૂર્યનો એક ભાગ હજુ પણ દેખાય છે, જાણે કે સૂર્યના ડિસ્કમાંથી કોઈએ કટાવ્યું હોય.",
            safetyWarning: "⚠️ સુરક્ષા ચેતવણી",
            safetyWarningText: "ક્યારેય સીધા સૂર્ય ગ્રહણને જોશો નહીં! ગ્રહણ દરમિયાન પણ, સૂર્ય એટલો તીવ્ર છે કે તે તમારી આંખોને કાયમી નુકસાન પહોંચાડી શકે છે અને અંધત્વનું કારણ બની શકે છે. નિયમિત સનગ્લાસ, દૂરબીન અથવા ટેલિસ્કોપ દ્વારા જોશો નહીં. હંમેશા વિશિષ્ટ ISO-પ્રમાણિત સૂર્ય ગ્રહણ ચશ્મા વાપરો અથવા તારામંડળ અને ખગોળશાસ્ત્ર ક્લબોમાં આયોજિત જોવાની ઘટનાઓમાં ભાગ લો.",
            lunarEclipseDesc: "ચંદ્ર ગ્રહણ ત્યારે થાય છે જ્યારે પૃથ્વી સૂર્ય અને ચંદ્ર વચ્ચે આવે છે, જે સૂર્યપ્રકાશને ચંદ્રની સપાટી સુધી પહોંચતા અટકાવે છે. પૃથ્વીની છાયા ચંદ્ર પર પડે છે, જે પૃથ્વીના રાત્રિ પક્ષ પર દરેક માટે એક નાટકીય ખગોળીય પ્રદર્શન બનાવે છે.",
            bloodMoonTitle: "બ્લડ મૂન ઘટના",
            bloodMoonDesc: "કુલ ચંદ્ર ગ્રહણ દરમિયાન, ચંદ્ર સંપૂર્ણપણે અંધકારમાં જતો નથી. તેના બદલે, તે એક આકર્ષક ઘેરા લાલ રંગમાં રૂપાંતરિત થાય છે, જે તેને નાટકીય નામ \"બ્લડ મૂન\" મળે છે. આ એટલા માટે થાય છે કારણ કે પૃથ્વીનું વાતાવરણ આપણા ગ્રહની આસપાસ કેટલાક સૂર્યપ્રકાશને વળાંક આપે છે, વાદળી તરંગલંબાઈને ફિલ્ટર કરે છે અને માત્ર લાલ પ્રકાશને ચંદ્ર સુધી પહોંચવા અને તેને પ્રકાશિત કરવાની મંજૂરી આપે છે.",
            totalLunarEclipse: "કુલ ચંદ્ર ગ્રહણ",
            totalLunarEclipseDesc: "ચંદ્ર સંપૂર્ણપણે પૃથ્વીના અંબરા (સંપૂર્ણ છાયા) ની અંદર છે. સંપૂર્ણ ચંદ્ર એક લાલ-તાંબાના રંગમાં લે છે, જે પ્રખ્યાત \"બ્લડ મૂન\" અસર બનાવે છે જે એક કલાકથી વધુ સમય સુધી રહી શકે છે.",
            partialLunarEclipse: "આંશિક ચંદ્ર ગ્રહણ",
            partialLunarEclipseDesc: "ચંદ્રનો માત્ર એક ભાગ પૃથ્વીના અંબરામાંથી પસાર થાય છે. તમે છાયાંકિત (અંધકારી/લાલ) ભાગ અને તેજસ્વી રીતે પ્રકાશિત ચંદ્રના ભાગ બંનેને એક સાથે જોઈ શકો છો.",
            safeToView: "✅ જોવા માટે સુરક્ષિત",
            safeToViewText: "સૂર્ય ગ્રહણથી વિપરીત, ચંદ્ર ગ્રહણ નગ્ન આંખોથી જોવા માટે સંપૂર્ણપણે સુરક્ષિત છે! તમે કોઈપણ વિશિષ્ટ રક્ષણાત્મક સાધન વગર સંપૂર્ણ ઘટનાનું નિરીક્ષણ કરી શકો છો. ચંદ્ર ગ્રહણ સૂર્ય ગ્રહણની તુલનામાં પૃથ્વીના ખૂબ મોટા વિસ્તારથી જોઈ શકાય છે, જે તેમને જોવા માટે વધુ સુલભ બનાવે છે.",
            historicalTitle: "ઐતિહાસિક અને સાંસ્કૃતિક મહત્વ",
            historicalText1: "લોકોએ પ્રાચીન સમયથી ગ્રહણોનું અવલોકન અને રેકોર્ડ કર્યું છે. જ્યારે ગ્રહણોના કારણો અજ્ઞાત હતા, ત્યારે તેઓ ઘણીવાર ડરાતા હતા. ઘણી પ્રાચીન સભ્યતાઓએ આ ઘટનાઓ સાથે અંધશ્રદ્ધા જોડી હતી. જોકે, પ્રાચીન ભારતીય ખગોળશાસ્ત્રીઓએ સદીઓ પહેલાં ગ્રહણોની સચોટ આગાહી કરવા માટે વ્યવહારુ ગાણિતિક પદ્ધતિઓ વિકસાવી હતી.",
            historicalText2: "કોડાઇકાનલ સોલર ઓબ્ઝર્વેટરી, જે 1899 માં દક્ષિણ ભારતની સુંદર પલાની પહાડીઓમાં સ્થાપિત કરવામાં આવી હતી, 125 વર્ષથી વધુ સમયથી સૂર્યનો અભ્યાસ કરી રહી છે. તે બેંગલુરુના ભારતીય ઇન્સ્ટિટ્યુટ ઓફ એસ્ટ્રોફિઝિક્સ (IIA) દ્વારા સંચાલિત છે અને સૂર્ય ઘટનાઓની અમારી સમજમાં મૂલ્યવાન ડેટાનો યોગદાન આપવાનું ચાલુ રાખે છે.",
            keyFactsTitle: "યાદ રાખવા માટે મુખ્ય તથ્યો",
            sunDiameter: "સૂર્યનો વ્યાસ",
            earthDiameter: "પૃથ્વીનો વ્યાસ",
            moonDiameter: "ચંદ્રનો વ્યાસ",
            sunEarthDistance: "સૂર્ય-પૃથ્વી અંતર",
            moonEarthDistance: "ચંદ્ર-પૃથ્વી અંતર",
            eclipseDuration: "કુલ ગ્રહણ અવધિ",
            footerText: "NCERT ક્યુરિયોસિટી વિજ્ઞાન પાઠ્યપુસ્તક — ગ્રેડ 7 પર આધારિત",
            footerQuote: "તમારી જિજ્ઞાસા એ ચિંગારી છે જે અન્વેષણની જ્યોતને પ્રગટાવે છે"
        },
        eclipsePracticeContent: {
            title: "અભ્યાસ મોડ",
            subtitle: "ગ્રહણ — તમારા જ્ઞાનની કસોટી કરો",
            questionOf: "પ્રશ્ન",
            of: "ના",
            score: "સ્કોર",
            nextQuestion: "આગળનો પ્રશ્ન →",
            seeResults: "પરિણામો જુઓ",
            correct: "✓ સાચું!",
            incorrect: "✗ ખોટું",
            quizCompleted: "ક્વિઝ પૂર્ણ!",
            yourScore: "તમારો સ્કોર",
            excellent: "ઉત્કૃષ્ટ! તમે ગ્રહણોમાં નિપુણતા મેળવી છે!",
            goodJob: "સારું કામ! શીખતા રહો!",
            keepPracticing: "સુધારા માટે અભ્યાસ ચાલુ રાખો!",
            tryAgain: "ફરી પ્રયાસ કરો",
            footerText: "NCERT ક્યુરિયોસિટી વિજ્ઞાન — ગ્રેડ 7 — અધ્યાય 12.3",
            questions: {
                q1: {
                    question: "સૂર્ય ગ્રહણનું કારણ શું છે?",
                    options: [
                        "પૃથ્વી સૂર્ય અને ચંદ્ર વચ્ચે આવે છે",
                        "ચંદ્ર સૂર્ય અને પૃથ્વી વચ્ચે આવે છે",
                        "સૂર્ય પૃથ્વી અને ચંદ્ર વચ્ચે આવે છે",
                        "તારાઓ સૂર્યપ્રકાશને અવરોધિત કરે છે"
                    ],
                    explanation: "સૂર્ય ગ્રહણ ત્યારે થાય છે જ્યારે ચંદ્ર સૂર્ય અને પૃથ્વી વચ્ચે આવે છે, જે સૂર્યપ્રકાશને આપણી પાસે પહોંચતા અટકાવે છે."
                },
                q2: {
                    question: "ચંદ્ર ખૂબ નાનો હોવા છતાં સૂર્યને કેમ અવરોધિત કરી શકે છે?",
                    options: [
                        "ચંદ્ર વાસ્તવમાં સૂર્ય કરતાં મોટો છે",
                        "ગ્રહણ દરમિયાન સૂર્ય સંકોચાય છે",
                        "ચંદ્ર ખૂબ નજીક છે, જે તેમના સ્પષ્ટ કદને સમાન બનાવે છે",
                        "પૃથ્વીનું વાતાવરણ ચંદ્રને વિસ્તૃત કરે છે"
                    ],
                    explanation: "સ્પષ્ટ કદ વાસ્તવિક કદ અને અંતર બંને પર આધારિત છે. ચંદ્ર સૂર્ય કરતાં લગભગ 400 ગણો નાનો છે પરંતુ પૃથ્વીથી લગભગ 400 ગણો નજીક પણ છે."
                },
                q3: {
                    question: "સાચું અથવા ખોટું: ચંદ્ર ગ્રહણ નગ્ન આંખોથી જોવા માટે સુરક્ષિત છે.",
                    options: ["સાચું", "ખોટું"],
                    explanation: "સૂર્ય ગ્રહણથી વિપરીત, ચંદ્ર ગ્રહણ કોઈપણ વિશિષ્ટ સાધન વગર નગ્ન આંખોથી જોવા માટે સંપૂર્ણપણે સુરક્ષિત છે."
                },
                q4: {
                    question: "કુલ ચંદ્ર ગ્રહણ દરમિયાન ચંદ્ર કયા રંગનો દેખાય છે?",
                    options: ["તેજસ્વી સફેદ", "ઘેરો લાલ", "વાદળી", "પીળો"],
                    explanation: "કુલ ચંદ્ર ગ્રહણ દરમિયાન, ચંદ્ર ઘેરો લાલ દેખાય છે (જેને 'બ્લડ મૂન' કહેવામાં આવે છે) કારણ કે પૃથ્વીનું વાતાવરણ વાદળી પ્રકાશને ફિલ્ટર કરે છે અને લાલ પ્રકાશને ચંદ્ર તરફ વળાંક આપે છે."
                },
                q5: {
                    question: "સાચું અથવા ખોટું: તમારે સૂર્ય ગ્રહણ જોવા માટે નિયમિત સનગ્લાસ વાપરવા જોઈએ.",
                    options: ["સાચું", "ખોટું"],
                    explanation: "નિયમિત સનગ્લાસ સૂર્ય ગ્રહણ જોવા માટે સુરક્ષિત નથી. તમારે વિશિષ્ટ ISO-પ્રમાણિત સૂર્ય ગ્રહણ ચશ્મા અથવા પરોક્ષ જોવાની પદ્ધતિઓની જરૂર છે."
                },
                q6: {
                    question: "ગ્રહણ દરમિયાન છાયાનો સૌથી અંધકારી ભાગ કહેવામાં આવે છે:",
                    options: ["પેનમ્બ્રા", "કોરોના", "અંબરા", "વાતાવરણ"],
                    explanation: "અંબરા એ છાયાનો સૌથી અંધકારી, કેન્દ્રીય ભાગ છે જ્યાં બધો પ્રત્યક્ષ પ્રકાશ અવરોધિત થાય છે. પેનમ્બ્રા એ હળવી બાહ્ય છાયા છે."
                },
                q7: {
                    question: "કયું ભારતીય વેધશાળા 125 વર્ષથી વધુ સમયથી સૂર્યનો અભ્યાસ કરી રહી છે?",
                    options: [
                        "માઉન્ટ આબુ વેધશાળા",
                        "કોડાઇકાનલ સોલર ઓબ્ઝર્વેટરી",
                        "ઊટી રેડિયો ટેલિસ્કોપ",
                        "વૈનુ બપ્પુ વેધશાળા"
                    ],
                    explanation: "કોડાઇકાનલ સોલર ઓબ્ઝર્વેટરી, જે 1899 માં પલાની પહાડીઓમાં સ્થાપિત કરવામાં આવી હતી, 125 વર્ષથી વધુ સમયથી સૂર્યનો અભ્યાસ કરી રહી છે."
                },
                q8: {
                    question: "સાચું અથવા ખોટું: કુલ સૂર્ય ગ્રહણ પૃથ્વી પર ક્યાંથી પણ જોઈ શકાય છે જ્યારે તે થાય છે.",
                    options: ["સાચું", "ખોટું"],
                    explanation: "કુલ સૂર્ય ગ્રહણ માત્ર પૃથ્વી પરના સાંકડા માર્ગથી દેખાય છે જ્યાં ચંદ્રનો અંબરા પડે છે. મોટાભાગના વિસ્તારો આંશિક ગ્રહણ અથવા બિલકુલ કંઈ જોતા નથી."
                },
                q9: {
                    question: "સૂર્ય ગ્રહણ દરમિયાન, અવરોધિત સૂર્યની આસપાસ દેખાતી ચમકતી હેલો કહેવામાં આવે છે:",
                    options: ["અંબરા", "પેનમ્બ્રા", "કોરોના", "ફોટોસ્ફિયર"],
                    explanation: "કોરોના એ સૂર્યનું બાહ્ય વાતાવરણ છે, જે કુલ સૂર્ય ગ્રહણ દરમિયાન એક સુંદર ચમકતી હેલો તરીકે દેખાય છે."
                },
                q10: {
                    question: "ચંદ્ર ગ્રહણ સૂર્ય ગ્રહણ કરતાં લાંબા સમય સુધી કેમ રહે છે?",
                    options: [
                        "ચંદ્ર ધીમે ધીમે ફરે છે",
                        "પૃથ્વીની છાયા ચંદ્રની છાયા કરતાં ખૂબ મોટી છે",
                        "સૂર્ય દૂર છે",
                        "ચંદ્ર પૃથ્વી કરતાં મોટો છે"
                    ],
                    explanation: "પૃથ્વીની છાયા ચંદ્રની છાયા કરતાં ખૂબ મોટી છે, તેથી ચંદ્રને તેમાંથી પસાર થવામાં વધુ સમય લાગે છે, જે ચંદ્ર ગ્રહણને લાંબા સમય સુધી રાખે છે."
                }
            }
        },
        eclipseRealWorldContent: {
            title: "વાસ્તવિક વિશ્વ",
            subtitle: "ગ્રહણ — આગામી ઘટનાઓ અને તથ્યો",
            upcomingEvents: "📅 આગામી ગ્રહણ ઘટનાઓ",
            markCalendars: "આ ખગોળીય ઘટનાઓ માટે તમારા કેલેન્ડરમાં નિશાન લગાવો",
            total: "કુલ",
            partial: "આંશિક",
            eclipsesAndIndia: "🇮🇳 ગ્રહણ અને ભારત",
            footerText: "NCERT ક્યુરિયોસિટી વિજ્ઞાન — ગ્રેડ 7 — અધ્યાય 12.3",
            events: {
                event1: {
                    date: "14 માર્ચ, 2025",
                    type: "કુલ ચંદ્ર ગ્રહણ",
                    visibility: "અમેરિકા, પશ્ચિમી યુરોપ, પશ્ચિમી આફ્રિકા",
                    description: "એક કુલ ચંદ્ર ગ્રહણ જ્યાં ચંદ્ર પૃથ્વીના અંબરામાંથી પસાર થશે, લગભગ 65 મિનિટ માટે દેખાતું એક શાનદાર બ્લડ મૂન બનાવશે."
                },
                event2: {
                    date: "29 માર્ચ, 2025",
                    type: "આંશિક સૂર્ય ગ્રહણ",
                    visibility: "ઉત્તર-પશ્ચિમ આફ્રિકા, યુરોપ, ઉત્તરી રશિયા",
                    description: "એક આંશિક સૂર્ય ગ્રહણ જ્યાં કેટલાક પ્રદેશોમાં સૂર્યનો 93% સુધી ચંદ્ર દ્વારા ઢંકાઈ જશે."
                },
                event3: {
                    date: "7 સપ્ટેમ્બર, 2025",
                    type: "કુલ ચંદ્ર ગ્રહણ",
                    visibility: "યુરોપ, આફ્રિકા, એશિયા, ઓસ્ટ્રેલિયા",
                    description: "બીજું કુલ ચંદ્ર ગ્રહણ જે બહુવિધ ખંડોમાં ઉત્કૃષ્ટ જોવાની તકો પ્રદાન કરે છે."
                },
                event4: {
                    date: "21 સપ્ટેમ્બર, 2025",
                    type: "આંશિક સૂર્ય ગ્રહણ",
                    visibility: "દક્ષિણ પેસિફિક, ન્યૂઝીલેન્ડ, એન્ટાર્કટિકા",
                    description: "એક આંશિક સૂર્ય ગ્રહણ જે મુખ્યત્વે દક્ષિણી ગોળાર્ધથી દેખાય છે."
                },
                event5: {
                    date: "12 ઑગસ્ટ, 2026",
                    type: "કુલ સૂર્ય ગ્રહણ",
                    visibility: "આર્કટિક, ગ્રીનલેન્ડ, આઇસલેન્ડ, સ્પેન",
                    description: "આર્કટિક પ્રદેશ અને યુરોપના કેટલાક ભાગોને પાર કરતો એક શાનદાર કુલ સૂર્ય ગ્રહણ."
                }
            },
            indiaFacts: {
                fact1: {
                    title: "કોડાઇકાનલ સોલર ઓબ્ઝર્વેટરી",
                    content: "1899 માં સ્થાપિત, તમિલનાડુની પલાની પહાડીઓમાં આ વેધશાળા 125 વર્ષથી વધુ સમયથી સૂર્યનો અભ્યાસ કરી રહી છે, જે તેને હજુ પણ સંચાલનમાં સૌથી જૂની સોલર વેધશાળાઓમાંથી એક બનાવે છે.",
                    icon: "🔭"
                },
                fact2: {
                    title: "વૈનુ બપ્પુ વેધશાળા",
                    content: "તમિલનાડુના કવલૂરમાં સ્થિત, આ વેધશાળા એશિયાના સૌથી મોટા ટેલિસ્કોપમાંથી એક ધરાવે છે અને આધુનિક ભારતીય ખગોળશાસ્ત્રના પિતા એમ.કે. વૈનુ બપ્પુના નામ પર છે.",
                    icon: "🌟"
                },
                fact3: {
                    title: "સૂર્ય સિદ્ધાંત",
                    content: "આ પ્રાચીન ભારતીય ખગોળીય લખાણમાં ગ્રહણ સમયની ગણતરી માટે વિગતવાર પદ્ધતિઓ છે. તે દર્શાવે છે કે ભારતીય ખગોળશાસ્ત્રીઓએ સદીઓ પહેલાં ગ્રહણ યાંત્રિકી સમજી હતી.",
                    icon: "📜"
                },
                fact4: {
                    title: "કુલ સૂર્ય ગ્રહણ 2031",
                    content: "14 નવેમ્બર, 2031 ના રોજ, એક કુલ સૂર્ય ગ્રહણનો માર્ગ દક્ષિણ ભારતના ભાગો સહિત કેરળ, તમિલનાડુ અને આંધ્ર પ્રદેશમાંથી પસાર થશે - એક દુર્લભ તક!",
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
        case "hi":
            return '"Noto Sans Devanagari", "Noto Sans", sans-serif';
        case "gu":
            return '"Noto Sans Gujarati", "Noto Sans", sans-serif';
        case "en":
        default:
            return 'Poppins, "Noto Sans", sans-serif';
    }
};

// ============================================================================
// Language Selector Component
// ============================================================================
const LanguageSelector: React.FC = () => {
    const { language, setLanguage } = useLanguage();

    const languages: { code: Language; name: string; flag: string }[] = [
        { code: "en", name: "English", flag: "🇬🇧" },
        { code: "hi", name: "हिंदी", flag: "🇮🇳" },
        { code: "gu", name: "ગુજરાતી", flag: "🇮🇳" },
    ];

    return (
        <div className="relative">
            <select
                aria-label="Select language"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="appearance-none bg-white border-2 border-teal-500 rounded-lg px-1.5 sm:px-2 md:px-3 lg:px-4 py-1.5 sm:py-2 pr-5 sm:pr-6 md:pr-8 w-28 xs:w-32 sm:w-36 md:w-44 lg:w-48 xl:w-56 text-[10px] xs:text-xs sm:text-sm md:text-base text-teal-700 font-medium cursor-pointer hover:border-purple-500 active:border-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300 touch-manipulation min-h-[36px] sm:min-h-[40px]"
            >
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 sm:px-1.5 md:px-2">
                <svg
                    className="fill-current h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-teal-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
            </div>
        </div>
    );
};

// ============================================================================
// Navbar Component
// ============================================================================
interface NavbarProps {
    mode: "learn" | "practice" | "applications";
    setMode: (mode: "learn" | "practice" | "applications") => void;
}

const Navbar: React.FC<NavbarProps> = ({ mode, setMode }) => {
    const { translations } = useLanguage();
    const safeTranslations = translations || translationsData["en"];

    const isLearn = mode === "learn";
    const isPractice = mode === "practice";
    const isApplications = mode === "applications";

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-teal-50 via-purple-50 to-teal-50 border-b border-teal-200/50 shadow-sm backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14 sm:h-16 md:h-18">
                    <div className="flex-shrink-0 flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
                        <Globe
                            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-teal-600 flex-shrink-0"
                            aria-hidden="true"
                        />
                        <span className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-teal-700 break-words overflow-wrap-anywhere">
                            {safeTranslations?.nav?.logo || 'Eclipses of the Earth'}
                        </span>
                    </div>

                    <div className="flex items-center space-x-0.5 sm:space-x-1 md:space-x-2 flex-shrink-0">
                        <button
                            type="button"
                            onClick={() => setMode("learn")}
                            className={`px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 lg:px-5 rounded-lg text-xs sm:text-sm md:text-base font-medium transition-all duration-200 touch-manipulation min-h-[36px] sm:min-h-[40px] ${isLearn
                                ? "bg-gradient-to-r from-teal-500 to-purple-500 text-white shadow-md"
                                : "text-teal-700 hover:bg-teal-100/50 active:bg-teal-200/50"
                                }`}
                        >
                            {safeTranslations?.nav?.tabs?.learn || 'Learn'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setMode("practice")}
                            className={`px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 lg:px-5 rounded-lg text-xs sm:text-sm md:text-base font-medium transition-all duration-200 touch-manipulation min-h-[36px] sm:min-h-[40px] ${isPractice
                                ? "bg-gradient-to-r from-teal-500 to-purple-500 text-white shadow-md"
                                : "text-purple-700 hover:bg-purple-100/50 active:bg-purple-200/50"
                                }`}
                        >
                            {safeTranslations?.nav?.tabs?.practice || 'Practice'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setMode("applications")}
                            className={`px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 lg:px-5 rounded-lg text-xs sm:text-sm md:text-base font-medium transition-all duration-200 touch-manipulation min-h-[36px] sm:min-h-[40px] ${isApplications
                                ? "bg-gradient-to-r from-teal-500 to-purple-500 text-white shadow-md"
                                : "text-gray-700 hover:bg-gray-100/50 active:bg-gray-200/50"
                                }`}
                        >
                            {safeTranslations?.nav?.tabs?.applications || 'Real World'}
                        </button>

                        <div className="ml-0.5 sm:ml-1 md:ml-2 lg:ml-4">
                            <LanguageSelector />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
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
        
        .main-card {
          background: linear-gradient(145deg, rgba(25, 25, 50, 0.85), rgba(15, 15, 35, 0.95));
          border: 1px solid rgba(255, 180, 100, 0.15);
          border-radius: 20px;
          padding: 32px;
          backdrop-filter: blur(15px);
          animation: fadeInUp 0.7s ease-out;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        }
        
        .eclipse-btn {
          padding: 18px 36px;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: center;
          position: relative;
          overflow: hidden;
          font-family: inherit;
          font-weight: 600;
          font-size: 15px;
          letter-spacing: 0.5px;
          min-width: 180px;
        }
        
        .eclipse-btn::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          transform: translate(-50%, -50%);
          transition: width 0.6s ease, height 0.6s ease;
        }
        
        .eclipse-btn:hover::after {
          width: 300px;
          height: 300px;
        }
        
        .solar-btn {
          background: linear-gradient(135deg, #ff9500, #ffcc00);
          border: 2px solid #ffcc00;
          color: #1a1a1a;
        }
        
        .solar-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(255, 180, 50, 0.4);
        }
        
        .solar-btn.active {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .lunar-btn {
          background: linear-gradient(135deg, #4a4a70, #6a6a90);
          border: 2px solid #7a7aa0;
          color: #ffffff;
        }
        
        .lunar-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(100, 100, 150, 0.4);
        }
        
        .lunar-btn.active {
          background: linear-gradient(135deg, #8b4040, #a05050);
          border-color: #b06060;
          box-shadow: 0 0 30px rgba(160, 80, 80, 0.5);
        }
        
        .info-box {
          background: rgba(30, 30, 60, 0.5);
          border-left: 4px solid #ffb860;
          padding: 18px 22px;
          border-radius: 0 12px 12px 0;
          margin: 20px 0;
          transition: all 0.3s ease;
        }
        
        .info-box:hover {
          background: rgba(35, 35, 70, 0.6);
          transform: translateX(5px);
        }
        
        .type-card {
          background: rgba(35, 35, 70, 0.4);
          padding: 22px;
          border-radius: 14px;
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }
        
        .type-card:hover {
          background: rgba(45, 45, 85, 0.5);
          border-color: rgba(255, 180, 100, 0.2);
          transform: translateY(-3px);
        }
        
        .warning-box {
          background: linear-gradient(135deg, rgba(220, 60, 60, 0.15), rgba(180, 40, 40, 0.1));
          border: 1px solid rgba(220, 80, 80, 0.4);
          border-radius: 14px;
          padding: 20px 24px;
          margin-top: 24px;
          transition: all 0.3s ease;
        }
        
        .warning-box:hover {
          border-color: rgba(220, 80, 80, 0.6);
        }
        
        .safe-box {
          background: linear-gradient(135deg, rgba(60, 160, 80, 0.15), rgba(40, 140, 60, 0.1));
          border: 1px solid rgba(80, 180, 100, 0.4);
          border-radius: 14px;
          padding: 20px 24px;
          margin-top: 24px;
          transition: all 0.3s ease;
        }
        
        .safe-box:hover {
          border-color: rgba(80, 180, 100, 0.6);
        }
        
        .canvas-container {
          background: linear-gradient(145deg, #080815, #0c0c1a);
          border-radius: 16px;
          overflow: hidden;
          border: 2px solid rgba(255, 180, 100, 0.2);
          box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.5);
          margin-bottom: 24px;
        }
        
        .section-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 180, 100, 0.3), transparent);
          margin: 32px 0;
        }
      `}</style>

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '36px' }}>
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
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          justifyContent: 'center', 
          marginBottom: '36px',
          flexWrap: 'wrap'
        }}>
          <button 
            className={`eclipse-btn solar-btn ${activeEclipse === 'solar' ? 'active' : ''}`}
            onClick={() => setActiveEclipse('solar')}
          >
            <div style={{ fontSize: '28px', marginBottom: '6px', position: 'relative', zIndex: 1 }}>☀️</div>
            <div style={{ position: 'relative', zIndex: 1 }}>{t.solarEclipse || "Solar Eclipse"}</div>
          </button>
          <button 
            className={`eclipse-btn lunar-btn ${activeEclipse === 'lunar' ? 'active' : ''}`}
            onClick={() => setActiveEclipse('lunar')}
          >
            <div style={{ fontSize: '28px', marginBottom: '6px', position: 'relative', zIndex: 1 }}>🌙</div>
            <div style={{ position: 'relative', zIndex: 1 }}>{t.lunarEclipse || "Lunar Eclipse"}</div>
          </button>
        </div>

        {/* Main Content Card */}
        <div className="main-card">
          {/* Animated Canvas */}
          <div className="canvas-container">
            <canvas 
              ref={canvasRef} 
              width={700} 
              height={280}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          {/* Content based on eclipse type */}
          {activeEclipse === 'solar' ? (
            <div>
              <h2 style={{ 
                fontSize: '28px', 
                color: '#ffcc00',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontWeight: 600
              }}>
                <span style={{ fontSize: '32px' }}>☀️</span>
                {t.solarEclipse || "Solar Eclipse"}
              </h2>
              
              <p style={{ fontSize: '16px', lineHeight: 1.85, marginBottom: '20px', color: '#d0d0e0' }}>
                {t.solarEclipseDesc || "A solar eclipse occurs when the Moon comes between the Sun and Earth, blocking sunlight from reaching us. This celestial alignment creates one of nature's most spectacular phenomena, turning day into an eerie twilight."}
              </p>

              <div className="info-box">
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
                <div className="type-card">
                  <h4 style={{ color: '#ffcc00', marginBottom: '12px', fontSize: '16px' }}>{t.totalSolarEclipse || "Total Solar Eclipse"}</h4>
                  <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#b8b8c8' }}>
                    {t.totalSolarEclipseDesc || "The Moon completely blocks the Sun. Observers in the Moon's shadow (umbra) experience complete darkness for a few minutes. The Sun's beautiful corona becomes visible as a glowing halo around the dark Moon."}
                  </p>
                </div>
                <div className="type-card">
                  <h4 style={{ color: '#ffcc00', marginBottom: '12px', fontSize: '16px' }}>{t.partialSolarEclipse || "Partial Solar Eclipse"}</h4>
                  <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#b8b8c8' }}>
                    {t.partialSolarEclipseDesc || "The Moon only partially blocks the Sun. Observers in the penumbra see a portion of the Sun still visible, appearing as if a bite has been taken out of the solar disk."}
                  </p>
                </div>
              </div>

              <div className="warning-box">
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

              <div className="info-box" style={{ borderLeftColor: '#c07070' }}>
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
                <div className="type-card">
                  <h4 style={{ color: '#c07070', marginBottom: '12px', fontSize: '16px' }}>{t.totalLunarEclipse || "Total Lunar Eclipse"}</h4>
                  <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#b8b8c8' }}>
                    {t.totalLunarEclipseDesc || "The Moon is completely within Earth's umbra (full shadow). The entire Moon takes on a reddish-copper color, creating the famous \"Blood Moon\" effect that can last for over an hour."}
                  </p>
                </div>
                <div className="type-card">
                  <h4 style={{ color: '#c07070', marginBottom: '12px', fontSize: '16px' }}>{t.partialLunarEclipse || "Partial Lunar Eclipse"}</h4>
                  <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#b8b8c8' }}>
                    {t.partialLunarEclipseDesc || "Only part of the Moon passes through Earth's umbra. You can observe both the shadowed (dark/reddish) portion and the brightly illuminated portion of the Moon simultaneously."}
                  </p>
                </div>
              </div>

              <div className="safe-box">
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
          <div className="section-divider" />
          
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
          <div className="section-divider" />
          
          <div>
            <h3 style={{ 
              color: '#ffb860', 
              marginBottom: '18px',
              fontSize: '20px',
              fontWeight: 600
            }}>
              {t.keyFactsTitle || "Key Facts to Remember"}
            </h3>
            <div style={{ 
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
                <div key={index} style={{ 
                  background: 'rgba(40, 40, 75, 0.4)', 
                  padding: '14px 16px', 
                  borderRadius: '10px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'default'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>{fact.icon}</div>
                  <div style={{ fontSize: '12px', color: '#9090a0', marginBottom: '4px' }}>{fact.label}</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#e8e8f0' }}>{fact.value}</div>
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
        
        .main-card {
          background: linear-gradient(145deg, rgba(25, 25, 50, 0.85), rgba(15, 15, 35, 0.95));
          border: 1px solid rgba(255, 180, 100, 0.15);
          border-radius: 20px;
          padding: 32px;
          backdrop-filter: blur(15px);
          animation: fadeIn 0.5s ease-out;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        }
        
        .option-btn {
          width: 100%;
          padding: 16px 20px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
          font-size: 15px;
          text-align: left;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(40, 40, 80, 0.4);
          color: #d0d0e0;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .option-btn:hover:not(.disabled) {
          background: rgba(60, 60, 100, 0.6);
          border-color: rgba(255, 180, 100, 0.3);
          transform: translateX(5px);
        }
        
        .option-btn.correct {
          background: rgba(80, 200, 120, 0.2);
          border-color: #50c878;
          color: #50c878;
        }
        
        .option-btn.wrong {
          background: rgba(232, 80, 80, 0.2);
          border-color: #e85050;
          color: #e85050;
          animation: shake 0.3s ease;
        }
        
        .option-btn.disabled {
          cursor: default;
          opacity: 0.7;
        }
        
        .progress-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #ffb860, #ffcc00);
          border-radius: 4px;
          transition: width 0.5s ease;
        }
        
        .celebration {
          animation: celebrate 0.6s ease;
        }
      `}</style>

      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '32px' }}>
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
        <div className="main-card">
          {!quizCompleted ? (
            <>
              {/* Progress */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <span style={{ fontSize: '14px', color: '#9090a0' }}>
                    {t.questionOf || "Question"} {currentQuestion + 1} {t.of || "of"} {questions.length}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <h2 style={{ 
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
                  let className = 'option-btn';
                  if (selectedAnswer !== null) {
                    className += ' disabled';
                    if (index === questions[currentQuestion].correct) {
                      className += ' correct';
                    } else if (index === selectedAnswer) {
                      className += ' wrong';
                    }
                  }
                  
                  return (
                    <button
                      key={index}
                      className={className}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={selectedAnswer !== null}
                    >
                      <span style={{
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
              <div className="celebration" style={{ fontSize: '64px', marginBottom: '20px' }}>
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

const EclipsesRealWorld: React.FC = () => {
  const { translations } = useLanguage();
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [animationPhase, setAnimationPhase] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const t = translations?.eclipseRealWorldContent || {};
  const events = t.events || {};
  const facts = t.indiaFacts || {};

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

  const upcomingEclipses: EclipseEvent[] = [
    {
      date: events.event1?.date || "March 14, 2025",
      type: events.event1?.type || "Total Lunar Eclipse",
      visibility: events.event1?.visibility || "Americas, Western Europe, Western Africa",
      description: events.event1?.description || "A total lunar eclipse where the Moon will pass through Earth's umbra, creating a stunning Blood Moon visible for about 65 minutes."
    },
    {
      date: events.event2?.date || "March 29, 2025",
      type: events.event2?.type || "Partial Solar Eclipse",
      visibility: events.event2?.visibility || "Northwest Africa, Europe, Northern Russia",
      description: events.event2?.description || "A partial solar eclipse where up to 93% of the Sun will be covered by the Moon in some regions."
    },
    {
      date: events.event3?.date || "September 7, 2025",
      type: events.event3?.type || "Total Lunar Eclipse",
      visibility: events.event3?.visibility || "Europe, Africa, Asia, Australia",
      description: events.event3?.description || "Another total lunar eclipse offering excellent viewing opportunities across multiple continents."
    },
    {
      date: events.event4?.date || "September 21, 2025",
      type: events.event4?.type || "Partial Solar Eclipse",
      visibility: events.event4?.visibility || "South Pacific, New Zealand, Antarctica",
      description: events.event4?.description || "A partial solar eclipse visible primarily from the southern hemisphere."
    },
    {
      date: events.event5?.date || "August 12, 2026",
      type: events.event5?.type || "Total Solar Eclipse",
      visibility: events.event5?.visibility || "Arctic, Greenland, Iceland, Spain",
      description: events.event5?.description || "A spectacular total solar eclipse with the path of totality crossing the Arctic region and parts of Europe."
    }
  ];

  const indiaEclipseFacts = [
    {
      title: facts.fact1?.title || "Kodaikanal Solar Observatory",
      content: facts.fact1?.content || "Established in 1899, this observatory in Tamil Nadu's Palani hills has been studying the Sun for over 125 years, making it one of the oldest solar observatories still in operation.",
      icon: facts.fact1?.icon || "🔭"
    },
    {
      title: facts.fact2?.title || "Vainu Bappu Observatory",
      content: facts.fact2?.content || "Located in Kavalur, Tamil Nadu, this observatory houses one of Asia's largest telescopes and is named after M.K. Vainu Bappu, the father of modern Indian astronomy.",
      icon: facts.fact2?.icon || "🌟"
    },
    {
      title: facts.fact3?.title || "Surya Siddhanta",
      content: facts.fact3?.content || "This ancient Indian astronomical text contains detailed methods for calculating eclipse times. It demonstrates that Indian astronomers understood eclipse mechanics centuries ago.",
      icon: facts.fact3?.icon || "📜"
    },
    {
      title: facts.fact4?.title || "Total Solar Eclipse 2031",
      content: facts.fact4?.content || "On November 14, 2031, a total solar eclipse path will cross through southern India including parts of Kerala, Tamil Nadu, and Andhra Pradesh - a rare opportunity!",
      icon: facts.fact4?.icon || "🇮🇳"
    }
  ];

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
        
        .main-card {
          background: linear-gradient(145deg, rgba(25, 25, 50, 0.85), rgba(15, 15, 35, 0.95));
          border: 1px solid rgba(255, 180, 100, 0.15);
          border-radius: 20px;
          padding: 28px;
          backdrop-filter: blur(15px);
          animation: fadeIn 0.5s ease-out;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        }
        
        .event-card {
          background: rgba(35, 35, 70, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 20px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .event-card:hover {
          background: rgba(45, 45, 85, 0.5);
          border-color: rgba(255, 180, 100, 0.2);
          transform: translateY(-3px);
        }
        
        .event-card.expanded {
          border-color: rgba(255, 180, 100, 0.3);
          background: rgba(50, 50, 90, 0.5);
        }
        
        .india-card {
          background: linear-gradient(135deg, rgba(255, 153, 51, 0.1), rgba(19, 136, 8, 0.1));
          border: 1px solid rgba(255, 153, 51, 0.2);
          border-radius: 14px;
          padding: 20px;
          transition: all 0.3s ease;
        }
        
        .india-card:hover {
          border-color: rgba(255, 153, 51, 0.4);
          transform: translateY(-2px);
        }
        
        .badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .badge-solar {
          background: rgba(255, 180, 100, 0.2);
          color: #ffcc00;
          border: 1px solid rgba(255, 180, 100, 0.3);
        }
        
        .badge-lunar {
          background: rgba(160, 80, 80, 0.2);
          color: #c07070;
          border: 1px solid rgba(160, 80, 80, 0.3);
        }
      `}</style>

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header with animated canvas */}
        <header style={{ textAlign: 'center', marginBottom: '32px', position: 'relative' }}>
          <canvas 
            ref={canvasRef}
            width={140}
            height={80}
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
            {t.subtitle || "Eclipses — Upcoming Events and Facts"}
          </p>
        </header>

        {/* Main Content */}
        <div className="main-card">
          <h2 style={{ fontSize: '24px', color: '#ffcc00', marginBottom: '8px' }}>
            {t.upcomingEvents || "📅 Upcoming Eclipse Events"}
          </h2>
          <p style={{ color: '#9090a0', marginBottom: '24px' }}>
            {t.markCalendars || "Mark your calendars for these celestial events"}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {upcomingEclipses.map((eclipse, index) => (
              <div 
                key={index}
                className={`event-card ${expandedCard === index ? 'expanded' : ''}`}
                onClick={() => setExpandedCard(expandedCard === index ? null : index)}
                style={{ animation: `slideIn 0.4s ease ${index * 0.1}s both` }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '20px' }}>
                        {eclipse.type.includes('Solar') ? '☀️' : '🌙'}
                      </span>
                      <span style={{ fontSize: '18px', fontWeight: 600, color: '#e8e8f0' }}>
                        {eclipse.date}
                      </span>
                      <span className={`badge ${eclipse.type.includes('Solar') ? 'badge-solar' : 'badge-lunar'}`}>
                        {eclipse.type.includes('Total') ? (t.total || 'Total') : (t.partial || 'Partial')}
                      </span>
                    </div>
                    <div style={{ fontSize: '15px', color: '#b8b8c8' }}>
                      {eclipse.type}
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '13px', 
                    color: '#9090a0',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '6px 12px',
                    borderRadius: '8px'
                  }}>
                    📍 {eclipse.visibility}
                  </div>
                </div>
                
                {expandedCard === index && (
                  <div style={{ 
                    marginTop: '16px', 
                    paddingTop: '16px', 
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    animation: 'fadeIn 0.3s ease'
                  }}>
                    <p style={{ lineHeight: 1.7, color: '#c8c8d8' }}>
                      {eclipse.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* India specific section */}
          <div style={{ 
            marginTop: '32px', 
            paddingTop: '24px', 
            borderTop: '1px solid rgba(255, 180, 100, 0.15)' 
          }}>
            <h3 style={{ fontSize: '20px', color: '#ff9933', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>🇮🇳</span> {t.eclipsesAndIndia || "Eclipses and India"}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {indiaEclipseFacts.map((fact, index) => (
                <div key={index} className="india-card">
                  <div style={{ fontSize: '24px', marginBottom: '10px' }}>{fact.icon}</div>
                  <h4 style={{ fontSize: '15px', color: '#ff9933', marginBottom: '8px' }}>{fact.title}</h4>
                  <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#b8b8c8' }}>{fact.content}</p>
                </div>
              ))}
            </div>
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
interface EclipsesLearningProps {
    mode: "learn" | "practice" | "applications";
    setMode: (mode: "learn" | "practice" | "applications") => void;
}

const EclipsesLearning: React.FC<EclipsesLearningProps> = ({ mode, setMode }) => {
    return (
        <LanguageProvider>
            <Navbar mode={mode} setMode={setMode} />
            <div className="pt-14 sm:pt-16 md:pt-18 px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8 pb-4 sm:pb-6 md:pb-8 overflow-x-hidden break-words overflow-wrap-anywhere">
                {mode === "learn" && <EclipsesLearnMode />}
                {mode === "practice" && <EclipsesPracticeMode />}
                {mode === "applications" && <EclipsesRealWorld />}
            </div>
        </LanguageProvider>
    );
};

export { EclipsesLearnMode, EclipsesPracticeMode, EclipsesRealWorld };

export default EclipsesLearning;
