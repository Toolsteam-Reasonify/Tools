import { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

type AssessmentQuestion = {
  id: string;
  question: string;
  multiplicand: number;
  multiplier: number;
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
};

type AssessmentResult = {
  questionId: string;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
  points: number;
};

export default function AssessmentHandler() {
  const { formatNumber, localizeDigitsInText } = useLanguage();
  
  const assessmentQuestions: AssessmentQuestion[] = [
    { id: 'q1', question: '2 × 3 = ?', multiplicand: 2, multiplier: 3, correctAnswer: 6, difficulty: 'easy', points: 1 },
    { id: 'q2', question: '4 × 5 = ?', multiplicand: 4, multiplier: 5, correctAnswer: 20, difficulty: 'easy', points: 1 },
    { id: 'q3', question: '6 × 7 = ?', multiplicand: 6, multiplier: 7, correctAnswer: 42, difficulty: 'medium', points: 2 },
    { id: 'q4', question: '8 × 9 = ?', multiplicand: 8, multiplier: 9, correctAnswer: 72, difficulty: 'medium', points: 2 },
    { id: 'q5', question: '12 × 11 = ?', multiplicand: 12, multiplier: 11, correctAnswer: 132, difficulty: 'hard', points: 3 },
    { id: 'q6', question: '15 × 13 = ?', multiplicand: 15, multiplier: 13, correctAnswer: 195, difficulty: 'hard', points: 3 },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>(new Array(assessmentQuestions.length).fill(''));
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const currentQuestion = assessmentQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / assessmentQuestions.length) * 100;

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = value;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    const userAnswer = Number(userAnswers[currentQuestionIndex]);
    const timeSpent = (Date.now() - questionStartTime) / 1000;
    const isCorrect = userAnswer === currentQuestion.correctAnswer;
    
    const result: AssessmentResult = {
      questionId: currentQuestion.id,
      userAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      timeSpent,
      points: isCorrect ? currentQuestion.points : 0
    };

    setResults(prev => [...prev, result]);

    if (currentQuestionIndex < assessmentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(Date.now());
    } else {
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setQuestionStartTime(Date.now());
    }
  };

  const calculateFinalScore = () => {
    const totalPoints = results.reduce((sum, result) => sum + result.points, 0);
    const maxPoints = assessmentQuestions.reduce((sum, q) => sum + q.points, 0);
    const percentage = (totalPoints / maxPoints) * 100;
    const totalTime = (Date.now() - startTime) / 1000;
    
    return {
      totalPoints,
      maxPoints,
      percentage,
      totalTime,
      correctAnswers: results.filter(r => r.isCorrect).length,
      totalQuestions: assessmentQuestions.length
    };
  };

  if (isComplete) {
    const finalScore = calculateFinalScore();
    
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-brand-50 via-accent-50 to-success-50 rounded-xl p-8 border-2 border-brand-200 shadow-xl">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold text-brand-700 mb-2">Assessment Complete!</h2>
            <p className="text-gray-600">Here are your multiplication assessment results</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-brand-200 shadow-lg text-center">
              <div className="text-3xl font-bold text-brand-600 mb-2">
                {Math.round(finalScore.percentage)}%
              </div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-accent-200 shadow-lg text-center">
              <div className="text-3xl font-bold text-accent-600 mb-2">
                {formatNumber(finalScore.correctAnswers)}/{formatNumber(finalScore.totalQuestions)}
              </div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-success-200 shadow-lg text-center">
              <div className="text-3xl font-bold text-success-600 mb-2">
                {Math.round(finalScore.totalTime)}s
              </div>
              <div className="text-sm text-gray-600">Total Time</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Question Review</h3>
            <div className="space-y-4">
              {results.map((result, index) => {
                const question = assessmentQuestions[index];
                return (
                  <div key={result.questionId} className={`p-4 rounded-lg border-2 ${
                    result.isCorrect ? 'border-success-200 bg-success-50' : 'border-error-200 bg-error-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">
                          {formatNumber(index + 1)}. {localizeDigitsInText(question.question)}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Your answer: {formatNumber(result.userAnswer)} | 
                          Correct: {formatNumber(result.correctAnswer)} | 
                          Time: {result.timeSpent.toFixed(1)}s
                        </div>
                      </div>
                      <div className={`text-2xl ${result.isCorrect ? 'text-success-600' : 'text-error-600'}`}>
                        {result.isCorrect ? '✅' : '❌'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                🔄 Take Assessment Again
              </button>
              <button
                onClick={() => window.location.href = '/practice'}
                className="btn-secondary"
              >
                🎯 More Practice
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-50 to-accent-50 p-6 rounded-xl border-2 border-brand-200 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-brand-700">📊 Multiplication Assessment</h2>
          <div className="text-sm text-gray-600">
            Question {formatNumber(currentQuestionIndex + 1)} of {formatNumber(assessmentQuestions.length)}
          </div>
        </div>
        
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-brand-400 to-accent-400 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl p-8 border-2 border-brand-200 shadow-lg">
        <div className="text-center mb-8">
          <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 ${
            currentQuestion.difficulty === 'easy' ? 'bg-success-100 text-success-800' :
            currentQuestion.difficulty === 'medium' ? 'bg-warning-100 text-warning-800' :
            'bg-error-100 text-error-800'
          }`}>
            {currentQuestion.difficulty.toUpperCase()} • {formatNumber(currentQuestion.points)} points
          </div>
          
          <h3 className="text-3xl font-bold text-brand-700 mb-6">
            {localizeDigitsInText(currentQuestion.question)}
          </h3>

          {/* Visual helper */}
          <div className="bg-brand-50 rounded-lg p-4 mb-6 inline-block">
            <div className="text-lg text-brand-600 mb-2">
              {formatNumber(currentQuestion.multiplicand)} × {formatNumber(currentQuestion.multiplier)}
            </div>
            <div className="text-sm text-gray-600">
              {formatNumber(currentQuestion.multiplicand)} groups of {formatNumber(currentQuestion.multiplier)}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <input
              type="number"
              value={userAnswers[currentQuestionIndex]}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Enter your answer..."
              className="text-2xl font-bold text-center w-48 px-4 py-3 border-2 border-brand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                currentQuestionIndex === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 transform hover:scale-105'
              }`}
            >
              ← Previous
            </button>

            <div className="text-center">
              <div className="text-sm text-gray-500">
                {results.length > 0 && (
                  <span>
                    Correct so far: {formatNumber(results.filter(r => r.isCorrect).length)}/{formatNumber(results.length)}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={!userAnswers[currentQuestionIndex].trim()}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                !userAnswers[currentQuestionIndex].trim()
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : currentQuestionIndex === assessmentQuestions.length - 1
                  ? 'bg-gradient-to-r from-success-500 to-success-600 text-white hover:from-success-600 hover:to-success-700 transform hover:scale-105'
                  : 'bg-gradient-to-r from-brand-500 to-accent-500 text-white hover:from-brand-600 hover:to-accent-600 transform hover:scale-105'
              }`}
            >
              {currentQuestionIndex === assessmentQuestions.length - 1 ? 'Finish Assessment' : 'Next →'}
            </button>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-600 text-xl">💡</div>
          <div>
            <h4 className="font-semibold text-blue-800 mb-1">Assessment Tips:</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Take your time to think through each problem</li>
              <li>• You can go back to previous questions</li>
              <li>• Use mental math strategies like arrays or repeated addition</li>
              <li>• Double-check your answers before moving forward</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}