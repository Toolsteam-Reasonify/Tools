import { useEffect, useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import AnimatedText from '../../../components/AnimatedText';
import { ModeExercise } from '../../../interfaces/modeTypes';

export default function PracticeMode() {
  const { isTransitioning, t } = useLanguage();

  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);

  const exercises: ModeExercise[] = [
    {
      exercise_id: 'm1',
      title: t('ex1Title'),
      description: t('ex1Desc'),
      difficulty: 'beginner',
      problem_data: { dataset: [1,1,2,2,2,3,3,4,4] },
      questions: [{ type: 'mode', question: t('ex1Question'), expected_answer: 2 }],
      solution: { modes: [2], step_by_step: [ { step: 1, description: t('stepCountEachValue') }, { step: 2, description: t('stepPickHighestFrequency'), result: '2' } ] },
      interaction_config: { input_methods: ['number_input'], hint_system: true, progressive_hints: [t('hintCountFrequencies'), t('hintPickLargestCount')] }
    },
    {
      exercise_id: 'm2',
      title: t('ex2Title'),
      description: t('ex2Desc'),
      difficulty: 'intermediate',
      problem_data: { dataset: [8,22,32,37,6] },
      questions: [{ type: 'mode', question: t('ex2Question'), expected_answer: 105 }],
      solution: { modes: [105], step_by_step: [ { step: 1, description: t('stepFindMaxCount') }, { step: 2, description: t('stepMapToSize'), result: '105' } ] },
      interaction_config: { input_methods: ['number_input'], hint_system: true, progressive_hints: [t('hintCountFrequencies'), t('hintPickLargestCount')] }
    },
    {
      exercise_id: 'm3',
      title: t('ex3Title'),
      description: t('ex3Desc'),
      difficulty: 'advanced',
      problem_data: { dataset: [2,2,5,5,6,3,4,5,2] },
      questions: [{ type: 'mode', question: t('ex3Question'), expected_answer: '2,5' }],
      solution: { modes: [2,5], step_by_step: [ { step: 1, description: t('stepMultipleModesCounts') }, { step: 2, description: t('stepBothAreModes'), result: '2 and 5' } ] },
      interaction_config: { input_methods: ['text_input'], hint_system: true, progressive_hints: [t('hintCountFrequencies'), t('hintPickLargestCount')] }
    },
    {
      exercise_id: 'm4',
      title: t('ex4Title'),
      description: t('ex4Desc'),
      difficulty: 'beginner',
      problem_data: { dataset: [85,90,85,78,92,85,88,90] },
      questions: [{ type: 'mode', question: t('ex4Question'), expected_answer: 85 }],
      solution: { modes: [85], step_by_step: [ { step: 1, description: t('stepCountEachValue') }, { step: 2, description: t('stepPickHighestFrequency'), result: '85' } ] },
      interaction_config: { input_methods: ['number_input'], hint_system: true, progressive_hints: [t('hintCountFrequencies'), t('hintPickLargestCount')] }
    },
    {
      exercise_id: 'm5',
      title: t('ex5Title'),
      description: t('ex5Desc'),
      difficulty: 'intermediate',
      problem_data: { dataset: [4,5,4,3,4,5,3,4,2] },
      questions: [{ type: 'mode', question: t('ex5Question'), expected_answer: 4 }],
      solution: { modes: [4], step_by_step: [ { step: 1, description: t('stepCountEachValue') }, { step: 2, description: t('stepPickHighestFrequency'), result: '4' } ] },
      interaction_config: { input_methods: ['number_input'], hint_system: true, progressive_hints: [t('hintCountFrequencies'), t('hintPickLargestCount')] }
    },
    {
      exercise_id: 'm6',
      title: t('ex6Title'),
      description: t('ex6Desc'),
      difficulty: 'beginner',
      problem_data: { dataset: [28,30,28,32,28,30,28,29] },
      questions: [{ type: 'mode', question: t('ex6Question'), expected_answer: 28 }],
      solution: { modes: [28], step_by_step: [ { step: 1, description: t('stepCountEachValue') }, { step: 2, description: t('stepPickHighestFrequency'), result: '28' } ] },
      interaction_config: { input_methods: ['number_input'], hint_system: true, progressive_hints: [t('hintCountFrequencies'), t('hintPickLargestCount')] }
    }
  ];

  const currentExerciseData = exercises[currentExercise];

  useEffect(() => {
    setShowHint(false);
    setCurrentHintIndex(0);
    setAttempts(0);
    setShowResults(false);
    setShowSolution(false);
    setUserAnswers({});
  }, [currentExercise]);

  const handleAnswerChange = (index: number, value: string) => {
    setUserAnswers(prev => ({ ...prev, [`q${index}`]: value }));
  };

  const handleSubmit = () => {
    setAttempts(prev => prev + 1);
    let correctAnswers = 0;
    currentExerciseData.questions.forEach((question, index) => {
      const userAnswer = userAnswers[`q${index}`] ?? '';
      if (typeof question.expected_answer === 'number') {
        const normalized = parseFloat(userAnswer);
        if (!Number.isNaN(normalized) && Math.abs(normalized - question.expected_answer) < 0.1) correctAnswers++;
      } else {
        const norm = (s: string) => s.replace(/\s+/g, '');
        if (norm(userAnswer) === norm(String(question.expected_answer))) correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setShowResults(true);
    setShowSolution(false);
  };

  const handleShowHint = () => {
    if (currentExerciseData.interaction_config?.progressive_hints) {
      setShowHint(true);
      if (currentHintIndex < currentExerciseData.interaction_config.progressive_hints.length - 1) {
        setCurrentHintIndex(prev => prev + 1);
      }
    }
  };

  return (
    <div className={`space-y-6 transition-all duration-500 ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
      {/* Progress header (Bargraph style) */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">🎯 <AnimatedText text={`${t('practice')} - ${currentExercise + 1}/${exercises.length}`} speed={150} /></h2>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700"
            style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-3 sm:space-y-4">
          <div className="number-card">
            <h3 className="text-lg sm:text-xl font-bold text-brand-700 mb-2 sm:mb-3"><AnimatedText text={currentExerciseData.title} speed={160} /></h3>
            <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base md:text-lg leading-relaxed"><AnimatedText text={currentExerciseData.description} speed={170} /></p>
            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-3">
              <div className="text-sm font-medium text-gray-600 mb-2">{t('data')}:</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {currentExerciseData.problem_data.dataset.map((value, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded text-center text-sm font-medium">{value}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="number-card">
            <h4 className="text-base sm:text-lg font-semibold text-accent-700 mb-3 sm:mb-4">📝 {t('question')}</h4>
            <div className="space-y-4">
              {currentExerciseData.questions.map((q, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">{i + 1}. <AnimatedText text={q.question} speed={170} /></div>
                  <input type={typeof q.expected_answer === 'number' ? 'number' : 'text'} value={userAnswers[`q${i}`] || ''} onChange={(e)=> handleAnswerChange(i, e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent" placeholder={t('enterYourAnswer')} disabled={showResults} />
                </div>
              ))}
            </div>

            {!showResults && currentExerciseData.interaction_config?.progressive_hints && (
              <div className="mt-4 space-y-3">
                <button onClick={handleShowHint} className="w-full px-4 py-2 bg-gradient-to-r from-amber-400 to-warning-500 text-white rounded-lg font-medium hover:from-amber-500 hover:to-warning-600 transition-all duration-300 transform hover:scale-105">💡 {t('showHint')} ({currentHintIndex + 1}/{currentExerciseData.interaction_config.progressive_hints.length})</button>
                {showHint && (
                  <div className="p-4 bg-gradient-to-r from-warning-50 to-amber-50 border-2 border-warning-300 rounded-xl">
                    <div className="font-bold text-warning-800 text-lg mb-2">{t('hint')} {currentHintIndex + 1}</div>
                    <div className="text-warning-700">{currentExerciseData.interaction_config.progressive_hints[currentHintIndex]}</div>
                  </div>
                )}
              </div>
            )}

            {!showResults && (
              <button onClick={handleSubmit} className="w-full mt-4 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-all duration-300 transform hover:scale-105">{t('submitAnswers')}</button>
            )}

            {showResults && (
              <div className="mt-4 space-y-3">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-700 mb-2">⭐ {t('score')}: {score}/{currentExerciseData.questions.length}</div>
                  <div className="text-sm text-gray-600 mb-3">🔁 {t('attempts')}: {attempts}</div>
                </div>
                <button onClick={() => setShowSolution(!showSolution)} className="w-full px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-all duration-300 transform hover:scale-105">{showSolution ? t('hideSolution') : t('showSolution')}</button>
                {showSolution && (
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-700 mb-2">{t('solutionSteps')}</div>
                    <div className="space-y-2">
                      {currentExerciseData.solution.step_by_step.map((s, idx) => (
                        <div key={idx} className="text-xs p-2 bg-white rounded border">Step {s.step}: {s.description}{s.result ? ` – ${s.result}` : ''}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-6 bg-white rounded-xl shadow-lg border">
        <button onClick={()=> setCurrentExercise(e=> Math.max(0, e-1))} disabled={currentExercise===0} className={`w-full sm:w-auto px-3 sm:px-4 py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 ${currentExercise===0?'bg-gray-200 text-gray-400 cursor-not-allowed':'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 transform hover:scale-105'}`}>← {t('previous')}</button>
        <button onClick={()=> { setUserAnswers({}); setShowResults(false); setScore(0); setAttempts(0); setShowSolution(false); setShowHint(false); setCurrentHintIndex(0); }} className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-lg font-semibold text-base hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-105">🔄 {t('reset')}</button>
        <button onClick={()=> setCurrentExercise(e=> Math.min(exercises.length-1, e+1))} disabled={currentExercise===exercises.length-1} className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 ${currentExercise===exercises.length-1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed':'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'}`}>{t('next')} →</button>
      </div>
    </div>
  );
}


