import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw, Droplets } from 'lucide-react';

type StepMode = 'learn' | 'practice' | 'real_world';

type LearnStage = 'overview' | 'evaporation' | 'condensation' | 'precipitation' | 'collection' | 'complete';

type LearnActiveElement = 'sun' | 'water' | 'vapor' | 'clouds' | 'rain' | 'ground' | 'all';

type PracticeQuestionType = 'sequence' | 'single';

interface BaseStep {
  id: number;
  title: string;
  description: string;
  mode: StepMode;
}

interface LearnStep extends BaseStep {
  mode: 'learn';
  type: 'intro' | 'explanation';
  data: {
    stage: LearnStage;
    activeElements?: LearnActiveElement[];
  };
}

interface PracticeChoiceData {
  question: string;
  answer: string;
  options: string[];
  type?: PracticeQuestionType;
}

interface PracticeSequenceData {
  question: string;
  answer: string[];
  type: 'sequence';
}

type PracticeData = PracticeChoiceData | PracticeSequenceData;

interface PracticeStep extends BaseStep {
  mode: 'practice';
  type: 'intro' | 'practice';
  data: PracticeData;
}

type RealWorldExample = 'clothes' | 'dew' | 'harvesting' | 'ice-stupa';

interface RealWorldStep extends BaseStep {
  mode: 'real_world';
  type: 'real_world';
  data: {
    example: RealWorldExample;
    image: string;
    relatedStage: LearnStage;
  };
}

type Step = LearnStep | PracticeStep | RealWorldStep;

