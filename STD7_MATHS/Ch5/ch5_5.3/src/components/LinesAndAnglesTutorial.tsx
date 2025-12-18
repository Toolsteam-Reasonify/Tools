import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type AppLang = 'en' | 'hi' | 'gu';
type AnglePair =
  | 'corresponding'
  | 'alternateInterior'
  | 'consecutiveInterior'
  | 'alternateExterior'
  | 'interior'
  | 'exterior';
type ViewState = 'intersecting' | AnglePair;

// Translations
const translations: Record<AppLang, any> = {
  en: {
    title: '5.3: Pairs of Lines & Transversals',
    subtitle: 'A **transversal** is a line that intersects two or more lines at distinct points.',
    makeParallel: 'Make Lines Parallel',
    makeNonParallel: 'Make Lines Non-Parallel',
    interior: 'Interior',
    exterior: 'Exterior',
    corresponding: 'Corresponding',
    alternateInterior: 'Alternate Interior',
    consecutiveInterior: 'Same Side Interior',
    alternateExterior: 'Alternate Exterior',
    explanations: {
      intersecting: {
        title: 'Intersecting Lines',
        description: 'Two lines are intersecting if they have one point in common. This common point is their point of intersection.',
      },
      interior: {
        title: 'Interior Angles',
        description: 'These are the angles that lie "between" the two main lines. (Angles 3, 4, 5, 6)',
      },
      exterior: {
        title: 'Exterior Angles',
        description: 'These are the angles that lie "outside" the two main lines. (Angles 1, 2, 7, 8)',
      },
      corresponding: {
        title: 'Corresponding Angles',
        description: 'Pairs: (1, 5), (2, 6), (3, 7), (4, 8). When lines are parallel, these angles are EQUAL.',
      },
      alternateInterior: {
        title: 'Alternate Interior Angles',
        description: 'Pairs: (3, 6), (4, 5). They are on opposite sides of the transversal and between the lines. When lines are parallel, these angles are EQUAL.',
      },
      consecutiveInterior: {
        title: 'Interior Angles on the Same Side',
        description: 'Pairs: (3, 5), (4, 6). When lines are parallel, these angles are SUPPLEMENTARY (add up to 180°).',
      },
      alternateExterior: {
        title: 'Alternate Exterior Angles',
        description: 'Pairs: (1, 8), (2, 7). They are on opposite sides of the transversal and outside the lines. When lines are parallel, these angles are EQUAL.',
      },
    },
  },
  hi: {
    title: '5.3: रेखाओं के युग्म और ट्रांसवर्सल',
    subtitle: 'एक **ट्रांसवर्सल** वह रेखा है जो दो या अधिक रेखाओं को अलग-अलग बिंदुओं पर काटती है।',
    makeParallel: 'रेखाओं को समांतर बनाएं',
    makeNonParallel: 'रेखाओं को गैर-समांतर बनाएं',
    interior: 'आंतरिक',
    exterior: 'बाह्य',
    corresponding: 'समतुल्य',
    alternateInterior: 'पर्यायी आंतरिक',
    consecutiveInterior: 'समान पक्ष आंतरिक',
    alternateExterior: 'पर्यायी बाह्य',
    explanations: {
      intersecting: {
        title: 'प्रतिच्छेदित रेखाएं',
        description: 'दो रेखाएं प्रतिच्छेदित होती हैं यदि उनका एक बिंदु समान हो। यह समान बिंदु उनका प्रतिच्छेदन बिंदु है।',
      },
      interior: {
        title: 'आंतरिक कोण',
        description: 'ये वे कोण हैं जो दो मुख्य रेखाओं के "बीच" स्थित हैं। (कोण 3, 4, 5, 6)',
      },
      exterior: {
        title: 'बाह्य कोण',
        description: 'ये वे कोण हैं जो दो मुख्य रेखाओं के "बाहर" स्थित हैं। (कोण 1, 2, 7, 8)',
      },
      corresponding: {
        title: 'समतुल्य कोण',
        description: 'जोड़े: (1, 5), (2, 6), (3, 7), (4, 8)। जब रेखाएं समांतर होती हैं, तो ये कोण समान होते हैं।',
      },
      alternateInterior: {
        title: 'पर्यायी आंतरिक कोण',
        description: 'जोड़े: (3, 6), (4, 5)। वे ट्रांसवर्सल के विपरीत पक्षों पर और रेखाओं के बीच स्थित हैं। जब रेखाएं समांतर होती हैं, तो ये कोण समान होते हैं।',
      },
      consecutiveInterior: {
        title: 'समान पक्ष के आंतरिक कोण',
        description: 'जोड़े: (3, 5), (4, 6)। जब रेखाएं समांतर होती हैं, तो ये कोण संपूरक होते हैं (180° तक जुड़ते हैं)।',
      },
      alternateExterior: {
        title: 'पर्यायी बाह्य कोण',
        description: 'जोड़े: (1, 8), (2, 7)। वे ट्रांसवर्सल के विपरीत पक्षों पर और रेखाओं के बाहर स्थित हैं। जब रेखाएं समांतर होती हैं, तो ये कोण समान होते हैं।',
      },
    },
  },
  gu: {
    title: '5.3: રેખાઓના જોડી અને ટ્રાન્સવર્સલ',
    subtitle: 'એક **ટ્રાન્સવર્સલ** રેખા છે જે બે અથવા વધુ રેખાઓને અલગ બિંદુઓ પર છેદે છે.',
    makeParallel: 'રેખાઓને સમાંતર બનાવો',
    makeNonParallel: 'રેખાઓને અસમાંતર બનાવો',
    interior: 'આંતરિક',
    exterior: 'બાહ્ય',
    corresponding: 'સંગત',
    alternateInterior: 'પર્યાયી આંતરિક',
    consecutiveInterior: 'સમાન બાજુ આંતરિક',
    alternateExterior: 'પર્યાયી બાહ્ય',
    explanations: {
      intersecting: {
        title: 'છેદક રેખાઓ',
        description: 'બે રેખાઓ છેદક હોય છે જો તેમનો એક બિંદુ સામાન્ય હોય. આ સામાન્ય બિંદુ તેમનો છેદ બિંદુ છે.',
      },
      interior: {
        title: 'આંતરિક કોણ',
        description: 'આ કોણ છે જે બે મુખ્ય રેખાઓના "બીच" આવેલા છે. (કોણ 3, 4, 5, 6)',
      },
      exterior: {
        title: 'બાહ્ય કોણ',
        description: 'આ કોણ છે જે બે મુખ્ય રેખાઓના "બહાર" આવેલા છે. (કોણ 1, 2, 7, 8)',
      },
      corresponding: {
        title: 'સંગત કોણ',
        description: 'જોડી: (1, 5), (2, 6), (3, 7), (4, 8). જ્યારે રેખાઓ સમાંતર હોય છે, ત્યારે આ કોણ સમાન હોય છે.',
      },
      alternateInterior: {
        title: 'પર્યાયી આંતરિક કોણ',
        description: 'જોડી: (3, 6), (4, 5). તે ટ્રાન્સવર્સલની વિપરીત બાજુઓ પર અને રેખાઓ વચ્ચે આવેલા છે. જ્યારે રેખાઓ સમાંતર હોય છે, ત્યારે આ કોણ સમાન હોય છે.',
      },
      consecutiveInterior: {
        title: 'સમાન બાજુના આંતરિક કોણ',
        description: 'જોડી: (3, 5), (4, 6). જ્યારે રેખાઓ સમાંતર હોય છે, ત્યારે આ કોણ સંપૂરક હોય છે (180° સુધી ઉમેરે છે).',
      },
      alternateExterior: {
        title: 'પર્યાયી બાહ્ય કોણ',
        description: 'જોડી: (1, 8), (2, 7). તે ટ્રાન્સવર્સલની વિપરીત બાજુઓ પર અને રેખાઓની બહાર આવેલા છે. જ્યારે રેખાઓ સમાંતર હોય છે, ત્યારે આ કોણ સમાન હોય છે.',
      },
    },
  },
};

