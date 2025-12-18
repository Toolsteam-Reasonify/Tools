import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Wind, Thermometer, Sun } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ConvectionLearnModeProps {
  props?: {
    width?: number;
    height?: number;
    data?: BaseDataInterface;
    steps?: StepDataInterface[];
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  isPaused: boolean;
}

interface StepDataInterface {
  id: number;
  title: string;
  description: string;
  type: 'intro' | 'explanation' | 'practice' | 'real_world';
  animationData?: any;
}

interface BaseDataInterface {
  themeColor?: string;
  autoPlayDuration?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  temp: 'hot' | 'cold';
  opacity: number;
}

const DEFAULT_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "What is Convection?",
    description: "Convection is the process of heat transfer through the actual movement of particles in fluids (liquids and gases). Unlike conduction where particles stay in place, in convection, the heated particles themselves move from one place to another.",
    type: 'intro'
  },
  {
    id: 2,
    title: "Activity 7.2: Paper Cup Experiment",
    description: "Two paper cups are hung on a stick. When a candle is placed under one cup, the hot air inside rises, making that cup tilt upward. This demonstrates that hot air is lighter than cold air and rises up.",
    type: 'explanation',
    animationData: { experiment: 'paper_cups' }
  },
  {
    id: 3,
    title: "Why Does Hot Air Rise?",
    description: "When air is heated, it expands and occupies more space. This makes it less dense (lighter) compared to the surrounding cold air. The lighter hot air rises up, while heavier cold air moves down to take its place.",
    type: 'explanation',
    animationData: { experiment: 'hot_air_rising' }
  },
  {
    id: 4,
    title: "Convection in Liquids",
    description: "Water at the bottom of a beaker gets heated first. It expands, becomes lighter, and rises up. Cooler water from the sides moves down to replace it. This creates a convection current - a continuous cycle of rising hot water and sinking cold water.",
    type: 'explanation',
    animationData: { experiment: 'water_heating' }
  },
  {
    id: 5,
    title: "Interactive: Sea Breeze (Day)",
    description: "During the day, land heats up faster than water. Hot air above the land rises, and cooler air from the sea moves toward the land to replace it. This is called sea breeze, which brings relief on hot days.",
    type: 'practice',
    animationData: { experiment: 'sea_breeze' }
  },
  {
    id: 6,
    title: "Interactive: Land Breeze (Night)",
    description: "At night, land cools faster than water. Air above the sea is warmer and rises. Cooler air from the land moves toward the sea. This is called land breeze, and it reverses the direction of daytime winds.",
    type: 'practice',
    animationData: { experiment: 'land_breeze' }
  },
  {
    id: 7,
    title: "Real World: Coastal Climate",
    description: "People living near the seashore experience sea breeze during the day (cool wind from sea) and land breeze at night (cool wind from land). This is why coastal areas have moderate temperatures and windows facing the sea are preferred.",
    type: 'real_world'
  },
  {
    id: 8,
    title: "Real World: Smoke from Incense",
    description: "When you burn an incense stick (agarbatti), the smoke rises upward. This happens because smoke is a mixture of hot gases and tiny particles. Being warmer than surrounding air, it rises up through convection.",
    type: 'real_world'
  },
  {
    id: 9,
    title: "Real World: Heating Your Room",
    description: "Room heaters work on convection. Hot air from the heater rises to the ceiling, then cools and comes down. This creates a convection current that circulates warm air throughout the room, heating it evenly.",
    type: 'real_world'
  }
];