const DEFAULT_STEPS: Step[] = [
  {
    id: 1,
    title: 'What is the Water Cycle?',
    description:
      "The water cycle is the continuous movement of water on, above, and below the Earth's surface. Water moves upward as water vapor through evaporation and downward through precipitation (rain, snow, hail), passing through soil, rocks, and plants, and finally returning to water bodies.",
    type: 'intro',
    mode: 'learn',
    data: { stage: 'overview' },
  },
  {
    id: 2,
    title: 'Evaporation: Water Rises',
    description:
      "When the Sun heats water in oceans, rivers, and lakes, it evaporates and becomes water vapor. The Sun's radiation provides the energy needed to convert liquid water into gas. Water also evaporates from trees and plants through a process called transpiration.",
    type: 'explanation',
    mode: 'learn',
    data: { stage: 'evaporation', activeElements: ['sun', 'water', 'vapor'] },
  },
  {
    id: 3,
    title: 'Condensation: Clouds Form',
    description:
      'As water vapor rises up into the atmosphere, it cools down. When it cools enough, the water vapor condenses into tiny water droplets, forming clouds. This process is called condensation.',
    type: 'explanation',
    mode: 'learn',
    data: { stage: 'condensation', activeElements: ['vapor', 'clouds'] },
  },
  {
    id: 4,
    title: 'Precipitation: Rain Falls',
    description:
      'When clouds become heavy with water droplets, they release the water back to Earth as precipitation - rain, snow, or hail. This water falls on the surface, replenishing water bodies.',
    type: 'explanation',
    mode: 'learn',
    data: { stage: 'precipitation', activeElements: ['clouds', 'rain', 'water'] },
  },
  {
    id: 5,
    title: 'Collection & Infiltration',
    description:
      'Rainwater that falls on Earth either flows into ponds, lakes, rivers, and oceans, or seeps into the ground through infiltration. Water that infiltrates gets stored as groundwater in underground layers called aquifers.',
    type: 'explanation',
    mode: 'learn',
    data: { stage: 'collection', activeElements: ['rain', 'ground', 'water'] },
  },
  {
    id: 6,
    title: 'The Complete Cycle',
    description:
      'The water cycle helps redistribute and replenish water across Earth. It conserves the total amount of water on our planet through this continuous movement - evaporation, condensation, precipitation, and collection.',
    type: 'explanation',
    mode: 'learn',
    data: { stage: 'complete', activeElements: ['all'] },
  },
  {
    id: 7,
    title: 'Practice: Identify the Stages',
    description: "Let's test your understanding! Click on the correct part of the water cycle for each question.",
    type: 'intro',
    mode: 'practice',
    data: {
      question: 'Which process converts water from liquid to gas?',
      answer: 'evaporation',
      options: ['evaporation', 'condensation', 'precipitation', 'collection'],
    },
  },
  {
    id: 8,
    title: 'Practice: Condensation',
    description: 'Great! Now identify the next stage.',
    type: 'practice',
    mode: 'practice',
    data: {
      question: 'What happens when water vapor cools down in the atmosphere?',
      answer: 'condensation',
      options: ['evaporation', 'condensation', 'precipitation', 'infiltration'],
    },
  },
  {
    id: 9,
    title: 'Practice: Precipitation',
    description: 'Excellent progress! One more question.',
    type: 'practice',
    mode: 'practice',
    data: {
      question: 'What do we call it when water falls from clouds as rain, snow, or hail?',
      answer: 'precipitation',
      options: ['evaporation', 'transpiration', 'precipitation', 'condensation'],
    },
  },
  {
    id: 10,
    title: 'Practice: Complete the Cycle',
    description: 'Final challenge! Arrange the stages in the correct order.',
    type: 'practice',
    mode: 'practice',
    data: {
      question: 'Arrange the water cycle stages in order:',
      answer: ['evaporation', 'condensation', 'precipitation', 'collection'],
      type: 'sequence',
    },
  },
  {
    id: 11,
    title: 'Real World: Drying Clothes',
    description:
      "Have you noticed wet clothes drying faster on sunny days? The Sun's heat causes water in the clothes to evaporate faster. This is the same evaporation process that happens in the water cycle! The Sun provides the energy needed to convert liquid water into water vapor.",
    type: 'real_world',
    mode: 'real_world',
    data: {
      example: 'clothes',
      image: 'clothes-drying',
      relatedStage: 'evaporation',
    },
  },
  {
    id: 12,
    title: 'Real World: Morning Dew',
    description:
      'Early morning dew on grass is water cycle in action! During the night, water vapor in the air cools down and condenses on cool surfaces like grass and leaves. This is the same condensation process that forms clouds in the sky.',
    type: 'real_world',
    mode: 'real_world',
    data: {
      example: 'dew',
      image: 'morning-dew',
      relatedStage: 'condensation',
    },
  },
  {
    id: 13,
    title: 'Real World: Rainwater Harvesting',
    description:
      'In many parts of India, people collect rainwater using harvesting systems. This harvested water seeps into the ground, replenishing groundwater in aquifers. This demonstrates the collection and infiltration stage of the water cycle, helping ensure sustainable water supply.',
    type: 'real_world',
    mode: 'real_world',
    data: {
      example: 'harvesting',
      image: 'rainwater-harvest',
      relatedStage: 'collection',
    },
  },
  {
    id: 14,
    title: 'Real World: Ice Stupas in Ladakh',
    description:
      'In Ladakh, people create ice stupas - tall cone-shaped ice structures - by spraying water into cold air during winter. The water freezes layer by layer. In spring, these stupas melt slowly, providing water for farming. This innovative technique uses the water cycle principles of freezing (precipitation) and melting to solve water scarcity.',
    type: 'real_world',
    mode: 'real_world',
    data: {
      example: 'ice-stupa',
      image: 'ice-stupa',
      relatedStage: 'complete',
    },
  },
];

interface WaterCycleLearningProps {
  width?: number;
  height?: number;
  steps?: Step[];
}

