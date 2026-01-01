import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";

// Type declarations for browser extension APIs to prevent TypeScript errors
declare global {
  interface Window {
    chrome?: {
      runtime?: {
        lastError?: { message?: string };
        sendMessage?: (...args: unknown[]) => unknown;
        connect?: (...args: unknown[]) => unknown;
        sendNativeMessage?: (...args: unknown[]) => unknown;
      };
    };
    browser?: {
      runtime?: {
        sendMessage?: (...args: unknown[]) => unknown;
        connect?: (...args: unknown[]) => unknown;
      };
    };
  }
}

// Simple icon components
const ShadowIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      className={className || undefined}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circle representing object */}
      <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.8" />
      {/* Ellipse representing shadow */}
      <ellipse cx="12" cy="16" rx="5" ry="2" fill="currentColor" opacity="0.4" />
      {/* Light rays */}
      <line
        x1="12"
        y1="4"
        x2="8"
        y2="12"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
      />
      <line
        x1="12"
        y1="4"
        x2="16"
        y2="12"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
      />
    </svg>
  );
};
ShadowIcon.displayName = 'ShadowIcon';

const BookOpen = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const ClipboardCheck = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4" />
  </svg>
);

const Globe = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

type Language = "en" | "hi" | "gu";
type TabType = "learn" | "practice" | "realWorld";

interface RealWorldApp {
  id: number;
  title: string;
  description: string;
  icon: string;
  category: string;
  example: string;
  materialType?: "transparent" | "translucent" | "opaque" | "mixed";
}

// Translation type definition
type TranslationValue =
  | string
  | string[]
  | number
  | { [key: string]: TranslationValue }
  | Array<{ [key: string]: TranslationValue }>;
type Translations = Record<Language, TranslationValue>;