// Embedded CSS
const cssStyles = `
  .geo-container {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    width: 100%;
    max-width: 700px;
    margin: 0 auto;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    background: #ffffff;
    overflow: hidden;
  }
  .geo-header {
    padding: 1.5rem;
    background: #f9f9f9;
    border-bottom: 1px solid #ddd;
  }
  .geo-header h2 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }
  .geo-header p {
    margin: 0;
    font-size: 0.95rem;
    color: #555;
  }
  .geo-svg {
    width: 100%;
    height: auto;
    background: #fafcff;
  }
  .line {
    stroke: #555;
    stroke-width: 2;
  }
  .transversal {
    stroke: #007bff;
    stroke-width: 2.5;
  }
  .line-label {
    font-family: 'Times New Roman', serif;
    font-style: italic;
    font-size: 1.25rem;
    fill: #333;
  }
  .angle-label {
    font-size: 1rem;
    font-weight: bold;
    fill: #111;
    -webkit-user-select: none;
    user-select: none;
  }
  .geo-controls {
    padding: 1.5rem;
    border-top: 1px solid #eee;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: #fdfdfd;
  }
  .toggle-parallel {
    padding: 0.75rem 1rem;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    background-color: #28a745;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s ease, box-shadow 0.2s ease;
  }
  .toggle-parallel:hover {
    background-color: #218838;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  .button-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .button-group button {
    flex-grow: 1;
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
    border: 1px solid #007bff;
    background: #fff;
    color: #007bff;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;
  }
  .button-group button:hover {
    background: #e6f2ff;
  }
  .geo-explanation {
    padding: 1.5rem;
    background: #fdfdfd;
    border-top: 1px dashed #ddd;
    min-height: 100px;
  }
  .geo-explanation h3 {
    margin-top: 0;
    color: #007bff;
  }
  .geo-explanation p {
    margin-bottom: 0;
    line-height: 1.6;
  }
`;

