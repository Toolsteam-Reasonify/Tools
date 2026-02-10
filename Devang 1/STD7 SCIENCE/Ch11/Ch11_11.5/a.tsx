// @ts-ignore - React types should be available via @types/react package
import React, { useState, useEffect, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

type ModeType = 'learn' | 'practice' | 'real_world' | 'hands_on';

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  stepDescription: string;
}

interface LightRay {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  animated: boolean;
  progress?: number;
}

interface Mirror {
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
}

interface ReflectionAdditionalProps {
  initialAngle?: number;
  showGrid?: boolean;
  lightColor?: string;
  mirrorCount?: number;
  showAngles?: boolean;
  autoRotate?: boolean;
}

interface ReflectionOfLightConfig {
  width?: number;
  height?: number;
  initialMode?: ModeType;
  showModeSelector?: boolean;
  enabledModes?: ModeType[];
  showNavigation?: boolean;
  showPlayPause?: boolean;
  showStepIndicator?: boolean;
  initialStep?: number;
  filterSteps?: number[];
  animationSpeed?: number;
  autoPlayDuration?: number;
  themeColor?: string;
  darkMode?: boolean;
  additionalProps?: ReflectionAdditionalProps;
}

interface ReflectionOfLightProps {
  props?: ReflectionOfLightConfig;
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

interface StepData {
  id: number;
  mode: ModeType;
  title: string;
  description: string;
  content: React.ReactNode;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const ReflectionOfLight: React.FC<ReflectionOfLightProps> = ({
  props,
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  // Extract props with defaults
  const config: ReflectionOfLightConfig = props || {};
  const {
    width = 800,
    height = 600,
    initialMode = 'learn',
    showModeSelector = true,
    enabledModes = ['learn', 'practice', 'real_world', 'hands_on'],
    showNavigation = true,
    showPlayPause = true,
    showStepIndicator = true,
    initialStep = 1,
    filterSteps,
    animationSpeed = 1,
    autoPlayDuration = 8000,
    themeColor = '#3b82f6',
    darkMode = false,
    additionalProps = {},
  } = config;

  // State management
  const [currentMode, setCurrentMode] = useState<ModeType>(initialMode);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [mirrorAngle, setMirrorAngle] = useState(additionalProps.initialAngle || 45);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [practiceScore, setPracticeScore] = useState(0);
  const [handsOnCompleted, setHandsOnCompleted] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  // Easing functions
  const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
  const easeInOutQuad = (t: number): number =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const easeOutElastic = (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  };

  // Steps data
  const allSteps: StepData[] = [
    // LEARN MODE
    {
      id: 1,
      mode: 'learn',
      title: 'What is Reflection of Light?',
      description: 'When light hits a shiny surface like a mirror, it bounces back. This bouncing back of light is called reflection.',
      content: null,
    },
    {
      id: 2,
      mode: 'learn',
      title: 'How Does Light Reflect?',
      description: 'Light travels in straight lines. When it hits a mirror, it changes direction but still travels in a straight line.',
      content: null,
    },
    {
      id: 3,
      mode: 'learn',
      title: 'Laws of Reflection',
      description: 'The angle at which light hits the mirror equals the angle at which it bounces back. Both angles are measured from an imaginary line perpendicular to the mirror.',
      content: null,
    },
    {
      id: 4,
      mode: 'learn',
      title: 'Mirrors and Images',
      description: 'When you look in a mirror, you see your reflection. The image appears to be behind the mirror at the same distance as you are in front of it.',
      content: null,
    },
    // PRACTICE MODE
    {
      id: 5,
      mode: 'practice',
      title: 'Question 1: What is Reflection?',
      description: 'What happens when light hits a mirror?',
      content: null,
    },
    {
      id: 6,
      mode: 'practice',
      title: 'Question 2: Light Travel',
      description: 'How does light travel?',
      content: null,
    },
    {
      id: 7,
      mode: 'practice',
      title: 'Question 3: Angle of Reflection',
      description: 'If light hits a mirror at 30° from the perpendicular, at what angle does it reflect?',
      content: null,
    },
    // REAL WORLD MODE
    {
      id: 8,
      mode: 'real_world',
      title: 'Mirrors in Daily Life',
      description: 'We use mirrors every day - bathroom mirrors, car rearview mirrors, and even in periscopes!',
      content: null,
    },
    {
      id: 9,
      mode: 'real_world',
      title: 'Periscopes',
      description: 'Periscopes use two mirrors to help us see around corners or over obstacles.',
      content: null,
    },
    {
      id: 10,
      mode: 'real_world',
      title: 'Kaleidoscopes',
      description: 'Kaleidoscopes use multiple mirrors to create beautiful symmetrical patterns through reflection.',
      content: null,
    },
    // HANDS ON MODE
    {
      id: 11,
      mode: 'hands_on',
      title: 'Experiment: Control the Mirror',
      description: 'Adjust the mirror angle and observe how the reflected light changes direction.',
      content: null,
    },
  ];

  // Filter steps if needed
  const steps = filterSteps
    ? allSteps.filter(step => filterSteps.includes(step.id))
    : allSteps.filter(step => enabledModes.includes(step.mode));

  const modeSteps = steps.filter(step => step.mode === currentMode);
  const currentStepData = modeSteps.find((_, idx) => idx === currentStep - 1) || modeSteps[0];
  const totalSteps = modeSteps.length;

  // Update parent component
  useEffect(() => {
    if (setStepDetails && currentStepData) {
      setStepDetails({
        currentStep,
        totalSteps,
        stepTitle: currentStepData.title,
        stepDescription: currentStepData.description,
      });
    }
  }, [currentStep, currentStepData, totalSteps, setStepDetails]);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && !stopAutoNext && autoPlayDuration > 0) {
      const timer = setTimeout(() => {
        handleNext();
      }, autoPlayDuration / animationSpeed);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStep, stopAutoNext, autoPlayDuration, animationSpeed]);