const WaterCycleLearning: React.FC<WaterCycleLearningProps> = ({
  width = 800,
  height = 600,
  steps = DEFAULT_STEPS,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedMode, setSelectedMode] = useState<StepMode>('learn');
  const [practiceAnswer, setPracticeAnswer] = useState<string | null>(null);
  const [sequenceOrder, setSequenceOrder] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const isSequenceData = (data: PracticeData): data is PracticeSequenceData =>
    Array.isArray(data.answer);

  const isChoiceData = (data: PracticeData): data is PracticeChoiceData =>
    !Array.isArray(data.answer);

  const modeSteps = steps.filter((step) => step.mode === selectedMode);
  const currentStep = modeSteps[currentStepIndex];

  useEffect(() => {
    if (!isPlaying || selectedMode === 'practice') return;
    const timer = window.setTimeout(() => {
      if (currentStepIndex < modeSteps.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, 8000);
    return () => window.clearTimeout(timer);
  }, [isPlaying, currentStepIndex, modeSteps.length, selectedMode]);

  useEffect(() => {
    if (selectedMode !== 'learn') return;

    const animate = () => {
      setAnimationProgress((prev) => (prev + 0.01) % 1);
      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    animationFrameRef.current = window.requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [selectedMode]);

  useEffect(() => {
    if (selectedMode !== 'learn' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const stage =
      currentStep && currentStep.mode === 'learn'
        ? currentStep.data.stage
        : 'overview';
    const activeElements =
      currentStep && currentStep.mode === 'learn' && currentStep.data.activeElements
        ? currentStep.data.activeElements
        : [];

    drawWaterCycle(ctx, width, height, stage, activeElements, animationProgress);
  }, [currentStep, animationProgress, width, height, selectedMode]);

  const nextStep = () => {
    if (currentStepIndex < modeSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setPracticeAnswer(null);
      setShowFeedback(false);
      setSequenceOrder([]);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setPracticeAnswer(null);
      setShowFeedback(false);
      setSequenceOrder([]);
    }
  };

  const resetMode = () => {
    setCurrentStepIndex(0);
    setPracticeAnswer(null);
    setShowFeedback(false);
    setSequenceOrder([]);
  };

  const handleModeChange = (mode: StepMode) => {
    setSelectedMode(mode);
    setCurrentStepIndex(0);
    setPracticeAnswer(null);
    setShowFeedback(false);
    setSequenceOrder([]);
    setIsPlaying(mode !== 'practice');
  };

  const handlePracticeAnswer = (answer: string) => {
    if (!currentStep || currentStep.mode !== 'practice') return;
    const data = currentStep.data;
    if (isChoiceData(data)) {
      setPracticeAnswer(answer);
      setShowFeedback(true);
      const isCorrect = answer === data.answer;
      if (isCorrect) {
        window.setTimeout(() => {
          if (currentStepIndex < modeSteps.length - 1) {
            nextStep();
          }
        }, 2000);
      }
    }
  };

  const handleSequenceSelection = (item: string) => {
    setSequenceOrder((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const checkSequence = () => {
    if (!currentStep || currentStep.mode !== 'practice') return;
    const data = currentStep.data;
    if (isSequenceData(data)) {
      const correctOrder = data.answer;
      const isCorrect = JSON.stringify(sequenceOrder) === JSON.stringify(correctOrder);
      setShowFeedback(true);
      setPracticeAnswer(isCorrect ? 'correct' : 'incorrect');
      if (isCorrect) {
        window.setTimeout(() => {
          if (currentStepIndex < modeSteps.length - 1) {
            nextStep();
          }
        }, 2000);
      }
    }
  };

  if (!currentStep) return null;

  return (
    <div className="w-full max-w-6xl mx-auto bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 rounded-2xl shadow-2xl overflow-hidden font-['Poppins',sans-serif]">
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white p-6">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <Droplets className="w-8 h-8" />
          Water Cycle Interactive Learning
        </h1>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handleModeChange('learn')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              selectedMode === 'learn'
                ? 'bg-white text-blue-600 shadow-lg scale-105'
                : 'bg-blue-500/30 text-white hover:bg-blue-500/50'
            }`}
          >
            📚 Learn
          </button>
          <button
            onClick={() => handleModeChange('practice')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              selectedMode === 'practice'
                ? 'bg-white text-blue-600 shadow-lg scale-105'
                : 'bg-blue-500/30 text-white hover:bg-blue-500/50'
            }`}
          >
            ✏️ Practice
          </button>
          <button
            onClick={() => handleModeChange('real_world')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              selectedMode === 'real_world'
                ? 'bg-white text-blue-600 shadow-lg scale-105'
                : 'bg-blue-500/30 text-white hover:bg-blue-500/50'
            }`}
          >
            🌍 Real World
          </button>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{currentStep.title}</h2>
          <div className="text-sm bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
            Step {currentStepIndex + 1} of {modeSteps.length}
          </div>
        </div>
      </div>

      <div className="p-8">
        {selectedMode === 'learn' && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className="w-full border-2 border-blue-200 rounded-lg"
            />
          </div>
        )}

        {selectedMode === 'practice' && currentStep.mode === 'practice' && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h3 className="text-2xl font-bold text-blue-900 mb-6">
              {currentStep.data.question}
            </h3>

            {isSequenceData(currentStep.data) ? (
              <div>
                <div className="mb-6">
                  <h4 className="font-semibold text-lg mb-3 text-gray-700">
                    Available Options (Click to add in order):
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {currentStep.data.answer.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleSequenceSelection(option)}
                        disabled={sequenceOrder.includes(option)}
                        className={`px-6 py-4 rounded-lg font-semibold transition-all ${
                          sequenceOrder.includes(option)
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:scale-105'
                        }`}
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-lg mb-3 text-gray-700">Your Order:</h4>
                  <div className="flex gap-2 min-h-[60px] p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    {sequenceOrder.map((item, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg font-semibold flex items-center gap-2"
                      >
                        {index + 1}. {item.charAt(0).toUpperCase() + item.slice(1)}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={checkSequence}
                  disabled={sequenceOrder.length !== currentStep.data.answer.length}
                  className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                    sequenceOrder.length === currentStep.data.answer.length
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Check Answer
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {isChoiceData(currentStep.data) &&
                  currentStep.data.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handlePracticeAnswer(option)}
                      disabled={practiceAnswer !== null}
                      className={`px-6 py-4 rounded-xl font-semibold text-lg transition-all ${
                        practiceAnswer === option
                          ? option === currentStep.data.answer
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105'
                            : 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg'
                          : practiceAnswer !== null
                          ? 'bg-gray-200 text-gray-400'
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:scale-105'
                      }`}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                  ))}
              </div>
            )}

            {showFeedback && (
              <div
                className={`mt-6 p-4 rounded-lg text-center font-semibold ${
                  practiceAnswer === 'correct' ||
                  (currentStep.mode === 'practice' &&
                    isChoiceData(currentStep.data) &&
                    practiceAnswer === currentStep.data.answer)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {practiceAnswer === 'correct' ||
                (currentStep.mode === 'practice' &&
                  isChoiceData(currentStep.data) &&
                  practiceAnswer === currentStep.data.answer)
                  ? '✅ Correct! Well done!'
                  : '❌ Try again!'}
              </div>
            )}
          </div>
        )}

        {selectedMode === 'real_world' && currentStep.mode === 'real_world' && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="flex items-start gap-6">
              <div className="flex-1">
                <div className="mb-6">
                  {getRealWorldIllustration(currentStep.data.example)}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 mb-6 border-l-4 border-blue-500">
          <p className="text-gray-800 text-lg leading-relaxed">{currentStep.description}</p>
        </div>

        <div className="flex justify-between items-center gap-4">
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="flex gap-3">
            {selectedMode === 'learn' && (
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Play
                  </>
                )}
              </button>
            )}

            <button
              onClick={resetMode}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>

          <button
            onClick={nextStep}
            disabled={currentStepIndex === modeSteps.length - 1}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 transition-all duration-300 rounded-full"
              style={{ width: `${((currentStepIndex + 1) / modeSteps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function drawWaterCycle(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  stage: LearnStage,
  activeElements: LearnActiveElement[],
  progress: number,
) {
  const waterY = height * 0.7;

  const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
  skyGradient.addColorStop(0, '#87CEEB');
  skyGradient.addColorStop(1, '#E0F6FF');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, width, height * 0.6);

  const groundGradient = ctx.createLinearGradient(0, height * 0.6, 0, height);
  groundGradient.addColorStop(0, '#90EE90');
  groundGradient.addColorStop(0.5, '#8FBC8F');
  groundGradient.addColorStop(1, '#654321');
  ctx.fillStyle = groundGradient;
  ctx.fillRect(0, height * 0.6, width, height * 0.4);

  if (activeElements.includes('sun') || activeElements.includes('all')) {
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(width * 0.15, height * 0.15, 40, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12 + progress * Math.PI * 2;
      const x1 = width * 0.15 + Math.cos(angle) * 50;
      const y1 = height * 0.15 + Math.sin(angle) * 50;
      const x2 = width * 0.15 + Math.cos(angle) * 65;
      const y2 = height * 0.15 + Math.sin(angle) * 65;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }

  ctx.fillStyle = '#4682B4';
  ctx.beginPath();
  ctx.ellipse(width * 0.3, waterY, width * 0.25, 40, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#8B7355';
  ctx.beginPath();
  ctx.moveTo(width * 0.7, height * 0.6);
  ctx.lineTo(width * 0.8, height * 0.3);
  ctx.lineTo(width * 0.9, height * 0.6);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(width * 0.75, height * 0.35);
  ctx.lineTo(width * 0.8, height * 0.3);
  ctx.lineTo(width * 0.85, height * 0.35);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#8B4513';
  ctx.fillRect(width * 0.55, height * 0.5, 15, 60);
  ctx.fillStyle = '#228B22';
  ctx.beginPath();
  ctx.arc(width * 0.5625, height * 0.48, 30, 0, Math.PI * 2);
  ctx.fill();

  if ((activeElements.includes('vapor') || activeElements.includes('all')) && (stage === 'evaporation' || stage === 'complete')) {
    drawAnimatedArrow(ctx, width * 0.3, waterY - 20, width * 0.35, height * 0.4, '#00CED1', progress);
    drawAnimatedArrow(ctx, width * 0.25, waterY - 20, width * 0.3, height * 0.45, '#00CED1', progress + 0.3);

    for (let i = 0; i < 5; i++) {
      const x = width * 0.25 + i * 20 + Math.sin(progress * Math.PI * 2 + i) * 10;
      const y = height * 0.5 - progress * 100 - i * 15;
      ctx.fillStyle = `rgba(0, 206, 209, ${0.6 - progress})`;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (
    (activeElements.includes('clouds') || activeElements.includes('all')) &&
    (stage === 'condensation' || stage === 'precipitation' || stage === 'complete')
  ) {
    drawCloud(ctx, width * 0.4, height * 0.25, 80);
    drawCloud(ctx, width * 0.6, height * 0.2, 100);
  }

  if (
    (activeElements.includes('rain') || activeElements.includes('all')) &&
    (stage === 'precipitation' || stage === 'collection' || stage === 'complete')
  ) {
    ctx.strokeStyle = '#4682B4';
    ctx.lineWidth = 2;
    for (let i = 0; i < 15; i++) {
      const x = width * 0.35 + i * 20 + Math.sin(progress * Math.PI * 2 + i) * 5;
      const y1 = height * 0.35 + ((progress * 200 + i * 10) % 200);
      const y2 = y1 + 15;
      ctx.beginPath();
      ctx.moveTo(x, y1);
      ctx.lineTo(x, y2);
      ctx.stroke();
    }
  }

  if (
    (activeElements.includes('ground') || activeElements.includes('all')) &&
    (stage === 'collection' || stage === 'complete')
  ) {
    drawAnimatedArrow(ctx, width * 0.4, height * 0.65, width * 0.4, height * 0.85, '#4169E1', progress);
    ctx.fillStyle = 'rgba(70, 130, 180, 0.5)';
    ctx.fillRect(width * 0.35, height * 0.85, width * 0.3, 30);
  }

  ctx.fillStyle = '#000000';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';

  if (stage === 'evaporation' || stage === 'complete') {
    ctx.fillText('EVAPORATION', width * 0.3, height * 0.55);
  }
  if (stage === 'condensation' || stage === 'complete') {
    ctx.fillText('CONDENSATION', width * 0.5, height * 0.15);
  }
  if (stage === 'precipitation' || stage === 'complete') {
    ctx.fillText('PRECIPITATION', width * 0.5, height * 0.4);
  }
  if (stage === 'collection' || stage === 'complete') {
    ctx.fillText('COLLECTION', width * 0.5, height * 0.73);
    ctx.fillText('INFILTRATION', width * 0.5, height * 0.95);
  }
}

function drawAnimatedArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  color: string,
  progress: number,
) {
  const animatedProgress = progress % 1;
  const currentX = fromX + (toX - fromX) * animatedProgress;
  const currentY = fromY + (toY - fromY) * animatedProgress;

  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(currentX, currentY);
  ctx.stroke();

  const angle = Math.atan2(toY - fromY, toX - fromX);
  const headLength = 15;

  ctx.beginPath();
  ctx.moveTo(currentX, currentY);
  ctx.lineTo(
    currentX - headLength * Math.cos(angle - Math.PI / 6),
    currentY - headLength * Math.sin(angle - Math.PI / 6),
  );
  ctx.lineTo(
    currentX - headLength * Math.cos(angle + Math.PI / 6),
    currentY - headLength * Math.sin(angle + Math.PI / 6),
  );
  ctx.closePath();
  ctx.fill();
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.fillStyle = '#FFFFFF';

  ctx.beginPath();
  ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x + size * 0.4, y - size * 0.1, size * 0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x - size * 0.4, y - size * 0.1, size * 0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x + size * 0.2, y + size * 0.2, size * 0.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x - size * 0.2, y + size * 0.2, size * 0.35, 0, Math.PI * 2);
  ctx.fill();
}

function getRealWorldIllustration(example: RealWorldExample): React.ReactElement | null {
  switch (example) {
    case 'clothes':
      return (
        <div className="relative bg-gradient-to-b from-sky-200 to-sky-100 rounded-lg p-8 h-80 overflow-hidden">
          <div className="absolute top-4 right-4 w-16 h-16 bg-yellow-400 rounded-full shadow-lg">
            <div className="absolute inset-0 animate-pulse bg-yellow-300 rounded-full opacity-50" />
          </div>
          <div className="absolute top-20 left-0 right-0 h-1 bg-gray-700" />
          <div className="absolute top-24 left-12 w-20 h-24 bg-blue-400 rounded-lg shadow-md transform rotate-2 animate-bounce" />
          <div className="absolute top-24 left-36 w-24 h-28 bg-red-400 rounded-lg shadow-md transform -rotate-1" />
          <div
            className="absolute top-24 left-64 w-20 h-24 bg-green-400 rounded-lg shadow-md transform rotate-3 animate-bounce"
            style={{ animationDelay: '0.2s' }}
          />
          <div
            className="absolute top-52 left-16 text-cyan-500 text-4xl animate-bounce"
            style={{ animationDuration: '2s' }}
          >
            ↑
          </div>
          <div
            className="absolute top-56 left-44 text-cyan-500 text-4xl animate-bounce"
            style={{ animationDuration: '2s', animationDelay: '0.3s' }}
          >
            ↑
          </div>
          <div
            className="absolute top-52 left-72 text-cyan-500 text-4xl animate-bounce"
            style={{ animationDuration: '2s', animationDelay: '0.6s' }}
          >
            ↑
          </div>
          <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-sm p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-800">
              ☀️ Sun&apos;s heat → Water evaporates from clothes → Clothes dry faster!
            </p>
          </div>
        </div>
      );
    case 'dew':
      return (
        <div className="relative bg-gradient-to-b from-indigo-900 via-blue-900 to-green-800 rounded-lg p-8 h-80 overflow-hidden">
          <div className="absolute top-4 right-8 w-12 h-12 bg-gray-200 rounded-full shadow-lg">
            <div className="absolute top-1 right-2 w-8 h-8 bg-indigo-900 rounded-full" />
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="inline-block mx-2">
                <div className="w-2 h-32 bg-green-600 rounded-t-full transform origin-bottom">
                  <div className="absolute top-8 -left-1 w-4 h-4 bg-cyan-300 rounded-full opacity-80 animate-pulse shadow-lg" />
                  <div
                    className="absolute top-16 -left-0.5 w-3 h-3 bg-cyan-300 rounded-full opacity-80 animate-pulse shadow-lg"
                    style={{ animationDelay: '0.3s' }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div
            className="absolute top-20 left-20 text-cyan-300 text-2xl animate-bounce"
            style={{ animationDuration: '3s' }}
          >
            💧
          </div>
          <div
            className="absolute top-32 left-40 text-cyan-300 text-2xl animate-bounce"
            style={{ animationDuration: '3s', animationDelay: '0.5s' }}
          >
            💧
          </div>
          <div
            className="absolute top-28 right-32 text-cyan-300 text-2xl animate-bounce"
            style={{ animationDuration: '3s', animationDelay: '1s' }}
          >
            💧
          </div>
          <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-800">
              🌙 Night cooling → Water vapor condenses → Dew forms on grass!
            </p>
          </div>
        </div>
      );
    case 'harvesting':
      return (
        <div className="relative bg-gradient-to-b from-gray-600 via-gray-400 to-green-700 rounded-lg p-8 h-80 overflow-hidden">
          <div className="absolute bottom-24 left-12 w-32 h-24 bg-orange-800 rounded-lg">
            <div className="absolute -top-8 -left-4 w-40 h-12 bg-red-800 transform -skew-y-12 rounded-t-lg" />
            <div className="absolute top-4 left-4 w-8 h-10 bg-blue-900" />
          </div>
          <div className="absolute top-8 left-0 right-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute text-blue-500 text-2xl animate-bounce"
                style={{
                  left: `${i * 5}%`,
                  top: `${(i * 13) % 60}px`,
                  animationDuration: '1.5s',
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                |
              </div>
            ))}
          </div>
          <div className="absolute bottom-24 right-12 w-24 h-32 bg-blue-800 rounded-lg border-4 border-blue-900">
            <div className="absolute top-4 left-0 right-0 h-20 bg-blue-400 animate-pulse" />
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-blue-500 text-3xl">
              ▼
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="text-blue-600 text-4xl animate-bounce" style={{ animationDuration: '2s' }}>
              ⬇
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-blue-900/30 backdrop-blur-sm">
            <p className="text-center text-white font-semibold pt-4 px-4 text-sm">
              🏠 Collected rainwater → Seeps into ground → Replenishes groundwater!
            </p>
          </div>
        </div>
      );
    case 'ice-stupa':
      return (
        <div className="relative bg-gradient-to-b from-blue-300 via-white to-blue-100 rounded-lg p-8 h-80 overflow-hidden">
          <div className="absolute bottom-16 left-4 w-32 h-40 bg-gray-600 transform -skew-x-12">
            <div className="absolute top-0 left-0 right-0 h-20 bg-white" />
          </div>
          <div className="absolute bottom-16 right-8 w-40 h-48 bg-gray-700 transform skew-x-6">
            <div className="absolute top-0 left-0 right-0 h-24 bg-white" />
          </div>
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="relative w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[120px] border-b-cyan-200">
              <div className="absolute -bottom-1 -left-12 w-24 h-2 bg-cyan-300 rounded-full" />
              <div className="absolute -bottom-20 -left-10 w-20 h-2 bg-cyan-300 rounded-full" />
              <div className="absolute -bottom-40 -left-8 w-16 h-2 bg-cyan-300 rounded-full" />
              <div className="absolute -bottom-60 -left-6 w-12 h-2 bg-cyan-300 rounded-full" />
              <div className="absolute -bottom-80 -left-4 w-8 h-2 bg-cyan-300 rounded-full" />
              <div className="absolute -bottom-4 left-0 text-blue-400 text-xl animate-bounce">💧</div>
              <div
                className="absolute -bottom-4 -left-4 text-blue-400 text-xl animate-bounce"
                style={{ animationDelay: '0.5s' }}
              >
                💧
              </div>
            </div>
          </div>
          <div className="absolute top-4 right-4 w-16 h-16 bg-yellow-400 rounded-full shadow-lg">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-8 h-1 bg-yellow-400 transform origin-left"
                style={{ transform: `translate(-50%, -50%) rotate(${i * 45}deg)` }}
              />
            ))}
          </div>
          <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-800">
              ❄️ Winter: Water freezes → Spring: Ice melts slowly → Provides water for farming!
            </p>
          </div>
        </div>
      );
    default:
      return null;
  }
}

export default WaterCycleLearning;


