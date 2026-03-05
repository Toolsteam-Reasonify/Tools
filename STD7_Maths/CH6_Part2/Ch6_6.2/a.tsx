// @ts-ignore - React types should be available in the project
import React, { useState, useRef, useEffect } from 'react';

// Design System Colors from PDF
const COLORS = {
  primary: '#4A4DC9',
  primaryDark: '#533086',
  primaryLight: '#C1C1EA',
  secondary: '#FF7212',
  secondaryDark: '#FC9145',
  secondaryLight: '#FFF3E4',
  gradient: {
    primary: 'linear-gradient(135deg, #533086 0%, #FC9145 100%)',
    secondary: 'linear-gradient(135deg, #FC9145 0%, #533086 100%)',
  },
  neutral: {
    dark: '#4E4E4E',
    medium: '#CACACA',
    light: '#EBEBEB',
    lighter: '#F5F5F5',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// INTERFACES - Following Agent Guidelines
// ═══════════════════════════════════════════════════════════════════════════

type ModeType = 'learn' | 'practice' | 'realworld';

interface TilePosition {
  x: number;
  y: number;
  rotation: number;
  type: string;
  color: string;
}

interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface RealWorldExample {
  id: number;
  title: string;
  description: string;
  image: string;
  connection: string;
  funFact: string;
}

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  mode: ModeType;
}

interface TilingAdditionalProps {
  // Grid configuration
  gridRows?: number;
  gridCols?: number;
  gridType?: 'rectangular' | 'hexagonal' | 'triangular';
  tileType?: '2x1' | 'square' | 'equilateral' | 'hexagon';
  
  // Colors
  tileColors?: string[];
  selectedColor?: string;
  
  // Features
  showCheckerboard?: boolean;
  autoSolve?: boolean;
  
  // Questions for practice mode
  customQuestions?: MCQQuestion[];
  
  // Examples for real world mode
  customExamples?: RealWorldExample[];
}

interface TilingExplorerProps {
  props?: {
    // DIMENSIONS
    width?: number;
    height?: number;
    
    // MODE CONFIGURATION
    initialMode?: ModeType;
    showModeSelector?: boolean;
    enabledModes?: ModeType[];
    
    // NAVIGATION CONFIGURATION
    showNavigation?: boolean;
    showStepIndicator?: boolean;
    
    // STEP FILTERING
    initialStep?: number;
    filterSteps?: number[];
    
    // ANIMATION CONFIGURATION
    animationSpeed?: number;
    
    // THEME
    themeColor?: string;
    darkMode?: boolean;
    
    // ADDITIONAL PROPS - TOOL-SPECIFIC
    additionalProps?: TilingAdditionalProps;
  };
  
  // EXTERNAL CONTROLS
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const TilingExplorer: React.FC<TilingExplorerProps> = ({ 
  props, 
  setStepDetails,
  stopAutoNext = false,
  setStopAutoNext
}) => {
  // Extract props with defaults
  const {
    width = 800,
    height = 600,
    initialMode = 'learn',
    showModeSelector = true,
    enabledModes = ['learn', 'practice', 'realworld'],
    showNavigation = true,
    showStepIndicator = true,
    initialStep = 0,
    filterSteps,
    animationSpeed = 1,
    themeColor = COLORS.primary,
    darkMode = false,
    additionalProps = {}
  } = props || {};

  // Extract additionalProps with defaults
  const {
    gridRows = 5,
    gridCols = 6,
    gridType = 'rectangular',
    tileType = '2x1',
    tileColors = [COLORS.secondary, COLORS.secondaryDark, COLORS.primary, COLORS.primaryLight, '#4ECDC4', '#C44569', '#8B4789', '#2ECC71'],
    selectedColor: defaultSelectedColor = COLORS.secondary,
    showCheckerboard: defaultShowCheckerboard = false,
    autoSolve: defaultAutoSolve = false,
    customQuestions,
    customExamples
  } = additionalProps;

  // State management
  const [navMode, setNavMode] = useState<ModeType>(initialMode);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [gridDims, setGridDims] = useState({ rows: gridRows, cols: gridCols });
  const [tiles, setTiles] = useState<TilePosition[]>([]);
  const [selectedColor, setSelectedColor] = useState(defaultSelectedColor);
  const [showCheckerboard, setShowCheckerboard] = useState(defaultShowCheckerboard);
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showExplanation, setShowExplanation] = useState(false);
  
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cellSize = 40;

  // Default questions
  const defaultQuestions: MCQQuestion[] = [
    {
      id: 1,
      question: "A rectangular grid has 5 rows and 7 columns. Can it be perfectly tiled with 2×1 domino tiles?",
      options: [
        "Yes, because both dimensions are odd",
        "No, because the total number of cells (35) is odd",
        "Yes, if we arrange them cleverly",
        "No, because 5 and 7 are prime numbers"
      ],
      correctAnswer: 1,
      explanation: "The grid has 5 × 7 = 35 cells. Since each 2×1 tile covers exactly 2 cells, we would need 17.5 tiles. Since we can't use half a tile, it's impossible!"
    },
    {
      id: 2,
      question: "In the checkerboard coloring technique, each 2×1 domino tile covers:",
      options: [
        "Two squares of the same color",
        "One black square and one white square",
        "Either two black or two white squares",
        "It depends on how we place it"
      ],
      correctAnswer: 1,
      explanation: "In a checkerboard pattern, adjacent squares always have opposite colors. Since a 2×1 domino covers two adjacent squares, it ALWAYS covers exactly one black and one white square!"
    },
    {
      id: 3,
      question: "Which of these regular polygons CANNOT tile a plane by itself?",
      options: [
        "Regular hexagon (6 sides)",
        "Square (4 sides)",
        "Regular pentagon (5 sides)",
        "Equilateral triangle (3 sides)"
      ],
      correctAnswer: 2,
      explanation: "Regular pentagons cannot tile a plane! Only THREE regular polygons can tile the plane: triangles (60°), squares (90°), and hexagons (120°)."
    },
    {
      id: 4,
      question: "Why do bees use hexagonal cells in their hives?",
      options: [
        "Hexagons look pretty",
        "They're easier to build than squares",
        "Hexagons use the least wax for maximum storage space",
        "Bees can't count higher than 6"
      ],
      correctAnswer: 2,
      explanation: "Bees are amazing mathematicians! Hexagonal tiling is the most efficient way to divide a plane into equal areas with the least perimeter."
    },
    {
      id: 5,
      question: "A 6×8 grid has two opposite corner squares removed. Can it be tiled with 2×1 dominoes?",
      options: [
        "Yes, it has an even number of cells (62)",
        "No, because corner squares are special",
        "No, because both removed corners have the same checkerboard color",
        "Yes, with a clever arrangement"
      ],
      correctAnswer: 2,
      explanation: "In a checkerboard, opposite corners have the SAME color. If we remove both, we have 31 white and 30 black squares. Since each domino covers 1 black + 1 white, we can't tile it!"
    }
  ];

  const mcqQuestions = customQuestions || defaultQuestions;

  // Default examples
  const defaultExamples: RealWorldExample[] = [
    {
      id: 1,
      title: "🐝 Honeycomb: Nature's Perfect Tessellation",
      description: "Honeybees construct their hives using regular hexagonal cells in a pattern that has fascinated mathematicians for centuries.",
      image: "🍯",
      connection: "Hexagons are one of only three regular polygons that can tile a plane. The hexagonal tiling uses the least perimeter to enclose a given area.",
      funFact: "Mathematician Thomas Hales proved in 1999 that hexagonal tiling is the most efficient. Bees figured this out millions of years before humans!"
    },
    {
      id: 2,
      title: "🕌 Islamic Geometric Art",
      description: "Islamic architecture features stunning geometric patterns. The Alhambra palace contains examples of all 17 possible 'wallpaper groups'.",
      image: "🎨",
      connection: "Islamic artists used complex combinations of regular polygons to create intricate tessellations demonstrating symmetry and reflection.",
      funFact: "The Alhambra palace, built in the 14th century, contains tessellations so complex that mathematicians didn't fully classify them until the 20th century!"
    },
    {
      id: 3,
      title: "🎮 Video Game Graphics",
      description: "Modern video games use 'texture tiling' to create large, detailed environments efficiently.",
      image: "🕹️",
      connection: "Game developers use square and rectangular tiles that tessellate perfectly. By designing edges that match, they create seamless patterns!",
      funFact: "Minecraft is entirely based on cubic tiling! The game world is essentially an infinite 3D tessellation."
    },
    {
      id: 4,
      title: "🗺️ Digital Maps",
      description: "When you zoom in and out on digital maps, you're viewing a tessellation system!",
      image: "🌍",
      connection: "Digital maps use square tiling. At zoom level 0, the world is 1 tile. Each zoom level quadruples the tiles.",
      funFact: "At zoom level 20, Earth is divided into over 1 trillion tiles! But your phone only loads about 12 at a time."
    },
    {
      id: 5,
      title: "🐢 Turtle Shells",
      description: "Turtle shells display natural tessellation patterns. The scutes fit together in geometric arrangements.",
      image: "🐢",
      connection: "Turtle shells use hexagonal and pentagonal patterns - like a soccer ball! This distributes force, making the shell stronger.",
      funFact: "Scientists study these patterns to understand how genes control geometric growth - it's geometry programmed by DNA!"
    }
  ];

  const realWorldExamples = customExamples || defaultExamples;

  // Update step details for parent
  useEffect(() => {
    if (setStepDetails) {
      const totalSteps = navMode === 'practice' ? mcqQuestions.length : navMode === 'realworld' ? realWorldExamples.length : 1;
      setStepDetails({
        currentStep: navMode === 'practice' ? currentQuestionIndex + 1 : navMode === 'realworld' ? currentExampleIndex + 1 : 1,
        totalSteps,
        mode: navMode
      });
    }
  }, [navMode, currentQuestionIndex, currentExampleIndex, setStepDetails]);

  // Animation helper functions
  const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
  const easeInOutQuad = (t: number): number => 
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  // Check tileability
  const checkTileability = (): boolean => {
    const totalCells = gridDims.rows * gridDims.cols;
    if (totalCells % 2 !== 0) {
      setMessage('❌ Impossible! Odd number of cells cannot be tiled with 2×1 tiles.');
      return false;
    }
    setMessage('✅ This grid is tileable!');
    return true;
  };

  // Auto solve with animation
  const autoSolveTiling = () => {
    if (tileType !== '2x1' || gridType !== 'rectangular') return;
    if (!checkTileability()) return;
    
    setIsAnimating(true);
    const newTiles: TilePosition[] = [];
    const { rows, cols } = gridDims;
    let delay = 0;
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c += 2) {
        setTimeout(() => {
          setTiles(prev => [...prev, {
            x: c * cellSize,
            y: r * cellSize,
            rotation: 0,
            type: '2x1',
            color: tileColors[Math.floor(Math.random() * tileColors.length)]
          }]);
        }, delay);
        delay += 50 / animationSpeed;
      }
    }
    
    setTimeout(() => {
      setIsAnimating(false);
      setMessage('✅ Auto-solved!');
    }, delay);
  };

  // Drawing functions
  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    const { rows, cols } = gridDims;
    const w = cols * cellSize;
    const h = rows * cellSize;

    ctx.fillStyle = showCheckerboard ? COLORS.neutral.lighter : '#FFFFFF';
    ctx.fillRect(0, 0, w, h);

    if (gridType === 'rectangular') {
      if (showCheckerboard) {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            ctx.fillStyle = (r + c) % 2 === 0 ? COLORS.primaryLight : COLORS.secondaryLight;
            ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
          }
        }
      }

      ctx.strokeStyle = COLORS.neutral.medium;
      ctx.lineWidth = 1;
      
      for (let r = 0; r <= rows; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * cellSize);
        ctx.lineTo(w, r * cellSize);
        ctx.stroke();
      }
      
      for (let c = 0; c <= cols; c++) {
        ctx.beginPath();
        ctx.moveTo(c * cellSize, 0);
        ctx.lineTo(c * cellSize, h);
        ctx.stroke();
      }
    }
  };

  const drawTiles = (ctx: CanvasRenderingContext2D) => {
    tiles.forEach((tile, index) => {
      ctx.save();
      ctx.translate(tile.x + cellSize, tile.y + cellSize);
      ctx.rotate(tile.rotation);
      
      // Pulse animation for newly added tiles
      const scale = isAnimating && index === tiles.length - 1 ? 1.1 : 1;
      ctx.scale(scale, scale);
      
      ctx.fillStyle = tile.color;
      ctx.strokeStyle = COLORS.primaryDark;
      ctx.lineWidth = 2;
      
      if (tile.type === '2x1') {
        ctx.fillRect(-cellSize, -cellSize / 2, cellSize * 2, cellSize);
        ctx.strokeRect(-cellSize, -cellSize / 2, cellSize * 2, cellSize);
      }
      
      ctx.restore();
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isAnimating) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize) * cellSize;
    const y = Math.floor((e.clientY - rect.top) / cellSize) * cellSize;
    
    setTiles([...tiles, { 
      x, y, 
      rotation: 0, 
      type: tileType, 
      color: selectedColor 
    }]);
  };

  const clearTiles = () => {
    setTiles([]);
    setMessage('');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = gridDims.cols * cellSize;
    canvas.height = gridDims.rows * cellSize;
    
    drawGrid(ctx);
    drawTiles(ctx);
  }, [gridDims, tiles, gridType, showCheckerboard]);

  // Inject animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
      
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.8);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      * {
        box-sizing: border-box;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Button Component
  const Button: React.FC<{
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'contained' | 'outlined' | 'text';
    disabled?: boolean;
    icon?: React.ReactNode;
    color?: 'primary' | 'secondary';
    fullWidth?: boolean;
  }> = ({ children, onClick, variant = 'contained', disabled = false, icon, color = 'primary', fullWidth = false }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const baseStyle: React.CSSProperties = {
      fontFamily: "'Poppins', sans-serif",
      fontSize: '16px',
      fontWeight: 600,
      padding: '12px 24px',
      borderRadius: '40px',
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: `all ${300 / animationSpeed}ms ease`,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: icon ? '8px' : '0',
      opacity: disabled ? 0.5 : 1,
      width: fullWidth ? '100%' : 'auto',
      whiteSpace: 'nowrap',
    };

    const colorPrimary = color === 'primary' ? COLORS.primary : COLORS.secondary;
    const colorDark = color === 'primary' ? COLORS.primaryDark : COLORS.secondaryDark;

    let style = { ...baseStyle };
    
    if (variant === 'contained') {
      style.background = colorPrimary;
      style.color = '#FFFFFF';
      style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    } else if (variant === 'outlined') {
      style.background = 'transparent';
      style.color = colorPrimary;
      style.border = `2px solid ${colorPrimary}`;
    } else {
      style.background = 'transparent';
      style.color = colorPrimary;
    }

    if (isPressed && !disabled) {
      style.transform = 'scale(0.95)';
      style.background = colorDark;
    } else if (isHovered && !disabled) {
      style.transform = 'translateY(-2px)';
      style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
    }

    return (
      <button
        style={style}
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
      >
        {icon && <span>{icon}</span>}
        {children}
      </button>
    );
  };

  // Mode rendering functions
  const renderLearnMode = () => (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <div style={{ 
        background: COLORS.gradient.primary, 
        padding: 'clamp(20px, 5vw, 40px)', 
        color: '#FFF' 
      }}>
        <h1 style={{ 
          margin: '0 0 10px 0', 
          fontSize: 'clamp(24px, 5vw, 42px)', 
          fontWeight: 700,
          fontFamily: "'Poppins', sans-serif",
          animation: 'slideIn 0.6s ease'
        }}>
          Interactive Learning
        </h1>
        <p style={{ 
          margin: 0, 
          fontSize: 'clamp(14px, 3vw, 18px)', 
          opacity: 0.95,
          fontFamily: "'Poppins', sans-serif",
          animation: 'slideIn 0.6s ease 0.1s backwards'
        }}>
          Explore tiling concepts hands-on
        </p>
      </div>

      <div style={{ 
        padding: 'clamp(20px, 4vw, 30px)', 
        background: COLORS.neutral.lighter 
      }}>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '20px' 
        }}>
          <div style={{ animation: 'scaleIn 0.5s ease' }}>
            <label style={{ 
              display: 'block', 
              fontWeight: 600, 
              marginBottom: '8px',
              fontFamily: "'Poppins', sans-serif",
              color: COLORS.neutral.dark,
              fontSize: '14px'
            }}>
              Grid Dimensions
            </label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input 
                type="number" 
                value={gridDims.rows} 
                onChange={(e) => setGridDims({ ...gridDims, rows: Math.max(2, Math.min(15, parseInt(e.target.value) || 5)) })} 
                style={{ 
                  flex: 1, 
                  padding: '12px', 
                  border: `2px solid ${COLORS.neutral.medium}`, 
                  borderRadius: '8px',
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '16px',
                  outline: 'none',
                  transition: `border ${300 / animationSpeed}ms`,
                }} 
                onFocus={(e) => e.currentTarget.style.borderColor = COLORS.primary}
                onBlur={(e) => e.currentTarget.style.borderColor = COLORS.neutral.medium}
              />
              <span style={{ fontWeight: 600, color: COLORS.neutral.dark }}>×</span>
              <input 
                type="number" 
                value={gridDims.cols} 
                onChange={(e) => setGridDims({ ...gridDims, cols: Math.max(2, Math.min(15, parseInt(e.target.value) || 6)) })} 
                style={{ 
                  flex: 1, 
                  padding: '12px', 
                  border: `2px solid ${COLORS.neutral.medium}`, 
                  borderRadius: '8px',
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '16px',
                  outline: 'none',
                  transition: `border ${300 / animationSpeed}ms`,
                }} 
                onFocus={(e) => e.currentTarget.style.borderColor = COLORS.primary}
                onBlur={(e) => e.currentTarget.style.borderColor = COLORS.neutral.medium}
              />
            </div>
          </div>
          
          <div style={{ animation: 'scaleIn 0.5s ease 0.1s backwards' }}>
            <label style={{ 
              display: 'block', 
              fontWeight: 600, 
              marginBottom: '8px',
              fontFamily: "'Poppins', sans-serif",
              color: COLORS.neutral.dark,
              fontSize: '14px'
            }}>
              Tile Color
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {tileColors.map((color, idx) => (
                <button 
                  key={color} 
                  onClick={() => setSelectedColor(color)}
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: color, 
                    border: selectedColor === color ? `3px solid ${COLORS.primaryDark}` : `2px solid ${COLORS.neutral.medium}`, 
                    borderRadius: '50%', 
                    cursor: 'pointer',
                    transition: `all ${200 / animationSpeed}ms`,
                    transform: selectedColor === color ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: selectedColor === color ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
                    animation: `scaleIn 0.4s ease ${idx * 0.05}s backwards`
                  }} 
                />
              ))}
            </div>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <Button onClick={clearTiles} color="primary" icon="🗑️" disabled={isAnimating}>Clear All</Button>
          <Button onClick={checkTileability} color="primary" icon="🔍" disabled={isAnimating}>Check</Button>
          <Button onClick={autoSolveTiling} color="secondary" icon="⚡" disabled={isAnimating}>
            {isAnimating ? 'Solving...' : 'Auto-Solve'}
          </Button>
          <Button 
            onClick={() => setShowCheckerboard(!showCheckerboard)} 
            variant={showCheckerboard ? 'contained' : 'outlined'}
            color="primary"
            icon="🎨"
          >
            Checkerboard
          </Button>
        </div>
      </div>

      {message && (
        <div style={{ 
          padding: 'clamp(15px, 3vw, 20px)', 
          background: message.includes('✅') ? COLORS.secondaryLight : COLORS.primaryLight, 
          color: message.includes('✅') ? COLORS.secondaryDark : COLORS.primaryDark, 
          fontSize: 'clamp(14px, 3vw, 18px)', 
          fontWeight: 600, 
          textAlign: 'center',
          fontFamily: "'Poppins', sans-serif",
          animation: 'slideIn 0.3s ease'
        }}>
          {message}
        </div>
      )}

      <div style={{ 
        padding: 'clamp(20px, 4vw, 40px)', 
        display: 'flex', 
        justifyContent: 'center', 
        background: COLORS.neutral.lighter,
        overflow: 'auto'
      }}>
        <div style={{ 
          border: `4px solid ${COLORS.primaryDark}`, 
          borderRadius: '12px', 
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          maxWidth: '100%',
          animation: 'scaleIn 0.6s ease'
        }}>
          <canvas 
            ref={canvasRef} 
            onClick={handleCanvasClick} 
            style={{ 
              display: 'block', 
              cursor: isAnimating ? 'wait' : 'crosshair',
              maxWidth: '100%',
              height: 'auto'
            }} 
          />
        </div>
      </div>

      <div style={{ 
        padding: 'clamp(20px, 4vw, 30px)', 
        background: COLORS.secondaryLight,
        borderTop: `4px solid ${COLORS.secondary}`,
        animation: 'slideIn 0.6s ease 0.3s backwards'
      }}>
        <h3 style={{ 
          margin: '0 0 15px 0', 
          fontSize: 'clamp(18px, 4vw, 24px)', 
          color: COLORS.secondaryDark, 
          fontWeight: 700,
          fontFamily: "'Poppins', sans-serif" 
        }}>
          💡 Did You Know?
        </h3>
        <ul style={{ 
          margin: 0, 
          paddingLeft: '20px', 
          fontSize: 'clamp(14px, 2.5vw, 16px)', 
          lineHeight: '1.8', 
          color: COLORS.neutral.dark,
          fontFamily: "'Poppins', sans-serif"
        }}>
          <li>A grid with an <strong>odd number of cells</strong> cannot be tiled with 2×1 tiles!</li>
          <li>Only <strong>three regular polygons</strong> tile a plane: triangles, squares, hexagons</li>
          <li><strong>Bee hives</strong> use hexagonal tiling for maximum efficiency</li>
        </ul>
      </div>
    </div>
  );

  const renderPracticeMode = () => {
    const currentQuestion = mcqQuestions[currentQuestionIndex];
    const selectedAnswer = selectedAnswers[currentQuestion.id];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    return (
      <div style={{ animation: 'fadeIn 0.5s ease' }}>
        <div style={{ 
          background: COLORS.gradient.primary, 
          padding: 'clamp(20px, 5vw, 40px)', 
          color: '#FFF' 
        }}>
          <h1 style={{ 
            margin: '0 0 10px 0', 
            fontSize: 'clamp(24px, 5vw, 42px)', 
            fontWeight: 700,
            fontFamily: "'Poppins', sans-serif",
            animation: 'slideIn 0.6s ease'
          }}>
            Practice Questions
          </h1>
          <p style={{ 
            margin: 0, 
            fontSize: 'clamp(14px, 3vw, 18px)', 
            opacity: 0.95,
            fontFamily: "'Poppins', sans-serif",
            animation: 'slideIn 0.6s ease 0.1s backwards'
          }}>
            Test your understanding
          </p>
        </div>

        {showStepIndicator && (
          <div style={{ 
            padding: 'clamp(15px, 3vw, 20px)', 
            background: COLORS.neutral.lighter, 
            borderBottom: `3px solid ${COLORS.neutral.light}`,
            animation: 'slideIn 0.5s ease'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '15px',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{ 
                fontSize: 'clamp(14px, 3vw, 18px)', 
                fontWeight: 700,
                fontFamily: "'Poppins', sans-serif",
                color: COLORS.neutral.dark
              }}>
                Question {currentQuestionIndex + 1} of {mcqQuestions.length}
              </div>
            </div>
            <div style={{ 
              width: '100%', 
              height: '10px', 
              background: COLORS.neutral.light, 
              borderRadius: '5px', 
              overflow: 'hidden' 
            }}>
              <div style={{ 
                width: `${((currentQuestionIndex + 1) / mcqQuestions.length) * 100}%`, 
                height: '100%', 
                background: COLORS.gradient.primary, 
                transition: `width ${500 / animationSpeed}ms ease` 
              }} />
            </div>
          </div>
        )}

        <div style={{ padding: 'clamp(20px, 4vw, 40px)' }}>
          <div style={{ 
            background: '#FFF', 
            padding: 'clamp(20px, 4vw, 30px)', 
            borderRadius: '15px', 
            boxShadow: '0 5px 20px rgba(0,0,0,0.1)', 
            marginBottom: 'clamp(20px, 4vw, 30px)',
            animation: 'scaleIn 0.5s ease'
          }}>
            <h2 style={{ 
              margin: '0 0 clamp(20px, 4vw, 30px) 0', 
              fontSize: 'clamp(18px, 4vw, 24px)', 
              lineHeight: '1.6',
              fontFamily: "'Poppins', sans-serif",
              color: COLORS.neutral.dark,
              fontWeight: 600,
              animation: 'slideIn 0.6s ease'
            }}>
              {currentQuestion.question}
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const showResult = showExplanation;
                const isCorrectOption = index === currentQuestion.correctAnswer;
                
                let bg = COLORS.neutral.lighter, border = COLORS.neutral.medium, color = COLORS.neutral.dark;
                if (showResult) {
                  if (isCorrectOption) { 
                    bg = COLORS.secondaryLight; 
                    border = COLORS.secondary; 
                    color = COLORS.secondaryDark; 
                  } else if (isSelected) { 
                    bg = COLORS.primaryLight; 
                    border = COLORS.primary; 
                    color = COLORS.primaryDark; 
                  }
                } else if (isSelected) {
                  bg = COLORS.primaryLight; 
                  border = COLORS.primary;
                }

                return (
                  <button 
                    key={index} 
                    onClick={() => !showExplanation && setSelectedAnswers({ ...selectedAnswers, [currentQuestion.id]: index })}
                    disabled={showExplanation}
                    style={{ 
                      padding: 'clamp(15px, 3vw, 20px)', 
                      background: bg, 
                      border: `3px solid ${border}`, 
                      borderRadius: '12px', 
                      cursor: showExplanation ? 'default' : 'pointer', 
                      fontSize: 'clamp(14px, 2.5vw, 16px)', 
                      textAlign: 'left', 
                      color, 
                      fontWeight: isSelected || isCorrectOption ? 600 : 400,
                      fontFamily: "'Poppins', sans-serif",
                      transition: `all ${200 / animationSpeed}ms`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      animation: `slideIn 0.4s ease ${index * 0.1}s backwards`
                    }}
                    onMouseEnter={(e) => {
                      if (!showExplanation) {
                        e.currentTarget.style.transform = 'translateX(5px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <span>
                      <span style={{ marginRight: '15px', fontWeight: 700 }}>
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {option}
                    </span>
                    {showResult && isCorrectOption && <span style={{ fontSize: '24px', flexShrink: 0 }}>✓</span>}
                    {showResult && isSelected && !isCorrectOption && <span style={{ fontSize: '24px', flexShrink: 0 }}>✗</span>}
                  </button>
                );
              })}
            </div>

            {!showExplanation && selectedAnswer !== undefined && (
              <div style={{ marginTop: 'clamp(20px, 4vw, 30px)', display: 'flex', justifyContent: 'center' }}>
                <Button onClick={() => setShowExplanation(true)} color="secondary" fullWidth>
                  Submit Answer
                </Button>
              </div>
            )}
          </div>

          {showExplanation && (
            <div style={{ 
              background: isCorrect ? COLORS.secondaryLight : COLORS.primaryLight, 
              padding: 'clamp(20px, 4vw, 30px)', 
              borderRadius: '15px', 
              border: `3px solid ${isCorrect ? COLORS.secondary : COLORS.primary}`,
              animation: 'scaleIn 0.5s ease'
            }}>
              <h3 style={{ 
                margin: '0 0 15px 0', 
                fontSize: 'clamp(18px, 4vw, 24px)', 
                color: isCorrect ? COLORS.secondaryDark : COLORS.primaryDark,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                {isCorrect ? '🎉 Correct!' : '❌ Not Quite!'}
              </h3>
              <p style={{ 
                margin: 0, 
                fontSize: 'clamp(14px, 2.5vw, 16px)', 
                lineHeight: '1.8',
                fontFamily: "'Poppins', sans-serif",
                color: COLORS.neutral.dark
              }}>
                <strong>Explanation:</strong> {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>

        {showNavigation && (
          <div style={{ 
            padding: 'clamp(15px, 3vw, 20px)', 
            background: COLORS.neutral.lighter, 
            borderTop: `3px solid ${COLORS.neutral.light}`, 
            display: 'flex', 
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <Button 
              onClick={() => { 
                if (currentQuestionIndex > 0) { 
                  setCurrentQuestionIndex(currentQuestionIndex - 1); 
                  setShowExplanation(false); 
                } 
              }}
              disabled={currentQuestionIndex === 0}
              variant="outlined"
              color="primary"
            >
              ← Previous
            </Button>
            <Button 
              onClick={() => { 
                if (currentQuestionIndex < mcqQuestions.length - 1) { 
                  setCurrentQuestionIndex(currentQuestionIndex + 1); 
                  setShowExplanation(false); 
                } 
              }}
              disabled={currentQuestionIndex === mcqQuestions.length - 1}
              variant="outlined"
              color="primary"
            >
              Next →
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderRealWorldMode = () => {
    const currentExample = realWorldExamples[currentExampleIndex];

    return (
      <div style={{ animation: 'fadeIn 0.5s ease' }}>
        <div style={{ 
          background: COLORS.gradient.secondary, 
          padding: 'clamp(20px, 5vw, 40px)', 
          color: '#FFF' 
        }}>
          <h1 style={{ 
            margin: '0 0 10px 0', 
            fontSize: 'clamp(24px, 5vw, 42px)', 
            fontWeight: 700,
            fontFamily: "'Poppins', sans-serif",
            animation: 'slideIn 0.6s ease'
          }}>
            Real World Applications
          </h1>
          <p style={{ 
            margin: 0, 
            fontSize: 'clamp(14px, 3vw, 18px)', 
            opacity: 0.95,
            fontFamily: "'Poppins', sans-serif",
            animation: 'slideIn 0.6s ease 0.1s backwards'
          }}>
            See tiling in nature, art, and technology
          </p>
        </div>

        {showStepIndicator && (
          <div style={{ 
            padding: 'clamp(15px, 3vw, 20px)', 
            background: COLORS.neutral.lighter, 
            borderBottom: `3px solid ${COLORS.neutral.light}`, 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '15px',
            flexWrap: 'wrap',
            animation: 'slideIn 0.5s ease'
          }}>
            <div style={{ 
              fontSize: 'clamp(14px, 3vw, 18px)', 
              fontWeight: 700,
              fontFamily: "'Poppins', sans-serif",
              color: COLORS.neutral.dark
            }}>
              Example {currentExampleIndex + 1} of {realWorldExamples.length}
            </div>
            <div style={{ 
              width: 'clamp(150px, 30vw, 200px)', 
              height: '10px', 
              background: COLORS.neutral.light, 
              borderRadius: '5px', 
              overflow: 'hidden' 
            }}>
              <div style={{ 
                width: `${((currentExampleIndex + 1) / realWorldExamples.length) * 100}%`, 
                height: '100%', 
                background: COLORS.gradient.secondary, 
                transition: `width ${500 / animationSpeed}ms ease` 
              }} />
            </div>
          </div>
        )}

        <div style={{ padding: 'clamp(20px, 4vw, 40px)' }}>
          <div style={{ 
            background: '#FFF', 
            padding: 'clamp(25px, 5vw, 40px)', 
            borderRadius: '15px', 
            boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
            animation: 'scaleIn 0.5s ease'
          }}>
            <div style={{ 
              fontSize: 'clamp(50px, 12vw, 80px)', 
              textAlign: 'center', 
              marginBottom: 'clamp(20px, 4vw, 30px)',
              animation: 'pulse 2s ease infinite'
            }}>
              {currentExample.image}
            </div>
            <h2 style={{ 
              margin: '0 0 clamp(15px, 3vw, 20px) 0', 
              fontSize: 'clamp(20px, 5vw, 32px)', 
              color: COLORS.secondaryDark, 
              textAlign: 'center', 
              fontWeight: 700,
              fontFamily: "'Poppins', sans-serif",
              animation: 'slideIn 0.6s ease'
            }}>
              {currentExample.title}
            </h2>
            
            <div style={{ 
              background: COLORS.neutral.lighter, 
              padding: 'clamp(20px, 4vw, 25px)', 
              borderRadius: '12px', 
              marginBottom: 'clamp(20px, 4vw, 25px)', 
              borderLeft: `5px solid ${COLORS.secondary}`,
              animation: 'slideIn 0.6s ease 0.1s backwards'
            }}>
              <h3 style={{ 
                margin: '0 0 10px 0', 
                fontSize: 'clamp(16px, 3vw, 18px)', 
                fontWeight: 700,
                fontFamily: "'Poppins', sans-serif",
                color: COLORS.neutral.dark
              }}>
                📖 Description
              </h3>
              <p style={{ 
                margin: 0, 
                fontSize: 'clamp(14px, 2.5vw, 16px)', 
                lineHeight: '1.8',
                fontFamily: "'Poppins', sans-serif",
                color: COLORS.neutral.dark
              }}>
                {currentExample.description}
              </p>
            </div>
            
            <div style={{ 
              background: COLORS.primaryLight, 
              padding: 'clamp(20px, 4vw, 25px)', 
              borderRadius: '12px', 
              marginBottom: 'clamp(20px, 4vw, 25px)', 
              borderLeft: `5px solid ${COLORS.primary}`,
              animation: 'slideIn 0.6s ease 0.2s backwards'
            }}>
              <h3 style={{ 
                margin: '0 0 10px 0', 
                fontSize: 'clamp(16px, 3vw, 18px)', 
                fontWeight: 700,
                fontFamily: "'Poppins', sans-serif",
                color: COLORS.neutral.dark
              }}>
                🔗 Connection to Tiling
              </h3>
              <p style={{ 
                margin: 0, 
                fontSize: 'clamp(14px, 2.5vw, 16px)', 
                lineHeight: '1.8',
                fontFamily: "'Poppins', sans-serif",
                color: COLORS.neutral.dark
              }}>
                {currentExample.connection}
              </p>
            </div>
            
            <div style={{ 
              background: COLORS.secondaryLight, 
              padding: 'clamp(20px, 4vw, 25px)', 
              borderRadius: '12px', 
              borderLeft: `5px solid ${COLORS.secondaryDark}`,
              animation: 'slideIn 0.6s ease 0.3s backwards'
            }}>
              <h3 style={{ 
                margin: '0 0 10px 0', 
                fontSize: 'clamp(16px, 3vw, 18px)', 
                color: COLORS.secondaryDark, 
                fontWeight: 700,
                fontFamily: "'Poppins', sans-serif"
              }}>
                💡 Fun Fact
              </h3>
              <p style={{ 
                margin: 0, 
                fontSize: 'clamp(14px, 2.5vw, 16px)', 
                lineHeight: '1.8',
                fontFamily: "'Poppins', sans-serif",
                color: COLORS.neutral.dark
              }}>
                {currentExample.funFact}
              </p>
            </div>
          </div>
        </div>

        {showNavigation && (
          <div style={{ 
            padding: 'clamp(15px, 3vw, 20px)', 
            background: COLORS.neutral.lighter, 
            borderTop: `3px solid ${COLORS.neutral.light}`, 
            display: 'flex', 
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <Button 
              onClick={() => currentExampleIndex > 0 && setCurrentExampleIndex(currentExampleIndex - 1)}
              disabled={currentExampleIndex === 0}
              variant="outlined"
              color="secondary"
            >
              ← Previous
            </Button>
            <Button 
              onClick={() => currentExampleIndex < realWorldExamples.length - 1 && setCurrentExampleIndex(currentExampleIndex + 1)}
              disabled={currentExampleIndex === realWorldExamples.length - 1}
              variant="outlined"
              color="secondary"
            >
              Next →
            </Button>
          </div>
        )}
      </div>
    );
  };

  // Filter enabled modes
  const visibleModes = enabledModes.filter(mode => 
    mode === 'learn' || mode === 'practice' || mode === 'realworld'
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: COLORS.gradient.primary, 
      fontFamily: "'Poppins', sans-serif", 
      padding: 0 
    }}>
      {showModeSelector && (
        <nav style={{ 
          background: COLORS.primaryDark,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)', 
          position: 'sticky', 
          top: 0, 
          zIndex: 1000,
          animation: 'slideIn 0.5s ease'
        }}>
          <div style={{ 
            maxWidth: '1400px', 
            margin: '0 auto', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '0 clamp(15px, 4vw, 40px)',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ 
              color: '#FFF', 
              fontSize: 'clamp(18px, 4vw, 24px)', 
              fontWeight: 700, 
              letterSpacing: '2px', 
              padding: 'clamp(15px, 3vw, 20px) 0',
              fontFamily: "'Poppins', sans-serif"
            }}>
              🔷 TILING EXPLORER
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {visibleModes.map((mode, idx) => {
                const labels = {
                  learn: '📚 Learn',
                  practice: '✍️ Practice',
                  realworld: '🌍 Real World'
                };
                return (
                  <button 
                    key={mode}
                    onClick={() => { 
                      setNavMode(mode); 
                      if (mode === 'practice') { 
                        setCurrentQuestionIndex(0); 
                        setShowExplanation(false); 
                      } else if (mode === 'realworld') setCurrentExampleIndex(0); 
                    }}
                    style={{ 
                      padding: 'clamp(10px, 2.5vw, 14px) clamp(20px, 4vw, 32px)', 
                      background: navMode === mode ? COLORS.secondary : 'rgba(255,255,255,0.15)', 
                      color: '#FFF', 
                      border: navMode === mode ? `3px solid ${COLORS.secondaryDark}` : '3px solid rgba(255,255,255,0.3)', 
                      borderRadius: '50px',
                      cursor: 'pointer', 
                      fontSize: 'clamp(13px, 2.5vw, 16px)', 
                      fontWeight: 600, 
                      transition: `all ${300 / animationSpeed}ms`,
                      fontFamily: "'Poppins', sans-serif",
                      whiteSpace: 'nowrap',
                      boxShadow: navMode === mode ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
                      transform: navMode === mode ? 'translateY(-2px)' : 'translateY(0)',
                      animation: `scaleIn 0.4s ease ${idx * 0.1}s backwards`
                    }}
                    onMouseEnter={(e) => {
                      if (navMode !== mode) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (navMode !== mode) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    {labels[mode]}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      )}

      <div style={{ 
        maxWidth: '1400px', 
        margin: 'clamp(20px, 4vw, 40px) auto', 
        background: '#FFF', 
        borderRadius: '20px', 
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)', 
        overflow: 'hidden',
        marginLeft: 'clamp(10px, 2vw, 40px)',
        marginRight: 'clamp(10px, 2vw, 40px)',
        animation: 'scaleIn 0.6s ease'
      }}>
        {navMode === 'learn' && renderLearnMode()}
        {navMode === 'practice' && renderPracticeMode()}
        {navMode === 'realworld' && renderRealWorldMode()}
      </div>
    </div>
  );
};

export default TilingExplorer;