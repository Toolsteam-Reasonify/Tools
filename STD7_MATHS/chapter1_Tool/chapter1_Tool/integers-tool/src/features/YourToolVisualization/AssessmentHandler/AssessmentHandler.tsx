import { useMemo, useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

type AssessmentQuestion = { 
  id: string;
  promptKey: string;
  prompt: string; 
  answer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
};

type QuestionAttempt = {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  timeSpent: number;
  skipped: boolean;
  attempts: number;
};

type AssessmentResults = {
  totalQuestions: number;
  attempted: number;
  correct: number;
  skipped: number;
  totalPoints: number;
  earnedPoints: number;
  accuracy: number;
  averageTime: number;
  grade: string;
  suggestions: string[];
};

export default function AssessmentHandler() {
  const { t, localizeDigitsInText, language } = useLanguage();
  
  const baseQuestions = useMemo<AssessmentQuestion[]>(() => [
    { id: 'a1', promptKey: 'assess_q1', prompt: 'Compute: (-3) + (-7)', answer: -10, difficulty: 'easy', points: 1 },
    { id: 'a2', promptKey: 'assess_q2', prompt: 'Compute: 15 - (-4)', answer: 19, difficulty: 'easy', points: 1 },
    { id: 'a3', promptKey: 'assess_q3', prompt: 'Compute: (-12) - 5', answer: -17, difficulty: 'medium', points: 2 },
    { id: 'a4', promptKey: 'assess_q4', prompt: 'Compute: 8 + (-15)', answer: -7, difficulty: 'medium', points: 2 },
    { id: 'a5', promptKey: 'assess_q5', prompt: 'Compute: (-20) - (-13)', answer: -7, difficulty: 'hard', points: 3 },
    { id: 'a6', promptKey: 'assess_q6', prompt: 'Compute: (-9) + 16 - (-4)', answer: 11, difficulty: 'hard', points: 3 },
  ], []);

  const [questions, setQuestions] = useState<AssessmentQuestion[]>(baseQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Update questions when language changes
  useEffect(() => {
    setQuestions(prev => prev.map(q => ({
      ...q,
      prompt: t(q.promptKey) || q.prompt
    })));
  }, [language, t]);

  // Reset question timer when index changes
  useEffect(() => {
    setQuestionStartTime(Date.now());
    setInput('');
    setValidationError(null);
    setIsSubmitted(false);
  }, [currentIndex]);

  const currentQuestion = questions[currentIndex];
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  function validateInput(input: string): { isValid: boolean; error?: string } {
    if (!input || input.trim() === '') {
      return { isValid: false, error: t('emptyAnswer') || 'Please enter an answer' };
    }

    if (/^\s+$/.test(input)) {
      return { isValid: false, error: t('whitespaceAnswer') || 'Answer cannot be just spaces' };
    }

    const num = Number(input.trim());
    if (Number.isNaN(num)) {
      return { isValid: false, error: t('invalidNumber') || 'Please enter a valid number' };
    }

    return { isValid: true };
  }

  function submitAnswer() {
    const validation = validateInput(input);
    
    if (!validation.isValid) {
      setValidationError(validation.error || '');
      return;
    }

    setValidationError(null);
    setIsSubmitted(true);

    const timeSpent = (Date.now() - questionStartTime) / 1000;
    const trimmedAnswer = input.trim();
    const num = Number(trimmedAnswer);
    const isCorrect = num === currentQuestion.answer;

    const attempt: QuestionAttempt = {
      questionId: currentQuestion.id,
      answer: trimmedAnswer,
      isCorrect,
      timeSpent,
      skipped: false,
      attempts: 1
    };

    setAttempts(prev => [...prev, attempt]);

    // Move to next question after a delay
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsCompleted(true);
      }
    }, 1500);
  }

  function skipQuestion() {
    const timeSpent = (Date.now() - questionStartTime) / 1000;

    const attempt: QuestionAttempt = {
      questionId: currentQuestion.id,
      answer: '',
      isCorrect: false,
      timeSpent,
      skipped: true,
      attempts: 0
    };

    setAttempts(prev => [...prev, attempt]);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  }

  function jumpToQuestion(index: number) {
    setCurrentIndex(index);
  }

  function calculateResults(): AssessmentResults {
    const attempted = attempts.filter(a => !a.skipped).length;
    const correct = attempts.filter(a => a.isCorrect).length;
    const skipped = attempts.filter(a => a.skipped).length;
    const earnedPoints = attempts.reduce((sum, attempt) => {
      if (attempt.isCorrect) {
        const question = questions.find(q => q.id === attempt.questionId);
        return sum + (question?.points || 0);
      }
      return sum;
    }, 0);

    const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;
    const averageTime = attempts.length > 0 ? attempts.reduce((sum, a) => sum + a.timeSpent, 0) / attempts.length : 0;
    
    let grade = 'F';
    const percentage = (earnedPoints / totalPoints) * 100;
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 85) grade = 'A';
    else if (percentage >= 80) grade = 'B+';
    else if (percentage >= 75) grade = 'B';
    else if (percentage >= 70) grade = 'C+';
    else if (percentage >= 65) grade = 'C';
    else if (percentage >= 60) grade = 'D';

    const suggestions = [];
    if (accuracy < 70) suggestions.push(t('suggestMorePractice') || 'Practice more basic operations');
    if (averageTime > 30) suggestions.push(t('suggestSpeedUp') || 'Work on improving calculation speed');
    if (skipped > 2) suggestions.push(t('suggestCompleteAll') || 'Try to attempt all questions');

    return {
      totalQuestions: questions.length,
      attempted,
      correct,
      skipped,
      totalPoints,
      earnedPoints,
      accuracy,
      averageTime,
      grade,
      suggestions
    };
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !isSubmitted) {
      submitAnswer();
    }
  }

  if (isCompleted) {
    const results = calculateResults();
    
    if (showReview) {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">{t('reviewAnswers')}</h3>
              <button
                onClick={() => setShowReview(false)}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
              >
                {t('backToResults')}
              </button>
            </div>
            
            <div className="space-y-4">
              {questions.map((question, index) => {
                const attempt = attempts.find(a => a.questionId === question.id);
                return (
                  <div key={question.id} className={`p-4 rounded-lg border-2 ${
                    attempt?.isCorrect ? 'border-green-200 bg-green-50' :
                    attempt?.skipped ? 'border-yellow-200 bg-yellow-50' :
                    'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">
                        {t('question')} {index + 1} ({question.points} {t('points')})
                      </span>
                      <span className={`px-2 py-1 rounded text-sm ${
                        attempt?.isCorrect ? 'bg-green-200 text-green-800' :
                        attempt?.skipped ? 'bg-yellow-200 text-yellow-800' :
                        'bg-red-200 text-red-800'
                      }`}>
                        {attempt?.isCorrect ? t('correct') : attempt?.skipped ? t('skipped') : t('incorrect')}
                      </span>
                    </div>
                    <div className="text-gray-700 mb-2">{localizeDigitsInText(question.prompt)}</div>
                    <div className="text-sm text-gray-600">
                      {t('correctAnswer')}: {localizeDigitsInText(String(question.answer))}
                      {attempt && !attempt.skipped && (
                        <span className="ml-4">
                          {t('yourAnswer')}: {localizeDigitsInText(attempt.answer)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-teal-50 to-purple-50 rounded-xl border p-6">
          <div className="text-center">
            <div className="text-6xl mb-4">
              {results.grade === 'A+' || results.grade === 'A' ? '🎉' : 
               results.grade.startsWith('B') ? '👏' : 
               results.grade.startsWith('C') ? '👍' : '💪'}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {t('assessmentComplete')}
            </h2>
            <div className="text-4xl font-bold text-teal-600 mb-2">
              {results.grade}
            </div>
            <div className="text-lg text-gray-600">
              {results.earnedPoints} / {results.totalPoints} {t('points')} 
              ({Math.round((results.earnedPoints / results.totalPoints) * 100)}%)
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('detailedResults')}</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{results.totalQuestions}</div>
              <div className="text-sm text-blue-600">{t('totalQuestions')}</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{results.correct}</div>
              <div className="text-sm text-green-600">{t('correct')}</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{results.skipped}</div>
              <div className="text-sm text-yellow-600">{t('skipped')}</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{Math.round(results.averageTime)}s</div>
              <div className="text-sm text-purple-600">{t('avgTime')}</div>
            </div>
          </div>

          {results.suggestions.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">{t('suggestions')}:</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                {results.suggestions.map((suggestion, index) => (
                  <li key={index}>• {suggestion}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setShowReview(true)}
              className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 font-medium"
            >
              {t('reviewAnswers')}
            </button>
            <button
              onClick={() => {
                setCurrentIndex(0);
                setAttempts([]);
                setIsCompleted(false);
                setShowReview(false);
              }}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-medium"
            >
              {t('retakeAssessment')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-purple-50 to-teal-50 p-4 rounded-xl border">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800">{t('assessment')}</h3>
          <div className="text-sm text-gray-600">
            {t('question')} {currentIndex + 1} / {questions.length}
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-purple-500 to-teal-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Overview */}
      <div className="bg-white p-4 rounded-xl border">
        <div className="grid grid-cols-6 gap-2 mb-4">
          {questions.map((_, index) => {
            const attempt = attempts.find(a => a.questionId === questions[index].id);
            return (
              <button
                key={index}
                onClick={() => jumpToQuestion(index)}
                className={`w-10 h-10 rounded-lg border-2 text-sm font-medium transition-colors ${
                  index === currentIndex 
                    ? 'border-purple-500 bg-purple-500 text-white' 
                    : attempt?.isCorrect 
                      ? 'border-green-500 bg-green-100 text-green-700'
                      : attempt?.skipped
                        ? 'border-yellow-500 bg-yellow-100 text-yellow-700'
                        : attempt
                          ? 'border-red-500 bg-red-100 text-red-700'
                          : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-gray-400'
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Question */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
              {t('question')} {currentIndex + 1}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
              currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {currentQuestion.difficulty} • {currentQuestion.points} {t('points')}
            </span>
          </div>
        </div>

        <div className="text-lg font-medium text-gray-800 mb-6">
          {localizeDigitsInText(currentQuestion.prompt)}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input 
              className={`flex-1 border-2 rounded-lg px-4 py-3 text-lg font-medium focus:outline-none transition-colors ${
                validationError 
                  ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50' 
                  : 'border-gray-300 focus:ring-2 focus:ring-purple-200 focus:border-purple-500'
              }`}
              placeholder={t('enterInteger') || 'Enter integer'} 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSubmitted}
              autoComplete="off"
            />
            <button 
              onClick={submitAnswer}
              disabled={isSubmitted}
              className={`px-6 py-3 rounded-lg font-medium transition-colors min-w-24 ${
                isSubmitted
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {isSubmitted ? t('checking') || '...' : t('submit')}
            </button>
          </div>

          {validationError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <span className="text-red-500">⚠️</span>
              <span className="text-red-700 text-sm font-medium">{validationError}</span>
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={skipQuestion}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              {t('skip')} {t('question')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