// Translation system - Inlined translations
const translations: Translations = {
  en: {
    nav: {
      logo: "Shadow Formation",
      tabs: {
        learn: "Learn",
        practice: "Practice",
        realWorld: "Real World",
      },
    },
    language: {
      en: "English",
      hi: "हिंदी",
      gu: "ગુજરાતી",
      selectorLabel: "Select Language",
    },
    controls: {
      step: "Step",
      of: "of",
      previous: "Previous",
      next: "Next",
      play: "Play",
      pause: "Pause",
      reset: "Reset",
    },
    shadowSimulator: {
      title: "Shadow Maker Simulator",
      subtitle: "Play with light and shadows like a scientist!",
      objects: {
        title: "Choose Your Object!",
        cat: "Cat Cut-out",
        superhero: "Superhero",
        bottle: "Water Bottle",
        glass: "Frosted Glass",
        paper: "Paper Sheet",
        football: "Football",
        tree: "Tree",
        selected: "selected! Drag it around!",
      },
      lightSize: {
        title: "Light Size",
        small: "Small Light (Sharp Shadow)",
        large: "Large Light (Soft Shadow)",
        smallFeedback: "Sharp shadow activated!",
        largeFeedback: "Soft, blurry shadow mode!",
      },
      shadowFacts: {
        title: "Shadow Facts!",
        opaque: "Opaque objects = Dark shadows",
        translucent: "Translucent objects = Faint shadows",
        transparent: "Transparent objects = Almost no shadow",
        currentObject: {
          opaque: "Opaque",
          translucent: "Translucent",
          semiTransparent: "Semi-transparent",
        },
      },
      controls: {
        showRays: "Show Light Rays",
        dragHelper: "Drag the light, object, and screen to see shadows change!",
        screenLabel: "Screen (Drag me!)",
        lightLabel: "Light",
        dragObject: "Drag me!",
      },
      feedback: {
        shadowBig: "Whoa! Your shadow grew SUPER BIG!",
        shadowTiny: "Nice move! You made a tiny shadow!",
        shadowShrinking: "Getting closer! Shadow shrinking!",
        objectBehindLight: "Object is behind the light source! No shadow.",
        objectBeyondScreen: "Object is beyond the screen! No shadow.",
      },
      infoBox: {
        title: "What's Happening?",
        hugeShadow: "HUGE shadow! The object is super close to the light!",
        tinyShadow: "Tiny shadow! The object is close to the screen!",
        normalShadow: "Normal shadow size! Try moving things around!",
        softEdges: "Soft edges because the light is BIG!",
        sharpEdges: "Sharp edges because the light is SMALL!",
        positionObject:
          "Position the object between the light source and the screen to see its shadow!",
      },
    },
    canvas: {
      intro: {
        title: "Does Light Travel in a Straight Line?",
        questionMark: "?",
      },
      matchbox_setup: {
        instruction: "Make holes in the same position on each matchbox",
        boxLabel: "Box",
      },
      matchbox_aligned: {
        message: "Aligned holes - Light passes through!",
      },
      matchbox_misaligned: {
        message: "Misaligned holes - Light is blocked!",
      },
      pipe_intro: {
        question: "Can we see through a pipe?",
      },
      pipe_straight: {
        message: "Straight pipe - You can see the flame!",
      },
      pipe_bent: {
        message: "Bent pipe - Cannot see the flame!",
      },
      conclusion: {
        title: "Light Travels in a Straight Line!",
        subtitle: "Both experiments confirm this important property of light",
      },
    },
    practice: {
      title: "🌍 Shadows in Real World",
      subtitle: "Discover how shadow formation affects our daily lives",
      scenarios: [
        {
          id: 1,
          title: "Shadow Play Performance",
          situation:
            "Priya is performing shadow puppetry (Togalu Gombeyaata) for her school's cultural program. She notices that when she moves the puppet closer to the light source, something interesting happens to the shadow on the screen.",
          question:
            "What should Priya do to make the shadow of her puppet appear LARGER on the screen?",
          options: [
            "Move the puppet closer to the screen",
            "Move the puppet closer to the light source",
            "Move the light source closer to the screen",
            "Use a brighter light",
          ],
          correctAnswer: 1,
          explanation:
            "When Priya moves the puppet closer to the light source (keeping the screen fixed), the shadow becomes larger. This is because light rays from the source spread out more after passing around the puppet, creating a bigger shadow on the screen. Shadow puppeteers use this principle to control the size of their characters!",
          realWorldTip:
            "Traditional Indian shadow puppetry forms like Tholu Bommalata (Andhra Pradesh), Togalu Gombeyaata (Karnataka), and Ravana Chhaya (Odisha) have been using this principle for centuries to create dramatic effects in their performances!",
          imageEmoji: "🎭",
        },
        {
          id: 2,
          title: "Cricket Match at Sunset",
          situation:
            "Rohan and his friends are playing cricket in the evening. As the Sun gets lower in the sky, Rohan notices that their shadows on the ground are getting much longer compared to when they were playing at noon.",
          question:
            "Why do shadows become longer in the evening compared to noon?",
          options: [
            "People grow taller in the evening",
            "The Sun is lower in the sky, creating a different angle of light",
            "The ground becomes softer in the evening",
            "There is more dust in the air during evening",
          ],
          correctAnswer: 1,
          explanation:
            "At noon, the Sun is high in the sky, almost directly overhead. Light falls at a steep angle, creating short shadows. In the evening, the Sun is lower near the horizon. Light travels at a shallow angle, similar to how Priya's puppet creates a larger shadow when the light source is positioned differently. This is why shadows are shortest at noon and longest during sunrise and sunset!",
          realWorldTip:
            "This is why photographers prefer 'golden hour' (early morning or late evening) for outdoor photography - the long, soft shadows add depth and drama to pictures!",
          imageEmoji: "🏏",
        },
        {
          id: 3,
          title: "Traffic Signal Safety",
          situation:
            "Kavya notices that at a busy traffic intersection, there are very tall streetlights. Her uncle explains that these lights are positioned high up for a good reason related to shadows.",
          question:
            "Why are streetlights placed high above the ground at traffic intersections?",
          options: [
            "To make them look more decorative",
            "To minimize shadows on the road and improve visibility",
            "To save electricity",
            "To protect them from damage",
          ],
          correctAnswer: 1,
          explanation:
            "When light sources are placed high, shadows of objects (like vehicles, poles, and people) become smaller and less prominent. This reduces dark patches on the road and improves visibility for all road users. If lights were placed low, they would create large, confusing shadows that could hide hazards and make driving dangerous. The positioning of the light source directly affects shadow size and road safety!",
          realWorldTip:
            "Modern street lighting design considers shadow formation carefully. LED streetlights are positioned to minimize shadows while providing even illumination, making roads safer at night!",
          imageEmoji: "🚦",
        },
        {
          id: 4,
          title: "Solar Eclipse Observation",
          situation:
            "During a solar eclipse, Aditya's science teacher set up a pinhole projector to safely view the eclipse. Aditya sees a crescent-shaped image on the screen and wonders why we can't look directly at the eclipse.",
          question:
            "Why is it dangerous to look directly at a solar eclipse, and how does the pinhole projector help?",
          options: [
            "The eclipse emits harmful rays that the pinhole blocks",
            "The pinhole magnifies the eclipse safely",
            "Looking directly can damage eyes; the pinhole projects a safe image on screen",
            "The pinhole creates a fake eclipse image",
          ],
          correctAnswer: 2,
          explanation:
            "During a solar eclipse, the Sun is still very bright and can damage your eyes permanently if viewed directly. A pinhole projector works on the same principle as shadow formation - light from the eclipse passes through a tiny hole and creates an image on a screen. This allows us to safely observe the eclipse's shadow pattern without looking at the Sun directly. The Moon is casting a shadow on Earth during an eclipse!",
          realWorldTip:
            "During solar eclipses, astronomers and educators set up pinhole projectors in communities to help people safely observe this rare astronomical event. Never look directly at the Sun or an eclipse without proper equipment!",
          imageEmoji: "🌑",
        },
        {
          id: 5,
          title: "Archaeological Discovery",
          situation:
            "Dr. Sharma, an archaeologist in Hampi, Karnataka, needs to photograph ancient rock carvings. She notices that during certain times of the day, the carvings are much easier to see and photograph.",
          question:
            "When would be the BEST time for Dr. Sharma to photograph the rock carvings to make the details most visible?",
          options: [
            "At noon when the Sun is directly overhead",
            "During early morning or late evening when Sun is at an angle",
            "At night with a flashlight",
            "On a cloudy day with no direct sunlight",
          ],
          correctAnswer: 1,
          explanation:
            "When the Sun is at an angle (early morning or late evening), it creates shadows in the carved grooves and details of the rock. These shadows make the three-dimensional features more visible and dramatic. At noon, when the Sun is overhead, there are minimal shadows, making the carvings appear flat and harder to see. This is the same principle of shadow formation - the position of the light source affects how shadows reveal or hide details!",
          realWorldTip:
            "Archaeologists, architects, and art historians use 'raking light' (light at a shallow angle) to study artifacts and structures. This technique reveals textures, tool marks, and wear patterns that might otherwise be invisible!",
          imageEmoji: "🏛️",
        },
        {
          id: 6,
          title: "Farmers and Sundials",
          situation:
            "In a village in Rajasthan, elderly farmers still use traditional knowledge to estimate time during the day by observing their shadow length. Ramesh's grandfather taught him this ancient skill.",
          question:
            "How can farmers estimate approximate time using shadow length?",
          options: [
            "Shadows are random and cannot indicate time",
            "Shadow length changes predictably: shortest at noon, longer morning/evening",
            "Shadows always point north",
            "Shadow color changes with time",
          ],
          correctAnswer: 1,
          explanation:
            "The position of the Sun changes predictably throughout the day. At sunrise, shadows are long and point west. As the Sun rises, shadows get shorter and rotate. At noon (solar noon), shadows are shortest and point north (in locations north of the Tropic of Cancer like most of India). After noon, shadows lengthen again and point east. This predictable pattern of shadow formation has been used for centuries in sundials and traditional timekeeping!",
          realWorldTip:
            "Sundials are one of humanity's oldest scientific instruments, used for over 5,000 years! Many ancient Indian temples have sundial markings. You can even make a simple sundial at home using a stick and marking shadow positions hourly on a sunny day!",
          imageEmoji: "🌾",
        },
        {
          id: 7,
          title: "Firefighters and Shadows",
          situation:
            "During a fire safety demonstration, firefighter Lakshmi explains to students why firefighters sometimes use powerful lights from multiple angles when searching through smoke-filled buildings.",
          question:
            "Why do firefighters use multiple light sources from different angles during rescue operations?",
          options: [
            "To make the building brighter only",
            "To reduce confusing shadows and see obstacles clearly",
            "To scare away smoke",
            "To signal other firefighters",
          ],
          correctAnswer: 1,
          explanation:
            "A single light source creates strong shadows that can hide obstacles, victims, or hazards. When light comes from only one direction, objects block the light and create dark shadow regions where nothing can be seen. By using multiple lights from different angles, firefighters reduce these shadowed areas. If one light creates a shadow, another light from a different angle illuminates it. This is a practical application of understanding shadow formation!",
          realWorldTip:
            "Film and photography studios also use multiple light sources (key light, fill light, back light) to control shadows and create the desired effect. Understanding shadow formation is crucial in many professions!",
          imageEmoji: "🚒",
        },
        {
          id: 8,
          title: "Building Design and Shadows",
          situation:
            "Architect Mrs. Patel is designing a new apartment building in Bangalore. She needs to plan the building's position carefully to ensure that it doesn't cast long shadows on the neighboring playground during afternoon hours when children play.",
          question:
            "What should Mrs. Patel consider about shadow formation when positioning the building?",
          options: [
            "Shadows don't matter in building design",
            "Building height, Sun's path, and shadow direction throughout the day",
            "Only the building's color affects shadows",
            "Shadows are the same size all day",
          ],
          correctAnswer: 1,
          explanation:
            "The building acts as an opaque object that blocks sunlight. Taller buildings create longer shadows. The Sun's position changes throughout the day and across seasons - it's higher in summer (shorter shadows) and lower in winter (longer shadows). Mrs. Patel must calculate where shadows will fall at different times and seasons. In hot climates like Bangalore, shadows can provide valuable cooling, but blocking playground light reduces safety and usability. This is why 'shadow impact studies' are required for new construction in many cities!",
          realWorldTip:
            "Modern sustainable architecture uses 'shadow analysis' software to optimize building design. Some buildings are designed to deliberately create shaded courtyards for natural cooling, while others use shadow patterns to create interesting architectural effects throughout the day!",
          imageEmoji: "🏢",
        },
      ],
      controls: {
        previous: "← Previous",
        checkAnswer: "Check Answer",
        nextScenario: "Next Scenario →",
        scenarioCount: "Scenario {{current}} of {{total}}",
      },
      headers: {
        realWorldSituation: "📖 Real-World Situation",
        scientificExplanation: "💡 Scientific Explanation",
        realWorldApplication: "🌍 Real-World Application",
      },
      progress: {
        title: "📊 Your Progress",
        completed: "Scenarios Completed:",
        congrats:
          "🎉 Congratulations! You've completed all real-world scenarios!",
      },
      facts: {
        title: "🌟 Amazing Shadow Facts from India",
        list: [
          "<strong>Konark Sun Temple</strong> (Odisha) was designed so that the first rays of the Sun would fall on its main entrance, creating spectacular shadow patterns",
          "<strong>Jantar Mantar</strong> observatories in Delhi, Jaipur, and other cities use giant shadow-casting instruments (sundials) to track time and astronomical positions with incredible accuracy",
          "Ancient Indian mathematicians like <strong>Aryabhata</strong> (5th century CE) studied shadows to calculate Earth's circumference and the distances to celestial bodies",
          "Traditional <strong>shadow puppetry</strong> performances in India often last through the night, with stories from epics like Ramayana and Mahabharata told through moving shadows",
          "The <strong>Dilwara Temples</strong> in Rajasthan are positioned to create changing shadow patterns on intricate marble carvings throughout the day",
        ],
      },
      simulation: {
        title: "🎭 Shadow Puppetry Simulator",
        show: "Show Simulation",
        hide: "Hide Simulation",
        intro:
          "Try moving the puppet and adjusting the light distance to see how shadows change in traditional Indian shadow puppetry!",
        shadowSize: "Shadow Size",
        large: "Large",
        medium: "Medium",
        small: "Small",
        puppetPosLabel: "🎭 Puppet Position (closer to light = larger shadow)",
        puppetShapeLabel: "Choose Puppet Shape",
        shapes: {
          hand: {
            label: "Hand",
            emoji: "✋",
          },
          bird: {
            label: "Bird",
            emoji: "🦅",
          },
          dog: {
            label: "Dog",
            emoji: "🐕",
          },
        },
        tip: "<strong>💡 Try this:</strong> Move the puppet closer to the light source (left) to make the shadow larger! Traditional shadow puppeteers use this technique to make characters appear to grow or shrink during performances.",
      },
    },
    realWorld: {
      title: "Real World Applications",
      subtitle:
        "Discover how the straight-line property of light is used in everyday life",
      searchPlaceholder: "Search applications...",
      allCategories: "All Categories",
      loading: "Loading applications...",
      example: "Example:",
      applications: [
        {
          id: 1,
          title: "Periscopes in Submarines",
          description:
            "Submarines use periscopes to see above water while staying submerged. Periscopes use mirrors to redirect light in straight paths, allowing submariners to see the surface from below.",
          icon: "🔭",
          category: "Military & Navigation",
          example:
            "Two mirrors at 45° angles reflect light in straight lines to see over obstacles.",
        },
        {
          id: 2,
          title: "Laser Pointers & Alignment",
          description:
            "Laser pointers create perfectly straight reference lines in construction and surveying. Because light travels in a straight line, lasers can accurately mark straight paths over long distances.",
          icon: "🔦",
          category: "Construction & Engineering",
          example:
            "Construction workers use laser levels to ensure walls are perfectly vertical.",
        },
        {
          id: 3,
          title: "Fiber Optic Cables",
          description:
            "Fiber optic cables use the principle that light travels in straight lines within glass fiber. Light signals travel through long fiber paths to transmit internet data at the speed of light.",
          icon: "🌐",
          category: "Communication Technology",
          example:
            "Your internet uses fiber optics where light travels through thin glass fibers.",
        },
        {
          id: 4,
          title: "Flashlights & Spotlights",
          description:
            "Flashlights create focused beams of light that travel in straight lines. Reflectors direct the light into a straight beam for illuminating specific areas.",
          icon: "🔦",
          category: "Lighting & Safety",
          example:
            "Emergency responders use spotlights that send straight beams to search in darkness.",
        },
        {
          id: 5,
          title: "Cameras & Photography",
          description:
            "Cameras work because light travels in straight lines from the subject through the lens to the sensor. The straight-line path creates sharp, clear images.",
          icon: "📷",
          category: "Imaging & Art",
          example:
            "When you take a photo, light travels in straight lines through the camera lens.",
        },
        {
          id: 6,
          title: "Solar Cookers",
          description:
            "Solar cookers use curved mirrors to redirect sunlight to a single point. Sunlight travels in straight lines, reflects off mirrors, and concentrates at the cooking pot.",
          icon: "☀️",
          category: "Sustainable Energy",
          example:
            "Solar cookers provide a free, clean way to cook food using focused sunlight.",
        },
        {
          id: 7,
          title: "Shadows & Sundials",
          description:
            "Shadows form because light travels in straight lines and cannot bend around opaque objects. Ancient sundials used this to tell time by tracking shadows.",
          icon: "🌤️",
          category: "Astronomy & Time",
          example:
            "Sundials have been used for thousands of years using shadow positions.",
        },
        {
          id: 8,
          title: "Traffic Signals",
          description:
            "Traffic lights are positioned so drivers have a clear straight-line view. Traffic engineers use the straight-line property to ensure signals are visible from safe distances.",
          icon: "🚦",
          category: "Transportation & Safety",
          example:
            "Traffic lights are placed high at intersections for clear straight-path visibility.",
        },
        {
          id: 9,
          title: "Optical Instruments",
          description:
            "Microscopes, telescopes, and binoculars rely on light traveling in straight lines through lenses and mirrors to magnify distant or tiny objects.",
          icon: "🔬",
          category: "Science & Research",
          example:
            "Astronomers use telescopes that collect light traveling from distant stars.",
        },
        {
          id: 10,
          title: "Barcode Scanners",
          description:
            "Barcode scanners use laser light that travels in straight lines to read patterns on products. The straight beam reflects differently from light and dark bars.",
          icon: "🏪",
          category: "Retail & Commerce",
          example:
            "Checkout scanners send straight beams across barcodes to read product codes.",
        },
        {
          id: 11,
          title: "Medical Endoscopes",
          description:
            "Doctors use endoscopes to see inside the body. These instruments use fiber optic cables that guide light in straight paths through flexible tubes.",
          icon: "🏥",
          category: "Medical Technology",
          example:
            "Doctors examine internal organs using light through thin tubes.",
        },
        {
          id: 12,
          title: "Stage Lighting",
          description:
            "Theater spotlights create dramatic effects by directing bright beams in straight lines onto performers. Lighting designers use predictable straight-path behavior.",
          icon: "🎭",
          category: "Entertainment & Arts",
          example:
            "Follow-spots track performers with straight beams creating dramatic effects.",
        },
      ],
    },
  },
  hi: {
    nav: {
      logo: "छाया निर्माण",
      tabs: {
        learn: "सीखें",
        practice: "अभ्यास",
        realWorld: "वास्तविक दुनिया",
      },
    },
    language: {
      en: "English",
      hi: "हिंदी",
      gu: "ગુજરાતી",
      selectorLabel: "भाषा चुनें",
    },
    controls: {
      step: "चरण",
      of: "का",
      previous: "पिछला",
      next: "अगला",
      play: "चलाएं",
      pause: "रोकें",
      reset: "रीसेट",
    },
    shadowSimulator: {
      title: "छाया निर्माता सिम्युलेटर",
      subtitle: "एक वैज्ञानिक की तरह प्रकाश और छाया के साथ खेलें!",
      objects: {
        title: "अपना वस्तु चुनें!",
        cat: "बिल्ली कट-आउट",
        superhero: "सुपरहीरो",
        bottle: "पानी की बोतल",
        glass: "फ्रॉस्टेड ग्लास",
        paper: "कागज की शीट",
        football: "फुटबॉल",
        tree: "पेड़",
        selected: "चुना गया! इसे चारों ओर खींचें!",
      },
      lightSize: {
        title: "प्रकाश का आकार",
        small: "छोटा प्रकाश (तीव्र छाया)",
        large: "बड़ा प्रकाश (नरम छाया)",
        smallFeedback: "तीव्र छाया सक्रिय!",
        largeFeedback: "नरम, धुंधली छाया मोड!",
      },
      shadowFacts: {
        title: "छाया तथ्य!",
        opaque: "अपारदर्शी वस्तुएं = गहरी छाया",
        translucent: "अर्ध-पारदर्शी वस्तुएं = हल्की छाया",
        transparent: "पारदर्शी वस्तुएं = लगभग कोई छाया नहीं",
        currentObject: {
          opaque: "अपारदर्शी",
          translucent: "अर्ध-पारदर्शी",
          semiTransparent: "अर्ध-पारदर्शी",
        },
      },
      controls: {
        showRays: "प्रकाश किरणें दिखाएं",
        dragHelper:
          "छाया बदलते देखने के लिए प्रकाश, वस्तु और स्क्रीन को खींचें!",
        screenLabel: "स्क्रीन (मुझे खींचें!)",
        lightLabel: "प्रकाश",
        dragObject: "मुझे खींचें!",
      },
      feedback: {
        shadowBig: "वाह! आपकी छाया बहुत बड़ी हो गई!",
        shadowTiny: "अच्छी चाल! आपने एक छोटी छाया बनाई!",
        shadowShrinking: "करीब आ रहे हैं! छाया सिकुड़ रही है!",
        objectBehindLight: "वस्तु प्रकाश स्रोत के पीछे है! कोई छाया नहीं।",
        objectBeyondScreen: "वस्तु स्क्रीन के पार है! कोई छाया नहीं।",
      },
      infoBox: {
        title: "क्या हो रहा है?",
        hugeShadow: "विशाल छाया! वस्तु प्रकाश के बहुत करीब है!",
        tinyShadow: "छोटी छाया! वस्तु स्क्रीन के करीब है!",
        normalShadow:
          "सामान्य छाया आकार! चीजों को इधर-उधर घुमाने का प्रयास करें!",
        softEdges: "नरम किनारे क्योंकि प्रकाश बड़ा है!",
        sharpEdges: "तीव्र किनारे क्योंकि प्रकाश छोटा है!",
        positionObject:
          "छाया देखने के लिए वस्तु को प्रकाश स्रोत और स्क्रीन के बीच रखें!",
      },
    },
    canvas: {
      intro: {
        title: "क्या प्रकाश सीधी रेखा में यात्रा करता है?",
        questionMark: "?",
      },
      matchbox_setup: {
        instruction: "प्रत्येक माचिस के डिब्बे में एक ही स्थान पर छेद करें",
        boxLabel: "डिब्बा",
      },
      matchbox_aligned: {
        message: "संरेखित छेद - प्रकाश गुजरता है!",
      },
      matchbox_misaligned: {
        message: "गलत संरेखित छेद - प्रकाश अवरुद्ध है!",
      },
      pipe_intro: {
        question: "क्या हम पाइप के माध्यम से देख सकते हैं?",
      },
      pipe_straight: {
        message: "सीधा पाइप - आप लौ देख सकते हैं!",
      },
      pipe_bent: {
        message: "मुड़ा हुआ पाइप - लौ नहीं देख सकते!",
      },
      conclusion: {
        title: "प्रकाश सीधी रेखा में यात्रा करता है!",
        subtitle: "दोनों प्रयोग इस प्रकाश के महत्वपूर्ण गुण की पुष्टि करते हैं",
      },
    },
    practice: {
      title: "🌍 वास्तविक दुनिया में छायाएं",
      subtitle:
        "जानें कि छाया निर्माण हमारे दैनिक जीवन को कैसे प्रभावित करता है",
      scenarios: [
        {
          id: 1,
          title: "छाया कठपुतली प्रदर्शन",
          situation:
            "प्रिया अपने स्कूल के सांस्कृतिक कार्यक्रम के लिए छाया कठपुतली (तोगालू गोम्बेयाता) प्रदर्शन कर रही है। उसने देखा कि जब वह कठपुतली को प्रकाश स्रोत के करीब ले जाती है, तो स्क्रीन पर छाया में कुछ दिलचस्प होता है।",
          question:
            "प्रिया को अपनी कठपुतली की छाया स्क्रीन पर बड़ी दिखाने के लिए क्या करना चाहिए?",
          options: [
            "कठपुतली को स्क्रीन के करीब ले जाएं",
            "कठपुतली को प्रकाश स्रोत के करीब ले जाएं",
            "प्रकाश स्रोत को स्क्रीन के करीब ले जाएं",
            "अधिक चमकदार प्रकाश का उपयोग करें",
          ],
          correctAnswer: 1,
          explanation:
            "जब प्रिया कठपुतली को प्रकाश स्रोत के करीब ले जाती है (स्क्रीन को स्थिर रखते हुए), छाया बड़ी हो जाती है। ऐसा इसलिए है क्योंकि स्रोत से प्रकाश किरणें कठपुतली के चारों ओर से गुजरने के बाद अधिक फैलती हैं, जिससे स्क्रीन पर एक बड़ी छाया बनती है। छाया कठपुतली कलाकार अपने पात्रों के आकार को नियंत्रित करने के लिए इस सिद्धांत का उपयोग करते हैं!",
          realWorldTip:
            "पारंपरिक भारतीय छाया कठपुतली रूप जैसे थोलू बोम्मलाटा (आंध्र प्रदेश), तोगालू गोम्बेयाता (कर्नाटक), और रावण छाया (ओडिशा) सदियों से अपने प्रदर्शन में नाटकीय प्रभाव बनाने के लिए इस सिद्धांत का उपयोग कर रहे हैं!",
          imageEmoji: "🎭",
        },
        {
          id: 2,
          title: "सूर्यास्त पर क्रिकेट मैच",
          situation:
            "रोहन और उसके दोस्त शाम को क्रिकेट खेल रहे हैं। जैसे-जैसे सूर्य आकाश में नीचे आता है, रोहन देखता है कि जमीन पर उनकी छायाएं दोपहर के समय की तुलना में बहुत लंबी हो रही हैं।",
          question: "शाम को छायाएं दोपहर की तुलना में क्यों लंबी हो जाती हैं?",
          options: [
            "शाम को लोग लंबे हो जाते हैं",
            "सूर्य आकाश में नीचे है, जो प्रकाश का एक अलग कोण बनाता है",
            "शाम को जमीन नरम हो जाती है",
            "शाम के दौरान हवा में अधिक धूल होती है",
          ],
          correctAnswer: 1,
          explanation:
            "दोपहर में, सूर्य आकाश में ऊंचा होता है, लगभग सिर के ऊपर सीधा। प्रकाश एक खड़ी कोण पर पड़ता है, जिससे छोटी छायाएं बनती हैं। शाम को, सूर्य क्षितिज के पास नीचे होता है। प्रकाश एक कम कोण पर यात्रा करता है, जैसे कि प्रिया की कठपुतली तब बड़ी छाया बनाती है जब प्रकाश स्रोत अलग तरीके से रखा जाता है। यही कारण है कि छायाएं दोपहर में सबसे छोटी और सूर्योदय और सूर्यास्त के दौरान सबसे लंबी होती हैं!",
          realWorldTip:
            "यही कारण है कि फोटोग्राफर बाहरी फोटोग्राफी के लिए 'गोल्डन आवर' (सुबह जल्दी या देर शाम) पसंद करते हैं - लंबी, नरम छायाएं तस्वीरों में गहराई और नाटक जोड़ती हैं!",
          imageEmoji: "🏏",
        },
        {
          id: 3,
          title: "ट्रैफिक सिग्नल सुरक्षा",
          situation:
            "कव्या देखती है कि एक व्यस्त यातायात चौराहे पर, बहुत ऊंचे स्ट्रीटलाइट हैं। उसके चाचा बताते हैं कि ये लाइटें छाया से संबंधित एक अच्छे कारण से ऊंचाई पर रखी गई हैं।",
          question:
            "यातायात चौराहों पर स्ट्रीटलाइट जमीन से ऊंचे क्यों रखी जाती हैं?",
          options: [
            "उन्हें अधिक सजावटी बनाने के लिए",
            "सड़क पर छायाओं को कम करने और दृश्यता बेहतर बनाने के लिए",
            "बिजली बचाने के लिए",
            "उन्हें नुकसान से बचाने के लिए",
          ],
          correctAnswer: 1,
          explanation:
            "जब प्रकाश स्रोत ऊंचाई पर रखे जाते हैं, तो वस्तुओं (जैसे वाहन, खंभे, और लोगों) की छायाएं छोटी और कम प्रमुख हो जाती हैं। यह सड़क पर अंधेरे पैच को कम करता है और सभी सड़क उपयोगकर्ताओं के लिए दृश्यता बेहतर बनाता है। यदि लाइटें नीचे रखी जातीं, तो वे बड़ी, भ्रमित करने वाली छायाएं बनातीं जो खतरों को छुपा सकती थीं और ड्राइविंग को खतरनाक बना सकती थीं। प्रकाश स्रोत की स्थिति सीधे छाया के आकार और सड़क सुरक्षा को प्रभावित करती है!",
          realWorldTip:
            "आधुनिक स्ट्रीट लाइटिंग डिज़ाइन छाया निर्माण पर ध्यान से विचार करता है। LED स्ट्रीटलाइट को छायाओं को कम करने के लिए रखा जाता है जबकि समान प्रकाश व्यवस्था प्रदान करते हुए, रात में सड़कों को सुरक्षित बनाता है!",
          imageEmoji: "🚦",
        },
        {
          id: 4,
          title: "सौर ग्रहण अवलोकन",
          situation:
            "एक सौर ग्रहण के दौरान, आदित्य के विज्ञान शिक्षक ने ग्रहण को सुरक्षित रूप से देखने के लिए एक पिनहोल प्रोजेक्टर स्थापित किया। आदित्य स्क्रीन पर एक अर्धचंद्राकार छवि देखता है और सोचता है कि हम सीधे ग्रहण को क्यों नहीं देख सकते।",
          question:
            "सौर ग्रहण को सीधे देखना खतरनाक क्यों है, और पिनहोल प्रोजेक्टर कैसे मदद करता है?",
          options: [
            "ग्रहण हानिकारक किरणें उत्सर्जित करता है जिन्हें पिनहोल अवरुद्ध करता है",
            "पिनहोल ग्रहण को सुरक्षित रूप से बढ़ाता है",
            "सीधे देखने से आंखें क्षतिग्रस्त हो सकती हैं; पिनहोल स्क्रीन पर एक सुरक्षित छवि बनाता है",
            "पिनहोल एक नकली ग्रहण छवि बनाता है",
          ],
          correctAnswer: 2,
          explanation:
            "सौर ग्रहण के दौरान, सूर्य अभी भी बहुत चमकदार है और यदि सीधे देखा जाए तो आपकी आंखों को स्थायी रूप से नुकसान पहुंचा सकता है। एक पिनहोल प्रोजेक्टर छाया निर्माण के समान सिद्धांत पर काम करता है - ग्रहण से प्रकाश एक छोटे छेद से गुजरता है और स्क्रीन पर एक छवि बनाता है। यह हमें सूर्य को सीधे देखे बिना ग्रहण के छाया पैटर्न को सुरक्षित रूप से देखने की अनुमति देता है। ग्रहण के दौरान चंद्रमा पृथ्वी पर एक छाया डाल रहा है!",
          realWorldTip:
            "सौर ग्रहण के दौरान, खगोलविद और शिक्षक समुदायों में पिनहोल प्रोजेक्टर स्थापित करते हैं ताकि लोगों को इस दुर्लभ खगोलीय घटना को सुरक्षित रूप से देखने में मदद मिल सके। उचित उपकरण के बिना कभी भी सीधे सूर्य या ग्रहण को न देखें!",
          imageEmoji: "🌑",
        },
        {
          id: 5,
          title: "पुरातात्विक खोज",
          situation:
            "डॉ. शर्मा, कर्नाटक में हंपी में एक पुरातत्वविद्, प्राचीन चट्टान की नक्काशी की तस्वीर लेने की आवश्यकता है। वह देखती है कि दिन के कुछ समय के दौरान, नक्काशी देखने और फोटोग्राफ करने में बहुत आसान होती है।",
          question:
            "विवरण को सबसे अधिक दिखाने के लिए डॉ. शर्मा के लिए चट्टान की नक्काशी की तस्वीर लेने का सबसे अच्छा समय कब होगा?",
          options: [
            "दोपहर में जब सूर्य सीधे सिर के ऊपर हो",
            "सुबह जल्दी या देर शाम जब सूर्य कोण पर हो",
            "रात में टॉर्च के साथ",
            "बादल वाले दिन में जब कोई सीधी धूप न हो",
          ],
          correctAnswer: 1,
          explanation:
            "जब सूर्य कोण पर होता है (सुबह जल्दी या देर शाम), यह चट्टान की नक्काशी वाली खांचे और विवरणों में छायाएं बनाता है। ये छायाएं त्रि-आयामी विशेषताओं को अधिक दिखाई देने योग्य और नाटकीय बनाती हैं। दोपहर में, जब सूर्य सिर के ऊपर होता है, तो न्यूनतम छायाएं होती हैं, जिससे नक्काशी सपाट और देखने में कठिन लगती है। यह छाया निर्माण का वही सिद्धांत है - प्रकाश स्रोत की स्थिति प्रभावित करती है कि छायाएं विवरणों को कैसे प्रकट या छुपाती हैं!",
          realWorldTip:
            "पुरातत्वविद्, वास्तुकार, और कला इतिहासकार कलाकृतियों और संरचनाओं का अध्ययन करने के लिए 'रेकिंग लाइट' (कम कोण पर प्रकाश) का उपयोग करते हैं। यह तकनीक बनावट, उपकरण के निशान, और घिसाव पैटर्न को प्रकट करती है जो अन्यथा अदृश्य हो सकते हैं!",
          imageEmoji: "🏛️",
        },
        {
          id: 6,
          title: "किसान और सूर्यघड़ी",
          situation:
            "राजस्थान के एक गांव में, बुजुर्ग किसान अभी भी अपनी छाया लंबाई का अवलोकन करके दिन के दौरान समय का अनुमान लगाने के लिए पारंपरिक ज्ञान का उपयोग करते हैं। रमेश के दादा ने उसे यह प्राचीन कौशल सिखाया।",
          question:
            "किसान छाया लंबाई का उपयोग करके अनुमानित समय कैसे लगा सकते हैं?",
          options: [
            "छायाएं यादृच्छिक हैं और समय नहीं बता सकतीं",
            "छाया लंबाई अनुमानित रूप से बदलती है: दोपहर में सबसे छोटी, सुबह/शाम में लंबी",
            "छायाएं हमेशा उत्तर की ओर इंगित करती हैं",
            "समय के साथ छाया का रंग बदलता है",
          ],
          correctAnswer: 1,
          explanation:
            "सूर्य की स्थिति पूरे दिन अनुमानित रूप से बदलती है। सूर्योदय पर, छायाएं लंबी होती हैं और पश्चिम की ओर इंगित करती हैं। जैसे-जैसे सूर्य उगता है, छायाएं छोटी हो जाती हैं और घूमती हैं। दोपहर में (सौर दोपहर), छायाएं सबसे छोटी होती हैं और उत्तर की ओर इंगित करती हैं (कर्क रेखा के उत्तर में स्थानों में जैसे भारत का अधिकांश हिस्सा)। दोपहर के बाद, छायाएं फिर से लंबी हो जाती हैं और पूर्व की ओर इंगित करती हैं। छाया निर्माण का यह अनुमानित पैटर्न सदियों से सूर्यघड़ी और पारंपरिक समय रखने में उपयोग किया गया है!",
          realWorldTip:
            "सूर्यघड़ी मानवता के सबसे पुराने वैज्ञानिक उपकरणों में से एक है, 5,000 से अधिक वर्षों से उपयोग की जा रही है! कई प्राचीन भारतीय मंदिरों में सूर्यघड़ी के निशान हैं। आप एक छड़ी का उपयोग करके और धूप वाले दिन पर प्रति घंटे छाया स्थितियों को चिह्नित करके घर पर एक साधारण सूर्यघड़ी भी बना सकते हैं!",
          imageEmoji: "🌾",
        },
        {
          id: 7,
          title: "अग्निशामक और छायाएं",
          situation:
            "एक अग्नि सुरक्षा प्रदर्शन के दौरान, अग्निशामक लक्ष्मी छात्रों को समझाती है कि अग्निशामक कभी-कभी धुएं से भरे इमारतों में खोज करते समय कई कोणों से शक्तिशाली रोशनी का उपयोग क्यों करते हैं।",
          question:
            "बचाव अभियानों के दौरान अग्निशामक अलग-अलग कोणों से कई प्रकाश स्रोतों का उपयोग क्यों करते हैं?",
          options: [
            "केवल इमारत को अधिक चमकदार बनाने के लिए",
            "भ्रमित करने वाली छायाओं को कम करने और बाधाओं को स्पष्ट रूप से देखने के लिए",
            "धुएं को भगाने के लिए",
            "अन्य अग्निशामकों को संकेत देने के लिए",
          ],
          correctAnswer: 1,
          explanation:
            "एक एकल प्रकाश स्रोत मजबूत छायाएं बनाता है जो बाधाओं, पीड़ितों, या खतरों को छुपा सकता है। जब प्रकाश केवल एक दिशा से आता है, तो वस्तुएं प्रकाश को अवरुद्ध करती हैं और अंधेरे छाया क्षेत्र बनाती हैं जहां कुछ भी नहीं देखा जा सकता। विभिन्न कोणों से कई रोशनी का उपयोग करके, अग्निशामक इन छाया क्षेत्रों को कम करते हैं। यदि एक रोशनी छाया बनाती है, तो एक अलग कोण से दूसरी रोशनी इसे प्रकाशित करती है। यह छाया निर्माण की समझ का एक व्यावहारिक अनुप्रयोग है!",
          realWorldTip:
            "फिल्म और फोटोग्राफी स्टूडियो भी छायाओं को नियंत्रित करने और वांछित प्रभाव बनाने के लिए कई प्रकाश स्रोतों (की लाइट, फिल लाइट, बैक लाइट) का उपयोग करते हैं। छाया निर्माण की समझ कई व्यवसायों में महत्वपूर्ण है!",
          imageEmoji: "🚒",
        },
        {
          id: 8,
          title: "भवन डिज़ाइन और छायाएं",
          situation:
            "वास्तुकार श्रीमती पटेल बैंगलोर में एक नई अपार्टमेंट इमारत डिज़ाइन कर रही हैं। उन्हें इमारत की स्थिति को सावधानी से योजना बनाने की आवश्यकता है ताकि यह सुनिश्चित हो सके कि यह दोपहर के घंटों के दौरान बच्चों के खेलने के समय पड़ोसी खेल के मैदान पर लंबी छायाएं न डाले।",
          question:
            "इमारत को स्थित करते समय श्रीमती पटेल को छाया निर्माण के बारे में क्या विचार करना चाहिए?",
          options: [
            "भवन डिज़ाइन में छायाएं मायने नहीं रखतीं",
            "भवन की ऊंचाई, सूर्य का पथ, और दिन भर छाया की दिशा",
            "केवल इमारत का रंग छायाओं को प्रभावित करता है",
            "छायाएं पूरे दिन एक ही आकार की होती हैं",
          ],
          correctAnswer: 1,
          explanation:
            "इमारत एक अपारदर्शी वस्तु के रूप में काम करती है जो सूर्य के प्रकाश को अवरुद्ध करती है। ऊंची इमारतें लंबी छायाएं बनाती हैं। सूर्य की स्थिति पूरे दिन और मौसमों में बदलती है - गर्मियों में यह उच्च होता है (छोटी छायाएं) और सर्दियों में नीचे (लंबी छायाएं)। श्रीमती पटेल को गणना करनी चाहिए कि विभिन्न समय और मौसमों में छायाएं कहां गिरेंगी। बैंगलोर जैसे गर्म जलवायु में, छायाएं मूल्यवान शीतलन प्रदान कर सकती हैं, लेकिन खेल के मैदान के प्रकाश को अवरुद्ध करना सुरक्षा और उपयोगिता को कम करता है। यही कारण है कि कई शहरों में नए निर्माण के लिए 'छाया प्रभाव अध्ययन' आवश्यक हैं!",
          realWorldTip:
            "आधुनिक स्थायी वास्तुकला भवन डिज़ाइन को अनुकूलित करने के लिए 'छाया विश्लेषण' सॉफ़्टवेयर का उपयोग करती है। कुछ इमारतें जानबूझकर प्राकृतिक शीतलन के लिए छायादार आंगन बनाने के लिए डिज़ाइन की जाती हैं, जबकि अन्य दिन भर दिलचस्प वास्तुशिल्प प्रभाव बनाने के लिए छाया पैटर्न का उपयोग करती हैं!",
          imageEmoji: "🏢",
        },
      ],
      controls: {
        previous: "← पिछला",
        checkAnswer: "उत्तर जांचें",
        nextScenario: "अगला परिदृश्य →",
        scenarioCount: "परिदृश्य {{current}} / {{total}}",
      },
      headers: {
        realWorldSituation: "📖 वास्तविक दुनिया की स्थिति",
        scientificExplanation: "💡 वैज्ञानिक व्याख्या",
        realWorldApplication: "🌍 वास्तविक दुनिया का अनुप्रयोग",
      },
      progress: {
        title: "📊 आपकी प्रगति",
        completed: "पूर्ण परिदृश्य:",
        congrats:
          "🎉 बधाई हो! आपने सभी वास्तविक दुनिया के परिदृश्य पूरे कर लिए हैं!",
      },
      facts: {
        title: "🌟 भारत से अद्भुत छाया तथ्य",
        list: [
          "<strong>कोणार्क सूर्य मंदिर</strong> (ओडिशा) को इस तरह डिज़ाइन किया गया था कि सूर्य की पहली किरणें इसके मुख्य प्रवेश द्वार पर पड़ें, शानदार छाया पैटर्न बनाते हुए",
          "<strong>जंतर मंतर</strong> वेधशालाएं दिल्ली, जयपुर और अन्य शहरों में विशाल छाया-प्रक्षेपण उपकरण (सूर्यघड़ी) का उपयोग अविश्वसनीय सटीकता के साथ समय और खगोलीय स्थितियों को ट्रैक करने के लिए करती हैं",
          "प्राचीन भारतीय गणितज्ञ जैसे <strong>आर्यभट्ट</strong> (5वीं शताब्दी CE) ने पृथ्वी की परिधि और खगोलीय पिंडों की दूरियों की गणना करने के लिए छायाओं का अध्ययन किया",
          "भारत में पारंपरिक <strong>छाया कठपुतली</strong> प्रदर्शन अक्सर रात भर चलते हैं, रामायण और महाभारत जैसे महाकाव्यों की कहानियां चलती छायाओं के माध्यम से बताई जाती हैं",
          "राजस्थान में <strong>दिलवाड़ा मंदिर</strong> जटिल संगमरमर नक्काशी पर दिन भर बदलते छाया पैटर्न बनाने के लिए स्थित हैं",
        ],
      },
      simulation: {
        title: "🎭 छाया कठपुतली सिम्युलेटर",
        show: "सिम्युलेशन दिखाएं",
        hide: "सिम्युलेशन छुपाएं",
        intro:
          "पारंपरिक भारतीय छाया कठपुतली में छायाएं कैसे बदलती हैं देखने के लिए कठपुतली को हिलाएं और प्रकाश दूरी समायोजित करें!",
        shadowSize: "छाया का आकार",
        large: "बड़ा",
        medium: "मध्यम",
        small: "छोटा",
        puppetPosLabel: "🎭 कठपुतली की स्थिति (प्रकाश के करीब = बड़ी छाया)",
        puppetShapeLabel: "कठपुतली का आकार चुनें",
        shapes: {
          hand: {
            label: "हाथ",
            emoji: "✋",
          },
          bird: {
            label: "पक्षी",
            emoji: "🦅",
          },
          dog: {
            label: "कुत्ता",
            emoji: "🐕",
          },
        },
        tip: "<strong>💡 इसे आजमाएं:</strong> छाया को बड़ा बनाने के लिए कठपुतली को प्रकाश स्रोत (बाएं) के करीब ले जाएं! पारंपरिक छाया कठपुतली कलाकार प्रदर्शन के दौरान पात्रों को बढ़ने या सिकुड़ने के लिए इस तकनीक का उपयोग करते हैं।",
      },
    },
    realWorld: {
      title: "वास्तविक दुनिया के अनुप्रयोग",
      subtitle:
        "जानें कि रोजमर्रा की जिंदगी में प्रकाश की सीधी-रेखा संपत्ति का उपयोग कैसे किया जाता है",
      searchPlaceholder: "अनुप्रयोग खोजें...",
      allCategories: "सभी श्रेणियां",
      loading: "अनुप्रयोग लोड हो रहे हैं...",
      example: "उदाहरण:",
      applications: [
        {
          id: 1,
          title: "पनडुब्बियों में पेरिस्कोप",
          description:
            "पनडुब्बियां पानी के नीचे रहते हुए पानी के ऊपर देखने के लिए पेरिस्कोप का उपयोग करती हैं। पेरिस्कोप सीधे पथों में प्रकाश को पुनर्निर्देशित करने के लिए दर्पणों का उपयोग करते हैं।",
          icon: "🔭",
          category: "सैन्य और नेविगेशन",
          example: "45° कोण पर दो दर्पण प्रकाश को प्रतिबिंबित करते हैं।",
        },
        {
          id: 2,
          title: "लेजर पॉइंटर",
          description:
            "निर्माण में पूरी तरह से सीधी संदर्भ रेखाएं बनाने के लिए उपयोग किया जाता है।",
          icon: "🔦",
          category: "निर्माण और इंजीनियरिंग",
          example: "निर्माण कार्यकर्ता लेजर स्तरों का उपयोग करते हैं।",
        },
        {
          id: 3,
          title: "फाइबर ऑप्टिक केबल",
          description:
            "इंटरनेट डेटा संचारित करने के लिए प्रकाश का उपयोग करते हैं।",
          icon: "🌐",
          category: "संचार प्रौद्योगिकी",
          example: "आपका इंटरनेट फाइबर ऑप्टिक्स का उपयोग करता है।",
        },
        {
          id: 4,
          title: "टॉर्च और स्पॉटलाइट",
          description: "केंद्रित प्रकाश बीम बनाते हैं।",
          icon: "🔦",
          category: "प्रकाश और सुरक्षा",
          example: "आपातकालीन उत्तरदाता स्पॉटलाइट का उपयोग करते हैं।",
        },
        {
          id: 5,
          title: "कैमरा और फोटोग्राफी",
          description: "सीधी रेखाओं में प्रकाश यात्रा के कारण काम करते हैं।",
          icon: "📷",
          category: "इमेजिंग और कला",
          example: "फोटो लेते समय प्रकाश सीधी रेखाओं में यात्रा करता है।",
        },
        {
          id: 6,
          title: "सौर कुकर",
          description:
            "सूर्य के प्रकाश को केंद्रित करने के लिए दर्पणों का उपयोग करते हैं।",
          icon: "☀️",
          category: "सतत ऊर्जा",
          example: "सौर कुकर भोजन पकाने का स्वच्छ तरीका प्रदान करते हैं।",
        },
        {
          id: 7,
          title: "छाया और धूपघड़ी",
          description: "प्रकाश की सीधी रेखा गति के कारण छाया बनती है।",
          icon: "🌤️",
          category: "खगोल विज्ञान",
          example: "धूपघड़ी का उपयोग हजारों वर्षों से किया जाता है।",
        },
        {
          id: 8,
          title: "यातायात संकेत",
          description: "स्पष्ट दृश्य के लिए रखे गए हैं।",
          icon: "🚦",
          category: "परिवहन",
          example: "यातायात लाइट चौराहों पर ऊंची रखी जाती हैं।",
        },
        {
          id: 9,
          title: "ऑप्टिकल उपकरण",
          description: "माइक्रोस्कोप और टेलीस्कोप।",
          icon: "🔬",
          category: "विज्ञान",
          example: "खगोलविद टेलीस्कोप का उपयोग करते हैं।",
        },
        {
          id: 10,
          title: "बारकोड स्कैनर",
          description: "उत्पाद कोड पढ़ने के लिए लेजर का उपयोग करते हैं।",
          icon: "🏪",
          category: "खुदरा",
          example: "स्कैनर बारकोड पर सीधी बीम भेजते हैं।",
        },
        {
          id: 11,
          title: "चिकित्सा एंडोस्कोप",
          description: "शरीर के अंदर देखने के लिए।",
          icon: "🏥",
          category: "चिकित्सा",
          example: "डॉक्टर पतली ट्यूबों के माध्यम से प्रकाश का उपयोग करते हैं।",
        },
        {
          id: 12,
          title: "मंच प्रकाश",
          description: "नाटकीय प्रभाव बनाते हैं।",
          icon: "🎭",
          category: "मनोरंजन",
          example: "थिएटर में स्पॉटलाइट कलाकारों को ट्रैक करते हैं।",
        },
      ],
    },
  },
  gu: {
    nav: {
      logo: "છાયા રચના",
      tabs: {
        learn: "શીખો",
        practice: "અભ્યાસ",
        realWorld: "વાસ્તવિક દુનિયા",
      },
    },
    language: {
      en: "English",
      hi: "हिंदी",
      gu: "ગુજરાતી",
      selectorLabel: "ભાષા પસંદ કરો",
    },
    controls: {
      step: "પગલું",
      of: "નું",
      previous: "અગાઉ",
      next: "આગળ",
      play: "ચલાવો",
      pause: "થોભાવો",
      reset: "રીસેટ",
    },
    shadowSimulator: {
      title: "છાયા બનાવનાર સિમ્યુલેટર",
      subtitle: "વૈજ્ઞાનિકની જેમ પ્રકાશ અને છાયા સાથે ખેલો!",
      objects: {
        title: "તમારી વસ્તુ પસંદ કરો!",
        cat: "બિલાડી કટ-આઉટ",
        superhero: "સુપરહીરો",
        bottle: "પાણીની બોટલ",
        glass: "ફ્રોસ્ટેડ ગ્લાસ",
        paper: "કાગળની શીટ",
        football: "ફૂટબોલ",
        tree: "વૃક્ષ",
        selected: "પસંદ કર્યું! તેને ચારેબાજુ ખેંચો!",
      },
      lightSize: {
        title: "પ્રકાશનું કદ",
        small: "નાનો પ્રકાશ (તીક્ષ્ણ છાયા)",
        large: "મોટો પ્રકાશ (મૃદુ છાયા)",
        smallFeedback: "તીક્ષ્ણ છાયા સક્રિય!",
        largeFeedback: "મૃદુ, ધૂંધળી છાયા મોડ!",
      },
      shadowFacts: {
        title: "છાયા તથ્યો!",
        opaque: "અપારદર્શક વસ્તુઓ = ઘેરી છાયા",
        translucent: "અર્ધ-પારદર્શક વસ્તુઓ = હળવી છાયા",
        transparent: "પારદર્શક વસ્તુઓ = લગભગ કોઈ છાયા નહીં",
        currentObject: {
          opaque: "અપારદર્શક",
          translucent: "અર્ધ-પારદર્શક",
          semiTransparent: "અર્ધ-પારદર્શક",
        },
      },
      controls: {
        showRays: "પ્રકાશ કિરણો બતાવો",
        dragHelper: "છાયા બદલાતી જોવા માટે પ્રકાશ, વસ્તુ અને સ્ક્રીનને ખેંચો!",
        screenLabel: "સ્ક્રીન (મને ખેંચો!)",
        lightLabel: "પ્રકાશ",
        dragObject: "મને ખેંચો!",
      },
      feedback: {
        shadowBig: "વાહ! તમારી છાયા ખૂબ મોટી થઈ ગઈ!",
        shadowTiny: "સારી ચાલ! તમે નાની છાયા બનાવી!",
        shadowShrinking: "નજીક આવી રહ્યા છો! છાયા સંકોચાઈ રહી છે!",
        objectBehindLight: "વસ્તુ પ્રકાશ સ્ત્રોતની પાછળ છે! કોઈ છાયા નહીં.",
        objectBeyondScreen: "વસ્તુ સ્ક્રીનની પાર છે! કોઈ છાયા નહીં.",
      },
      infoBox: {
        title: "શું થઈ રહ્યું છે?",
        hugeShadow: "વિશાળ છાયા! વસ્તુ પ્રકાશની ખૂબ નજીક છે!",
        tinyShadow: "નાની છાયા! વસ્તુ સ્ક્રીનની નજીક છે!",
        normalShadow: "સામાન્ય છાયા કદ! વસ્તુઓને આસપાસ ખસેડવાનો પ્રયાસ કરો!",
        softEdges: "મૃદુ ધાર કારણ કે પ્રકાશ મોટો છે!",
        sharpEdges: "તીક્ષ્ણ ધાર કારણ કે પ્રકાશ નાનો છે!",
        positionObject:
          "તેની છાયા જોવા માટે વસ્તુને પ્રકાશ સ્ત્રોત અને સ્ક્રીન વચ્ચે મૂકો!",
      },
    },
    canvas: {
      intro: {
        title: "શું પ્રકાશ સીધી રેખામાં મુસાફરી કરે છે?",
        questionMark: "?",
      },
      matchbox_setup: {
        instruction: "દરેક માચીસની પેટીમાં એક જ સ્થાને છિદ્ર બનાવો",
        boxLabel: "પેટી",
      },
      matchbox_aligned: {
        message: "સંરેખિત છિદ્રો - પ્રકાશ પસાર થાય છે!",
      },
      matchbox_misaligned: {
        message: "ખોટી સંરેખિત છિદ્રો - પ્રકાશ અવરોધાયો છે!",
      },
      pipe_intro: {
        question: "શું આપણે પાઈપ દ્વારા જોઈ શકીએ છીએ?",
      },
      pipe_straight: {
        message: "સીધી પાઈપ - તમે જ્યોત જોઈ શકો છો!",
      },
      pipe_bent: {
        message: "વળેલી પાઈપ - જ્યોત જોઈ શકતા નથી!",
      },
      conclusion: {
        title: "પ્રકાશ સીધી રેખામાં મુસાફરી કરે છે!",
        subtitle: "બંને પ્રયોગો પ્રકાશના આ મહત્વપૂર્ણ ગુણધર્મની પુષ્ટિ કરે છે",
      },
    },
    practice: {
      title: "🌍 વાસ્તવિક દુનિયામાં છાયાઓ",
      subtitle: "જાણો કે છાયા રચના આપણા દૈનિક જીવનને કેવી રીતે અસર કરે છે",
      scenarios: [
        {
          id: 1,
          title: "છાયા કઠપુતળી પ્રદર્શન",
          situation:
            "પ્રિયા તેના સ્કૂલના સાંસ્કૃતિક કાર્યક્રમ માટે છાયા કઠપુતળી (તોગાળુ ગોમ્બેયાતા) કરી રહી છે. તે જુએ છે કે જ્યારે તે કઠપુતળીને પ્રકાશ સ્ત્રોતની નજીક ખસેડે છે, ત્યારે સ્ક્રીન પર છાયામાં કંઈક રસપ્રદ બનતું હોય છે.",
          question:
            "પ્રિયાએ તેની કઠપુતળીની છાયા સ્ક્રીન પર મોટી દેખાડવા માટે શું કરવું જોઈએ?",
          options: [
            "કઠપુતળીને સ્ક્રીનની નજીક ખસેડો",
            "કઠપુતળીને પ્રકાશ સ્ત્રોતની નજીક ખસેડો",
            "પ્રકાશ સ્ત્રોતને સ્ક્રીનની નજીક ખસેડો",
            "વધુ તેજસ્વી પ્રકાશનો ઉપયોગ કરો",
          ],
          correctAnswer: 1,
          explanation:
            "જ્યારે પ્રિયા કઠપુતળીને પ્રકાશ સ્ત્રોતની નજીક ખસેડે છે (સ્ક્રીનને નિશ્ચિત રાખીને), છાયા મોટી થઈ જાય છે. આ એટલા માટે કારણ કે સ્ત્રોતમાંથી પ્રકાશ કિરણો કઠપુતળીની આસપાસથી પસાર થયા પછી વધુ ફેલાય છે, જે સ્ક્રીન પર મોટી છાયા બનાવે છે. છાયા કઠપુતળી કલાકારો પોતાના પાત્રોના કદને નિયંત્રિત કરવા માટે આ સિદ્ધાંતનો ઉપયોગ કરે છે!",
          realWorldTip:
            "પરંપરાગત ભારતીય છાયા કઠપુતળી ફોર્મ જેવા કે થોલુ બોમ્મલટા (આંધ્ર પ્રદેશ), તોગાળુ ગોમ્બેયાતા (કર્ણાટક), અને રાવણ છાયા (ઓડિશા) સદીઓથી પોતાના પ્રદર્શનોમાં નાટકીય અસરો બનાવવા માટે આ સિદ્ધાંતનો ઉપયોગ કરી રહ્યા છે!",
          imageEmoji: "🎭",
        },
        {
          id: 2,
          title: "સૂર્યાસ્ત પર ક્રિકેટ મેચ",
          situation:
            "રોહન અને તેના મિત્રો સાંજે ક્રિકેટ ખેલી રહ્યા છે. જેમ જેમ સૂર્ય આકાશમાં નીચે આવે છે, રોહન જુએ છે કે જમીન પર તેમની છાયાઓ બપોરે ખેલતી વખતે કરતાં ખૂબ લાંબી થઈ રહી છે.",
          question: "સાંજે છાયાઓ બપોર કરતાં શા માટે લાંબી થઈ જાય છે?",
          options: [
            "સાંજે લોકો લાંબા થઈ જાય છે",
            "સૂર્ય આકાશમાં નીચે છે, જે પ્રકાશનો વિવિધ કોણ બનાવે છે",
            "સાંજે જમીન નરમ થઈ જાય છે",
            "સાંજે હવામાં વધુ ધૂળ હોય છે",
          ],
          correctAnswer: 1,
          explanation:
            "બપોરે, સૂર્ય આકાશમાં ઊંચો હોય છે, લગભગ સીધો ઓવરહેડ. પ્રકાશ ઊંચા કોણ પર પડે છે, જે નાની છાયાઓ બનાવે છે. સાંજે, સૂર્ય આદિક્ષિતિ નજીક નીચે હોય છે. પ્રકાશ નીચા કોણ પર મુસાફરી કરે છે, જેમ કે પ્રિયાની કઠપુતળી જ્યારે પ્રકાશ સ્ત્રોત અલગ રીતે સ્થિત થાય છે ત્યારે મોટી છાયા બનાવે છે. આ જ કારણ છે કે છાયાઓ બપોરે સૌથી ટૂંકી અને સૂર્યોદય અને સૂર્યાસ્ત દરમ્યાન સૌથી લાંબી હોય છે!",
          realWorldTip:
            "આ જ કારણ છે કે ફોટોગ્રાફરો બાહ્ય ફોટોગ્રાફી માટે 'ગોલ્ડન અવર' (સવારે વહેલા અથવા સાંજે મોડા) પસંદ કરે છે - લાંબી, નરમ છાયાઓ ચિત્રોમાં ઊંડાઈ અને નાટક ઉમેરે છે!",
          imageEmoji: "🏏",
        },
        {
          id: 3,
          title: "ટ્રાફિક સિગ્નલ સુરક્ષા",
          situation:
            "કવ્યા જુએ છે કે વ્યસ્ત ટ્રાફિક આંતરછેદ પર, ખૂબ ઊંચી સ્ટ્રીટલાઇટ્સ છે. તેના કાકા સમજાવે છે કે આ લાઇટો છાયાઓ સંબંધિત સારા કારણોસર ઊંચાઈ પર સ્થિત છે.",
          question:
            "ટ્રાફિક આંતરછેદ પર સ્ટ્રીટલાઇટ્સ જમીનથી ઊંચી કેમ મૂકવામાં આવે છે?",
          options: [
            "તેમને વધુ સુશોભિત બનાવવા માટે",
            "રસ્તા પર છાયાઓ ઘટાડવા અને દૃશ્યતા સુધારવા માટે",
            "વીજળી બચાવવા માટે",
            "તેમને નુકસાનથી બચાવવા માટે",
          ],
          correctAnswer: 1,
          explanation:
            "જ્યારે પ્રકાશ સ્ત્રોતો ઊંચાઈ પર મૂકવામાં આવે છે, ત્યારે વસ્તુઓ (વાહનો, ધ્રુવો, અને લોકો જેવી) ની છાયાઓ નાની અને ઓછી પ્રમુખ બને છે. આ રસ્તા પર ડાર્ક પેચો ઘટાડે છે અને બધા રોડ ઉપયોગકર્તાઓ માટે દૃશ્યતા સુધારે છે. જો લાઇટો નીચે મૂકવામાં આવે, તો તે મોટી, ગૂંચવણમાં મૂકનારી છાયાઓ બનાવે જે જોખમો છુપાવી શકે અને ડ્રાઇવિંગને ખતરનાક બનાવી શકે. પ્રકાશ સ્ત્રોતની સ્થિતિ સીધી રીતે છાયાના કદ અને રોડ સુરક્ષાને અસર કરે છે!",
          realWorldTip:
            "આધુનિક સ્ટ્રીટ લાઇટિંગ ડિઝાઇન છાયા રચનાને કાળજીપૂર્વક ધ્યાનમાં લે છે. LED સ્ટ્રીટલાઇટ્સ છાયાઓ ઘટાડવા માટે સ્થિત છે જ્યારે સમાન પ્રકાશ પ્રદાન કરતી વખતે, રાત્રે રસ્તાઓને સુરક્ષિત બનાવે છે!",
          imageEmoji: "🚦",
        },
        {
          id: 4,
          title: "સૌર ગ્રહણ અવલોકન",
          situation:
            "સૌર ગ્રહણ દરમ્યાન, આદિત્યના વિજ્ઞાન શિક્ષકે ગ્રહણને સુરક્ષિત રીતે જોવા માટે પિનહોલ પ્રોજેક્ટર સેટઅપ કર્યો. આદિત્ય સ્ક્રીન પર અર્ધચંદ્રાકાર છબી જુએ છે અને આશ્ચર્ય પામે છે કે આપણે ગ્રહણને સીધું કેમ જોઈ શકતા નથી.",
          question:
            "સૌર ગ્રહણને સીધું જોવું ખતરનાક શા માટે છે, અને પિનહોલ પ્રોજેક્ટર કેવી રીતે મદદ કરે છે?",
          options: [
            "ગ્રહણ હાનિકારક કિરણો બહાર પાડે છે જેને પિનહોલ અવરોધે છે",
            "પિનહોલ ગ્રહણને સુરક્ષિત રીતે મોટું કરે છે",
            "સીધું જોવાથી આંખો નુકસાન થઈ શકે છે; પિનહોલ સ્ક્રીન પર સુરક્ષિત છબી બનાવે છે",
            "પિનહોલ ખોટી ગ્રહણ છબી બનાવે છે",
          ],
          correctAnswer: 2,
          explanation:
            "સૌર ગ્રહણ દરમ્યાન, સૂર્ય હજી પણ ખૂબ તેજસ્વી છે અને જો સીધું જોવામાં આવે તો તમારી આંખોને કાયમી નુકસાન પહોંચાડી શકે છે. પિનહોલ પ્રોજેક્ટર છાયા રચના જેવા જ સિદ્ધાંત પર કામ કરે છે - ગ્રહણમાંથી પ્રકાશ નાના છિદ્રમાંથી પસાર થાય છે અને સ્ક્રીન પર છબી બનાવે છે. આ આપણને સૂર્યને સીધું જોયા વગર ગ્રહણના છાયા પેટર્નને સુરક્ષિત રીતે જોવા માટે પરવાનગી આપે છે. ગ્રહણ દરમ્યાન ચંદ્ર પૃથ્વી પર છાયા પાડી રહ્યો છે!",
          realWorldTip:
            "સૌર ગ્રહણ દરમ્યાન, ખગોળશાસ્ત્રીઓ અને શિક્ષકો સમુદાયોમાં પિનહોલ પ્રોજેક્ટર સેટઅપ કરે છે જેથી લોકોને આ દુર્લભ ખગોળીય ઘટનાને સુરક્ષિત રીતે જોવામાં મદદ મળે. યોગ્ય ઉપકરણ વગર ક્યારેય સીધું સૂર્ય અથવા ગ્રહણ જોવાનું નહીં!",
          imageEmoji: "🌑",
        },
        {
          id: 5,
          title: "પુરાતત્વીય શોધ",
          situation:
            "ડૉ. શર્મા, કર્ણાટકમાં હંપીમાં પુરાતત્વશાસ્ત્રી, પ્રાચીન ચટ્ટાની કોતરણીની ફોટો લેવાની જરૂર છે. તે જુએ છે કે દિવસના ચોક્કસ સમય દરમ્યાન, કોતરણી જોવી અને ફોટોગ્રાફ કરવી ખૂબ સરળ હોય છે.",
          question:
            "વિગતોને સૌથી વધુ દેખાવવા માટે ડૉ. શર્મા માટે ચટ્ટાની કોતરણીની ફોટો લેવાનો શ્રેષ્ઠ સમય ક્યારે હશે?",
          options: [
            "બપોરે જ્યારે સૂર્ય સીધો ઓવરહેડ હોય",
            "સવારે વહેલા અથવા સાંજે મોડા જ્યારે સૂર્ય કોણ પર હોય",
            "રાત્રે ટોર્ચ સાથે",
            "બાદળિયા દિવસે જ્યારે કોઈ સીધી સૂર્યપ્રકાશ ન હોય",
          ],
          correctAnswer: 1,
          explanation:
            "જ્યારે સૂર્ય કોણ પર હોય છે (સવારે વહેલા અથવા સાંજે મોડા), તે ચટ્ટાની કોતરેલી ખાંચો અને વિગતોમાં છાયાઓ બનાવે છે. આ છાયાઓ ત્રિ-પરિમાણીય લક્ષણોને વધુ દ્રશ્ય અને નાટકીય બનાવે છે. બપોરે, જ્યારે સૂર્ય ઓવરહેડ હોય છે, ત્યારે લઘુત્તમ છાયાઓ હોય છે, જે કોતરણીને સપાટ અને જોવા માટે મુશ્કેલ બનાવે છે. આ છાયા રચના જેવો જ સિદ્ધાંત છે - પ્રકાશ સ્ત્રોતની સ્થિતિ અસર કરે છે કે છાયાઓ વિગતોને કેવી રીતે પ્રકટ કરે છે અથવા છુપાવે છે!",
          realWorldTip:
            "પુરાતત્વશાસ્ત્રીઓ, વાસ્તુકારો, અને કલા ઇતિહાસકારો કલાકૃતિઓ અને માળખાનો અભ્યાસ કરવા માટે 'રેકિંગ લાઇટ' (નીચા કોણ પર પ્રકાશ) નો ઉપયોગ કરે છે. આ તકનીક બનાવટ, સાધન નિશાનો, અને ઘસારા પેટર્નને પ્રકટ કરે છે જે અન્યથા અદૃશ્ય હોઈ શકે!",
          imageEmoji: "🏛️",
        },
        {
          id: 6,
          title: "કિસાનો અને સૂર્યઘડિયાળ",
          situation:
            "રાજસ્થાનના એક ગામમાં, વૃદ્ધ કિસાનો હજી પણ પરંપરાગત જ્ઞાનનો ઉપયોગ કરે છે જે દિવસ દરમ્યાન તેમની છાયા લંબાઈને અવલોકન કરીને સમયનો અંદાજ લગાવવા માટે. રમેશના દાદાએ તેને આ પ્રાચીન કૌશલ્ય શીખવ્યું.",
          question:
            "કિસાનો છાયા લંબાઈનો ઉપયોગ કરીને અંદાજિત સમય કેવી રીતે અંદાજી શકે છે?",
          options: [
            "છાયાઓ રેન્ડમ છે અને સમય સૂચવી શકતી નથી",
            "છાયા લંબાઈ અનુમાનિત રીતે બદલાય છે: બપોરે સૌથી ટૂંકી, સવાર/સાંજે લાંબી",
            "છાયાઓ હંમેશા ઉત્તર તરફ નિર્દેશ કરે છે",
            "સમય સાથે છાયાનો રંગ બદલાય છે",
          ],
          correctAnswer: 1,
          explanation:
            "સૂર્યની સ્થિતિ દિવસ દરમ્યાન અનુમાનિત રીતે બદલાય છે. સૂર્યોદય પર, છાયાઓ લાંબી હોય છે અને પશ્ચિમ તરફ નિર્દેશ કરે છે. જેમ જેમ સૂર્ય ઉગે છે, છાયાઓ ટૂંકી થઈ જાય છે અને ફેરવાય છે. બપોરે (સૌર બપોર), છાયાઓ સૌથી ટૂંકી હોય છે અને ઉત્તર તરફ નિર્દેશ કરે છે (કર્ક રેખાના ઉત્તરમાં સ્થાનોમાં જેમ કે મોટાભાગનો ભારત). બપોર પછી, છાયાઓ ફરીથી લંબાઈ પામે છે અને પૂર્વ તરફ નિર્દેશ કરે છે. છાયા રચનાનો આ અનુમાનિત પેટર્ન સદીઓથી સૂર્યઘડિયાળ અને પરંપરાગત સમય રાખવામાં ઉપયોગ કરવામાં આવ્યો છે!",
          realWorldTip:
            "સૂર્યઘડિયાળ માનવતાના સૌથી પ્રાચીન વૈજ્ઞાનિક ઉપકરણોમાંથી એક છે, 5,000 થી વધુ વર્ષોથી ઉપયોગમાં છે! ઘણા પ્રાચીન ભારતીય મંદિરોમાં સૂર્યઘડિયાળ નિશાનો છે. તમે એક લાકડીનો ઉપયોગ કરીને અને સની દિવસે પ્રતિ કલાકે છાયા સ્થિતિઓને ચિહ્નિત કરીને ઘરે એક સરળ સૂર્યઘડિયાળ પણ બનાવી શકો છો!",
          imageEmoji: "🌾",
        },
        {
          id: 7,
          title: "અગ્નિશામકો અને છાયાઓ",
          situation:
            "અગ્નિ સુરક્ષા પ્રદર્શન દરમ્યાન, અગ્નિશામક લક્ષ્મી વિદ્યાર્થીઓને સમજાવે છે કે અગ્નિશામકો કેમ ક્યારેક ધુમાડાથી ભરેલા મકાનોમાં શોધ કરતી વખતે અનેક કોણોમાંથી શક્તિશાળી લાઇટ્સનો ઉપયોગ કરે છે.",
          question:
            "રેસ્ક્યુ ઓપરેશન દરમ્યાન અગ્નિશામકો શા માટે અલગ અલગ કોણોમાંથી અનેક પ્રકાશ સ્ત્રોતોનો ઉપયોગ કરે છે?",
          options: [
            "માત્ર મકાનને વધુ તેજસ્વી બનાવવા માટે",
            "ગૂંચવણમાં મૂકનારી છાયાઓ ઘટાડવા અને અવરોધોને સ્પષ્ટ રીતે જોવા માટે",
            "ધુમાડો દૂર કરવા માટે",
            "અન્ય અગ્નિશામકોને સિગ્નલ આપવા માટે",
          ],
          correctAnswer: 1,
          explanation:
            "એક એક પ્રકાશ સ્ત્રોત મજબૂત છાયાઓ બનાવે છે જે અવરોધો, શિકારો, અથવા જોખમોને છુપાવી શકે છે. જ્યારે પ્રકાશ માત્ર એક દિશામાંથી આવે છે, ત્યારે વસ્તુઓ પ્રકાશને અવરોધે છે અને ડાર્ક છાયા પ્રદેશો બનાવે છે જ્યાં કંઈ જોઈ શકાતું નથી. અલગ અલગ કોણોમાંથી અનેક લાઇટ્સનો ઉપયોગ કરીને, અગ્નિશામકો આ છાયા પ્રદેશોને ઘટાડે છે. જો એક લાઇટ છાયા બનાવે, તો અલગ કોણમાંથી બીજી લાઇટ તેને પ્રકાશિત કરે છે. આ છાયા રચનાની સમજનો વ્યવહારિક ઉપયોગ છે!",
          realWorldTip:
            "ફિલ્મ અને ફોટોગ્રાફી સ્ટુડિયો પણ છાયાઓને નિયંત્રિત કરવા અને ઇચ્છિત અસર બનાવવા માટે અનેક પ્રકાશ સ્ત્રોતો (કી લાઇટ, ફિલ લાઇટ, બેક લાઇટ) નો ઉપયોગ કરે છે. છાયા રચનાની સમજ ઘણા વ્યવસાયોમાં મહત્વપૂર્ણ છે!",
          imageEmoji: "🚒",
        },
        {
          id: 8,
          title: "બિલ્ડિંગ ડિઝાઇન અને છાયાઓ",
          situation:
            "વાસ્તુકાર શ્રીમતી પટેલ બેંગલોરમાં નવી એપાર્ટમેન્ટ બિલ્ડિંગ ડિઝાઇન કરી રહ્યા છે. તેમને બિલ્ડિંગની સ્થિતિ કાળજીપૂર્વક યોજના બનાવવાની જરૂર છે જેથી તે બપોરના કલાકો દરમ્યાન બાળકો ખેલતી વખતે પડોશી પ્લેગ્રાઉન્ડ પર લાંબી છાયાઓ ન પાડે.",
          question:
            "બિલ્ડિંગને સ્થિત કરતી વખતે શ્રીમતી પટેલે છાયા રચના વિશે શું વિચારવું જોઈએ?",
          options: [
            "બિલ્ડિંગ ડિઝાઇનમાં છાયાઓનું મહત્વ નથી",
            "બિલ્ડિંગની ઊંચાઈ, સૂર્યનો પાથ, અને દિવસ દરમ્યાન છાયાની દિશા",
            "માત્ર બિલ્ડિંગનો રંગ છાયાઓને અસર કરે છે",
            "છાયાઓ આખો દિવસ એક જ કદની હોય છે",
          ],
          correctAnswer: 1,
          explanation:
            "બિલ્ડિંગ એક અપારદર્શક વસ્તુ તરીકે કામ કરે છે જે સૂર્યપ્રકાશને અવરોધે છે. ઊંચા બિલ્ડિંગો લાંબી છાયાઓ બનાવે છે. સૂર્યની સ્થિતિ દિવસ દરમ્યાન અને ઋતુઓ દરમ્યાન બદલાય છે - તે ઉનાળામાં ઊંચી હોય છે (ટૂંકી છાયાઓ) અને શિયાળામાં નીચી (લાંબી છાયાઓ). શ્રીમતી પટેલે ગણતરી કરવી જોઈએ કે વિવિધ સમય અને ઋતુઓમાં છાયાઓ ક્યાં પડશે. બેંગલોર જેવી ગરમ આબોહવામાં, છાયાઓ મૂલ્યવાન ઠંડક પ્રદાન કરી શકે છે, પરંતુ પ્લેગ્રાઉન્ડ પ્રકાશને અવરોધવું સુરક્ષા અને ઉપયોગિતાને ઘટાડે છે. આ જ કારણ છે કે ઘણા શહેરોમાં નવા બાંધકામ માટે 'છાયા અસર અભ્યાસ' જરૂરી છે!",
          realWorldTip:
            "આધુનિક ટકાઉ વાસ્તુકલા બિલ્ડિંગ ડિઝાઇનને ઓપ્ટિમાઇઝ કરવા માટે 'છાયા વિશ્લેષણ' સોફ્ટવેરનો ઉપયોગ કરે છે. કેટલીક બિલ્ડિંગો જાણી જોઈને પ્રાકૃતિક ઠંડક માટે છાયાદાર આંગણાં બનાવવા માટે ડિઝાઇન કરવામાં આવે છે, જ્યારે અન્ય દિવસ દરમ્યાન રસપ્રદ વાસ્તુકલા અસરો બનાવવા માટે છાયા પેટર્નનો ઉપયોગ કરે છે!",
          imageEmoji: "🏢",
        },
      ],
      controls: {
        previous: "← અગાઉ",
        checkAnswer: "જવાબ તપાસો",
        nextScenario: "આગળનું પરિદ્રશ્ય →",
        scenarioCount: "પરિદ્રશ્ય {{current}} / {{total}}",
      },
      headers: {
        realWorldSituation: "📖 વાસ્તવિક દુનિયાની પરિસ્થિતિ",
        scientificExplanation: "💡 વૈજ્ઞાનિક સમજૂતી",
        realWorldApplication: "🌍 વાસ્તવિક દુનિયાનો ઉપયોગ",
      },
      progress: {
        title: "📊 તમારી પ્રગતિ",
        completed: "પૂર્ણ પરિદ્રશ્ય:",
        congrats:
          "🎉 અભિનંદન! તમે બધા વાસ્તવિક દુનિયાના પરિદ્રશ્યો પૂર્ણ કર્યા છે!",
      },
      facts: {
        title: "🌟 ભારતના અદ્ભુત છાયા તથ્યો",
        list: [
          "<strong>કોનાર્ક સૂર્ય મંદિર</strong> (ઓડિશા) આ રીતે ડિઝાઇન કરવામાં આવ્યું હતું કે સૂર્યની પહેલી કિરણો તેના મુખ્ય પ્રવેશદ્વાર પર પડે, શાનદાર છાયા પેટર્ન બનાવતી",
          "<strong>જંતર મંતર</strong> વેધશાળાઓ દિલ્હી, જયપુર, અને અન્ય શહેરોમાં વિશાળ છાયા-પ્રક્ષેપણ સાધનો (સૂર્યઘડિયાળ) નો ઉપયોગ અવિશ્વસનીય ચોકસાઈ સાથે સમય અને ખગોળીય સ્થિતિઓને ટ્રેક કરવા માટે કરે છે",
          "પ્રાચીન ભારતીય ગણિતશાસ્ત્રીઓ જેવા કે <strong>આર્યભટ્ટ</strong> (5મી સદી CE) પૃથ્વીની પરિઘ અને આકાશી પિંડોની દૂરીઓની ગણતરી કરવા માટે છાયાઓનો અભ્યાસ કર્યો",
          "ભારતમાં પરંપરાગત <strong>છાયા કઠપુતળી</strong> પ્રદર્શનો ઘણીવાર રાત્રે ચાલે છે, રામાયણ અને મહાભારત જેવા મહાકાવ્યોની વાર્તાઓ ચલતી છાયાઓ દ્વારા કહેવામાં આવે છે",
          "રાજસ્થાનમાં <strong>દિલવાડા મંદિરો</strong> જટિલ સંગમરમર કોતરણી પર દિવસ દરમ્યાન બદલતા છાયા પેટર્ન બનાવવા માટે સ્થિત છે",
        ],
      },
      simulation: {
        title: "🎭 છાયા કઠપુતળી સિમ્યુલેટર",
        show: "સિમ્યુલેશન બતાવો",
        hide: "સિમ્યુલેશન છુપાવો",
        intro:
          "પરંપરાગત ભારતીય છાયા કઠપુતળીમાં છાયાઓ કેવી રીતે બદલાય છે તે જોવા માટે કઠપુતળીને ખસેડવાનો અને પ્રકાશ અંતર સમાયોજિત કરવાનો પ્રયાસ કરો!",
        shadowSize: "છાયાનું કદ",
        large: "મોટું",
        medium: "મધ્યમ",
        small: "નાનું",
        puppetPosLabel: "🎭 કઠપુતળીની સ્થિતિ (પ્રકાશની નજીક = મોટી છાયા)",
        puppetShapeLabel: "કઠપુતળીનું આકાર પસંદ કરો",
        shapes: {
          hand: {
            label: "હાથ",
            emoji: "✋",
          },
          bird: {
            label: "પક્ષી",
            emoji: "🦅",
          },
          dog: {
            label: "કુતરો",
            emoji: "🐕",
          },
        },
        tip: "<strong>💡 આ અજમાવો:</strong> છાયાને મોટી બનાવવા માટે કઠપુતળીને પ્રકાશ સ્ત્રોત (ડાબે) ની નજીક ખસેડો! પરંપરાગત છાયા કઠપુતળી કલાકારો પ્રદર્શન દરમ્યાન પાત્રોને વધવા અથવા સંકોચાવા માટે આ તકનીકનો ઉપયોગ કરે છે.",
      },
    },
    realWorld: {
      title: "વાસ્તવિક દુનિયા એપ્લિકેશન્સ",
      subtitle: "રોજિંદા જીવનમાં પ્રકાશની સીધી-રેખા ગુણધર્મનો ઉપયોગ જાણો",
      searchPlaceholder: "એપ્લિકેશન્સ શોધો...",
      allCategories: "બધી શ્રેણીઓ",
      loading: "એપ્લિકેશન્સ લોડ થઈ રહ્યા છે...",
      example: "ઉદાહરણ:",
      applications: [
        {
          id: 1,
          title: "સબમરીનમાં પેરિસ્કોપ",
          description:
            "સબમરીન પાણીની નીચે રહીને જોવા માટે પેરિસ્કોપનો ઉપયોગ કરે છે.",
          icon: "🔭",
          category: "લશ્કરી",
          example: "બે અરીસાઓ પ્રકાશને પ્રતિબિંબિત કરે છે.",
        },
        {
          id: 2,
          title: "લેસર પોઇન્ટર",
          description: "બાંધકામમાં સીધી રેખાઓ બનાવવા માટે વપરાય છે.",
          icon: "🔦",
          category: "બાંધકામ",
          example: "બાંધકામ કામદારો લેસરનો ઉપયોગ કરે છે.",
        },
        {
          id: 3,
          title: "ફાઇબર ઓપ્ટિક કેબલ્સ",
          description: "ઇન્ટરનેટ ડેટા માટે પ્રકાશનો ઉપયોગ કરે છે.",
          icon: "🌐",
          category: "સંચાર",
          example: "તમારું ઇન્ટરનેટ ફાઇબર ઓપ્ટિક્સનો ઉપયોગ કરે છે.",
        },
        {
          id: 4,
          title: "ટોર્ચ અને સ્પોટલાઇટ્સ",
          description: "કેન્દ્રિત બીમ બનાવે છે.",
          icon: "🔦",
          category: "પ્રકાશ",
          example: "કટોકટી સ્પોટલાઇટ્સનો ઉપયોગ કરે છે.",
        },
        {
          id: 5,
          title: "કેમેરા અને ફોટોગ્રાફી",
          description: "સીધી રેખાઓમાં પ્રકાશનો ઉપયોગ કરે છે.",
          icon: "📷",
          category: "કલા",
          example: "ફોટો લેતી વખતે પ્રકાશ સીધી રેખાઓમાં મુસાફરી કરે છે.",
        },
        {
          id: 6,
          title: "સોલર કૂકર",
          description: "સૂર્યપ્રકાશને કેન્દ્રિત કરે છે.",
          icon: "☀️",
          category: "ઊર્જા",
          example: "સોલર કૂકર સ્વચ્છ રીત પ્રદાન કરે છે.",
        },
        {
          id: 7,
          title: "પડછાયા અને સૂર્યઘડિયાળ",
          description: "પ્રકાશની સીધી રેખા ગતિને કારણે પડછાયા રચાય છે.",
          icon: "🌤️",
          category: "ખગોળશાસ્ત્ર",
          example: "સૂર્યઘડિયાળનો ઉપયોગ હજારો વર્ષોથી થાય છે.",
        },
        {
          id: 8,
          title: "ટ્રાફિક સિગ્નલ્સ",
          description: "સ્પષ્ટ દૃશ્ય માટે સ્થિત છે.",
          icon: "🚦",
          category: "પરિવહન",
          example: "ટ્રાફિક લાઇટ્સ ઊંચી મૂકવામાં આવે છે.",
        },
        {
          id: 9,
          title: "ઓપ્ટિકલ સાધનો",
          description: "માઇક્રોસ્કોપ અને ટેલિસ્કોપ.",
          icon: "🔬",
          category: "વિજ્ઞાન",
          example: "ખગોળશાસ્ત્રીઓ ટેલિસ્કોપનો ઉપયોગ કરે છે.",
        },
        {
          id: 10,
          title: "બારકોડ સ્કેનર્સ",
          description: "ઉત્પાદન કોડ વાંચવા માટે લેસરનો ઉપયોગ કરે છે.",
          icon: "🏪",
          category: "રિટેલ",
          example: "સ્કેનર બારકોડ પર સીધો બીમ મોકલે છે.",
        },
        {
          id: 11,
          title: "તબીબી એન્ડોસ્કોપ",
          description: "શરીરની અંદર જોવા માટે.",
          icon: "🏥",
          category: "તબીબી",
          example: "ડોક્ટર પાતળી નળી દ્વારા પ્રકાશનો ઉપયોગ કરે છે.",
        },
        {
          id: 12,
          title: "સ્ટેજ લાઇટિંગ",
          description: "નાટકીય અસરો બનાવે છે.",
          icon: "🎭",
          category: "મનોરંજન",
          example: "થિયેટરમાં સ્પોટલાઇટ્સ કલાકારોને ટ્રેક કરે છે.",
        },
      ],
    },
  },
};
// Language Context
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tValue: (key: string) => TranslationValue;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>("en");

  const handleSetLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("lightMaterialsLang", lang);
  };

  useEffect(() => {
    const saved = localStorage.getItem("lightMaterialsLang") as Language;
    if (saved && ["en", "hi", "gu"].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: TranslationValue = translations[language];
    for (const k of keys) {
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        value = (value as Record<string, TranslationValue>)[k];
        if (value === undefined) {
          return key;
        }
      } else {
        return key;
      }
    }
    return typeof value === "string" ? value : key;
  };

  const tValue = (key: string): TranslationValue => {
    const keys = key.split(".");
    let value: TranslationValue = translations[language];
    for (const k of keys) {
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        value = (value as Record<string, TranslationValue>)[k];
        if (value === undefined) {
          return key;
        }
      } else {
        return key;
      }
    }
    return value !== undefined ? value : key;
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t, tValue }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};

