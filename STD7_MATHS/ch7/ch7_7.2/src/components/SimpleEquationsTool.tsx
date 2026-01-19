import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// Type definitions
interface EquationType {
  id: string;
  name: string;
  equation: string;
  solution: string;
  rule: string;
  description: string;
  icon: string;
  color: string;
  steps: string[];
  translations?: {
    [key: string]: {
      name: string;
      rule: string;
      description: string;
      steps: string[];
    };
  };
}

interface Exercise {
  id: string;
  promptKey: string;
  prompt: string;
  answer: string;
  attempted: boolean;
  correct?: boolean;
  skipped: boolean;
}

interface QuestionAttempt {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  attempts: number;
  timeSpent: number;
  skipped: boolean;
}


// Visual percentage application data with icons and colors
const equationTypes: EquationType[] = [
  {
    id: 'percentage_of_quantity',
    name: 'Percentage of a Quantity',
    equation: '25% of 40 = ?',
    solution: '10',
    rule: 'Multiply percentage by quantity',
    description: 'Finding actual quantities from percentages',
    icon: '📊',
    color: 'bg-blue-500',
    steps: [
      'Start with: 25% of 40 = ?',
      'Convert percentage to decimal: 25% = 0.25',
      'Multiply: 0.25 × 40 = 10',
      'Answer: 25% of 40 = 10',
      'Check: 10 out of 40 is 25% ✓'
    ],
    translations: {
      gu: { 
        name: 'જથ્થાના ટકા', 
        rule: 'ટકાને જથ્થા વડે ગુણો', 
        description: 'ટકાથી વાસ્તવિક જથ્થા શોધવું',
        steps: [
          'શરૂ કરો: 25% of 40 = ?',
          'ટકાને દશાંશમાં બદલો: 25% = 0.25',
          'ગુણાકાર: 0.25 × 40 = 10',
          'જવાબ: 25% of 40 = 10',
          'તપાસો: 40 માંથી 10 એ 25% છે ✓'
        ]
      },
      hi: { 
        name: 'मात्रा का प्रतिशत', 
        rule: 'प्रतिशत को मात्रा से गुणा करें', 
        description: 'प्रतिशत से वास्तविक मात्रा ज्ञात करना',
        steps: [
          'शुरू करें: 25% of 40 = ?',
          'प्रतिशत को दशमलव में बदलें: 25% = 0.25',
          'गुणा करें: 0.25 × 40 = 10',
          'उत्तर: 25% of 40 = 10',
          'जांचें: 40 में से 10, 25% है ✓'
        ]
      }
    }
  },
  {
    id: 'ratio_to_percentage',
    name: 'Ratio to Percentage',
    equation: 'Ratio 2:1 = ?%',
    solution: '66⅔%',
    rule: 'Convert ratio parts to percentages',
    description: 'Converting ratios to percentage form',
    icon: '📈',
    color: 'bg-green-500',
    steps: [
      'Start with: Ratio 2:1 = ?%',
      'Total parts = 2 + 1 = 3',
      'First part: 2/3 × 100% = 66⅔%',
      'Second part: 1/3 × 100% = 33⅓%',
      'Answer: 2:1 = 66⅔% : 33⅓% ✓'
    ],
    translations: {
      gu: { 
        name: 'ગુણોત્તરથી ટકાવારી', 
        rule: 'ગુણોત્તર ભાગોને ટકાવારીમાં બદલો', 
        description: 'ગુણોત્તરને ટકાવારી સ્વરૂપમાં બદલવું',
        steps: [
          'શરૂ કરો: ગુણોત્તર 2:1 = ?%',
          'કુલ ભાગો = 2 + 1 = 3',
          'પહેલો ભાગ: 2/3 × 100% = 66⅔%',
          'બીજો ભાગ: 1/3 × 100% = 33⅓%',
          'જવાબ: 2:1 = 66⅔% : 33⅓% ✓'
        ]
      },
      hi: { 
        name: 'अनुपात से प्रतिशत', 
        rule: 'अनुपात भागों को प्रतिशत में बदलें', 
        description: 'अनुपात को प्रतिशत रूप में बदलना',
        steps: [
          'शुरू करें: अनुपात 2:1 = ?%',
          'कुल भाग = 2 + 1 = 3',
          'पहला भाग: 2/3 × 100% = 66⅔%',
          'दूसरा भाग: 1/3 × 100% = 33⅓%',
          'उत्तर: 2:1 = 66⅔% : 33⅓% ✓'
        ]
      }
    }
  },
  {
    id: 'profit_loss_percentage',
    name: 'Profit/Loss Percentage',
    equation: 'CP=₹200, SP=₹250, Profit%=?',
    solution: '25%',
    rule: 'Calculate profit/loss percentage on CP',
    description: 'Calculating profit and loss percentages',
    icon: '💰',
    color: 'bg-purple-500',
    steps: [
      'Start with: CP=₹200, SP=₹250, Profit%=?',
      'Calculate profit: SP - CP = ₹250 - ₹200 = ₹50',
      'Calculate profit %: (Profit/CP) × 100',
      'Profit % = (50/200) × 100 = 25%',
      'Answer: Profit % = 25% ✓'
    ],
    translations: {
      gu: { 
        name: 'લાભ/નુકસાન ટકાવારી', 
        rule: 'CP પર લાભ/નુકસાન ટકાવારી ગણો', 
        description: 'લાભ અને નુકસાન ટકાવારી ગણવી',
        steps: [
          'શરૂ કરો: CP=₹200, SP=₹250, લાભ%=?',
          'લાભ ગણો: SP - CP = ₹250 - ₹200 = ₹50',
          'લાભ % ગણો: (લાભ/CP) × 100',
          'લાભ % = (50/200) × 100 = 25%',
          'જવાબ: લાભ % = 25% ✓'
        ]
      },
      hi: { 
        name: 'लाभ/हानि प्रतिशत', 
        rule: 'CP पर लाभ/हानि प्रतिशत गणना करें', 
        description: 'लाभ और हानि प्रतिशत की गणना',
        steps: [
          'शुरू करें: CP=₹200, SP=₹250, लाभ%=?',
          'लाभ गणना: SP - CP = ₹250 - ₹200 = ₹50',
          'लाभ % गणना: (लाभ/CP) × 100',
          'लाभ % = (50/200) × 100 = 25%',
          'उत्तर: लाभ % = 25% ✓'
        ]
      }
    }
  }
];