// Helper to define which angles to highlight for each pair
const angleGroups: Record<AnglePair, number[]> = {
  interior: [3, 4, 5, 6],
  exterior: [1, 2, 7, 8],
  corresponding: [1, 5, 2, 6, 3, 7, 4, 8],
  alternateInterior: [3, 6, 4, 5],
  consecutiveInterior: [3, 5, 4, 6],
  alternateExterior: [1, 8, 2, 7],
};

// Helper to assign colors to paired angles
const getAngleColor = (angle: number, view: AnglePair): string => {
  const groups = angleGroups[view];
  if (!groups.includes(angle)) return 'transparent';

  switch (view) {
    case 'interior':
      return 'rgba(255, 165, 0, 0.7)'; // Orange
    case 'exterior':
      return 'rgba(0, 191, 255, 0.7)'; // Deep Sky Blue
    case 'corresponding':
      if ([1, 5].includes(angle)) return 'rgba(255, 99, 71, 0.7)'; // Tomato
      if ([2, 6].includes(angle)) return 'rgba(60, 179, 113, 0.7)'; // Medium Sea Green
      if ([3, 7].includes(angle)) return 'rgba(238, 130, 238, 0.7)'; // Violet
      if ([4, 8].includes(angle)) return 'rgba(106, 90, 205, 0.7)'; // Slate Blue
      break;
    case 'alternateInterior':
      if ([3, 6].includes(angle)) return 'rgba(255, 99, 71, 0.7)'; // Tomato
      if ([4, 5].includes(angle)) return 'rgba(60, 179, 113, 0.7)'; // Medium Sea Green
      break;
    case 'consecutiveInterior':
      if ([3, 5].includes(angle)) return 'rgba(255, 99, 71, 0.7)'; // Tomato
      if ([4, 6].includes(angle)) return 'rgba(60, 179, 113, 0.7)'; // Medium Sea Green
      break;
    case 'alternateExterior':
      if ([1, 8].includes(angle)) return 'rgba(255, 99, 71, 0.7)'; // Tomato
      if ([2, 7].includes(angle)) return 'rgba(60, 179, 113, 0.7)'; // Medium Sea Green
      break;
  }
  return 'transparent';
};