const ConvectionLearnMode: React.FC<ConvectionLearnModeProps> = ({
  props = {},
  setStepDetails,
  stopAutoNext,
  setStopAutoNext
}) => {
  const { t } = useLanguage();
  const width = props.width || 800;
  const height = props.height || 500;

  // Build steps from translations, but preserve animationData and type from DEFAULT_STEPS
  const steps: StepDataInterface[] = useMemo(() => {
    const translated = t('convection.learn.steps', { returnObjects: true }) as unknown;
    const base: StepDataInterface[] =
      Array.isArray(translated) && translated.length
        ? (translated as StepDataInterface[])
        : (props.steps || DEFAULT_STEPS);

    return base.map((step, index) => ({
      ...step,
      // ensure type is preserved from DEFAULT_STEPS if not in translation
      type: (step.type || DEFAULT_STEPS[index]?.type || 'intro') as StepDataInterface['type'],
      animationData: DEFAULT_STEPS[index]?.animationData ?? step.animationData,
    }));
  }, [t, props.steps]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(!stopAutoNext);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [animationFrame, setAnimationFrame] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const currentStep = steps[currentStepIndex] || {
    id: 0,
    title: '',
    description: '',
    type: 'intro' as const
  };

  // Update step details for parent
  useEffect(() => {
    if (setStepDetails) {
      setStepDetails({
        currentStep: currentStepIndex + 1,
        totalSteps: steps.length,
        isPaused: !isPlaying
      });
    }
  }, [currentStepIndex, steps.length, isPlaying, setStepDetails]);

  // Auto-advance logic
  useEffect(() => {
    if (!isPlaying || stopAutoNext) return;

    const timer = setTimeout(() => {
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, props.data?.autoPlayDuration || 8000);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, stopAutoNext, steps.length, props.data?.autoPlayDuration]);

  // Initialize particles based on current step
  useEffect(() => {
    initializeAnimation();
  }, [currentStep]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      setAnimationFrame(prev => prev + 1);
      drawAnimation();
      animationRef.current = requestAnimationFrame(animate);
    };

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, particles, currentStep]);

  const initializeAnimation = () => {
    const newParticles: Particle[] = [];
    
    if (currentStep.animationData?.experiment === 'hot_air_rising') {
      // Create hot and cold air particles
      for (let i = 0; i < 30; i++) {
        newParticles.push({
          x: width / 2 + (Math.random() - 0.5) * 100,
          y: height - 100 + Math.random() * 50,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -1 - Math.random() * 0.5,
          temp: 'hot',
          opacity: 0.7 + Math.random() * 0.3
        });
      }
      
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          x: Math.random() * width,
          y: Math.random() * 150,
          vx: (Math.random() - 0.5) * 0.3,
          vy: 0.5 + Math.random() * 0.3,
          temp: 'cold',
          opacity: 0.5 + Math.random() * 0.3
        });
      }
    }

    setParticles(newParticles);
  };

  const drawAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw based on current step
    if (currentStep.animationData?.experiment === 'paper_cups') {
      drawPaperCupsExperiment(ctx);
    } else if (currentStep.animationData?.experiment === 'hot_air_rising') {
      drawHotAirRising(ctx);
    } else if (currentStep.animationData?.experiment === 'water_heating') {
      drawWaterHeating(ctx);
    } else if (currentStep.animationData?.experiment === 'sea_breeze') {
      drawSeaBreeze(ctx);
    } else if (currentStep.animationData?.experiment === 'land_breeze') {
      drawLandBreeze(ctx);
    } else {
      drawIntroAnimation(ctx);
    }

    // Update particles
    updateParticles();
  };

  const drawPaperCupsExperiment = (ctx: CanvasRenderingContext2D) => {
    // Draw wooden stick
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(width / 2 - 200, 150, 400, 10);

    // Draw threads
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    // Left cup thread
    ctx.beginPath();
    ctx.moveTo(width / 2 - 120, 150);
    ctx.lineTo(width / 2 - 120, 230);
    ctx.stroke();

    // Right cup thread (tilted up when heated)
    const tiltY = Math.sin(animationFrame * 0.05) * 20;
    ctx.beginPath();
    ctx.moveTo(width / 2 + 120, 150);
    ctx.lineTo(width / 2 + 120, 230 - tiltY);
    ctx.stroke();

    // Draw cups
    // Left cup
    ctx.fillStyle = '#F5F5DC';
    ctx.beginPath();
    ctx.moveTo(width / 2 - 140, 230);
    ctx.lineTo(width / 2 - 100, 230);
    ctx.lineTo(width / 2 - 95, 280);
    ctx.lineTo(width / 2 - 145, 280);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#8B7355';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Right cup (hot)
    ctx.save();
    ctx.translate(width / 2 + 120, 230 - tiltY);
    ctx.rotate(-tiltY * 0.01);
    ctx.translate(-(width / 2 + 120), -(230 - tiltY));
    
    ctx.fillStyle = '#FFE4B5';
    ctx.beginPath();
    ctx.moveTo(width / 2 + 100, 230 - tiltY);
    ctx.lineTo(width / 2 + 140, 230 - tiltY);
    ctx.lineTo(width / 2 + 145, 280 - tiltY);
    ctx.lineTo(width / 2 + 95, 280 - tiltY);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#8B7355';
    ctx.stroke();
    ctx.restore();

    // Draw candle under right cup
    drawCandle(ctx, width / 2 + 120, height - 80);

    // Draw hot air rising
    for (let i = 0; i < 5; i++) {
      const offset = (animationFrame + i * 10) % 100;
      ctx.fillStyle = `rgba(255, 100, 0, ${0.3 - offset / 300})`;
      ctx.beginPath();
      ctx.arc(width / 2 + 120, height - 80 - offset, 15 - offset / 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // Labels
    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(t('convection.learn.canvas.cup1'), width / 2 - 120, 310);
    ctx.fillText(t('convection.learn.canvas.cup2Heated'), width / 2 + 120, 310 - tiltY);
  };

  const drawHotAirRising = (ctx: CanvasRenderingContext2D) => {
    // Draw heat source
    drawCandle(ctx, width / 2, height - 60);

    // Draw particles
    particles.forEach(particle => {
      if (particle.temp === 'hot') {
        ctx.fillStyle = `rgba(255, 100, 50, ${particle.opacity})`;
      } else {
        ctx.fillStyle = `rgba(100, 150, 255, ${particle.opacity})`;
      }
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Draw direction arrow
      ctx.strokeStyle = particle.temp === 'hot' ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 0, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(particle.x, particle.y);
      ctx.lineTo(particle.x + particle.vx * 20, particle.y + particle.vy * 20);
      ctx.stroke();
    });

    // Labels
    ctx.fillStyle = '#FF6347';
    ctx.font = 'bold 18px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(t('convection.learn.canvas.hotAirRises'), width / 2, 50);

    ctx.fillStyle = '#4682B4';
    ctx.fillText(t('convection.learn.canvas.coldAirSinks'), width / 2 + 80, height - 20);
  };

  const drawWaterHeating = (ctx: CanvasRenderingContext2D) => {
    // Draw beaker
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 120, 120);
    ctx.lineTo(width / 2 - 100, 140);
    ctx.lineTo(width / 2 - 100, 350);
    ctx.lineTo(width / 2 + 100, 350);
    ctx.lineTo(width / 2 + 100, 140);
    ctx.lineTo(width / 2 + 120, 120);
    ctx.stroke();

    // Draw water
    ctx.fillStyle = 'rgba(100, 150, 255, 0.3)';
    ctx.fillRect(width / 2 - 100, 150, 200, 200);

    // Draw convection currents with colored streaks
    const time = animationFrame * 0.02;
    
    // Hot water rising in center (red)
    ctx.strokeStyle = `rgba(255, 50, 50, ${0.5 + Math.sin(time) * 0.3})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(width / 2, 340);
    for (let y = 340; y > 160; y -= 10) {
      const x = width / 2 + Math.sin((340 - y) * 0.1 + time) * 15;
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Cold water sinking on sides (blue)
    ctx.strokeStyle = `rgba(50, 100, 255, ${0.5 + Math.cos(time) * 0.3})`;
    
    // Left side
    ctx.beginPath();
    ctx.moveTo(width / 2 - 80, 160);
    for (let y = 160; y < 340; y += 10) {
      const x = width / 2 - 80 + Math.sin((y - 160) * 0.1 + time) * 10;
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Right side
    ctx.beginPath();
    ctx.moveTo(width / 2 + 80, 160);
    for (let y = 160; y < 340; y += 10) {
      const x = width / 2 + 80 + Math.sin((y - 160) * 0.1 + time) * 10;
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw candle
    drawCandle(ctx, width / 2, height - 40);

    // Draw arrows showing circulation
    drawArrow(ctx, width / 2, 300, width / 2, 180, 'rgba(255, 0, 0, 0.7)');
    drawArrow(ctx, width / 2 + 80, 180, width / 2 + 80, 300, 'rgba(0, 0, 255, 0.7)');

    // Labels
    ctx.fillStyle = '#000';
    ctx.font = '14px Inter';
    ctx.fillText(t('convection.learn.canvas.hotWaterRises'), width / 2 - 150, 250);
    ctx.fillText(t('convection.learn.canvas.coldWaterSinks'), width / 2 + 110, 250);
  };

  const drawSeaBreeze = (ctx: CanvasRenderingContext2D) => {
    // Draw sun
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(width - 80, 60, 35, 0, Math.PI * 2);
    ctx.fill();

    // Draw rays
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(width - 80 + Math.cos(angle) * 40, 60 + Math.sin(angle) * 40);
      ctx.lineTo(width - 80 + Math.cos(angle) * 55, 60 + Math.sin(angle) * 55);
      ctx.stroke();
    }

    // Draw land (left side) - warmer
    ctx.fillStyle = '#DEB887';
    ctx.fillRect(0, height / 2, width / 2, height / 2);

    // Draw warm land "heat waves" moving from land towards sea (left -> right)
    ctx.strokeStyle = 'rgba(255, 140, 0, 0.7)';
    ctx.lineWidth = 2;
    for (let y = height / 2 + 30; y < height / 2 + 100; y += 20) {
      ctx.beginPath();
      for (let x = 0; x < width / 2; x += 20) {
        const waveY = y + Math.sin((x - animationFrame * 2) * 0.12) * 4;
        if (x === 0) {
          ctx.moveTo(x, waveY);
        } else {
          ctx.lineTo(x, waveY);
        }
      }
      ctx.stroke();
    }

    // Draw sea (right side)
    const gradient = ctx.createLinearGradient(width / 2, 0, width, 0);
    gradient.addColorStop(0, '#4682B4');
    gradient.addColorStop(1, '#1E90FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(width / 2, height / 2, width / 2, height / 2);

    // Draw waves moving from sea towards land (right -> left)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    for (let y = height / 2 + 40; y < height; y += 30) {
      ctx.beginPath();
      for (let x = width / 2; x < width; x += 20) {
        const waveY = y + Math.sin((x - animationFrame * 2) * 0.1) * 5;
        if (x === width / 2) {
          ctx.moveTo(x, waveY);
        } else {
          ctx.lineTo(x, waveY);
        }
      }
      ctx.stroke();
    }

    // Draw hot air rising from land
    for (let i = 0; i < 4; i++) {
      const offset = (animationFrame + i * 15) % 120;
      const x = width / 4 + (Math.random() - 0.5) * 100;
      ctx.fillStyle = `rgba(255, 100, 0, ${0.4 - offset / 300})`;
      ctx.beginPath();
      ctx.arc(x, height / 2 - offset, 20 - offset / 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw wind arrows (sea breeze) clearly moving from sea (right) to land (left)
    const arrowY = height / 2 - 60;
    for (let i = 0; i < 3; i++) {
      const x = width / 2 + 250 - ((animationFrame + i * 40) % 250);
      if (x > width / 2 + 20) {
        drawArrow(ctx, x, arrowY, x - 30, arrowY, '#4169E1', 3);
      }
    }

    // Labels
    ctx.fillStyle = '#000';
    ctx.font = 'bold 18px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(t('convection.learn.canvas.daytime'), width / 2, 30);
    
    ctx.font = '16px Inter';
    ctx.fillText(t('convection.learn.canvas.warmerLand'), width / 4, height - 30);
    ctx.fillText(t('convection.learn.canvas.coolerSea'), width * 3 / 4, height - 30);
    
    ctx.fillStyle = '#4169E1';
    ctx.font = 'bold 16px Inter';
    ctx.fillText(t('convection.learn.canvas.seaBreeze'), width / 2, arrowY - 20);
  };

  const drawLandBreeze = (ctx: CanvasRenderingContext2D) => {
    // Draw moon
    ctx.fillStyle = '#F0E68C';
    ctx.beginPath();
    ctx.arc(width - 80, 60, 30, 0, Math.PI * 2);
    ctx.fill();

    // Moon craters
    ctx.fillStyle = 'rgba(200, 200, 150, 0.5)';
    ctx.beginPath();
    ctx.arc(width - 90, 55, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(width - 70, 65, 6, 0, Math.PI * 2);
    ctx.fill();

    // Stars
    ctx.fillStyle = '#FFF';
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * width;
      const y = Math.random() * (height / 2);
      const size = Math.random() * 2 + 1;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw land (left side) - cooler
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(0, height / 2, width / 2, height / 2);

    // Draw sea (right side) - warmer
    const gradient = ctx.createLinearGradient(width / 2, 0, width, 0);
    gradient.addColorStop(0, '#2F4F4F');
    gradient.addColorStop(1, '#4682B4');
    ctx.fillStyle = gradient;
    ctx.fillRect(width / 2, height / 2, width / 2, height / 2);

    // Draw warmer sea surface waves, near the coastline, moving from sea towards land (right -> left)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    for (let y = height / 2 + 30; y < height / 2 + 90; y += 20) {
      ctx.beginPath();
      for (let x = width / 2; x < width; x += 20) {
        const waveY = y + Math.sin((x + animationFrame * 2) * 0.12) * 5;
        if (x === width / 2) {
          ctx.moveTo(x, waveY);
        } else {
          ctx.lineTo(x, waveY);
        }
      }
      ctx.stroke();
    }

    // Draw warm air rising from sea
    for (let i = 0; i < 4; i++) {
      const offset = (animationFrame + i * 15) % 120;
      const x = width * 3 / 4 + (Math.random() - 0.5) * 100;
      ctx.fillStyle = `rgba(255, 200, 100, ${0.3 - offset / 400})`;
      ctx.beginPath();
      ctx.arc(x, height / 2 - offset, 18 - offset / 12, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw wind arrows (land breeze) clearly moving from land (left) to sea (right)
    const arrowY = height / 2 - 60;
    for (let i = 0; i < 3; i++) {
      const x = width / 2 - 250 + ((animationFrame + i * 40) % 250);
      if (x < width / 2 - 20) {
        drawArrow(ctx, x, arrowY, x + 30, arrowY, '#9370DB', 3);
      }
    }

    // Labels
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 18px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(t('convection.learn.canvas.nighttime'), width / 2, 30);
    
    ctx.font = '16px Inter';
    ctx.fillText(t('convection.learn.canvas.coolerLand'), width / 4, height - 30);
    ctx.fillText(t('convection.learn.canvas.warmerSea'), width * 3 / 4, height - 30);
    
    ctx.fillStyle = '#9370DB';
    ctx.font = 'bold 16px Inter';
    ctx.fillText(t('convection.learn.canvas.landBreeze'), width / 2, arrowY - 20);
  };

  const drawIntroAnimation = (ctx: CanvasRenderingContext2D) => {
    // Draw container
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.strokeRect(width / 2 - 150, height / 2 - 150, 300, 300);

    // Draw convection current

    // Hot particles rising
    for (let i = 0; i < 8; i++) {
      const y = height / 2 + 130 - ((animationFrame + i * 20) % 250);
      ctx.fillStyle = `rgba(255, ${100 - (animationFrame + i * 20) % 250 / 2}, 0, 0.7)`;
      ctx.beginPath();
      ctx.arc(width / 2, y, 12, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cold particles sinking
    for (let i = 0; i < 8; i++) {
      const y = height / 2 - 130 + ((animationFrame + i * 20) % 250);
      ctx.fillStyle = `rgba(0, ${100 + (animationFrame + i * 20) % 250 / 2}, 255, 0.7)`;
      ctx.beginPath();
      ctx.arc(width / 2 + 100, y, 12, 0, Math.PI * 2);
      ctx.fill();
    }

    // Labels
    ctx.fillStyle = '#FF4500';
    ctx.font = 'bold 20px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(t('convection.learn.canvas.hot'), width / 2, height / 2 + 180);

    ctx.fillStyle = '#4169E1';
    ctx.fillText(t('convection.learn.canvas.cold'), width / 2, height / 2 - 180);

    ctx.fillStyle = '#000';
    ctx.font = 'bold 24px Inter';
    ctx.fillText(t('convection.learn.canvas.convectionCurrent'), width / 2, height / 2 + 230);
  };

  const drawCandle = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Candle body
    ctx.fillStyle = '#FBBF24';
    ctx.fillRect(x - 10, y, 20, 35);
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(x - 10, y, 20, 8);

    // Wick
    ctx.fillStyle = '#2C3E50';
    ctx.fillRect(x - 1, y - 5, 2, 8);

    // Flame
    ctx.fillStyle = '#FCD34D';
    ctx.beginPath();
    ctx.ellipse(x, y - 8, 6, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Inner flame
    ctx.fillStyle = '#3B82F6';
    ctx.beginPath();
    ctx.ellipse(x, y - 8, 3, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color: string,
    width: number = 2
  ) => {
    const headLength = 15;
    const angle = Math.atan2(toY - fromY, toX - fromX);

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;

    // Draw line
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    // Draw arrowhead
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headLength * Math.cos(angle - Math.PI / 6),
      toY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      toX - headLength * Math.cos(angle + Math.PI / 6),
      toY - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
  };

  const updateParticles = () => {
    setParticles(prevParticles =>
      prevParticles.map(particle => {
        let newX = particle.x + particle.vx;
        let newY = particle.y + particle.vy;

        // Wrap around boundaries
        if (particle.temp === 'hot') {
          if (newY < 50) {
            newY = height - 100;
            newX = width / 2 + (Math.random() - 0.5) * 100;
          }
        } else {
          if (newY > height - 50) {
            newY = 50;
            newX = Math.random() * width;
          }
        }

        if (newX < 0) newX = width;
        if (newX > width) newX = 0;

        return { ...particle, x: newX, y: newY };
      })
    );
  };

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setAnimationFrame(0);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setAnimationFrame(0);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (setStopAutoNext) {
      setStopAutoNext(isPlaying);
    }
  };

  const reset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(true);
    setAnimationFrame(0);
    if (setStopAutoNext) {
      setStopAutoNext(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Wind className="w-8 h-8" />
              <h1 className="text-3xl font-bold">{t('convection.learn.header.title')}</h1>
            </div>
            <p className="text-blue-100">{t('convection.learn.header.subtitle')}</p>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">
              {t('convection.learn.step', { current: currentStepIndex + 1, total: steps.length })}
            </div>
            {currentStep?.type && (
              <div className="text-xs opacity-75 mt-1">
                {currentStep.type.toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 bg-white bg-opacity-20 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 bg-white rounded-full transition-all duration-500"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-3">{currentStep.title}</h2>

        {/* Canvas Animation */}
        <div className="mb-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="w-full rounded-lg bg-white shadow-md"
          />
        </div>

        {/* Description */}
        <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-6 rounded-xl border-l-4 border-blue-500">
          <p className="text-gray-700 leading-relaxed text-lg">{currentStep.description}</p>
        </div>

        {/* Special indicators for practice and real-world */}
        {currentStep?.type === 'practice' &&
          currentStep?.animationData?.experiment !== 'sea_breeze' &&
          currentStep?.animationData?.experiment !== 'land_breeze' && (
          <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-xl">
            <div className="flex items-center gap-2 text-green-800 font-semibold">
              <Thermometer className="w-5 h-5" />
              {t('convection.learn.indicators.practice')}
            </div>
          </div>
        )}

        {currentStep?.type === 'real_world' && (
          <div className="mt-4 bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-xl">
            <div className="flex items-center gap-2 text-purple-800 font-semibold">
              <Sun className="w-5 h-5" />
              {t('convection.learn.indicators.realWorld')}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-50 p-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
          >
            <ChevronLeft className="w-5 h-5" />
            {t('convection.learn.controls.previous')}
          </button>

          <div className="flex gap-3">
            <button
              onClick={togglePlay}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isPlaying ? t('convection.learn.controls.pause') : t('convection.learn.controls.play')}
            </button>

            <button
              onClick={reset}
              className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
            >
              <RotateCcw className="w-5 h-5" />
              {t('convection.learn.controls.reset')}
            </button>
          </div>

          <button
            onClick={nextStep}
            disabled={currentStepIndex === steps.length - 1}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-cyan-700 transition"
          >
            {t('convection.learn.controls.next')}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConvectionLearnMode;


