import { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import AnimatedText from '../../../components/AnimatedText';

// Using shared AnimatedText component

type ArithmeticMeanExercise = {
  id: number;
  title: string;
  description: string;
  data: number[];
  question: string;
  answer: string | number;
  hint: string;
  solution: string;
  unit: string;
  context: string;
};

export default function PracticeMode() {
  const { t } = useLanguage();
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [showAssessment, setShowAssessment] = useState(false);
  const [exerciseResults, setExerciseResults] = useState<{correct: boolean, attempts: number}[]>([]);

  // Practice exercises with Arithmetic Mean data
  const exercises: ArithmeticMeanExercise[] = [
    {
      id: 1,
      title: t('studyHoursAnalysis'),
      description: t('studyHoursDescription'),
      data: [4, 5, 3],
      question: t('meanStudyTimeQuestion'),
      answer: '4',
      hint: t('hint1MeanFormula'),
      solution: t('hint1AddNumbers'),
        unit: t('hours'),
      context: t('ashishStudyHours')
    },
    {
      id: 2,
      title: t('batsmanPerformance'),
      description: t('batsmanPerformanceDescription'),
      data: [36, 35, 50, 46, 60, 55],
      question: t('meanRunsQuestion'),
      answer: '47',
      hint: t('hint2AddRuns'),
      solution: t('hint2DivideInnings'),
        unit: t('runs'),
      context: t('batsmanRunsContext')
    },
    {
      id: 3,
      title: t('weeklyRainfallAnalysis'),
      description: t('weeklyRainfallDescription'),
      data: [0.0, 12.2, 2.1, 0.0, 20.5, 5.5, 1.0],
      question: t('meanRainfallQuestion'),
      answer: '5.9',
      hint: t('hint3AddRainfall'),
      solution: t('hint3DivideSeven'),
        unit: t('mm'),
      context: t('dailyRainfallContext')
    },
    {
      id: 4,
      title: t('studentHeights'),
      description: t('studentHeightsDescription'),
      data: [135, 150, 139, 128, 151, 132, 146, 149, 143, 141],
      question: t('meanHeightQuestion'),
      answer: '141.4',
      hint: t('hint4AddHeights'),
      solution: t('hint4DivideStudents'),
        unit: t('cm'),
      context: t('studentsHeightsContext')
    },
    {
      id: 5,
      title: t('temperatureRecords'),
      description: t('temperatureRecordsDescription'),
      data: [22, 25, 28, 24, 26, 23, 27],
          question: t('meanTemperatureQuestion'),
      answer: '25',
      hint: t('hint5AddTemperatures'),
      solution: t('hint5DivideSevenTemp'),
      unit: '°C',
      context: t('dailyTemperatureContext')
    },
    {
      id: 6,
      title: t('testScores'),
      description: t('testScoresDescription'),
      data: [85, 92, 78, 96, 87, 89, 94, 81, 88, 93],
      question: t('meanTestScoreQuestion'),
      answer: '88.3',
      hint: t('hint6AddTestScores'),
      solution: t('hint6DivideTen'),
        unit: t('marks'),
      context: t('mathematicsTestContext')
    },
  ];

  const currentEx = exercises[currentExercise];

  const handleSubmit = () => {
    const correct = userAnswer.trim().toLowerCase() === String(currentEx.answer).toLowerCase();
    setIsCorrect(correct);
    setSubmitted(true);
    setAttempts(attempts + 1);
    if (correct) {
      setScore(score + 1);
    }
    
    // Store result for this exercise
    const newResults = [...exerciseResults];
    newResults[currentExercise] = {
      correct,
      attempts: (newResults[currentExercise]?.attempts || 0) + 1
    };
    setExerciseResults(newResults);
  };

  const handleNext = () => {
    setCurrentExercise(currentExercise + 1);
    setUserAnswer('');
    setShowHint(false);
      setShowSolution(false);
    setSubmitted(false);
    setIsCorrect(false);
  };

  const handlePrevious = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
      setUserAnswer('');
      setShowHint(false);
      setShowSolution(false);
      setSubmitted(false);
      setIsCorrect(false);
    }
  };

  const calculateMean = (data: number[]) => {
    const sum = data.reduce((acc, val) => acc + val, 0);
    return (sum / data.length).toFixed(1);
  };

  const getExerciseEmoji = (exerciseId: number) => {
    switch (exerciseId) {
      case 1: return '📚'; // Study hours
      case 2: return '🏏'; // Cricket/Batsman
      case 3: return '🌧️'; // Rainfall
      case 4: return '📏'; // Heights
      case 5: return '🌡️'; // Temperature
      case 6: return '📝'; // Test scores
      default: return '📊';
    }
  };

  const getValueLabels = (exerciseId: number) => {
    switch (exerciseId) {
      case 1: // Study hours
        return [t('monday'), t('tuesday'), t('wednesday')];
      case 2: // Cricket/Batsman innings
        return [t('firstInnings'), t('secondInnings'), t('thirdInnings'), t('fourthInnings'), t('fifthInnings'), t('sixthInnings')];
      case 3: // Weekly rainfall
        return [t('monday'), t('tuesday'), t('wednesday'), t('thursday'), t('friday'), t('saturday'), t('sunday')];
      case 4: // Student heights
        return [t('studentA'), t('studentB'), t('studentC'), t('studentD'), t('studentE'), t('studentF'), t('studentG'), t('studentH'), t('studentI'), t('studentJ')];
      case 5: // Temperature records
        return [t('monday'), t('tuesday'), t('wednesday'), t('thursday'), t('friday'), t('saturday'), t('sunday')];
      case 6: // Test scores
        return [t('student1'), t('student2'), t('student3'), t('student4'), t('student5'), t('student6'), t('student7'), t('student8'), t('student9'), t('student10')];
      default:
        return [t('value') + ' 1', t('value') + ' 2', t('value') + ' 3'];
    }
  };

  // Show assessment if completed
  if (showAssessment) {
    const accuracy = (score / exercises.length) * 100;
    
    return (
      <div className="space-y-6">
        {/* Assessment Header */}
        <div className="relative bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-3xl shadow-2xl p-8 text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-emerald-400/10 to-teal-400/10 animate-pulse" />
          
          <div className="relative z-10 text-center">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-4xl font-bold mb-2">
              {t('arithmeticMeanMasteryComplete')}
            </h2>
            <p className="text-xl opacity-90">{t('completedAllPracticeExercises')}</p>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Score Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-200 transform hover:scale-105 transition-all duration-300">
            <div className="text-4xl mb-4 text-center">🎯</div>
            <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">{t('yourScore')}</h3>
            <div className="text-5xl font-bold text-blue-600 mb-2 text-center">
              {score}/{exercises.length}
            </div>
            <div className="text-lg text-gray-600 text-center">
              {accuracy.toFixed(0)}% {t('accuracy')}
            </div>
          </div>

          {/* Performance Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-200 transform hover:scale-105 transition-all duration-300">
            <div className="text-4xl mb-4 text-center">📊</div>
            <h3 className="text-2xl font-bold text-purple-700 mb-4 text-center">{t('performance')}</h3>
            <div className="text-5xl font-bold text-purple-600 mb-2 text-center">
              {accuracy >= 80 ? '⭐⭐⭐' : accuracy >= 60 ? '⭐⭐' : '⭐'}
            </div>
            <div className="text-lg text-gray-600 text-center">
              {t('totalAttempts')}: {attempts}
            </div>
          </div>
        </div>

        {/* Exercise Breakdown */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">📝 {t('exerciseBreakdown')}</h3>
          <div className="space-y-3">
            {exercises.map((ex, i) => (
              <div key={ex.id} className={`p-4 rounded-xl border-2 ${exerciseResults[i]?.correct ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{exerciseResults[i]?.correct ? '✅' : '❌'}</span>
                    <span className='font-semibold'>{t('questionLabel')} {i + 1}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {exerciseResults[i]?.attempts || 0} {t('attemptLabel')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Restart Button */}
        <div className="text-center">
          <button
            onClick={() => {
              setShowAssessment(false);
              setCurrentExercise(0);
    setScore(0);
    setAttempts(0);
              setExerciseResults([]);
              setUserAnswer('');
              setSubmitted(false);
              setIsCorrect(false);
            }}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
          >
            {t('practiceAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with emoji */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl shadow-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 text-9xl opacity-10">✍️</div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <span className="text-5xl animate-bounce">✍️</span>
            <AnimatedText text={t('practiceMode')} speed={150} />
          </h2>
          <p className="text-lg md:text-xl opacity-90">
            <AnimatedText text={t('practiceSubtitle')} delay={200} speed={150} />
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl shadow-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-gray-700">
            📝 {t('questionProgress')} {currentExercise + 1} {t('of')} {exercises.length}
          </span>
          <span className="font-semibold text-gray-700">
            ⭐ {t('score')}: {score}/{exercises.length}
            </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left - Data visualization */}
        <div className="relative bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-3xl shadow-2xl p-6 overflow-hidden">
          {/* Animated orbs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-300/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent flex items-center gap-2">
              <span className="text-3xl">📊</span>
              {t('dataTitle')}
            </h3>
                
                {/* Data Table */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl mb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-bold text-gray-700">{t('value')}</th>
                      <th className="text-center py-3 px-4 font-bold text-gray-700">{t('data')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentEx.data.map((value, i) => {
                      const colors = ['#ef4444', '#22c55e', '#3b82f6', '#eab308', '#f97316', '#ec4899', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'];
                      const color = colors[i % colors.length];
                      const valueLabels = getValueLabels(currentEx.id);
                      const label = valueLabels[i] || `${t('value')} ${i + 1}`;
                      return (
                        <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: color }}
                              ></div>
                              <span className="font-medium text-gray-700">{label}</span>
                        </div>
                          </td>
                          <td className="text-center py-3 px-4">
                            <span className="text-2xl font-bold" style={{ color: color }}>
                              {value} {currentEx.unit}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mean calculation moved to Solution section */}
          </div>
        </div>

        {/* Right - Question and answer */}
        <div className="relative bg-gradient-to-br from-pink-100 via-red-100 to-orange-100 rounded-3xl shadow-2xl p-6 overflow-hidden">
          {/* Animated orbs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-300/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <div className="relative z-10 space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-700 to-orange-700 bg-clip-text text-transparent flex items-center gap-2">
              <span className="text-3xl">❓</span>
              {t('questionTitle')}
            </h3>

            {/* Question card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-pink-300">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{getExerciseEmoji(currentEx.id)}</span>
                <p className="text-lg font-semibold text-gray-800 leading-relaxed">
                  <AnimatedText text={currentEx.question} key={currentExercise} />
                </p>
              </div>
                  </div>
                  
            {/* Answer input */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-orange-300">
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span className="text-xl">✏️</span>
                {t('yourAnswer')}:
              </label>
                    <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder={t('placeholderAnswer')}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-300 focus:border-pink-500 text-lg transition-all duration-300"
                disabled={submitted && isCorrect}
                    />
                  </div>
                  
            {/* Submit button */}
            {!submitted && (
              <button
                onClick={handleSubmit}
                disabled={!userAnswer.trim()}
                className={`w-full py-4 rounded-2xl font-bold text-xl transition-all duration-300 shadow-xl flex items-center justify-center gap-3 ${
                  userAnswer.trim()
                    ? 'bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white hover:from-pink-600 hover:via-red-600 hover:to-orange-600 hover:scale-105 hover:shadow-2xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span className="text-2xl">✅</span>
                {t('submit')}
              </button>
            )}

            {/* Result */}
            {submitted && (
              <div className={`bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-4 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{isCorrect ? '🎉' : '❌'}</span>
                  <p className={`text-2xl font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrect ? t('correct') : t('incorrect')}
                  </p>
                </div>
                
                {!isCorrect && (
                          <button
                    onClick={() => {
                      setSubmitted(false);
                      setUserAnswer('');
                    }}
                    className="w-full mt-4 py-3 rounded-xl font-bold text-lg bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    {t('tryAgain')} 🔄
                          </button>
                )}
              </div>
            )}

            {/* Hint section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-yellow-300">
              <button
                onClick={() => setShowHint(!showHint)}
                className="w-full flex items-center justify-between py-3 px-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl font-bold text-lg hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <span className="flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  {showHint ? t('hideHint') : t('showHint')}
                </span>
                <span className="text-2xl">{showHint ? '▲' : '▼'}</span>
              </button>
              
              {showHint && (
                <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-400">
                  <div className="flex items-start gap-2">
                    <span className="text-2xl">🔍</span>
                    <p className="text-gray-700 leading-relaxed"><AnimatedText text={currentEx.hint} /></p>
                  </div>
                </div>
              )}
                </div>
                
            {/* Solution section */}
            {submitted && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-blue-300">
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="w-full flex items-center justify-between py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-2xl">👁️</span>
                  {showSolution ? t('hideSolution') : t('showSolution')}
                  </span>
                  <span className="text-2xl">{showSolution ? '▲' : '▼'}</span>
                </button>
                
                {showSolution && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-400">
                    <div className="flex items-start gap-2">
                      <span className="text-2xl">📖</span>
                      <div className="w-full">
                        <p className="text-gray-700 leading-relaxed mb-4"><AnimatedText text={currentEx.solution} /></p>
                        {/* Mean calculation visualization now shown inside solution */}
                        <div className="space-y-3 mb-4">
                          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border-l-4 border-blue-500">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-700">{t('sumOfValues')}:</span>
                              <span className="font-bold text-blue-600">
                                {currentEx.data.join(' + ')} = {currentEx.data.reduce((a, b) => a + b, 0)}
                              </span>
                            </div>
                          </div>
                          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border-l-4 border-green-500">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-700">{t('numberOfValues')}:</span>
                              <span className="font-bold text-green-600">{currentEx.data.length}</span>
                            </div>
                          </div>
                          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border-l-4 border-purple-500">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-700">{t('mean')}:</span>
                              <span className="font-bold text-purple-600">
                                {currentEx.data.reduce((a, b) => a + b, 0)} ÷ {currentEx.data.length} = {calculateMean(currentEx.data)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 mt-3 border-2 border-green-400">
                          <p className="font-bold text-green-700 flex items-center gap-2">
                            <span>✓</span>
                            {t('answerLabel')}: {currentEx.answer} {currentEx.unit}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-6 bg-white rounded-xl shadow-lg border">
        <button
          onClick={handlePrevious}
          disabled={currentExercise === 0}
          className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-base transition-all duration-300 ${
            currentExercise === 0 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 transform hover:scale-105'
          }`}
        >
          ← {t('previous')}
        </button>
        <button
          onClick={handleNext}
          disabled={currentExercise === exercises.length - 1}
          className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 ${
            currentExercise === exercises.length - 1 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {t('next')} →
        </button>
      </div>
      
      {/* View Assessment Button - only show after completing all questions */}
      {currentExercise === exercises.length - 1 && submitted && (
            <div className="text-center">
          <button 
            onClick={() => setShowAssessment(true)}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-xl hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-300 shadow-xl flex items-center justify-center gap-3 mx-auto"
          >
            <span className="text-2xl">🎊</span>
            {t('viewAssessment')}
          </button>
        </div>
      )}
    </div>
  );
}