// Angle Label Component
const AngleLabel: React.FC<{
  n: number;
  x: number;
  y: number;
  view: ViewState;
  animate?: 'parallel' | 'nonParallel';
}> = ({ n, x, y, view, animate }) => {
  // Calculate positions for parallel vs non-parallel
  const getYPosition = (parallel: boolean) => {
    if (!parallel) return y;
    
    // For angles 5-8 (bottom intersection), adjust for parallel position
    // Line m is at y=250 when parallel, so angles need to be positioned accordingly
    if (n === 5) return 230; // Above line m when parallel (y=250)
    if (n === 6) return 230;
    if (n === 7) return 270; // Below line m when parallel
    if (n === 8) return 270;
    return y;
  };

  const getXPosition = (parallel: boolean) => {
    if (!parallel) return x;
    
    // Adjust x position for better positioning when parallel
    if (n === 5 || n === 7) return 200;
    if (n === 6 || n === 8) return 245;
    return x;
  };

  const parallelY = getYPosition(true);
  const parallelX = getXPosition(true);

  const variants = {
    nonParallel: { y, x },
    parallel: { y: parallelY, x: parallelX },
  };

  const isHighlighted =
    view !== 'intersecting' && angleGroups[view as AnglePair].includes(n);
  const color = view !== 'intersecting' ? getAngleColor(n, view as AnglePair) : 'transparent';

  return (
    <motion.g
      variants={animate ? variants : undefined}
      animate={animate}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
    >
      <motion.circle
        cx={animate === 'parallel' ? parallelX + 7 : x + 7}
        cy={animate === 'parallel' ? parallelY - 5 : y - 5}
        r={12}
        fill={color}
        initial={{ scale: 0 }}
        animate={{ scale: isHighlighted ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      />
      <motion.text
        x={animate === 'parallel' ? parallelX : x}
        y={animate === 'parallel' ? parallelY : y}
        className="angle-label"
      >
        {n}
      </motion.text>
    </motion.g>
  );
};

// Main Component
export default function LinesAndAnglesTutorial({ language }: { language: AppLang }) {
  const t = translations[language];
  const [isParallel, setIsParallel] = useState(false);
  const [view, setView] = useState<ViewState>('intersecting');
  
  // Sequential animation states
  const [showDiagram, setShowDiagram] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Animate line coordinates for proper parallel lines
  const line2Y1 = isParallel ? 250 : 200;
  const line2Y2 = isParallel ? 250 : 150;
  const textY = isParallel ? 245 : 195;

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  // Sequential animation on mount
  useEffect(() => {
    const timer1 = setTimeout(() => setShowDiagram(true), 100);
    const timer2 = setTimeout(() => setShowControls(true), 800);
    const timer3 = setTimeout(() => setShowExplanation(true), 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <>
      <style>{cssStyles}</style>
      
      <div className="geo-container">

        {/* SVG Canvas for visualization */}
        <motion.svg
          viewBox="0 0 400 300"
          className="geo-svg"
          aria-label="Geometric lines and angles"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: showDiagram ? 1 : 0, 
            scale: showDiagram ? 1 : 0.9 
          }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {/* Line 1 (l) */}
          <line x1="0" y1="100" x2="400" y2="100" className="line" />
          <text x="10" y="95" className="line-label">
            l
          </text>

          {/* Line 2 (m) - Animated */}
          <motion.line
            x1="0"
            x2="400"
            y1={line2Y1}
            y2={line2Y2}
            className="line"
            animate={{
              y1: line2Y1,
              y2: line2Y2,
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          />
          <motion.text
            x="10"
            y={textY}
            className="line-label"
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          >
            m
          </motion.text>

          {/* Transversal (p) */}
          <line x1="100" y1="0" x2="300" y2="300" className="line transversal" />
          <text x="85" y="20" className="line-label">
            p
          </text>

          {/* Intersection 1 (Top) */}
          <AngleLabel
            n={1}
            x={125}
            y={80}
            view={view}
          />
          <AngleLabel
            n={2}
            x={190}
            y={80}
            view={view}
          />
          <AngleLabel
            n={3}
            x={145}
            y={120}
            view={view}
          />
          <AngleLabel
            n={4}
            x={190}
            y={120}
            view={view}
          />

          {/* Intersection 2 (Bottom) - Animated */}
          {/* When non-parallel, intersection is around (220, 167) on line m */}
          <AngleLabel
            n={5}
            x={205}
            y={147}
            view={view}
            animate={isParallel ? 'parallel' : 'nonParallel'}
          />
          <AngleLabel
            n={6}
            x={250}
            y={147}
            view={view}
            animate={isParallel ? 'parallel' : 'nonParallel'}
          />
          <AngleLabel
            n={7}
            x={205}
            y={187}
            view={view}
            animate={isParallel ? 'parallel' : 'nonParallel'}
          />
          <AngleLabel
            n={8}
            x={250}
            y={187}
            view={view}
            animate={isParallel ? 'parallel' : 'nonParallel'}
          />
        </motion.svg>

        {/* Controls */}
        <motion.div 
          className="geo-controls"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: showControls ? 1 : 0, 
            y: showControls ? 0 : 20 
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <button
            onClick={() => setIsParallel(!isParallel)}
            className="toggle-parallel"
          >
            {isParallel ? t.makeNonParallel : t.makeParallel}
          </button>
          <div className="button-group">
            <button onClick={() => setView('interior')}>{t.interior}</button>
            <button onClick={() => setView('exterior')}>{t.exterior}</button>
            <button onClick={() => setView('corresponding')}>{t.corresponding}</button>
            <button onClick={() => setView('alternateInterior')}>
              {t.alternateInterior}
            </button>
            <button onClick={() => setView('consecutiveInterior')}>
              {t.consecutiveInterior}
            </button>
            <button onClick={() => setView('alternateExterior')}>
              {t.alternateExterior}
            </button>
          </div>
        </motion.div>

        {/* Explanation Box */}
        <motion.div 
          className="geo-explanation"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: showExplanation ? 1 : 0, 
            y: showExplanation ? 0 : 20 
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.3 }}
            >
              <h3>{t.explanations[view].title}</h3>
              <p>{t.explanations[view].description}</p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