const SimpleEquationsTool: React.FC = () => {
  const [currentMode] = useState<'demonstration' | 'practice' | 'assessment'>('demonstration');
  const { language, t } = useLanguage();
  const [selectedEquation, setSelectedEquation] = useState<string>('percentage_of_quantity');
  
  // Practice mode state
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  
  // Demonstration mode state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);


  // Initialize practice exercises
  const baseExercises = useMemo<Omit<Exercise, 'attempted' | 'correct' | 'skipped'>[]>(() => [
    { id: 'q1', promptKey: 'practice_q1', prompt: 'If 25% of 40 children like football, how many like football?', answer: '10' },
    { id: 'q2', promptKey: 'practice_q2', prompt: 'A recipe has rice and urad dal in ratio 2:1. What percentage is rice?', answer: '66⅔%' },
    { id: 'q3', promptKey: 'practice_q3', prompt: 'If a price increases from ₹280 to ₹350, what is the percentage increase?', answer: '25%' },
    { id: 'q4', promptKey: 'practice_q4', prompt: 'If 20% of dresses are blue out of 150 dresses, how many are blue?', answer: '30' },
    { id: 'q5', promptKey: 'practice_q5', prompt: 'If CP = ₹200 and SP = ₹250, what is the profit percentage?', answer: '25%' },
    { id: 'q6', promptKey: 'practice_q6', prompt: 'If 15% of income is saved from ₹2000, how much is saved?', answer: '₹300' },
  ], []);

  // Initialize exercises with tracking
  useEffect(() => {
    setExercises(baseExercises.map(ex => ({ ...ex, attempted: false, skipped: false })));
  }, [baseExercises]);

  // Reset question timer when index changes
  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [index]);

  // Update exercises when language changes
  useEffect(() => {
    setExercises(prev => prev.map(ex => ({
      ...ex,
      prompt: t(ex.promptKey) || ex.prompt
    })));
  }, [language, t]);

  // Demonstration mode controls
  function next() {
    const equation = equationTypes.find(eq => eq.id === selectedEquation) || equationTypes[0];
    const steps = getTranslatedText(equation, 'steps', language);
    setCurrentStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }
  
  function prev() {
    setCurrentStepIndex((i) => Math.max(i - 1, 0));
  }
  
  function reset() {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }

  useEffect(() => {
    if (!isPlaying) return;
    const equation = equationTypes.find(eq => eq.id === selectedEquation) || equationTypes[0];
    const steps = getTranslatedText(equation, 'steps', language);
    const id = setInterval(() => {
      setCurrentStepIndex((i) => {
        if (i >= steps.length - 1) {
          setIsPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 2500);
    return () => clearInterval(id);
  }, [isPlaying, selectedEquation, language]);

  const getTranslatedText = (item: any, field: string, lang: string) => {
    if (item.translations && item.translations[lang] && item.translations[lang][field]) {
      return item.translations[lang][field];
    }
    return item[field];
  };

  // Practice mode functions
  function onResult(ok: boolean) {
    const timeSpent = (Date.now() - questionStartTime) / 1000;
    const currentExercise = exercises[index];
    
    const attempt: QuestionAttempt = {
      questionId: currentExercise.id,
      answer: ok ? 'correct' : 'incorrect',
      isCorrect: ok,
      attempts: 1,
      timeSpent,
      skipped: false
    };
    
    setAttempts(prev => [...prev, attempt]);
    setExercises(prev => prev.map((ex, i) => 
      i === index ? { ...ex, attempted: true, correct: ok } : ex
    ));

    if (ok) {
      setCorrectCount((c) => c + 1);
    }
  }

  function goToPrevious() {
    if (index > 0) {
      setIndex(index - 1);
    }
  }

  function goToNext() {
    if (index < exercises.length - 1) {
      setIndex(index + 1);
    }
  }

  function skipQuestion() {
    const timeSpent = (Date.now() - questionStartTime) / 1000;
    const currentExercise = exercises[index];
    
    const attempt: QuestionAttempt = {
      questionId: currentExercise.id,
      answer: '',
      isCorrect: false,
      attempts: 0,
      timeSpent,
      skipped: true
    };
    
    setAttempts(prev => [...prev, attempt]);
    setExercises(prev => prev.map((ex, i) => 
      i === index ? { ...ex, skipped: true, attempted: false } : ex
    ));

    if (index < exercises.length - 1) {
      setIndex(index + 1);
    }
  }

  // Transport Controls Component
  const TransportControls = ({ onPrev, onNext, onPlayPause, isPlaying }: {
    onPrev: () => void;
    onNext: () => void;
    onPlayPause: () => void;
    isPlaying: boolean;
  }) => (
    <div className="flex items-center gap-2">
      <button
        onClick={onPrev}
        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
        title="Previous Step"
      >
        ⏮️
      </button>
      <button
        onClick={onPlayPause}
        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
        title={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? "⏸️" : "▶️"}
      </button>
      <button
        onClick={onNext}
        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
        title="Next Step"
      >
        ⏭️
      </button>
    </div>
  );

  // Reset Button Component
  const ResetButton = ({ onReset }: { onReset: () => void }) => (
    <button
      onClick={onReset}
      className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
      title="Reset to Beginning"
    >
      🔄 Reset
    </button>
  );

  const renderDemonstrationMode = () => {
    const equation = equationTypes.find(eq => eq.id === selectedEquation) || equationTypes[0];
    const steps = getTranslatedText(equation, 'steps', language);
    
    return (
      <div className="space-y-6 transition-all duration-500 ease-out">
        {/* Enhanced Header with Teal-Purple Theme */}
        <div className="bg-gradient-to-r from-teal-50 to-purple-50 p-4 rounded-xl border border-teal-200/50 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <TransportControls onPrev={prev} onNext={next} onPlayPause={() => setIsPlaying((v) => !v)} isPlaying={isPlaying} />
              <ResetButton onReset={reset} />
            </div>
            
            {/* Enhanced Progress Indicator */}
            <div className="flex items-center gap-3">
              <div className="text-sm font-medium bg-gradient-to-r from-teal-700 to-purple-700 bg-clip-text text-transparent">
                Step {currentStepIndex + 1} / {steps.length}
              </div>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-teal-400 to-purple-500 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Equation Selector */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-2xl">🔽</div>
            <label className="text-lg font-semibold text-gray-700">Select Application Type</label>
          </div>
          <select
            value={selectedEquation}
            onChange={(e) => setSelectedEquation(e.target.value)}
            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-teal-200 focus:border-teal-500 bg-white shadow-sm"
          >
            {equationTypes.map(eq => {
              const eqData = getTranslatedText(eq, 'name', language);
              return (
                <option key={eq.id} value={eq.id}>
                  {eq.icon} {eqData}: {eq.equation}
                </option>
              );
            })}
          </select>
        </div>

        {/* Enhanced Content Section */}
        <div className="transition-all duration-700 ease-out">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">{equation.icon}</div>
              <div className="text-2xl font-bold text-gray-800 mb-2">
                {getTranslatedText(equation, 'name', language)}
              </div>
              <div className="text-5xl font-bold text-gray-800 mb-4">
                {equation.equation}
              </div>
              <div className="text-lg text-gray-600">
                {getTranslatedText(equation, 'description', language)}
              </div>
            </div>
            
            {/* Step Display */}
            <div className="bg-gradient-to-br from-teal-50 to-purple-50 rounded-xl p-6 border border-teal-200">
              <div className="text-center mb-4">
                <div className="text-lg font-semibold text-gray-800">Step-by-Step Application</div>
              </div>
              <div className="space-y-4">
                {steps.map((step: string, stepIndex: number) => (
                  <div 
                    key={stepIndex} 
                    className={`p-4 bg-white rounded-lg border transition-all duration-500 ${
                      stepIndex <= currentStepIndex 
                        ? 'opacity-100 transform translate-x-0 border-teal-200' 
                        : 'opacity-50 transform translate-x-4 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        stepIndex <= currentStepIndex 
                          ? 'bg-teal-500 text-white scale-100' 
                          : 'bg-gray-300 text-gray-500 scale-75'
                      }`}>
                        {stepIndex + 1}
                      </div>
                      <div className="flex-1 text-gray-700">
                        {step}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPracticeMode = () => {
    const currentExercise = exercises[index];
    const completedCount = exercises.filter(ex => ex.attempted && ex.correct).length;
    const attemptedCount = exercises.filter(ex => ex.attempted).length;
    const skippedCount = exercises.filter(ex => ex.skipped).length;
    const notAttemptedCount = exercises.filter(ex => !ex.attempted && !ex.skipped).length;
    const incorrectCount = attemptedCount - completedCount;
    const allQuestionsCompleted = exercises.every(ex => ex.attempted || ex.skipped);

    if (allQuestionsCompleted) {
      const totalTimeSpent = attempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0);
      const averageTimePerQuestion = totalTimeSpent / exercises.length;
      const accuracyRate = exercises.length > 0 ? (correctCount / exercises.length) * 100 : 0;
      
      return (
        <div className="p-6 space-y-6">
          {/* SESSION COMPLETE HEADER */}
          <div className="text-center p-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
            <div className="text-3xl font-bold text-green-700 mb-2">🎉 Session Complete! 🎉</div>
            <div className="text-lg text-gray-600">Here's your complete session summary</div>
          </div>

          {/* COMPREHENSIVE STATISTICS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200 shadow-sm">
              <div className="text-4xl font-bold text-green-600">{correctCount}</div>
              <div className="text-sm text-gray-700 font-medium">Correct Answers</div>
            </div>
            
            <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200 shadow-sm">
              <div className="text-4xl font-bold text-red-600">{incorrectCount}</div>
              <div className="text-sm text-gray-700 font-medium">Incorrect Answers</div>
            </div>
            
            <div className="text-center p-6 bg-yellow-50 rounded-lg border border-yellow-200 shadow-sm">
              <div className="text-4xl font-bold text-yellow-600">{skippedCount}</div>
              <div className="text-sm text-gray-700 font-medium">Skipped Questions</div>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-4xl font-bold text-gray-600">{notAttemptedCount}</div>
              <div className="text-sm text-gray-700 font-medium">Not Attempted</div>
            </div>
          </div>

          {/* PERFORMANCE METRICS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <div className="text-4xl font-bold text-purple-600">{accuracyRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Accuracy Rate</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-600">{exercises.length}</div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-600">{Math.round(averageTimePerQuestion)}s</div>
              <div className="text-sm text-gray-600">Avg Time/Question</div>
            </div>
          </div>

          {/* RESTART BUTTON */}
          <div className="text-center">
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Start New Session
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Simple Progress Header */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Practice Mode</h3>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                Question {index + 1} / {exercises.length}
              </div>
            </div>
          </div>
          
          {/* Simple Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((index + 1) / exercises.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Question */}
        <PracticeExerciseCard 
          prompt={currentExercise.prompt} 
          answer={currentExercise.answer} 
          onResult={onResult}
          questionNumber={index + 1}
          totalQuestions={exercises.length}
          onPrevious={goToPrevious}
          onNext={goToNext}
          onSkip={skipQuestion}
          canGoPrevious={index > 0}
          canGoNext={index < exercises.length - 1}
        />
      </div>
    );
  };

  // PracticeExerciseCard Component
  const PracticeExerciseCard = ({ 
    prompt, 
    answer, 
    onResult,
    questionNumber,
    totalQuestions,
    onPrevious,
    onNext,
    onSkip,
    canGoPrevious = true,
    canGoNext = true
  }: {
    prompt: string;
    answer: string;
    onResult?: (correct: boolean) => void;
    questionNumber?: number;
    totalQuestions?: number;
    onPrevious?: () => void;
    onNext?: () => void;
    onSkip?: () => void;
    canGoPrevious?: boolean;
    canGoNext?: boolean;
  }) => {
    const [value, setValue] = useState('');
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);

    // Reset state when question changes
    useEffect(() => {
      setValue('');
      setFeedback(null);
      setIsSubmitted(false);
      setShowAnswer(false);
    }, [prompt]);

    function check() {
      if (!value.trim()) return;
      
      setIsSubmitted(true);
      
      const ok = value.trim() === answer;
      
      setFeedback(ok ? 'Correct!' : 'Incorrect');
      onResult?.(ok);
    }

    function handleKeyPress(e: React.KeyboardEvent) {
      if (e.key === 'Enter' && !isSubmitted) {
        check();
      }
    }

    function reset() {
      setValue('');
      setFeedback(null);
      setIsSubmitted(false);
      setShowAnswer(false);
    }

    return (
      <div className="practice-card bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
        {/* TOP NAVIGATION */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <div className="flex justify-between items-center">
            <button
              onClick={onPrevious}
              disabled={!canGoPrevious}
              className={`px-6 py-3 rounded-lg font-bold text-lg ${
                !canGoPrevious
                  ? 'bg-white/20 text-white/50 cursor-not-allowed'
                  : 'bg-white/30 hover:bg-white/40 transform hover:scale-105'
              }`}
            >
              ← PREVIOUS
            </button>

            <div className="text-center">
              <div className="text-xl font-bold">
                Question {questionNumber || 1} / {totalQuestions || 1}
              </div>
            </div>

            <button
              onClick={onNext}
              disabled={!canGoNext}
              className={`px-6 py-3 rounded-lg font-bold text-lg ${
                !canGoNext
                  ? 'bg-white/20 text-white/50 cursor-not-allowed'
                  : 'bg-white/30 hover:bg-white/40 transform hover:scale-105'
              }`}
            >
              NEXT →
            </button>
          </div>
        </div>

        {/* QUESTION CONTENT */}
        <div className="p-8 space-y-6">
          <div className="text-center">
            <div className="text-xl font-semibold text-gray-800 mb-4">
              {prompt}
            </div>
          </div>

          <div className="space-y-4">
            <input 
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg text-center"
              placeholder="Your answer" 
              value={value} 
              onChange={(e) => setValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSubmitted}
              type="text"
            />
            
            <div className="flex justify-center gap-3">
              <button 
                className={`px-6 py-2 rounded-lg font-medium ${
                  isSubmitted || !value.trim()
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                onClick={check}
                disabled={isSubmitted || !value.trim()}
              >
                Submit
              </button>
            </div>
          </div>

          {/* FEEDBACK */}
          {feedback && (
            <div className={`text-center py-3 px-4 rounded-lg ${
              feedback === 'Correct!' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              <div className="text-2xl mb-1">
                {feedback === 'Correct!' ? '✅' : '❌'}
              </div>
              <div className="text-lg font-semibold">{feedback}</div>
            </div>
          )}

          {/* SHOW ANSWER */}
          {showAnswer && (
            <div className="bg-blue-100 text-blue-800 p-6 rounded-xl text-center border-4 border-blue-300">
              <div className="text-lg font-bold mb-2">📚 Correct Answer</div>
              <div className="text-3xl font-bold">{answer}</div>
            </div>
          )}

          {/* ACTION BUTTONS */}
          {isSubmitted && (
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold"
              >
                {showAnswer ? 'Hide Answer' : 'Show Answer'}
              </button>
              
              <button
                onClick={reset}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-bold"
              >
                Try Again
              </button>
            </div>
          )}

          {/* SKIP BUTTON */}
          <div className="flex justify-center gap-4">
            <button
              onClick={onSkip}
              className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium"
            >
              ⏭️ Skip
            </button>
          </div>
        </div>

        {/* BOTTOM NAVIGATION */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <button
              onClick={onPrevious}
              disabled={!canGoPrevious}
              className="px-4 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            <div className="text-center">
              <div className="text-sm font-medium text-gray-600">
                {questionNumber || 1} / {totalQuestions || 1}
              </div>
            </div>

            <button
              onClick={onNext}
              disabled={!canGoNext}
              className="px-4 py-2 bg-green-500 text-white rounded font-medium hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderAssessmentMode = () => {
    const correctAnswers = attempts.filter(r => r.isCorrect).length;
    const accuracy = attempts.length > 0 ? (correctAnswers / attempts.length) * 100 : 0;
    const avgTime = attempts.length > 0 ? 
      attempts.reduce((sum, r) => sum + r.timeSpent, 0) / attempts.length : 0;

    return (
      <div className="assessment-mode space-y-6">
        {/* Visual Stats Cards */}
        <div className="stats-grid grid grid-cols-3 gap-6">
          <div className="stat-card bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-center">
              <div className="text-4xl mb-2">✅</div>
              <div className="text-4xl font-bold">{correctAnswers}</div>
              <div className="text-blue-100">Correct Answers</div>
            </div>
          </div>
          
          <div className="stat-card bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-center">
              <div className="text-4xl mb-2">🎯</div>
              <div className="text-4xl font-bold">{Math.round(accuracy)}%</div>
              <div className="text-green-100">Accuracy</div>
            </div>
          </div>
          
          <div className="stat-card bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-center">
              <div className="text-4xl mb-2">⚡</div>
              <div className="text-4xl font-bold">{Math.round(avgTime)}s</div>
              <div className="text-purple-100">Avg Time</div>
            </div>
          </div>
        </div>

        {/* Visual Performance Feedback */}
        <div className="performance-feedback bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center">
            <div className="text-6xl mb-4">
              {accuracy >= 80 ? '🌟' : accuracy >= 60 ? '👍' : '💪'}
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-4">
              {accuracy >= 80 ? 'Excellent!' : accuracy >= 60 ? 'Good Job!' : 'Keep Trying!'}
            </div>
            
            {/* Visual Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-6 mb-6">
              <div 
                className={`h-6 rounded-full transition-all duration-1000 ${
                  accuracy >= 80 ? 'bg-green-500' : accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${accuracy}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Main Content */}
        <div className="main-content">
          {currentMode === 'demonstration' && renderDemonstrationMode()}
          {currentMode === 'practice' && renderPracticeMode()}
          {currentMode === 'assessment' && renderAssessmentMode()}
        </div>
      </div>
    </div>
  );
};

export default SimpleEquationsTool;