  // Animation loop
  useEffect(() => {
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const duration = 2000 / animationSpeed;
      const progress = Math.min(elapsed / duration, 1);
      
      setAnimationProgress(easeInOutQuad(progress));
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        startTime = timestamp;
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animationSpeed]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawScene = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      if (currentMode === 'learn') {
        // Draw different scenes based on step
        if (currentStepData.id === 1) {
          drawBasicReflection(ctx, centerX, centerY);
        } else if (currentStepData.id === 2) {
          drawLightPath(ctx, centerX, centerY);
        } else if (currentStepData.id === 3) {
          drawLawsOfReflection(ctx, centerX, centerY);
        } else if (currentStepData.id === 4) {
          drawMirrorImage(ctx, centerX, centerY);
        }
      } else if (currentMode === 'real_world') {
        if (currentStepData.id === 8) {
          drawDailyMirrors(ctx, centerX, centerY);
        } else if (currentStepData.id === 9) {
          drawPeriscope(ctx, centerX, centerY);
        } else if (currentStepData.id === 10) {
          drawKaleidoscope(ctx, centerX, centerY);
        }
      } else if (currentMode === 'hands_on') {
        drawInteractiveMirror(ctx, centerX, centerY, mirrorAngle);
      }
    };

    drawScene();
  }, [currentStepData, animationProgress, mirrorAngle, currentMode]);

  // Drawing functions
  const drawBasicReflection = (ctx: CanvasRenderingContext2D, cx: number, cy: number) => {
    const progress = animationProgress;

    // Draw mirror
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(0);
    
    // Mirror surface
    ctx.fillStyle = darkMode ? '#60a5fa' : '#3b82f6';
    ctx.fillRect(-5, -100, 10, 200);
    
    // Mirror shine effect
    const gradient = ctx.createLinearGradient(-5, -100, 10, 200);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.8)');
    ctx.fillStyle = gradient;
    ctx.fillRect(-3, -100, 6, 200);
    
    ctx.restore();

    // Calculate the point where the incident ray hits the mirror
    // Incident ray: from (cx - 200, cy - 80) to mirror at x = cx
    // When rayLength = 200, endpoint is (cx, cy - 80 + 200 * 0.5) = (cx, cy + 20)
    const mirrorHitX = cx;
    const mirrorHitY = cy + 20;

    // Phase 1: Incoming ray reaches the mirror (first 60% of animation)
    const incomingPhaseProgress = Math.min(1, progress / 0.6);
    const rayLength = 200 * easeOutCubic(incomingPhaseProgress);
    ctx.strokeStyle = additionalProps.lightColor || '#fbbf24';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 10;
    ctx.shadowColor = additionalProps.lightColor || '#fbbf24';
    
    ctx.beginPath();
    ctx.moveTo(cx - 200, cy - 80);
    const incidentEndX = cx - 200 + rayLength;
    const incidentEndY = cy - 80 + rayLength * 0.5;
    ctx.lineTo(incidentEndX, incidentEndY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Phase 2: Draw reflected ray (only after incoming ray has touched the mirror)
    if (progress > 0.6) {
      const reflectProgress = (progress - 0.6) / 0.4; // Remaining 40% of animation
      const reflectLength = 150 * easeOutCubic(reflectProgress);
      
      ctx.strokeStyle = additionalProps.lightColor || '#fbbf24';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 10;
      ctx.shadowColor = additionalProps.lightColor || '#fbbf24';
      
      // Reflected ray starts from the exact point where incident ray hits the mirror
      ctx.beginPath();
      ctx.moveTo(mirrorHitX, mirrorHitY);
      ctx.lineTo(mirrorHitX + reflectLength, mirrorHitY - reflectLength * 0.5);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Draw light source
    const pulseScale = 1 + Math.sin(animationProgress * Math.PI * 4) * 0.1;
    ctx.fillStyle = additionalProps.lightColor || '#fbbf24';
    ctx.beginPath();
    ctx.arc(cx - 200, cy - 80, 8 * pulseScale, 0, Math.PI * 2);
    ctx.fill();

    // Glow effect
    const glowGradient = ctx.createRadialGradient(cx - 200, cy - 80, 0, cx - 200, cy - 80, 25 * pulseScale);
    glowGradient.addColorStop(0, 'rgba(251, 191, 36, 0.6)');
    glowGradient.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(cx - 200, cy - 80, 25 * pulseScale, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawLightPath = (ctx: CanvasRenderingContext2D, cx: number, cy: number) => {
    const progress = animationProgress;

    // Draw multiple straight light rays to show light travels in straight lines
    for (let i = 0; i < 5; i++) {
      const yOffset = (i - 2) * 40;
      const rayProgress = Math.max(0, Math.min(1, (progress - i * 0.1) * 1.5));
      const rayLength = 300 * easeOutCubic(rayProgress);

      ctx.strokeStyle = `rgba(251, 191, 36, ${0.4 + i * 0.1})`;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#fbbf24';

      ctx.beginPath();
      ctx.moveTo(cx - 150, cy + yOffset);
      ctx.lineTo(cx - 150 + rayLength, cy + yOffset);
      ctx.stroke();

      // Arrow head at the end
      if (rayProgress > 0.8) {
        const arrowX = cx - 150 + rayLength;
        const arrowY = cy + yOffset;
        
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX - 10, arrowY - 5);
        ctx.lineTo(arrowX - 10, arrowY + 5);
        ctx.closePath();
        ctx.fill();
      }
    }
    ctx.shadowBlur = 0;
  };

  const drawLawsOfReflection = (ctx: CanvasRenderingContext2D, cx: number, cy: number) => {
    const progress = animationProgress;

    // Draw mirror
    ctx.strokeStyle = darkMode ? '#60a5fa' : '#3b82f6';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(cx - 100, cy + 50);
    ctx.lineTo(cx + 100, cy + 50);
    ctx.stroke();

    // Draw normal (perpendicular line)
    if (progress > 0.2) {
      ctx.strokeStyle = darkMode ? '#94a3b8' : '#64748b';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(cx, cy + 50);
      ctx.lineTo(cx, cy - 100);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label "Normal"
      ctx.fillStyle = darkMode ? '#e2e8f0' : '#1e293b';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Normal', cx + 30, cy - 80);
    }

    // Draw incident ray
    if (progress > 0.4) {
      const angle = 35 * (Math.PI / 180);
      const rayLength = 80;
      
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#fbbf24';
      
      ctx.beginPath();
      ctx.moveTo(cx - rayLength * Math.sin(angle), cy + 50 - rayLength * Math.cos(angle));
      ctx.lineTo(cx, cy + 50);
      ctx.stroke();

      // Draw angle arc
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(cx, cy + 50, 30, -Math.PI / 2, -Math.PI / 2 + angle, false);
      ctx.stroke();

      // Label incident angle
      ctx.fillStyle = '#ef4444';
      ctx.font = '12px Arial';
      ctx.fillText('i', cx - 15, cy + 25);
    }

    // Draw reflected ray
    if (progress > 0.6) {
      const angle = 35 * (Math.PI / 180);
      const rayLength = 80;
      
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#fbbf24';
      
      ctx.beginPath();
      ctx.moveTo(cx, cy + 50);
      ctx.lineTo(cx + rayLength * Math.sin(angle), cy + 50 - rayLength * Math.cos(angle));
      ctx.stroke();

      // Draw angle arc
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(cx, cy + 50, 30, -Math.PI / 2 - angle, -Math.PI / 2, true);
      ctx.stroke();

      // Label reflected angle
      ctx.fillStyle = '#10b981';
      ctx.font = '12px Arial';
      ctx.fillText('r', cx + 15, cy + 25);
    }

    // Show equality
    if (progress > 0.8) {
      ctx.fillStyle = darkMode ? '#e2e8f0' : '#1e293b';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Angle i = Angle r', cx, cy + 100);
    }
  };

  const drawMirrorImage = (ctx: CanvasRenderingContext2D, cx: number, cy: number) => {
    const progress = animationProgress;

    // Draw mirror
    ctx.fillStyle = darkMode ? '#60a5fa' : '#3b82f6';
    ctx.fillRect(cx - 5, cy - 120, 10, 240);

    // Mirror shine
    const gradient = ctx.createLinearGradient(cx - 5, cy - 120, cx + 5, cy + 120);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.6)');
    ctx.fillStyle = gradient;
    ctx.fillRect(cx - 3, cy - 120, 6, 240);

    // Draw object (arrow)
    const objectX = cx - 100;
    const objectScale = Math.min(1, progress * 2);
    
    ctx.save();
    ctx.translate(objectX, cy);
    ctx.scale(objectScale, objectScale);
    
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(0, -40);
    ctx.lineTo(-15, -20);
    ctx.lineTo(-5, -20);
    ctx.lineTo(-5, 40);
    ctx.lineTo(5, 40);
    ctx.lineTo(5, -20);
    ctx.lineTo(15, -20);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();

    // Draw image (reflected arrow) - appears after object
    if (progress > 0.5) {
      const imageProgress = (progress - 0.5) * 2;
      const imageX = cx + 100;
      const imageAlpha = imageProgress * 0.7;
      
      ctx.save();
      ctx.translate(imageX, cy);
      ctx.scale(imageProgress, imageProgress);
      ctx.globalAlpha = imageAlpha;
      
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(0, -40);
      ctx.lineTo(15, -20);
      ctx.lineTo(5, -20);
      ctx.lineTo(5, 40);
      ctx.lineTo(-5, 40);
      ctx.lineTo(-5, -20);
      ctx.lineTo(-15, -20);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();

      // Dashed lines showing equal distance
      if (imageProgress > 0.7) {
        ctx.strokeStyle = darkMode ? '#94a3b8' : '#64748b';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        ctx.beginPath();
        ctx.moveTo(objectX, cy - 60);
        ctx.lineTo(cx, cy - 60);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(cx, cy - 60);
        ctx.lineTo(imageX, cy - 60);
        ctx.stroke();
        
        ctx.setLineDash([]);

        // Distance labels
        ctx.fillStyle = darkMode ? '#e2e8f0' : '#1e293b';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('d', objectX + (cx - objectX) / 2, cy - 70);
        ctx.fillText('d', cx + (imageX - cx) / 2, cy - 70);
      }
    }

    // Label
    if (progress > 0.8) {
      ctx.fillStyle = darkMode ? '#e2e8f0' : '#1e293b';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Object', objectX, cy + 70);
      ctx.fillText('Image', cx + 100, cy + 70);
    }
  };

  const drawDailyMirrors = (ctx: CanvasRenderingContext2D, cx: number, cy: number) => {
    const progress = animationProgress;

    // Draw bathroom mirror
    if (progress > 0) {
      const mirrorProgress = Math.min(1, progress * 2);
      ctx.save();
      ctx.globalAlpha = mirrorProgress;
      
      // Mirror frame
      ctx.fillStyle = '#8b4513';
      ctx.fillRect(cx - 150, cy - 100, 100, 120);
      
      // Mirror surface
      const mirrorGradient = ctx.createLinearGradient(cx - 140, cy - 90, cx - 60, cy + 10);
      mirrorGradient.addColorStop(0, '#b8c4d1');
      mirrorGradient.addColorStop(1, '#7a8ea3');
      ctx.fillStyle = mirrorGradient;
      ctx.fillRect(cx - 140, cy - 90, 80, 100);
      
      // Reflection
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(cx - 135, cy - 85, 30, 90);
      
      ctx.fillStyle = darkMode ? '#e2e8f0' : '#1e293b';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Bathroom', cx - 100, cy + 35);
      
      ctx.restore();
    }

    // Draw car mirror
    if (progress > 0.3) {
      const carProgress = Math.min(1, (progress - 0.3) * 2);
      ctx.save();
      ctx.globalAlpha = carProgress;
      
      // Mirror shape (rounded rectangle)
      ctx.fillStyle = '#2c3e50';
      ctx.beginPath();
      ctx.roundRect(cx - 20, cy - 80, 80, 50, 10);
      ctx.fill();
      
      // Mirror surface
      ctx.fillStyle = '#7a8ea3';
      ctx.beginPath();
      ctx.roundRect(cx - 15, cy - 75, 70, 40, 8);
      ctx.fill();
      
      // Reflection
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(cx - 10, cy - 70, 25, 30);
      
      ctx.fillStyle = darkMode ? '#e2e8f0' : '#1e293b';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Car Mirror', cx + 20, cy - 10);
      
      ctx.restore();
    }

    // Draw periscope mirror
    if (progress > 0.6) {
      const periProgress = Math.min(1, (progress - 0.6) * 2);
      ctx.save();
      ctx.globalAlpha = periProgress;
      
      // Simplified periscope
      ctx.strokeStyle = darkMode ? '#94a3b8' : '#64748b';
      ctx.lineWidth = 3;
      ctx.strokeRect(cx + 80, cy - 90, 50, 120);
      
      // Top mirror
      ctx.save();
      ctx.translate(cx + 105, cy - 75);
      ctx.rotate(45 * Math.PI / 180);
      ctx.fillStyle = '#60a5fa';
      ctx.fillRect(-20, -3, 40, 6);
      ctx.restore();
      
      // Bottom mirror
      ctx.save();
      ctx.translate(cx + 105, cy + 15);
      ctx.rotate(45 * Math.PI / 180);
      ctx.fillStyle = '#60a5fa';
      ctx.fillRect(-20, -3, 40, 6);
      ctx.restore();
      
      ctx.fillStyle = darkMode ? '#e2e8f0' : '#1e293b';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Periscope', cx + 105, cy + 45);
      
      ctx.restore();
    }
  };

  const drawPeriscope = (ctx: CanvasRenderingContext2D, cx: number, cy: number) => {
    const progress = animationProgress;

    // Periscope body with more realistic design
    const tubeWidth = 35;
    const tubeHeight = 220;
    const horizontalLength = 90;
    const horizontalHeight = 35;

    // Main vertical tube
    ctx.fillStyle = darkMode ? '#475569' : '#cbd5e1';
    ctx.strokeStyle = darkMode ? '#64748b' : '#94a3b8';
    ctx.lineWidth = 2;
    ctx.fillRect(cx - tubeWidth/2, cy - tubeHeight/2, tubeWidth, tubeHeight);
    ctx.strokeRect(cx - tubeWidth/2, cy - tubeHeight/2, tubeWidth, tubeHeight);

    // Top horizontal viewing tube
    ctx.fillRect(cx - tubeWidth/2, cy - tubeHeight/2 - horizontalHeight, horizontalLength, horizontalHeight);
    ctx.strokeRect(cx - tubeWidth/2, cy - tubeHeight/2 - horizontalHeight, horizontalLength, horizontalHeight);

    // Bottom horizontal viewing tube
    ctx.fillRect(cx - horizontalLength + tubeWidth/2, cy + tubeHeight/2, horizontalLength, horizontalHeight);
    ctx.strokeRect(cx - horizontalLength + tubeWidth/2, cy + tubeHeight/2, horizontalLength, horizontalHeight);

    // Mirror positions (45-degree angles for proper reflection)
    const mirror1X = cx + 30;
    const mirror1Y = cy - 100;
    const mirror2X = cx - 30;
    const mirror2Y = cy + 100;
    const mirrorSize = 35;

    // Top mirror (45 degrees, reflects light downward)
    ctx.save();
    ctx.translate(mirror1X, mirror1Y);
    ctx.rotate(45 * Math.PI / 180);
    
    // Mirror surface with gradient
    const mirrorGradient1 = ctx.createLinearGradient(-mirrorSize/2, -3, mirrorSize/2, 3);
    mirrorGradient1.addColorStop(0, '#3b82f6');
    mirrorGradient1.addColorStop(0.5, '#60a5fa');
    mirrorGradient1.addColorStop(1, '#3b82f6');
    ctx.fillStyle = mirrorGradient1;
    ctx.fillRect(-mirrorSize/2, -4, mirrorSize, 8);
    
    // Mirror shine/highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(-mirrorSize/2, -4, mirrorSize * 0.4, 8);
    
    // Mirror border
    ctx.strokeStyle = darkMode ? '#1e40af' : '#1e3a8a';
    ctx.lineWidth = 1;
    ctx.strokeRect(-mirrorSize/2, -4, mirrorSize, 8);
    ctx.restore();

    // Bottom mirror (45 degrees, reflects light upward)
    ctx.save();
    ctx.translate(mirror2X, mirror2Y);
    ctx.rotate(-45 * Math.PI / 180);
    
    // Mirror surface with gradient
    const mirrorGradient2 = ctx.createLinearGradient(-mirrorSize/2, -3, mirrorSize/2, 3);
    mirrorGradient2.addColorStop(0, '#3b82f6');
    mirrorGradient2.addColorStop(0.5, '#60a5fa');
    mirrorGradient2.addColorStop(1, '#3b82f6');
    ctx.fillStyle = mirrorGradient2;
    ctx.fillRect(-mirrorSize/2, -4, mirrorSize, 8);
    
    // Mirror shine/highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(-mirrorSize/2, -4, mirrorSize * 0.4, 8);
    
    // Mirror border
    ctx.strokeStyle = darkMode ? '#1e40af' : '#1e3a8a';
    ctx.lineWidth = 1;
    ctx.strokeRect(-mirrorSize/2, -4, mirrorSize, 8);
    ctx.restore();

    // Light ray animation with proper physics-based reflections
    const lightColor = additionalProps.lightColor || '#fbbf24';
    ctx.strokeStyle = lightColor;
    ctx.lineWidth = 3;
    ctx.shadowBlur = 12;
    ctx.shadowColor = lightColor;

    // Phase 1: Incoming light ray from top (0-30% of animation)
    if (progress > 0) {
      const phase1Progress = Math.min(1, progress / 0.3);
      const incomingStartX = cx + 70;
      const incomingStartY = cy - 120;
      
      // Calculate intersection with mirror 1 (at 45 degrees)
      const mirror1Angle = 45 * Math.PI / 180;
      const dx = mirror1X - incomingStartX;
      const dy = mirror1Y - incomingStartY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const currentDistance = distance * easeOutCubic(phase1Progress);
      const angle = Math.atan2(dy, dx);
      const currentX = incomingStartX + Math.cos(angle) * currentDistance;
      const currentY = incomingStartY + Math.sin(angle) * currentDistance;
      
      ctx.beginPath();
      ctx.moveTo(incomingStartX, incomingStartY);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
      
      // Draw light source
      if (phase1Progress < 1) {
        const pulseScale = 1 + Math.sin(animationProgress * Math.PI * 6) * 0.15;
        ctx.fillStyle = lightColor;
        ctx.beginPath();
        ctx.arc(incomingStartX, incomingStartY, 6 * pulseScale, 0, Math.PI * 2);
        ctx.fill();
        
        const glowGradient = ctx.createRadialGradient(incomingStartX, incomingStartY, 0, incomingStartX, incomingStartY, 20 * pulseScale);
        glowGradient.addColorStop(0, 'rgba(251, 191, 36, 0.6)');
        glowGradient.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(incomingStartX, incomingStartY, 20 * pulseScale, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Phase 2: First reflection from Mirror 1 to Mirror 2 (30-65% of animation)
    if (progress > 0.3) {
      const phase2Progress = Math.min(1, (progress - 0.3) / 0.35);
      
      // Light reflects at 90 degrees from mirror 1 (45 + 45 = 90 degrees down)
      const reflect1Angle = Math.PI / 2; // 90 degrees downward
      const distance1to2 = Math.sqrt((mirror2X - mirror1X) ** 2 + (mirror2Y - mirror1Y) ** 2);
      const currentDistance = distance1to2 * easeOutCubic(phase2Progress);
      
      const currentX = mirror1X + Math.cos(reflect1Angle) * currentDistance;
      const currentY = mirror1Y + Math.sin(reflect1Angle) * currentDistance;
      
      ctx.beginPath();
      ctx.moveTo(mirror1X, mirror1Y);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
    }

    // Phase 3: Second reflection from Mirror 2 outward (65-100% of animation)
    if (progress > 0.65) {
      const phase3Progress = Math.min(1, (progress - 0.65) / 0.35);
      
      // Light reflects at 90 degrees from mirror 2 (upward and to the right)
      const reflect2Angle = -Math.PI / 2; // 90 degrees upward
      const rayLength = 80;
      const currentDistance = rayLength * easeOutCubic(phase3Progress);
      
      const currentX = mirror2X + Math.cos(reflect2Angle) * currentDistance;
      const currentY = mirror2Y + Math.sin(reflect2Angle) * currentDistance;
      
      ctx.beginPath();
      ctx.moveTo(mirror2X, mirror2Y);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
    }

    ctx.shadowBlur = 0;

    // Labels
    ctx.fillStyle = darkMode ? '#e2e8f0' : '#1e293b';
    ctx.font = 'bold 13px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Mirror 1', mirror1X + 30, mirror1Y - 8);
    ctx.fillText('Mirror 2', mirror2X - 30, mirror2Y + 8);
    
    if (progress > 0.95) {
      ctx.font = 'bold 15px Arial';
      ctx.fillText('Light bounces twice!', cx, cy + 140);
    }
  };

  const drawKaleidoscope = (ctx: CanvasRenderingContext2D, cx: number, cy: number) => {
    const progress = animationProgress;
    const slowRotation = progress * 0.3; // Slower rotation for realism

    ctx.save();
    ctx.translate(cx, cy);

    // Draw three mirrors forming an equilateral triangle
    const mirrorLength = 100;
    const triangleRadius = 60;
    const mirrorAngle = 120 * Math.PI / 180; // 120 degrees between mirrors

    // Triangle of mirrors with proper angles
    for (let i = 0; i < 3; i++) {
      ctx.save();
      const angle = (i * mirrorAngle) + slowRotation;
      const mirrorX = Math.cos(angle) * triangleRadius;
      const mirrorY = Math.sin(angle) * triangleRadius;
      
      ctx.translate(mirrorX, mirrorY);
      ctx.rotate(angle + Math.PI / 2);
      
      // Mirror surface with gradient
      const mirrorGradient = ctx.createLinearGradient(-mirrorLength/2, -4, mirrorLength/2, 4);
      mirrorGradient.addColorStop(0, '#3b82f6');
      mirrorGradient.addColorStop(0.5, '#60a5fa');
      mirrorGradient.addColorStop(1, '#3b82f6');
      ctx.fillStyle = mirrorGradient;
      ctx.fillRect(-mirrorLength/2, -5, mirrorLength, 10);
      
      // Mirror shine/highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillRect(-mirrorLength/2, -5, mirrorLength * 0.4, 10);
      
      // Mirror border
      ctx.strokeStyle = darkMode ? '#1e40af' : '#1e3a8a';
      ctx.lineWidth = 2;
      ctx.strokeRect(-mirrorLength/2, -5, mirrorLength, 10);
      
      ctx.restore();
    }

    // Light source at center
    const lightColor = additionalProps.lightColor || '#fbbf24';
    const pulseScale = 1 + Math.sin(animationProgress * Math.PI * 4) * 0.1;
    ctx.fillStyle = lightColor;
    ctx.beginPath();
    ctx.arc(0, 0, 8 * pulseScale, 0, Math.PI * 2);
    ctx.fill();
    
    // Light glow
    const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 30 * pulseScale);
    glowGradient.addColorStop(0, 'rgba(251, 191, 36, 0.6)');
    glowGradient.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(0, 0, 30 * pulseScale, 0, Math.PI * 2);
    ctx.fill();

    // Draw light rays showing reflections
    ctx.strokeStyle = lightColor;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 8;
    ctx.shadowColor = lightColor;
    ctx.globalAlpha = 0.7;

    // Draw multiple light rays showing reflections
    const numRays = 6;
    for (let i = 0; i < numRays; i++) {
      const rayAngle = (i * Math.PI * 2 / numRays) + slowRotation * 2;
      const rayLength = 50 + Math.sin(progress * Math.PI * 2 + i) * 10;
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(rayAngle) * rayLength, Math.sin(rayAngle) * rayLength);
      ctx.stroke();
    }

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

    // Colorful pattern pieces created by reflections
    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
    const patternProgress = Math.min(1, progress * 1.5);
    
    // Draw symmetrical pattern pieces
    for (let i = 0; i < 6; i++) {
      ctx.save();
      const patternAngle = (i * Math.PI / 3) + slowRotation * 1.5;
      const patternDistance = 35 + Math.sin(progress * Math.PI * 3) * 5;
      
      ctx.translate(
        Math.cos(patternAngle) * patternDistance,
        Math.sin(patternAngle) * patternDistance
      );
      ctx.rotate(patternAngle);
      
      // Petal shape with gradient
      const petalGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 20);
      petalGradient.addColorStop(0, colors[i]);
      petalGradient.addColorStop(1, colors[(i + 3) % 6]);
      ctx.fillStyle = petalGradient;
      ctx.globalAlpha = 0.7 * patternProgress;
      
      ctx.beginPath();
      ctx.ellipse(0, 0, 12, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Inner circle
      ctx.fillStyle = colors[(i + 3) % 6];
      ctx.globalAlpha = 0.9 * patternProgress;
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }

    // Additional smaller pattern elements
    ctx.globalAlpha = 0.5 * patternProgress;
    for (let i = 0; i < 12; i++) {
      ctx.save();
      const smallAngle = (i * Math.PI / 6) + slowRotation * 2;
      const smallDistance = 25;
      
      ctx.translate(
        Math.cos(smallAngle) * smallDistance,
        Math.sin(smallAngle) * smallDistance
      );
      
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }

    ctx.globalAlpha = 1;

    ctx.restore();

    // Label
    if (progress > 0.7) {
      ctx.fillStyle = darkMode ? '#e2e8f0' : '#1e293b';
      ctx.font = 'bold 15px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Multiple Reflections Create Beautiful Patterns!', cx, cy + 140);
    }
  };

  const drawInteractiveMirror = (ctx: CanvasRenderingContext2D, cx: number, cy: number, angle: number) => {
    // Draw mirror at the specified angle
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle * Math.PI / 180);

    // Mirror
    ctx.fillStyle = darkMode ? '#60a5fa' : '#3b82f6';
    ctx.fillRect(-5, -100, 10, 200);

    // Mirror shine
    const gradient = ctx.createLinearGradient(-5, -100, 10, 200);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.8)');
    ctx.fillStyle = gradient;
    ctx.fillRect(-3, -100, 6, 200);

    ctx.restore();

    // Draw normal line
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle * Math.PI / 180);
    ctx.strokeStyle = darkMode ? '#94a3b8' : '#64748b';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -80);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Incident ray (always from top-left)
    const incidentAngle = 30;
    const rayLength = 100;
    
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#fbbf24';

    // Calculate incident ray endpoint
    const incidentEndX = cx + rayLength * Math.sin((angle - incidentAngle) * Math.PI / 180);
    const incidentEndY = cy - rayLength * Math.cos((angle - incidentAngle) * Math.PI / 180);

    ctx.beginPath();
    ctx.moveTo(cx - 100, cy - 100);
    ctx.lineTo(incidentEndX, incidentEndY);
    ctx.stroke();

    // Calculate reflected ray based on law of reflection
    const reflectedEndX = cx + rayLength * Math.sin((angle + incidentAngle) * Math.PI / 180);
    const reflectedEndY = cy - rayLength * Math.cos((angle + incidentAngle) * Math.PI / 180);

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(reflectedEndX, reflectedEndY);
    ctx.stroke();

    ctx.shadowBlur = 0;

    // Light source
    const pulseScale = 1 + Math.sin(animationProgress * Math.PI * 4) * 0.1;
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(cx - 100, cy - 100, 8 * pulseScale, 0, Math.PI * 2);
    ctx.fill();

    // Glow
    const glowGradient = ctx.createRadialGradient(cx - 100, cy - 100, 0, cx - 100, cy - 100, 25 * pulseScale);
    glowGradient.addColorStop(0, 'rgba(251, 191, 36, 0.6)');
    glowGradient.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(cx - 100, cy - 100, 25 * pulseScale, 0, Math.PI * 2);
    ctx.fill();

    // Angle indicator
    if (additionalProps.showAngles !== false) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle * Math.PI / 180);

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 30, -Math.PI / 2, -Math.PI / 2 + incidentAngle * Math.PI / 180, false);
      ctx.stroke();

      ctx.strokeStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(0, 0, 30, -Math.PI / 2 - incidentAngle * Math.PI / 180, -Math.PI / 2, true);
      ctx.stroke();

      ctx.restore();
    }
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setAnimationProgress(0);
      setShowFeedback(false);
      setUserAnswer('');
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setAnimationProgress(0);
      setShowFeedback(false);
      setUserAnswer('');
    }
  };

  const handleModeChange = (mode: ModeType) => {
    setCurrentMode(mode);
    setCurrentStep(1);
    setAnimationProgress(0);
    setIsPlaying(false);
    setShowFeedback(false);
    setUserAnswer('');
  };

  // Practice mode handlers
  const checkAnswer = (questionId: number, answer: string) => {
    const correctAnswers: { [key: number]: string } = {
      5: 'B', // Question 1: What is reflection - "It bounces back"
      6: 'A', // Question 2: Light travel - "In straight lines"
      7: 'B', // Question 3: Angle - "30 degrees"
    };

    const isAnswerCorrect = correctAnswers[questionId] === answer;
    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);

    if (isAnswerCorrect) {
      setPracticeScore(practiceScore + 1);
      setTimeout(() => {
        if (currentStep < totalSteps) {
          handleNext();
        }
      }, 2000);
    }
  };

  // Render practice questions
  const renderPracticeQuestion = () => {
    const questions: { [key: number]: { question: string; options: string[] } } = {
      5: {
        question: 'What happens when light hits a mirror?',
        options: ['A) It passes through', 'B) It bounces back', 'C) It stops', 'D) It disappears'],
      },
      6: {
        question: 'How does light travel?',
        options: ['A) In straight lines', 'B) In curved paths', 'C) In circles', 'D) Randomly'],
      },
      7: {
        question: 'If light hits a mirror at 30° from the normal, at what angle does it reflect?',
        options: ['A) 60 degrees', 'B) 30 degrees', 'C) 90 degrees', 'D) 45 degrees'],
      },
    };

    const currentQuestion = questions[currentStepData.id];
    if (!currentQuestion) return null;

    return (
      <div style={{ marginTop: 20 }}>
        <div
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 20,
            color: darkMode ? '#e2e8f0' : '#1e293b',
          }}
        >
          {currentQuestion.question}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {currentQuestion.options.map((option, idx) => {
            const optionLetter = option.charAt(0);
            const isSelected = userAnswer === optionLetter;
            const showResult = showFeedback && isSelected;

            return (
              <button
                key={idx}
                onClick={() => {
                  setUserAnswer(optionLetter);
                  checkAnswer(currentStepData.id, optionLetter);
                }}
                disabled={showFeedback}
                style={{
                  padding: '15px 20px',
                  fontSize: 16,
                  borderRadius: 12,
                  border: `2px solid ${
                    showResult
                      ? isCorrect
                        ? '#10b981'
                        : '#ef4444'
                      : isSelected
                      ? themeColor
                      : darkMode
                      ? '#475569'
                      : '#cbd5e1'
                  }`,
                  backgroundColor: showResult
                    ? isCorrect
                      ? '#d1fae5'
                      : '#fee2e2'
                    : isSelected
                    ? `${themeColor}22`
                    : darkMode
                    ? '#334155'
                    : '#ffffff',
                  color: darkMode ? '#e2e8f0' : '#1e293b',
                  cursor: showFeedback ? 'not-allowed' : 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.3s ease',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  opacity: showFeedback && !isSelected ? 0.5 : 1,
                }}
              >
                {option}
              </button>
            );
          })}
        </div>
        {showFeedback && (
          <div
            style={{
              marginTop: 20,
              padding: 15,
              borderRadius: 12,
              backgroundColor: isCorrect ? '#d1fae5' : '#fee2e2',
              color: isCorrect ? '#065f46' : '#991b1b',
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'center',
              animation: 'fadeIn 0.5s ease',
            }}
          >
            {isCorrect ? '✓ Correct! Great job!' : '✗ Incorrect. Try again!'}
          </div>
        )}
      </div>
    );
  };

  // Render hands-on controls
  const renderHandsOnControls = () => {
    return (
      <div style={{ marginTop: 20 }}>
        <div
          style={{
            marginBottom: 15,
            fontSize: 16,
            color: darkMode ? '#e2e8f0' : '#1e293b',
          }}
        >
          Mirror Angle: {mirrorAngle.toFixed(0)}°
        </div>
        <input
          type="range"
          min="0"
          max="90"
          value={mirrorAngle}
          onChange={(e) => setMirrorAngle(Number(e.target.value))}
          style={{
            width: '100%',
            height: 8,
            borderRadius: 4,
            outline: 'none',
            background: `linear-gradient(to right, ${themeColor} 0%, ${themeColor} ${
              (mirrorAngle / 90) * 100
            }%, ${darkMode ? '#475569' : '#cbd5e1'} ${(mirrorAngle / 90) * 100}%, ${
              darkMode ? '#475569' : '#cbd5e1'
            } 100%)`,
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 10,
            fontSize: 14,
            color: darkMode ? '#94a3b8' : '#64748b',
          }}
        >
          <span>0°</span>
          <span>45°</span>
          <span>90°</span>
        </div>
        {!handsOnCompleted && (
          <button
            onClick={() => setHandsOnCompleted(true)}
            style={{
              marginTop: 20,
              padding: '12px 24px',
              fontSize: 16,
              fontWeight: 'bold',
              borderRadius: 12,
              border: 'none',
              backgroundColor: themeColor,
              color: '#ffffff',
              cursor: 'pointer',
              width: '100%',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Complete Experiment
          </button>
        )}
        {handsOnCompleted && (
          <div
            style={{
              marginTop: 20,
              padding: 15,
              borderRadius: 12,
              backgroundColor: '#d1fae5',
              color: '#065f46',
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            ✓ Experiment Completed! You observed how reflection angle changes with mirror position.
          </div>
        )}
      </div>
    );
  };

  // Styles
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      width: width,
      minHeight: height,
      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
      borderRadius: 16,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    modeSelector: {
      display: 'flex',
      borderBottom: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
    },
    modeTab: {
      flex: 1,
      padding: '16px 24px',
      border: 'none',
      backgroundColor: 'transparent',
      fontSize: 16,
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      position: 'relative',
    },
    content: {
      padding: 32,
    },
    canvas: {
      width: '100%',
      height: 350,
      borderRadius: 12,
      backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
    },
    navigation: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 24,
      borderTop: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
    },
    button: {
      padding: '12px 24px',
      fontSize: 16,
      fontWeight: '600',
      borderRadius: 12,
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    stepInfo: {
      fontSize: 16,
      fontWeight: '600',
      color: darkMode ? '#e2e8f0' : '#1e293b',
    },
  };

  // Inject keyframes
  useEffect(() => {
    const styleSheet = document.styleSheets[0];
    const keyframes = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes slideIn {
        from { transform: translateX(-20px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
    `;
    try {
      styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    } catch (e) {
      // Keyframes already exist
    }
  }, []);

  return (
    <div style={styles.container}>
      {/* Mode Selector */}
      {showModeSelector && (
        <div style={styles.modeSelector}>
          {enabledModes.includes('learn') && (
            <button
              style={{
                ...styles.modeTab,
                color: currentMode === 'learn' ? themeColor : darkMode ? '#94a3b8' : '#64748b',
                borderBottom: currentMode === 'learn' ? `3px solid ${themeColor}` : '3px solid transparent',
              }}
              onClick={() => handleModeChange('learn')}
            >
              📚 Learn
            </button>
          )}
          {enabledModes.includes('practice') && (
            <button
              style={{
                ...styles.modeTab,
                color: currentMode === 'practice' ? themeColor : darkMode ? '#94a3b8' : '#64748b',
                borderBottom: currentMode === 'practice' ? `3px solid ${themeColor}` : '3px solid transparent',
              }}
              onClick={() => handleModeChange('practice')}
            >
              ✏️ Practice
            </button>
          )}
          {enabledModes.includes('real_world') && (
            <button
              style={{
                ...styles.modeTab,
                color: currentMode === 'real_world' ? themeColor : darkMode ? '#94a3b8' : '#64748b',
                borderBottom: currentMode === 'real_world' ? `3px solid ${themeColor}` : '3px solid transparent',
              }}
              onClick={() => handleModeChange('real_world')}
            >
              🌍 Real World
            </button>
          )}
          {enabledModes.includes('hands_on') && (
            <button
              style={{
                ...styles.modeTab,
                color: currentMode === 'hands_on' ? themeColor : darkMode ? '#94a3b8' : '#64748b',
                borderBottom: currentMode === 'hands_on' ? `3px solid ${themeColor}` : '3px solid transparent',
              }}
              onClick={() => handleModeChange('hands_on')}
            >
              🔬 Hands On
            </button>
          )}
        </div>
      )}

      {/* Content */}
      <div style={styles.content}>
        <h2
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 12,
            color: darkMode ? '#e2e8f0' : '#1e293b',
            animation: 'slideIn 0.5s ease',
          }}
        >
          {currentStepData?.title}
        </h2>
        <p
          style={{
            fontSize: 16,
            marginBottom: 24,
            color: darkMode ? '#cbd5e1' : '#475569',
            lineHeight: 1.6,
            animation: 'fadeIn 0.5s ease 0.1s backwards',
          }}
        >
          {currentStepData?.description}
        </p>

        {currentMode !== 'practice' && (
          <canvas
            ref={canvasRef}
            width={width - 64}
            height={350}
            style={{
              ...styles.canvas,
              animation: 'fadeIn 0.5s ease 0.2s backwards',
            }}
          />
        )}

        {currentMode === 'practice' && renderPracticeQuestion()}
        {currentMode === 'hands_on' && renderHandsOnControls()}

        {currentMode === 'practice' && showStepIndicator && (
          <div
            style={{
              marginTop: 20,
              padding: 15,
              borderRadius: 12,
              backgroundColor: darkMode ? '#334155' : '#f1f5f9',
              textAlign: 'center',
              fontSize: 16,
              fontWeight: '600',
              color: darkMode ? '#e2e8f0' : '#1e293b',
            }}
          >
            Score: {practiceScore} / {totalSteps}
          </div>
        )}
      </div>

      {/* Navigation */}
      {showNavigation && (
        <div style={styles.navigation}>
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            style={{
              ...styles.button,
              backgroundColor: currentStep === 1 ? (darkMode ? '#334155' : '#e2e8f0') : themeColor,
              color: currentStep === 1 ? (darkMode ? '#64748b' : '#94a3b8') : '#ffffff',
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            ← Previous
          </button>

          {showStepIndicator && (
            <div style={styles.stepInfo}>
              {currentStep} / {totalSteps}
            </div>
          )}

          {showPlayPause && (
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                ...styles.button,
                backgroundColor: themeColor,
                color: '#ffffff',
              }}
            >
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={currentStep === totalSteps}
            style={{
              ...styles.button,
              backgroundColor: currentStep === totalSteps ? (darkMode ? '#334155' : '#e2e8f0') : themeColor,
              color: currentStep === totalSteps ? (darkMode ? '#64748b' : '#94a3b8') : '#ffffff',
              cursor: currentStep === totalSteps ? 'not-allowed' : 'pointer',
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default ReflectionOfLight;