// Language Selector
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
        aria-label="Select Language"
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="appearance-none bg-white border-2 border-blue-500 rounded-lg px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 pr-6 sm:pr-8 w-40 sm:w-48 md:w-56 text-xs sm:text-sm md:text-base text-blue-700 font-medium cursor-pointer hover:border-teal-500 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-300"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 sm:px-2">
        <svg
          className="fill-current h-3 w-3 sm:h-4 sm:w-4 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

// Default steps data for Topic 11.3
interface LightTravelProps {
  width?: number;
  height?: number;
}

export const LightTravelStraightLine: React.FC<LightTravelProps> = () => {
  const { t } = useLanguage();
  const [lightPos, setLightPos] = useState({ x: 150, y: 150 });
  const [objectPos, setObjectPos] = useState({ x: 400, y: 250 });
  const [screenPos, setScreenPos] = useState(650);
  const [selectedObject, setSelectedObject] = useState("cat");
  const [lightSize, setLightSize] = useState<"small" | "large">("small");
  const [dragging, setDragging] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [showRays, setShowRays] = useState(true);

  const objects: Record<
    string,
    { emoji: string; name: string; opacity: number; color: string }
  > = {
    cat: {
      emoji: "🐱",
      name: t("shadowSimulator.objects.cat"),
      opacity: 1,
      color: "#FF6B9D",
    },
    superhero: {
      emoji: "🦸",
      name: t("shadowSimulator.objects.superhero"),
      opacity: 1,
      color: "#4A90E2",
    },
    bottle: {
      emoji: "🍼",
      name: t("shadowSimulator.objects.bottle"),
      opacity: 0.3,
      color: "#66D9EF",
    },
    glass: {
      emoji: "🧊",
      name: t("shadowSimulator.objects.glass"),
      opacity: 0.5,
      color: "#A8E6CF",
    },
    paper: {
      emoji: "📄",
      name: t("shadowSimulator.objects.paper"),
      opacity: 1,
      color: "#FFE66D",
    },
    football: {
      emoji: "⚽",
      name: t("shadowSimulator.objects.football"),
      opacity: 1,
      color: "#FF6B35",
    },
    tree: {
      emoji: "🌲",
      name: t("shadowSimulator.objects.tree"),
      opacity: 1,
      color: "#2ECC71",
    },
  };

  const currentObject = objects[selectedObject];

  const calculateShadow = () => {
    // Only calculate shadow if object is between light and screen
    if (objectPos.x <= lightPos.x || objectPos.x >= screenPos) {
      return null; // No shadow if object is not between light and screen
    }

    const shadowX = screenPos;
    const distanceToLight = Math.sqrt(
      Math.pow(objectPos.x - lightPos.x, 2) +
        Math.pow(objectPos.y - lightPos.y, 2)
    );
    const distanceToScreen = Math.abs(screenPos - objectPos.x);

    const scale = 1 + (distanceToScreen / distanceToLight) * 2;
    const shadowY =
      lightPos.y +
      (objectPos.y - lightPos.y) *
        ((screenPos - lightPos.x) / (objectPos.x - lightPos.x));

    return {
      x: shadowX,
      y: shadowY,
      scale,
      blur: lightSize === "large" ? 20 : 2,
    };
  };

  const shadow = calculateShadow();

  const giveFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(""), 2500);
  };

  const handleMouseDown = (type: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(type);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (dragging === "light") {
      setLightPos({
        x: Math.max(50, Math.min(300, x)),
        y: Math.max(50, Math.min(450, y)),
      });
    } else if (dragging === "object") {
      // Prevent object from going to the left of the light source
      // Object must stay to the right of the light source (with small margin)
      const minX = lightPos.x + 20; // 20px margin to prevent overlap
      const maxX = screenPos - 50; // Keep some margin from screen
      const newX = Math.max(minX, Math.min(maxX, x));
      const newY = Math.max(50, Math.min(450, y));
      const oldX = objectPos.x;

      setObjectPos({ x: newX, y: newY });

      // Check if object is positioned to cast shadow
      if (newX > lightPos.x && newX < screenPos) {
        if (Math.abs(newX - lightPos.x) < Math.abs(oldX - lightPos.x)) {
          giveFeedback(t("shadowSimulator.feedback.shadowBig"));
        } else if (Math.abs(newX - screenPos) < 80) {
          giveFeedback(t("shadowSimulator.feedback.shadowTiny"));
        }
      } else if (newX >= screenPos) {
        giveFeedback(
          t("shadowSimulator.feedback.objectBeyondScreen") ||
            "Object is beyond the screen! No shadow."
        );
      }
    } else if (dragging === "screen") {
      const newScreen = Math.max(500, Math.min(750, x));
      setScreenPos(newScreen);
      if (newScreen < screenPos) {
        giveFeedback(t("shadowSimulator.feedback.shadowShrinking"));
      }
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const getLightRays = () => {
    const rays: JSX.Element[] = [];
    const numRays = 12;
    const objectSize = 30;

    for (let i = 0; i < numRays; i++) {
      const angle = ((Math.PI * 2) / numRays) * i;
      const rayX = Math.cos(angle) * objectSize + objectPos.x;
      const rayY = Math.sin(angle) * objectSize + objectPos.y;

      // Check if ray is blocked by object
      const dx = rayX - objectPos.x;
      const dy = rayY - objectPos.y;
      const distanceFromObject = Math.sqrt(dx * dx + dy * dy);
      const blocked = distanceFromObject < objectSize;

      // Only draw rays that go towards the screen
      if (!blocked || rayX > objectPos.x) {
        // Calculate where ray hits the screen
        const t = (screenPos - lightPos.x) / (rayX - lightPos.x);
        const screenY = lightPos.y + (rayY - lightPos.y) * t;

        rays.push(
          <line
            key={i}
            x1={lightPos.x}
            y1={lightPos.y}
            x2={rayX > objectPos.x ? screenPos : rayX}
            y2={rayX > objectPos.x ? screenY : rayY}
            stroke={rayX > objectPos.x ? "#FFE66D" : "#FFF176"}
            strokeWidth="1"
            opacity={rayX > objectPos.x ? "0.3" : "0.6"}
            style={{ pointerEvents: "none" }}
          />
        );
      }
    }
    return rays;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Feedback Banner */}
        {feedback && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-lg sm:text-xl font-bold shadow-2xl animate-bounce z-50">
            {feedback}
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Control Panel */}
          <div className="w-full lg:w-80 bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-6 space-y-6 border-2 border-blue-200 shadow-xl">
            <div>
              <h3 className="text-blue-600 font-bold text-lg sm:text-xl mb-3 flex items-center gap-2">
                🎨 {t("shadowSimulator.objects.title")}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(objects).map(([key, obj]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedObject(key);
                      giveFeedback(
                        `${obj.name} ${t("shadowSimulator.objects.selected")}`
                      );
                    }}
                    className={`p-3 sm:p-4 rounded-xl text-3xl sm:text-4xl transition-all transform hover:scale-110 ${
                      selectedObject === key
                        ? "bg-gradient-to-br from-blue-500 to-teal-500 shadow-lg scale-105"
                        : "bg-blue-50 hover:bg-blue-100"
                    }`}
                    style={{
                      borderColor: obj.color,
                      borderWidth: selectedObject === key ? "3px" : "0",
                    }}
                  >
                    {obj.emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-blue-600 font-bold text-lg sm:text-xl mb-3 flex items-center gap-2">
                💡 {t("shadowSimulator.lightSize.title")}
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setLightSize("small");
                    giveFeedback(t("shadowSimulator.lightSize.smallFeedback"));
                  }}
                  className={`w-full p-3 rounded-xl transition-all font-semibold ${
                    lightSize === "small"
                      ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {t("shadowSimulator.lightSize.small")} 🔦
                </button>
                <button
                  onClick={() => {
                    setLightSize("large");
                    giveFeedback(t("shadowSimulator.lightSize.largeFeedback"));
                  }}
                  className={`w-full p-3 rounded-xl transition-all font-semibold ${
                    lightSize === "large"
                      ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {t("shadowSimulator.lightSize.large")} 💡
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-blue-600 font-bold text-lg sm:text-xl mb-3">
                📚 {t("shadowSimulator.shadowFacts.title")}
              </h3>
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-4 text-gray-700 text-sm space-y-2 border-l-4 border-blue-500">
                <p>🔸 {t("shadowSimulator.shadowFacts.opaque")}</p>
                <p>🔹 {t("shadowSimulator.shadowFacts.translucent")}</p>
                <p>🔷 {t("shadowSimulator.shadowFacts.transparent")}</p>
                <p className="mt-3 pt-3 border-t border-blue-200">
                  Current object:{" "}
                  <strong className="text-blue-600">
                    {currentObject.opacity === 1
                      ? t("shadowSimulator.shadowFacts.currentObject.opaque")
                      : currentObject.opacity > 0.5
                      ? t(
                          "shadowSimulator.shadowFacts.currentObject.translucent"
                        )
                      : t(
                          "shadowSimulator.shadowFacts.currentObject.semiTransparent"
                        )}
                  </strong>
                </p>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showRays}
                  onChange={(e) => setShowRays(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <span className="text-gray-700 font-semibold">
                  {t("shadowSimulator.controls.showRays")}
                </span>
              </label>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 bg-gradient-to-br from-blue-900 via-teal-900 to-blue-800 rounded-2xl p-4 sm:p-6 md:p-8 border-4 border-blue-400/30 shadow-2xl">
            <svg
              width="100%"
              height="500"
              className="cursor-default"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ userSelect: "none" }}
            >
              {/* Light Rays */}
              {showRays && getLightRays()}

              {/* Screen */}
              <g
                onMouseDown={(e) => handleMouseDown("screen", e)}
                className="cursor-ew-resize"
                style={{ cursor: "ew-resize" }}
              >
                <rect
                  x={screenPos}
                  y="0"
                  width="10"
                  height="500"
                  fill="#E8E8E8"
                  stroke="#FFD700"
                  strokeWidth="3"
                  className="transition-all"
                />
              </g>

              {/* Shadow - Only render if shadow exists */}
              {shadow && (
                <g style={{ pointerEvents: "none" }}>
                  <text
                    x={shadow.x}
                    y={shadow.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={60 * shadow.scale}
                    style={{
                      filter: `blur(${shadow.blur}px) brightness(0)`,
                      opacity: 0.6 + currentObject.opacity * 0.2,
                    }}
                  >
                    {currentObject.emoji}
                  </text>
                </g>
              )}

              {/* Object */}
              <g
                onMouseDown={(e) => handleMouseDown("object", e)}
                style={{ cursor: "move" }}
              >
                {/* Invisible larger hit area for better dragging */}
                <circle
                  cx={objectPos.x}
                  cy={objectPos.y}
                  r="50"
                  fill="transparent"
                  style={{ cursor: "move" }}
                />

                {/* Emoji */}
                <text
                  x={objectPos.x}
                  y={objectPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="60"
                  style={{
                    filter: `drop-shadow(0 0 8px ${currentObject.color})`,
                    opacity: currentObject.opacity,
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                >
                  {currentObject.emoji}
                </text>
                <text
                  x={objectPos.x}
                  y={objectPos.y - 50}
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {t("shadowSimulator.controls.dragObject")}
                </text>
              </g>

              {/* Light Source */}
              <g
                onMouseDown={(e) => handleMouseDown("light", e)}
                style={{ cursor: "move" }}
              >
                <circle
                  cx={lightPos.x}
                  cy={lightPos.y}
                  r={lightSize === "small" ? "20" : "35"}
                  fill="#FFD700"
                  className="transition-all"
                  style={{ cursor: "move" }}
                />
                <circle
                  cx={lightPos.x}
                  cy={lightPos.y}
                  r={lightSize === "small" ? "30" : "50"}
                  fill="#FFD700"
                  opacity="0.3"
                  className="animate-pulse transition-all"
                  style={{ pointerEvents: "none" }}
                />
                <text
                  x={lightPos.x}
                  y={lightPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="20"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  💡
                </text>
                <text
                  x={lightPos.x - 30}
                  y={lightPos.y - 50}
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {t("shadowSimulator.controls.lightLabel")}
                </text>
              </g>

              {/* Helper Text */}
              {/* This text is moved to the info box below */}
            </svg>

            {/* Info Box */}
            <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white border-l-4 border-blue-400">
              <h4 className="font-bold text-lg mb-2 text-yellow-300">
                🔬 {t("shadowSimulator.infoBox.title")}
              </h4>
              {shadow ? (
                <>
                  <p className="text-sm leading-relaxed">
                    {shadow.scale > 2.5
                      ? t("shadowSimulator.infoBox.hugeShadow")
                      : shadow.scale < 1.3
                      ? t("shadowSimulator.infoBox.tinyShadow")
                      : t("shadowSimulator.infoBox.normalShadow")}
                  </p>
                  <p className="text-sm mt-2 leading-relaxed">
                    {lightSize === "large"
                      ? t("shadowSimulator.infoBox.softEdges")
                      : t("shadowSimulator.infoBox.sharpEdges")}
                  </p>
                </>
              ) : (
                <p className="text-sm leading-relaxed">
                  {t("shadowSimulator.infoBox.positionObject")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface Scenario {
  id: number;
  title: string;
  situation: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  realWorldTip: string;
  imageEmoji: string;
}

// Practice Mode Component
const PracticeMode: React.FC = () => {
  const { t, tValue } = useLanguage();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completedScenarios, setCompletedScenarios] = useState<number[]>([]);

  // Fetch scenarios from translations
  const scenarios =
    (tValue("practice.scenarios") as unknown as Scenario[]) || [];

  const handleAnswerSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setShowExplanation(true);
    if (selectedAnswer === scenarios[currentScenario].correctAnswer) {
      setCompletedScenarios([...completedScenarios, currentScenario]);
    }
  };

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentScenario > 0) {
      setCurrentScenario(currentScenario - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  // Safe access to scenario data
  const currentScenarioData = scenarios[currentScenario];

  if (!currentScenarioData) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#F8F9FA",
      }}
    >
      {/* Scenario Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        {scenarios.map((_, index) => (
          <div
            key={index}
            style={{
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              backgroundColor: completedScenarios.includes(index)
                ? "#27AE60"
                : index === currentScenario
                ? "#2563EB"
                : "#ECF0F1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "16px",
              color:
                index === currentScenario || completedScenarios.includes(index)
                  ? "white"
                  : "#7F8C8D",
              cursor: "pointer",
              transition: "all 0.3s ease",
              border: completedScenarios.includes(index)
                ? "2px solid #27AE60"
                : "2px solid transparent",
            }}
            onClick={() => {
              setCurrentScenario(index);
              setSelectedAnswer(null);
              setShowExplanation(false);
            }}
          >
            {completedScenarios.includes(index) ? "✓" : index + 1}
          </div>
        ))}
      </div>

      {/* Question Card */}
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "15px",
          marginBottom: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {/* Question */}
        <h3
          style={{
            color: "#2C3E50",
            marginBottom: "25px",
            fontSize: "20px",
            lineHeight: "1.6",
          }}
        >
          {currentScenarioData.question}
        </h3>

        {/* Options */}
        <div style={{ marginBottom: "30px" }}>
          {currentScenarioData.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentScenarioData.correctAnswer;
            const showResult = showExplanation;

            let backgroundColor = "white";
            let borderColor = "#BDC3C7";
            let textColor = "#2C3E50";

            if (showResult) {
              if (isCorrect) {
                backgroundColor = "#D5F4E6";
                borderColor = "#27AE60";
                textColor = "#27AE60";
              } else if (isSelected && !isCorrect) {
                backgroundColor = "#FADBD8";
                borderColor = "#E74C3C";
                textColor = "#E74C3C";
              }
            } else if (isSelected) {
              backgroundColor = "#EFF6FF";
              borderColor = "#2563EB";
            }

            return (
              <div
                key={index}
                onClick={() => handleAnswerSelect(index)}
                style={{
                  padding: "16px 20px",
                  marginBottom: "12px",
                  border: `2px solid ${borderColor}`,
                  borderRadius: "10px",
                  cursor: showExplanation ? "default" : "pointer",
                  backgroundColor,
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  color: textColor,
                  fontWeight:
                    isSelected || (showResult && isCorrect) ? "bold" : "normal",
                  transform:
                    isSelected && !showResult ? "scale(1.02)" : "scale(1)",
                  boxShadow:
                    isSelected && !showResult
                      ? "0 4px 8px rgba(37,99,235,0.2)"
                      : "none",
                }}
              >
                <div
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    border: `2px solid ${borderColor}`,
                    backgroundColor: isSelected ? borderColor : "white",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {showResult && isCorrect
                    ? "✓"
                    : showResult && isSelected
                    ? "✗"
                    : String.fromCharCode(65 + index)}
                </div>
                <span style={{ flex: 1, lineHeight: "1.6" }}>{option}</span>
                {showResult && isCorrect && (
                  <span style={{ fontSize: "22px" }}>✓</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "space-between",
            marginTop: "25px",
          }}
        >
          <button
            onClick={handlePrevious}
            disabled={currentScenario === 0}
            style={{
              padding: "12px 25px",
              fontSize: "16px",
              backgroundColor: currentScenario === 0 ? "#ECF0F1" : "#95A5A6",
              color: currentScenario === 0 ? "#BDC3C7" : "white",
              border: "none",
              borderRadius: "8px",
              cursor: currentScenario === 0 ? "not-allowed" : "pointer",
              fontWeight: "bold",
              transition: "all 0.3s ease",
            }}
          >
            {t("practice.controls.previous")}
          </button>

          <div style={{ display: "flex", gap: "15px" }}>
            {!showExplanation ? (
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                style={{
                  padding: "12px 30px",
                  fontSize: "16px",
                  backgroundColor:
                    selectedAnswer === null ? "#BDC3C7" : "#2563EB",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: selectedAnswer === null ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                  transition: "all 0.3s ease",
                }}
              >
                {t("practice.controls.checkAnswer")}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={currentScenario === scenarios.length - 1}
                style={{
                  padding: "12px 30px",
                  fontSize: "16px",
                  backgroundColor:
                    currentScenario === scenarios.length - 1
                      ? "#ECF0F1"
                      : "#27AE60",
                  color:
                    currentScenario === scenarios.length - 1
                      ? "#BDC3C7"
                      : "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor:
                    currentScenario === scenarios.length - 1
                      ? "not-allowed"
                      : "pointer",
                  fontWeight: "bold",
                  transition: "all 0.3s ease",
                }}
              >
                {t("practice.controls.nextScenario")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Real World Applications Component
const RealWorldMode: React.FC = () => {
  const { t, tValue } = useLanguage();

  // Get applications from translations
  const applications: RealWorldApp[] =
    (tValue("realWorld.applications") as unknown as RealWorldApp[]) || [];

  const getMaterialBadgeColor = (type?: string) => {
    switch (type) {
      case "transparent":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "translucent":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "opaque":
        return "bg-gray-100 text-gray-700 border-gray-300";
      case "mixed":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto py-8">
        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 border-2 border-transparent hover:border-blue-400 hover:scale-105 transform duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-6xl">{app.icon}</div>
                <div className="flex flex-col gap-2 items-end">
                  <span className="text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {app.category}
                  </span>
                  {app.materialType && (
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full border ${getMaterialBadgeColor(
                        app.materialType
                      )}`}
                    >
                      {app.materialType.charAt(0).toUpperCase() +
                        app.materialType.slice(1)}
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {app.title}
              </h3>

              <p className="text-gray-600 mb-4 leading-relaxed">
                {app.description}
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">
                    {t("realWorld.example")}{" "}
                  </span>
                  {app.example}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main App Component (internal, uses LanguageProvider)
const MainApp: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>("learn");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-blue-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <ShadowIcon className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                {t("nav.logo")}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("learn")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    activeTab === "learn"
                      ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  {t("nav.tabs.learn")}
                </button>
                <button
                  onClick={() => setActiveTab("practice")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    activeTab === "practice"
                      ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  <ClipboardCheck className="w-5 h-5" />
                  {t("nav.tabs.practice")}
                </button>
                <button
                  onClick={() => setActiveTab("realWorld")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    activeTab === "realWorld"
                      ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  <Globe className="w-5 h-5" />
                  {t("nav.tabs.realWorld")}
                </button>
              </div>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        {activeTab === "learn" ? (
          <LightTravelStraightLine />
        ) : activeTab === "practice" ? (
          <PracticeMode />
        ) : (
          <RealWorldMode />
        )}
      </div>
    </div>
  );
};

// Main App Component with Provider (exported for use in main App.tsx)
export const ShadowFormation: React.FC = () => {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
};
