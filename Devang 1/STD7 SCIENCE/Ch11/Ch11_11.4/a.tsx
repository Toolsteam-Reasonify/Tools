import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  useRef,
  // @ts-ignore - React types resolved by host/bundler
} from "react";

// ═══════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

type ModeType = "learn" | "practice" | "real_world";

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  mode: ModeType;
}

interface ShadowAdditionalProps {
  initialObject?:
    | "cat"
    | "superhero"
    | "bottle"
    | "glass"
    | "paper"
    | "football"
    | "tree";
  lightSize?: "small" | "large";
  showRays?: boolean;
  practiceScenarios?: number[];
  randomizeScenarios?: boolean;
  filterApplications?: string[];
  highlightMaterialType?: "transparent" | "translucent" | "opaque" | "mixed";
  customTheme?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
}

interface ShadowFormationProps {
  props?: {
    width?: number;
    height?: number;
    initialMode?: ModeType;
    showModeSelector?: boolean;
    enabledModes?: ModeType[];
    showNavigation?: boolean;
    showPlayPause?: boolean;
    showStepIndicator?: boolean;
    animationSpeed?: number;
    autoPlayDuration?: number;
    themeColor?: string;
    darkMode?: boolean;
    additionalProps?: ShadowAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

interface RealWorldApp {
  id: number;
  title: string;
  description: string;
  icon: string;
  category: string;
  example: string;
  materialType?: "transparent" | "translucent" | "opaque" | "mixed";
}

type TranslationValue =
  | string
  | string[]
  | number
  | { [key: string]: TranslationValue }
  | Array<{ [key: string]: TranslationValue }>;

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM - Colors from PDF
// ═══════════════════════════════════════════════════════════════════════════

const COLORS = {
  primary: "#4A4DC9",
  secondary: "#FF7212",
  primaryDark: "#533086",
  secondaryLight: "#FC9145",
  primaryLight: "#C1C1EA",
  secondaryLightBg: "#FFF3E4",
  darkGray: "#4E4E4E",
  mediumGray: "#CACACA",
  lightGray: "#EBEBEB",
  ultraLightGray: "#F5F5F5",
  gradient: {
    purple: "linear-gradient(135deg, #533086 0%, #FC9145 100%)",
    primarySecondary: "linear-gradient(135deg, #4A4DC9 0%, #FF7212 100%)",
    lightPurple: "linear-gradient(135deg, #C1C1EA 0%, #FFF3E4 100%)",
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// ICON COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const ShadowIcon: React.FC<{
  className?: string;
  style?: React.CSSProperties;
}> = ({ className, style }) => {
  return (
    <svg
      className={className}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.8" />
      <ellipse
        cx="12"
        cy="16"
        rx="5"
        ry="2"
        fill="currentColor"
        opacity="0.4"
      />
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
ShadowIcon.displayName = "ShadowIcon";

const BookOpen = ({ style }: { style?: React.CSSProperties }) => (
  <svg
    style={style}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const ClipboardCheck = ({ style }: { style?: React.CSSProperties }) => (
  <svg
    style={style}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4" />
  </svg>
);

const Globe = ({ style }: { style?: React.CSSProperties }) => (
  <svg
    style={style}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// TRANSLATION SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

const translations = {
  en: {
    nav: {
      logo: "Shadow Formation",
      tabs: {
        learn: "Learn",
        practice: "Practice",
        realWorld: "Real World",
      },
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
    },
    realWorld: {
      title: "Shadows in Real World",
      example: "Example:",
      applications: [
        {
          id: 1,
          title: "Sundials",
          description: "Ancient clocks that use shadow position to tell time",
          icon: "⏰",
          category: "Time Telling",
          example:
            "Garden sundials track the sun's movement throughout the day",
          materialType: "opaque",
        },
        {
          id: 2,
          title: "Solar Eclipses",
          description: "Moon's shadow on Earth creates this natural phenomenon",
          icon: "🌑",
          category: "Astronomy",
          example: "Total solar eclipse when moon blocks all sunlight",
          materialType: "opaque",
        },
        {
          id: 3,
          title: "Shadow Puppets",
          description: "Creating stories and shapes using hand shadows",
          icon: "🎭",
          category: "Entertainment",
          example: "Making animal shapes with your hands on the wall",
          materialType: "opaque",
        },
        {
          id: 4,
          title: "Photography",
          description: "Photographers use shadows to add depth and drama",
          icon: "📸",
          category: "Art",
          example: "Golden hour photos with long, dramatic shadows",
          materialType: "mixed",
        },
        {
          id: 5,
          title: "Architecture",
          description: "Buildings designed to provide shade in hot climates",
          icon: "🏛️",
          category: "Design",
          example: "Overhanging roofs create cool shaded areas",
          materialType: "opaque",
        },
        {
          id: 6,
          title: "Shadow Art",
          description:
            "Sculptures that create different shadows from different angles",
          icon: "🎨",
          category: "Art",
          example: "3D sculptures revealing hidden images in their shadows",
          materialType: "mixed",
        },
      ],
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// TRANSLATION CONTEXT
// ═══════════════════════════════════════════════════════════════════════════

interface LanguageContextType {
  t: (key: string) => string;
  tValue: (key: string) => TranslationValue;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const LanguageProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const t = (key: string): string => {
    const keys = key.split(".");
    let value: TranslationValue = translations.en;

    for (const k of keys) {
      if (typeof value === "object" && value !== null && k in value) {
        value = (value as Record<string, TranslationValue>)[k];
      } else {
        return key;
      }
    }

    return typeof value === "string" ? value : key;
  };

  const tValue = (key: string): TranslationValue => {
    const keys = key.split(".");
    let value: TranslationValue = translations.en;

    for (const k of keys) {
      if (typeof value === "object" && value !== null && k in value) {
        value = (value as Record<string, TranslationValue>)[k];
      } else {
        return key;
      }
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ t, tValue }}>
      {children}
    </LanguageContext.Provider>
  );
};

const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

interface LightTravelProps {}

// ═══════════════════════════════════════════════════════════════════════════
// LEARN MODE - Light Travel Straight Line Component (REDESIGNED & RESPONSIVE)
// ═══════════════════════════════════════════════════════════════════════════

export const LightTravelStraightLine: React.FC<LightTravelProps> = () => {
  const { t } = useLanguage();
  const svgRef = useRef<SVGSVGElement>(null);
  const [svgDimensions, setSvgDimensions] = useState({
    width: 800,
    height: 500,
  });

  const scale = svgDimensions.width / 800;

  const [lightPos, setLightPos] = useState({ x: 150 * scale, y: 150 * scale });
  const [objectPos, setObjectPos] = useState({
    x: 400 * scale,
    y: 250 * scale,
  });
  const [screenPos, setScreenPos] = useState(650 * scale);
  const [selectedObject, setSelectedObject] = useState("cat");
  const [lightSize, setLightSize] = useState<"small" | "large">("small");
  const [dragging, setDragging] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [showRays, setShowRays] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const container = svgRef.current.parentElement;
        if (container) {
          const width = Math.min(container.clientWidth - 32, 800);
          const height = Math.max(400, Math.min(width * 0.625, 500));
          setSvgDimensions({ width, height });

          const newScale = width / 800;
          setLightPos((prev) => ({
            x: (prev.x / scale) * newScale,
            y: (prev.y / scale) * newScale,
          }));
          setObjectPos((prev) => ({
            x: (prev.x / scale) * newScale,
            y: (prev.y / scale) * newScale,
          }));
          setScreenPos((prev) => (prev / scale) * newScale);
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const objects: Record<
    string,
    { emoji: string; name: string; opacity: number; color: string }
  > = {
    cat: {
      emoji: "🐱",
      name: t("shadowSimulator.objects.cat"),
      opacity: 1,
      color: COLORS.primary,
    },
    superhero: {
      emoji: "🦸",
      name: t("shadowSimulator.objects.superhero"),
      opacity: 1,
      color: COLORS.primaryDark,
    },
    bottle: {
      emoji: "🍼",
      name: t("shadowSimulator.objects.bottle"),
      opacity: 0.3,
      color: COLORS.secondary,
    },
    glass: {
      emoji: "🧊",
      name: t("shadowSimulator.objects.glass"),
      opacity: 0.5,
      color: COLORS.primaryLight,
    },
    paper: {
      emoji: "📄",
      name: t("shadowSimulator.objects.paper"),
      opacity: 1,
      color: COLORS.secondaryLight,
    },
    football: {
      emoji: "⚽",
      name: t("shadowSimulator.objects.football"),
      opacity: 1,
      color: COLORS.secondary,
    },
    tree: {
      emoji: "🌲",
      name: t("shadowSimulator.objects.tree"),
      opacity: 1,
      color: COLORS.primaryDark,
    },
  };

  const currentObject = objects[selectedObject];

  const calculateShadow = () => {
    if (objectPos.x <= lightPos.x || objectPos.x >= screenPos) {
      return null;
    }

    const shadowX = screenPos;
    const distanceToLight = Math.sqrt(
      Math.pow(objectPos.x - lightPos.x, 2) +
        Math.pow(objectPos.y - lightPos.y, 2),
    );
    const distanceToScreen = Math.abs(screenPos - objectPos.x);

    const scale = 1 + (distanceToScreen / distanceToLight) * 1.5;
    const shadowY =
      lightPos.y +
      (objectPos.y - lightPos.y) *
        ((screenPos - lightPos.x) / (objectPos.x - lightPos.x));

    const shadowOpacity = Math.max(0.3, 0.5 + currentObject.opacity * 0.3);

    return {
      x: shadowX,
      y: shadowY,
      scale,
      blur: lightSize === "large" ? 15 : 3,
      opacity: shadowOpacity,
    };
  };

  const shadow = calculateShadow();

  const giveFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(""), 2500);
  };

  const handleMouseDown = (
    type: string,
    e: React.MouseEvent | React.TouchEvent,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(type);
  };

  const handleMouseMove = (
    e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>,
  ) => {
    if (!dragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (dragging === "light") {
      setLightPos({
        x: Math.max(50 * scale, Math.min(300 * scale, x)),
        y: Math.max(50 * scale, Math.min(svgDimensions.height - 50 * scale, y)),
      });
    } else if (dragging === "object") {
      const minX = lightPos.x + 20 * scale;
      const maxX = screenPos - 50 * scale;
      const newX = Math.max(minX, Math.min(maxX, x));
      const newY = Math.max(
        50 * scale,
        Math.min(svgDimensions.height - 50 * scale, y),
      );
      const oldX = objectPos.x;

      setObjectPos({ x: newX, y: newY });

      if (newX > lightPos.x && newX < screenPos) {
        if (Math.abs(newX - lightPos.x) < Math.abs(oldX - lightPos.x)) {
          giveFeedback(t("shadowSimulator.feedback.shadowBig"));
        } else if (Math.abs(newX - screenPos) < 80 * scale) {
          giveFeedback(t("shadowSimulator.feedback.shadowTiny"));
        }
      } else if (newX >= screenPos) {
        giveFeedback(
          t("shadowSimulator.feedback.objectBeyondScreen") ||
            "Object is beyond the screen! No shadow.",
        );
      }
    } else if (dragging === "screen") {
      const newScreen = Math.max(
        500 * scale,
        Math.min(svgDimensions.width - 50 * scale, x),
      );
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
    const rays: React.ReactElement[] = [];
    const numRays = 16;
    const objectSize = 40 * scale;

    for (let i = 0; i < numRays; i++) {
      const angle = ((Math.PI * 2) / numRays) * i;
      const rayX = Math.cos(angle) * objectSize + objectPos.x;
      const rayY = Math.sin(angle) * objectSize + objectPos.y;

      const dx = rayX - objectPos.x;
      const dy = rayY - objectPos.y;
      const distanceFromObject = Math.sqrt(dx * dx + dy * dy);
      const blocked = distanceFromObject < objectSize;

      if (!blocked || rayX > objectPos.x) {
        const t = (screenPos - lightPos.x) / (rayX - lightPos.x);
        const screenY = lightPos.y + (rayY - lightPos.y) * t;

        rays.push(
          <line
            key={i}
            x1={lightPos.x}
            y1={lightPos.y}
            x2={rayX > objectPos.x ? screenPos : rayX}
            y2={rayX > objectPos.x ? screenY : rayY}
            stroke={
              rayX > objectPos.x ? COLORS.secondaryLight : COLORS.secondary
            }
            strokeWidth={2 * scale}
            opacity={rayX > objectPos.x ? "0.4" : "0.7"}
            style={{ pointerEvents: "none" }}
          />,
        );
      }
    }
    return rays;
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: COLORS.gradient.lightPurple,
        padding: "clamp(0.5rem, 2vw, 1.5rem)",
      }}
    >
      <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
        {feedback && (
          <div
            style={{
              position: "fixed",
              top: "5rem",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 50,
              background: COLORS.gradient.primarySecondary,
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "9999px",
              fontSize: "clamp(0.875rem, 2vw, 1.125rem)",
              fontWeight: "bold",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              animation: "bounce 1s infinite",
              maxWidth: "90vw",
              textAlign: "center",
            }}
          >
            {feedback}
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "clamp(1rem, 2vw, 1.5rem)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
              gap: "clamp(1rem, 2vw, 1.5rem)",
            }}
          >
            {/* Control Panel */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "clamp(1rem, 2.5vw, 1.5rem)",
                display: "flex",
                flexDirection: "column",
                gap: "clamp(1rem, 2vw, 1.5rem)",
                border: `2px solid ${COLORS.primaryLight}`,
                boxShadow: "0 4px 12px rgba(74, 77, 201, 0.1)",
              }}
            >
              <div>
                <h3
                  style={{
                    color: COLORS.primary,
                    fontWeight: "bold",
                    fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
                    marginBottom: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  🎨 {t("shadowSimulator.objects.title")}
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(70px, 1fr))",
                    gap: "clamp(0.5rem, 1.5vw, 0.75rem)",
                  }}
                >
                  {Object.entries(objects).map(([key, obj]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedObject(key);
                        giveFeedback(
                          `${obj.name} ${t("shadowSimulator.objects.selected")}`,
                        );
                      }}
                      style={{
                        padding: "clamp(0.75rem, 2vw, 1rem)",
                        borderRadius: "12px",
                        fontSize: "clamp(1.5rem, 4vw, 2rem)",
                        transition: "all 0.3s ease",
                        transform:
                          selectedObject === key ? "scale(1.05)" : "scale(1)",
                        backgroundColor:
                          selectedObject === key
                            ? COLORS.primaryLight
                            : COLORS.ultraLightGray,
                        border:
                          selectedObject === key
                            ? `3px solid ${COLORS.primary}`
                            : "3px solid transparent",
                        cursor: "pointer",
                        boxShadow:
                          selectedObject === key
                            ? `0 4px 12px ${COLORS.primaryLight}`
                            : "none",
                      }}
                      onMouseEnter={(e) => {
                        if (selectedObject !== key) {
                          e.currentTarget.style.backgroundColor =
                            COLORS.lightGray;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedObject !== key) {
                          e.currentTarget.style.backgroundColor =
                            COLORS.ultraLightGray;
                        }
                      }}
                    >
                      {obj.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3
                  style={{
                    color: COLORS.primary,
                    fontWeight: "bold",
                    fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
                    marginBottom: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  💡 {t("shadowSimulator.lightSize.title")}
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  <button
                    onClick={() => {
                      setLightSize("small");
                      giveFeedback(
                        t("shadowSimulator.lightSize.smallFeedback"),
                      );
                    }}
                    style={{
                      width: "100%",
                      padding: "clamp(0.75rem, 2vw, 1rem)",
                      borderRadius: "12px",
                      transition: "all 0.3s ease",
                      fontWeight: "600",
                      fontSize: "clamp(0.875rem, 2vw, 1rem)",
                      cursor: "pointer",
                      border: "none",
                      fontFamily: "Poppins, sans-serif",
                      backgroundColor:
                        lightSize === "small"
                          ? COLORS.primary
                          : COLORS.ultraLightGray,
                      color: lightSize === "small" ? "white" : COLORS.darkGray,
                      boxShadow:
                        lightSize === "small"
                          ? `0 4px 12px ${COLORS.primaryLight}`
                          : "none",
                    }}
                  >
                    {t("shadowSimulator.lightSize.small")} 🔦
                  </button>
                  <button
                    onClick={() => {
                      setLightSize("large");
                      giveFeedback(
                        t("shadowSimulator.lightSize.largeFeedback"),
                      );
                    }}
                    style={{
                      width: "100%",
                      padding: "clamp(0.75rem, 2vw, 1rem)",
                      borderRadius: "12px",
                      transition: "all 0.3s ease",
                      fontWeight: "600",
                      fontSize: "clamp(0.875rem, 2vw, 1rem)",
                      cursor: "pointer",
                      border: "none",
                      fontFamily: "Poppins, sans-serif",
                      backgroundColor:
                        lightSize === "large"
                          ? COLORS.primary
                          : COLORS.ultraLightGray,
                      color: lightSize === "large" ? "white" : COLORS.darkGray,
                      boxShadow:
                        lightSize === "large"
                          ? `0 4px 12px ${COLORS.primaryLight}`
                          : "none",
                    }}
                  >
                    {t("shadowSimulator.lightSize.large")} 💡
                  </button>
                </div>
              </div>

              <div>
                <h3
                  style={{
                    color: COLORS.primary,
                    fontWeight: "bold",
                    fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
                    marginBottom: "0.75rem",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  📚 {t("shadowSimulator.shadowFacts.title")}
                </h3>
                <div
                  style={{
                    background: COLORS.gradient.lightPurple,
                    borderRadius: "12px",
                    padding: "clamp(0.75rem, 2vw, 1rem)",
                    fontSize: "clamp(0.75rem, 1.75vw, 0.875rem)",
                    lineHeight: "1.6",
                    borderLeft: `4px solid ${COLORS.primary}`,
                    color: COLORS.darkGray,
                  }}
                >
                  <p style={{ marginBottom: "0.5rem" }}>
                    🔸 {t("shadowSimulator.shadowFacts.opaque")}
                  </p>
                  <p style={{ marginBottom: "0.5rem" }}>
                    🔹 {t("shadowSimulator.shadowFacts.translucent")}
                  </p>
                  <p style={{ marginBottom: "0.75rem" }}>
                    🔷 {t("shadowSimulator.shadowFacts.transparent")}
                  </p>
                  <p
                    style={{
                      marginTop: "0.75rem",
                      paddingTop: "0.75rem",
                      borderTop: `1px solid ${COLORS.primaryLight}`,
                    }}
                  >
                    Current object:{" "}
                    <strong style={{ color: COLORS.primary }}>
                      {currentObject.opacity === 1
                        ? t("shadowSimulator.shadowFacts.currentObject.opaque")
                        : currentObject.opacity > 0.5
                          ? t(
                              "shadowSimulator.shadowFacts.currentObject.translucent",
                            )
                          : t(
                              "shadowSimulator.shadowFacts.currentObject.semiTransparent",
                            )}
                    </strong>
                  </p>
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={showRays}
                    onChange={(e) => setShowRays(e.target.checked)}
                    style={{
                      width: "clamp(1rem, 2vw, 1.25rem)",
                      height: "clamp(1rem, 2vw, 1.25rem)",
                      accentColor: COLORS.primary,
                      cursor: "pointer",
                    }}
                  />
                  <span
                    style={{
                      color: COLORS.darkGray,
                      fontWeight: "600",
                      fontSize: "clamp(0.875rem, 2vw, 1rem)",
                    }}
                  >
                    {t("shadowSimulator.controls.showRays")}
                  </span>
                </label>
              </div>
            </div>

            {/* Canvas Area */}
            <div
              style={{
                background: COLORS.gradient.purple,
                borderRadius: "16px",
                padding: "clamp(1rem, 2.5vw, 1.5rem)",
                border: `3px solid ${COLORS.primaryLight}`,
                boxShadow: "0 8px 24px rgba(83, 48, 134, 0.15)",
                gridColumn: "1 / -1",
              }}
            >
              <svg
                ref={svgRef}
                width="100%"
                height={svgDimensions.height}
                viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
                style={{
                  cursor: "default",
                  touchAction: "none",
                  userSelect: "none",
                  maxWidth: "100%",
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
              >
                {showRays && getLightRays()}

                <g
                  onMouseDown={(e) => handleMouseDown("screen", e)}
                  onTouchStart={(e) => handleMouseDown("screen", e)}
                  style={{ cursor: "ew-resize" }}
                >
                  <rect
                    x={screenPos}
                    y="0"
                    width={10 * scale}
                    height={svgDimensions.height}
                    fill={COLORS.ultraLightGray}
                    stroke={COLORS.secondary}
                    strokeWidth={4 * scale}
                    rx={2 * scale}
                  />
                  <text
                    x={screenPos + 15 * scale}
                    y={30 * scale}
                    fill={COLORS.secondary}
                    fontSize={14 * scale}
                    fontWeight="bold"
                    fontFamily="Poppins, sans-serif"
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {t("shadowSimulator.controls.screenLabel")}
                  </text>
                </g>

                {shadow && (
                  <g style={{ pointerEvents: "none" }}>
                    <ellipse
                      cx={shadow.x - 5 * scale}
                      cy={shadow.y}
                      rx={35 * shadow.scale * scale}
                      ry={25 * shadow.scale * scale}
                      fill="rgba(78, 78, 78, 0.4)"
                      filter={`blur(${shadow.blur * scale}px)`}
                    />
                    <text
                      x={shadow.x - 5 * scale}
                      y={shadow.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={60 * shadow.scale * scale}
                      fill={COLORS.darkGray}
                      opacity={shadow.opacity}
                      filter={`blur(${shadow.blur * scale}px) brightness(0.2)`}
                      style={{
                        textShadow: "0 0 10px rgba(78, 78, 78, 0.5)",
                      }}
                    >
                      {currentObject.emoji}
                    </text>
                  </g>
                )}

                <g
                  onMouseDown={(e) => handleMouseDown("object", e)}
                  onTouchStart={(e) => handleMouseDown("object", e)}
                  style={{ cursor: "move" }}
                >
                  <circle
                    cx={objectPos.x}
                    cy={objectPos.y}
                    r={50 * scale}
                    fill="transparent"
                    style={{ cursor: "move" }}
                  />

                  <text
                    x={objectPos.x}
                    y={objectPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={60 * scale}
                    style={{
                      filter: `drop-shadow(0 0 ${8 * scale}px ${currentObject.color})`,
                      opacity: currentObject.opacity,
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  >
                    {currentObject.emoji}
                  </text>
                  <text
                    x={objectPos.x}
                    y={objectPos.y - 50 * scale}
                    fill="white"
                    fontSize={12 * scale}
                    fontWeight="bold"
                    fontFamily="Poppins, sans-serif"
                    textAnchor="middle"
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {t("shadowSimulator.controls.dragObject")}
                  </text>
                </g>

                <g
                  onMouseDown={(e) => handleMouseDown("light", e)}
                  onTouchStart={(e) => handleMouseDown("light", e)}
                  style={{ cursor: "move" }}
                >
                  <circle
                    cx={lightPos.x}
                    cy={lightPos.y}
                    r={(lightSize === "small" ? 20 : 35) * scale}
                    fill={COLORS.secondary}
                    style={{ cursor: "move" }}
                  />
                  <circle
                    cx={lightPos.x}
                    cy={lightPos.y}
                    r={(lightSize === "small" ? 30 : 50) * scale}
                    fill={COLORS.secondary}
                    opacity="0.3"
                    style={{
                      pointerEvents: "none",
                      animation:
                        "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                    }}
                  />
                  <text
                    x={lightPos.x}
                    y={lightPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={20 * scale}
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    💡
                  </text>
                  <text
                    x={lightPos.x - 30 * scale}
                    y={lightPos.y - 50 * scale}
                    fill="white"
                    fontSize={12 * scale}
                    fontWeight="bold"
                    fontFamily="Poppins, sans-serif"
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {t("shadowSimulator.controls.lightLabel")}
                  </text>
                </g>
              </svg>

              <div
                style={{
                  marginTop: "clamp(0.75rem, 2vw, 1rem)",
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "12px",
                  padding: "clamp(0.75rem, 2vw, 1rem)",
                  color: "white",
                  borderLeft: `4px solid ${COLORS.secondaryLight}`,
                }}
              >
                <h4
                  style={{
                    fontWeight: "bold",
                    fontSize: "clamp(1rem, 2.5vw, 1.125rem)",
                    marginBottom: "0.5rem",
                    color: COLORS.secondaryLightBg,
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  🔬 {t("shadowSimulator.infoBox.title")}
                </h4>
                {shadow ? (
                  <>
                    <p
                      style={{
                        fontSize: "clamp(0.8125rem, 2vw, 0.9375rem)",
                        lineHeight: "1.6",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {shadow.scale > 2.5
                        ? t("shadowSimulator.infoBox.hugeShadow")
                        : shadow.scale < 1.3
                          ? t("shadowSimulator.infoBox.tinyShadow")
                          : t("shadowSimulator.infoBox.normalShadow")}
                    </p>
                    <p
                      style={{
                        fontSize: "clamp(0.8125rem, 2vw, 0.9375rem)",
                        lineHeight: "1.6",
                      }}
                    >
                      {lightSize === "large"
                        ? t("shadowSimulator.infoBox.softEdges")
                        : t("shadowSimulator.infoBox.sharpEdges")}
                    </p>
                  </>
                ) : (
                  <p
                    style={{
                      fontSize: "clamp(0.8125rem, 2vw, 0.9375rem)",
                      lineHeight: "1.6",
                    }}
                  >
                    {t("shadowSimulator.infoBox.positionObject")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateX(-50%) translateY(-5px); }
            50% { transform: translateX(-50%) translateY(0); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
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

// ═══════════════════════════════════════════════════════════════════════════
// PRACTICE MODE Component (REDESIGNED & RESPONSIVE)
// ═══════════════════════════════════════════════════════════════════════════

const PracticeMode: React.FC = () => {
  const { t, tValue } = useLanguage();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completedScenarios, setCompletedScenarios] = useState<number[]>([]);

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

  const currentScenarioData = scenarios[currentScenario];

  if (!currentScenarioData) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "clamp(1rem, 3vw, 1.5rem)",
        fontFamily: "Poppins, sans-serif",
        background: COLORS.gradient.lightPurple,
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "clamp(0.5rem, 1.5vw, 0.75rem)",
          marginBottom: "clamp(1.25rem, 4vw, 2rem)",
          flexWrap: "wrap",
          padding: "0.75rem",
        }}
      >
        {scenarios.map((_, index) => (
          <div
            key={index}
            style={{
              width: "clamp(2rem, 5vw, 2.5rem)",
              height: "clamp(2rem, 5vw, 2.5rem)",
              borderRadius: "50%",
              backgroundColor: completedScenarios.includes(index)
                ? COLORS.primaryDark
                : index === currentScenario
                  ? COLORS.primary
                  : COLORS.lightGray,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
              color:
                index === currentScenario || completedScenarios.includes(index)
                  ? "white"
                  : COLORS.darkGray,
              cursor: "pointer",
              transition: "all 0.3s ease",
              border: completedScenarios.includes(index)
                ? `2px solid ${COLORS.primaryDark}`
                : index === currentScenario
                  ? `2px solid ${COLORS.primary}`
                  : "2px solid transparent",
              boxShadow:
                index === currentScenario
                  ? `0 4px 12px ${COLORS.primaryLight}`
                  : "none",
            }}
            onClick={() => {
              setCurrentScenario(index);
              setSelectedAnswer(null);
              setShowExplanation(false);
            }}
            onMouseEnter={(e) => {
              if (
                index !== currentScenario &&
                !completedScenarios.includes(index)
              ) {
                e.currentTarget.style.transform = "scale(1.1)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {completedScenarios.includes(index) ? "✓" : index + 1}
          </div>
        ))}
      </div>

      <div
        style={{
          backgroundColor: "white",
          padding: "clamp(1.25rem, 4vw, 2rem)",
          borderRadius: "16px",
          marginBottom: "1.25rem",
          boxShadow: "0 4px 12px rgba(74, 77, 201, 0.1)",
          border: `2px solid ${COLORS.primaryLight}`,
        }}
      >
        <div
          style={{
            fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
            fontWeight: "bold",
            color: COLORS.primary,
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <span style={{ fontSize: "clamp(1.75rem, 4vw, 2rem)" }}>
            {currentScenarioData.imageEmoji}
          </span>
          {currentScenarioData.title}
        </div>

        <div
          style={{
            background: COLORS.gradient.lightPurple,
            padding: "clamp(1rem, 3vw, 1.25rem)",
            borderRadius: "12px",
            marginBottom: "clamp(1.25rem, 3vw, 1.5rem)",
            borderLeft: `4px solid ${COLORS.primary}`,
            fontSize: "clamp(0.9375rem, 2vw, 1rem)",
            lineHeight: "1.6",
            color: COLORS.darkGray,
          }}
        >
          {currentScenarioData.situation}
        </div>

        <h3
          style={{
            color: COLORS.primaryDark,
            marginBottom: "clamp(1.25rem, 3vw, 1.5rem)",
            fontSize: "clamp(1.0625rem, 2.5vw, 1.25rem)",
            lineHeight: "1.6",
            fontWeight: "600",
          }}
        >
          {currentScenarioData.question}
        </h3>

        <div style={{ marginBottom: "clamp(1.25rem, 4vw, 1.75rem)" }}>
          {currentScenarioData.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentScenarioData.correctAnswer;
            const showResult = showExplanation;

            let backgroundColor = "white";
            let borderColor = COLORS.mediumGray;
            let textColor = COLORS.darkGray;

            if (showResult) {
              if (isCorrect) {
                backgroundColor = COLORS.secondaryLightBg;
                borderColor = COLORS.secondaryLight;
                textColor = COLORS.primaryDark;
              } else if (isSelected && !isCorrect) {
                backgroundColor = "#FFE5E5";
                borderColor = "#E74C3C";
                textColor = "#E74C3C";
              }
            } else if (isSelected) {
              backgroundColor = COLORS.primaryLight;
              borderColor = COLORS.primary;
              textColor = COLORS.primary;
            }

            return (
              <div
                key={index}
                onClick={() => handleAnswerSelect(index)}
                style={{
                  padding:
                    "clamp(0.875rem, 2.5vw, 1.125rem) clamp(1rem, 3vw, 1.25rem)",
                  marginBottom: "clamp(0.75rem, 2vw, 1rem)",
                  border: `2px solid ${borderColor}`,
                  borderRadius: "12px",
                  cursor: showExplanation ? "default" : "pointer",
                  backgroundColor,
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "clamp(0.75rem, 2vw, 1rem)",
                  color: textColor,
                  fontWeight:
                    isSelected || (showResult && isCorrect) ? "600" : "normal",
                  transform:
                    isSelected && !showResult ? "scale(1.02)" : "scale(1)",
                  boxShadow:
                    isSelected && !showResult
                      ? `0 4px 12px ${COLORS.primaryLight}`
                      : "none",
                  fontSize: "clamp(0.9375rem, 2vw, 1rem)",
                }}
                onMouseEnter={(e) => {
                  if (!showExplanation && !isSelected) {
                    e.currentTarget.style.backgroundColor =
                      COLORS.ultraLightGray;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!showExplanation && !isSelected) {
                    e.currentTarget.style.backgroundColor = "white";
                  }
                }}
              >
                <div
                  style={{
                    width: "clamp(1.5rem, 4vw, 1.75rem)",
                    height: "clamp(1.5rem, 4vw, 1.75rem)",
                    borderRadius: "50%",
                    border: `2px solid ${borderColor}`,
                    backgroundColor:
                      isSelected || (showResult && isCorrect)
                        ? borderColor
                        : "white",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "clamp(0.8125rem, 2vw, 0.9375rem)",
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
                  <span style={{ fontSize: "clamp(1.25rem, 3vw, 1.5rem)" }}>
                    ✓
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {showExplanation && (
          <div
            style={{
              backgroundColor:
                selectedAnswer === currentScenarioData.correctAnswer
                  ? COLORS.secondaryLightBg
                  : "#FFE5E5",
              padding: "clamp(1.25rem, 3vw, 1.5rem)",
              borderRadius: "12px",
              marginBottom: "clamp(1.25rem, 3vw, 1.5rem)",
              borderLeft: `4px solid ${selectedAnswer === currentScenarioData.correctAnswer ? COLORS.secondaryLight : "#E74C3C"}`,
            }}
          >
            <h4
              style={{
                fontSize: "clamp(1.0625rem, 2.5vw, 1.1875rem)",
                fontWeight: "bold",
                marginBottom: "0.75rem",
                color:
                  selectedAnswer === currentScenarioData.correctAnswer
                    ? COLORS.primaryDark
                    : "#E74C3C",
              }}
            >
              {selectedAnswer === currentScenarioData.correctAnswer
                ? "✓ Correct!"
                : "✗ Incorrect"}
            </h4>
            <p
              style={{
                fontSize: "clamp(0.9375rem, 2vw, 1rem)",
                lineHeight: "1.6",
                marginBottom: "1rem",
                color: COLORS.darkGray,
              }}
            >
              {currentScenarioData.explanation}
            </p>
            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.6)",
                padding: "clamp(1rem, 2.5vw, 1.25rem)",
                borderRadius: "10px",
              }}
            >
              <strong
                style={{
                  fontSize: "clamp(0.9375rem, 2vw, 1rem)",
                  color: COLORS.primaryDark,
                }}
              >
                💡 Real World Tip:{" "}
              </strong>
              <span
                style={{
                  fontSize: "clamp(0.9375rem, 2vw, 1rem)",
                  lineHeight: "1.6",
                  color: COLORS.darkGray,
                }}
              >
                {currentScenarioData.realWorldTip}
              </span>
            </div>
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "clamp(0.75rem, 2vw, 1rem)",
            justifyContent: "space-between",
            marginTop: "clamp(1.25rem, 3vw, 1.75rem)",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={handlePrevious}
            disabled={currentScenario === 0}
            style={{
              padding:
                "clamp(0.75rem, 2vw, 0.875rem) clamp(1.25rem, 3vw, 1.75rem)",
              fontSize: "clamp(0.9375rem, 2vw, 1rem)",
              backgroundColor:
                currentScenario === 0 ? COLORS.lightGray : COLORS.mediumGray,
              color:
                currentScenario === 0 ? COLORS.mediumGray : COLORS.darkGray,
              border: "none",
              borderRadius: "12px",
              cursor: currentScenario === 0 ? "not-allowed" : "pointer",
              fontWeight: "600",
              transition: "all 0.3s ease",
              flex: "1 1 auto",
              minWidth: "100px",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            {t("practice.controls.previous")}
          </button>

          <div
            style={{
              display: "flex",
              gap: "clamp(0.75rem, 2vw, 1rem)",
              flex: "1 1 auto",
              justifyContent: "flex-end",
            }}
          >
            {!showExplanation ? (
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                style={{
                  padding:
                    "clamp(0.75rem, 2vw, 0.875rem) clamp(1.5rem, 4vw, 2rem)",
                  fontSize: "clamp(0.9375rem, 2vw, 1rem)",
                  backgroundColor:
                    selectedAnswer === null
                      ? COLORS.mediumGray
                      : COLORS.primary,
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  cursor: selectedAnswer === null ? "not-allowed" : "pointer",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  flex: "1 1 auto",
                  minWidth: "120px",
                  fontFamily: "Poppins, sans-serif",
                  boxShadow:
                    selectedAnswer !== null
                      ? `0 4px 12px ${COLORS.primaryLight}`
                      : "none",
                }}
                onMouseEnter={(e) => {
                  if (selectedAnswer !== null) {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                {t("practice.controls.checkAnswer")}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={currentScenario === scenarios.length - 1}
                style={{
                  padding:
                    "clamp(0.75rem, 2vw, 0.875rem) clamp(1.5rem, 4vw, 2rem)",
                  fontSize: "clamp(0.9375rem, 2vw, 1rem)",
                  backgroundColor:
                    currentScenario === scenarios.length - 1
                      ? COLORS.lightGray
                      : COLORS.primaryDark,
                  color:
                    currentScenario === scenarios.length - 1
                      ? COLORS.mediumGray
                      : "white",
                  border: "none",
                  borderRadius: "12px",
                  cursor:
                    currentScenario === scenarios.length - 1
                      ? "not-allowed"
                      : "pointer",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  flex: "1 1 auto",
                  minWidth: "120px",
                  fontFamily: "Poppins, sans-serif",
                  boxShadow:
                    currentScenario !== scenarios.length - 1
                      ? `0 4px 12px rgba(83, 48, 134, 0.3)`
                      : "none",
                }}
                onMouseEnter={(e) => {
                  if (currentScenario !== scenarios.length - 1) {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
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

// ═══════════════════════════════════════════════════════════════════════════
// REAL WORLD MODE Component (REDESIGNED & RESPONSIVE)
// ═══════════════════════════════════════════════════════════════════════════

const RealWorldMode: React.FC = () => {
  const { t, tValue } = useLanguage();
  const applications: RealWorldApp[] =
    (tValue("realWorld.applications") as unknown as RealWorldApp[]) || [];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.gradient.lightPurple,
        padding: "clamp(1rem, 3vw, 2rem)",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "clamp(1rem, 2vw, 1.5rem)",
          }}
        >
          {applications.map((app) => (
            <div
              key={app.id}
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "clamp(1.25rem, 2.5vw, 1.75rem)",
                boxShadow: "0 4px 12px rgba(74, 77, 201, 0.1)",
                transition: "all 0.3s ease",
                border: `2px solid ${COLORS.primaryLight}`,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = `0 12px 24px ${COLORS.primaryLight}`;
                e.currentTarget.style.borderColor = COLORS.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(74, 77, 201, 0.1)";
                e.currentTarget.style.borderColor = COLORS.primaryLight;
              }}
            >
              <div
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 3rem)",
                  marginBottom: "1rem",
                  textAlign: "center",
                }}
              >
                {app.icon}
              </div>
              <h3
                style={{
                  fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)",
                  fontWeight: "bold",
                  marginBottom: "0.75rem",
                  color: COLORS.primary,
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                {app.title}
              </h3>
              <p
                style={{
                  color: COLORS.darkGray,
                  marginBottom: "1rem",
                  fontSize: "clamp(0.9375rem, 2vw, 1rem)",
                  lineHeight: "1.6",
                }}
              >
                {app.description}
              </p>
              <div
                style={{
                  background: COLORS.gradient.lightPurple,
                  padding: "clamp(0.875rem, 2vw, 1.125rem)",
                  borderRadius: "10px",
                  borderLeft: `4px solid ${COLORS.secondary}`,
                }}
              >
                <p
                  style={{
                    fontSize: "clamp(0.875rem, 1.75vw, 0.9375rem)",
                    color: COLORS.darkGray,
                    lineHeight: "1.6",
                  }}
                >
                  <strong style={{ color: COLORS.primaryDark }}>
                    {t("realWorld.example")}{" "}
                  </strong>
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

// Main App Component
const MainApp: React.FC<ShadowFormationProps> = ({
  props: propsIn,
}: ShadowFormationProps) => {
  const { t } = useLanguage();
  const props = (propsIn ?? {}) as NonNullable<ShadowFormationProps["props"]>;

  const {
    initialMode = "learn",
    showModeSelector = true,
    enabledModes = ["learn", "practice", "real_world"],
    themeColor = COLORS.primary,
  } = props;

  const [activeTab, setActiveTab] = useState<ModeType>(initialMode);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isModeEnabled = (mode: ModeType) => enabledModes.includes(mode);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.gradient.lightPurple,
      }}
    >
      {showModeSelector && (
        <nav
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            backgroundColor: "white",
            borderBottom: `2px solid ${COLORS.primaryLight}`,
            boxShadow: "0 2px 8px rgba(74, 77, 201, 0.1)",
          }}
        >
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "0 clamp(0.75rem, 2vw, 1rem)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: "clamp(3.75rem, 10vw, 4.5rem)",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  flex: "0 1 auto",
                }}
              >
                <ShadowIcon
                  style={{
                    width: "clamp(1.5rem, 3vw, 2rem)",
                    height: "clamp(1.5rem, 3vw, 2rem)",
                    color: themeColor,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: "clamp(1.125rem, 2.5vw, 1.5rem)",
                    fontWeight: "bold",
                    background: COLORS.gradient.primarySecondary,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {t("nav.logo")}
                </span>
              </div>

              {/* Desktop Menu */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "clamp(0.5rem, 1vw, 0.75rem)",
                }}
                className="hidden sm:flex"
              >
                {isModeEnabled("learn") && (
                  <button
                    onClick={() => setActiveTab("learn")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding:
                        "clamp(0.5rem, 1.5vw, 0.75rem) clamp(1rem, 2vw, 1.5rem)",
                      borderRadius: "12px",
                      fontWeight: "600",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      fontSize: "clamp(0.9375rem, 1.75vw, 1rem)",
                      whiteSpace: "nowrap",
                      fontFamily: "Poppins, sans-serif",
                      ...(activeTab === "learn"
                        ? {
                            background: COLORS.primary,
                            color: "white",
                            boxShadow: `0 4px 12px ${COLORS.primaryLight}`,
                          }
                        : {
                            backgroundColor: "transparent",
                            color: COLORS.darkGray,
                          }),
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== "learn") {
                        e.currentTarget.style.backgroundColor =
                          COLORS.ultraLightGray;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== "learn") {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <BookOpen
                      style={{
                        width: "clamp(1.125rem, 2vw, 1.5rem)",
                        height: "clamp(1.125rem, 2vw, 1.5rem)",
                        flexShrink: 0,
                      }}
                    />
                    <span className="hidden md:inline">
                      {t("nav.tabs.learn")}
                    </span>
                  </button>
                )}
                {isModeEnabled("practice") && (
                  <button
                    onClick={() => setActiveTab("practice")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding:
                        "clamp(0.5rem, 1.5vw, 0.75rem) clamp(1rem, 2vw, 1.5rem)",
                      borderRadius: "12px",
                      fontWeight: "600",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      fontSize: "clamp(0.9375rem, 1.75vw, 1rem)",
                      whiteSpace: "nowrap",
                      fontFamily: "Poppins, sans-serif",
                      ...(activeTab === "practice"
                        ? {
                            background: COLORS.primary,
                            color: "white",
                            boxShadow: `0 4px 12px ${COLORS.primaryLight}`,
                          }
                        : {
                            backgroundColor: "transparent",
                            color: COLORS.darkGray,
                          }),
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== "practice") {
                        e.currentTarget.style.backgroundColor =
                          COLORS.ultraLightGray;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== "practice") {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <ClipboardCheck
                      style={{
                        width: "clamp(1.125rem, 2vw, 1.5rem)",
                        height: "clamp(1.125rem, 2vw, 1.5rem)",
                        flexShrink: 0,
                      }}
                    />
                    <span className="hidden md:inline">
                      {t("nav.tabs.practice")}
                    </span>
                  </button>
                )}
                {isModeEnabled("real_world") && (
                  <button
                    onClick={() => setActiveTab("real_world")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding:
                        "clamp(0.5rem, 1.5vw, 0.75rem) clamp(1rem, 2vw, 1.5rem)",
                      borderRadius: "12px",
                      fontWeight: "600",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      fontSize: "clamp(0.9375rem, 1.75vw, 1rem)",
                      whiteSpace: "nowrap",
                      fontFamily: "Poppins, sans-serif",
                      ...(activeTab === "real_world"
                        ? {
                            background: COLORS.primary,
                            color: "white",
                            boxShadow: `0 4px 12px ${COLORS.primaryLight}`,
                          }
                        : {
                            backgroundColor: "transparent",
                            color: COLORS.darkGray,
                          }),
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== "real_world") {
                        e.currentTarget.style.backgroundColor =
                          COLORS.ultraLightGray;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== "real_world") {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <Globe
                      style={{
                        width: "clamp(1.125rem, 2vw, 1.5rem)",
                        height: "clamp(1.125rem, 2vw, 1.5rem)",
                        flexShrink: 0,
                      }}
                    />
                    <span className="hidden md:inline">
                      {t("nav.tabs.realWorld")}
                    </span>
                  </button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden"
                style={{
                  padding: "0.5rem",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "2px",
                      backgroundColor: COLORS.primary,
                      borderRadius: "2px",
                    }}
                  />
                  <div
                    style={{
                      width: "24px",
                      height: "2px",
                      backgroundColor: COLORS.primary,
                      borderRadius: "2px",
                    }}
                  />
                  <div
                    style={{
                      width: "24px",
                      height: "2px",
                      backgroundColor: COLORS.primary,
                      borderRadius: "2px",
                    }}
                  />
                </div>
              </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div
                className="sm:hidden"
                style={{
                  paddingBottom: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {isModeEnabled("learn") && (
                  <button
                    onClick={() => {
                      setActiveTab("learn");
                      setIsMobileMenuOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.875rem 1rem",
                      borderRadius: "12px",
                      fontWeight: "600",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      fontSize: "1rem",
                      width: "100%",
                      fontFamily: "Poppins, sans-serif",
                      ...(activeTab === "learn"
                        ? {
                            background: COLORS.primary,
                            color: "white",
                          }
                        : {
                            backgroundColor: COLORS.ultraLightGray,
                            color: COLORS.darkGray,
                          }),
                    }}
                  >
                    <BookOpen style={{ width: "1.25rem", height: "1.25rem" }} />
                    {t("nav.tabs.learn")}
                  </button>
                )}
                {isModeEnabled("practice") && (
                  <button
                    onClick={() => {
                      setActiveTab("practice");
                      setIsMobileMenuOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.875rem 1rem",
                      borderRadius: "12px",
                      fontWeight: "600",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      fontSize: "1rem",
                      width: "100%",
                      fontFamily: "Poppins, sans-serif",
                      ...(activeTab === "practice"
                        ? {
                            background: COLORS.primary,
                            color: "white",
                          }
                        : {
                            backgroundColor: COLORS.ultraLightGray,
                            color: COLORS.darkGray,
                          }),
                    }}
                  >
                    <ClipboardCheck
                      style={{ width: "1.25rem", height: "1.25rem" }}
                    />
                    {t("nav.tabs.practice")}
                  </button>
                )}
                {isModeEnabled("real_world") && (
                  <button
                    onClick={() => {
                      setActiveTab("real_world");
                      setIsMobileMenuOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.875rem 1rem",
                      borderRadius: "12px",
                      fontWeight: "600",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      fontSize: "1rem",
                      width: "100%",
                      fontFamily: "Poppins, sans-serif",
                      ...(activeTab === "real_world"
                        ? {
                            background: COLORS.primary,
                            color: "white",
                          }
                        : {
                            backgroundColor: COLORS.ultraLightGray,
                            color: COLORS.darkGray,
                          }),
                    }}
                  >
                    <Globe style={{ width: "1.25rem", height: "1.25rem" }} />
                    {t("nav.tabs.realWorld")}
                  </button>
                )}
              </div>
            )}
          </div>
        </nav>
      )}

      <div
        style={{
          paddingTop: showModeSelector ? "clamp(3.75rem, 10vw, 4.5rem)" : "0",
        }}
      >
        {activeTab === "learn" ? (
          <LightTravelStraightLine />
        ) : activeTab === "practice" ? (
          <PracticeMode />
        ) : (
          <RealWorldMode />
        )}
      </div>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
          
          @keyframes bounce {
            0%, 100% { transform: translateX(-50%) translateY(-5px); }
            50% { transform: translateX(-50%) translateY(0); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.5; }
          }
          
          @media (min-width: 640px) {
            .hidden { display: none !important; }
            .sm\\:flex { display: flex !important; }
          }
          
          @media (max-width: 639px) {
            .sm\\:hidden { display: flex !important; }
          }
          
          @media (min-width: 768px) {
            .md\\:inline { display: inline !important; }
          }
          
          @media (max-width: 767px) {
            .hidden.md\\:inline { display: none !important; }
          }
        `}
      </style>
    </div>
  );
};

// Main exported component with Provider
export const ShadowFormation: React.FC<ShadowFormationProps> = (
  componentProps,
) => {
  return (
    <LanguageProvider>
      <MainApp {...componentProps} />
    </LanguageProvider>
  );
};

export default ShadowFormation;
