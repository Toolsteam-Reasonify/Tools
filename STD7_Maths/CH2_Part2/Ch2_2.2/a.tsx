import React, { useState } from 'react';

const MultiplicationIntegers = () => {
  // Mode state
  const [mode, setMode] = useState<'learn' | 'practice' | 'realworld'>('learn');
  
  // Step navigation state
  const [learnStep, setLearnStep] = useState(0);
  const [practiceStep, setPracticeStep] = useState(0);
  const [realWorldStep, setRealWorldStep] = useState(0);

  // Learn Mode State - Token Model
  const [showTokenBag, setShowTokenBag] = useState(false);
  const [tokenOperation, setTokenOperation] = useState('4 × 2');
  
  // Practice Mode State
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0);

  // Real World Mode State
  const [correctAnswers, setCorrectAnswers] = useState('30');
  const [wrongAnswers, setWrongAnswers] = useState('20');
  const [examScore, setExamScore] = useState<number | null>(null);
  
  const [elevatorStart, setElevatorStart] = useState('0');
  const [elevatorTime, setElevatorTime] = useState('60');
  const [elevatorPosition, setElevatorPosition] = useState<number | null>(null);

  const [startTemp, setStartTemp] = useState('8');
  const [tempHours, setTempHours] = useState('4');
  const [finalTemp, setFinalTemp] = useState<number | null>(null);

  // Total steps for each mode
  const LEARN_STEPS = 3;
  const PRACTICE_STEPS = 10;
  const REALWORLD_STEPS = 6;

  // MCQ Questions
  const practiceQuestions = [
    {
      id: 1,
      question: "If two numbers have a product of 24 and one is −6, what is the other number?",
      options: ["4", "−4", "18", "−18"],
      correct: "−4"
    },
    {
      id: 2,
      question: "What is 3 × (−2)?",
      options: ["6", "−6", "5", "−5"],
      correct: "−6"
    },
    {
      id: 3,
      question: "What is (−5) × (−2)?",
      options: ["−10", "10", "−7", "7"],
      correct: "10"
    },
    {
      id: 4,
      question: "Calculate (−4) × (−1):",
      options: ["−4", "4", "−5", "5"],
      correct: "4"
    },
    {
      id: 5,
      question: "What is (−7) × 3?",
      options: ["21", "−21", "−10", "10"],
      correct: "−21"
    },
    {
      id: 6,
      question: "Which property states that a × b = b × a?",
      options: ["Associative", "Distributive", "Commutative", "Identity"],
      correct: "Commutative"
    },
    {
      id: 7,
      question: "If 123 × 456 = 56088, what is (−123) × 456?",
      options: ["56088", "−56088", "56000", "−56000"],
      correct: "−56088"
    },
    {
      id: 8,
      question: "What is (−1) × a equal to?",
      options: ["a", "−a", "1", "0"],
      correct: "−a"
    },
    {
      id: 9,
      question: "Calculate: (−2) × (−1) × (−5) × (−3)",
      options: ["30", "−30", "60", "−60"],
      correct: "30"
    },
    {
      id: 10,
      question: "What is the sign of the product of 5 negative integers?",
      options: ["Positive", "Negative", "Zero", "Cannot be determined"],
      correct: "Negative"
    }
  ];

  // Handlers
  const calculateExamScore = () => {
    const correct = parseInt(correctAnswers) || 0;
    const wrong = parseInt(wrongAnswers) || 0;
    const score = (correct * 5) + (wrong * (-2));
    setExamScore(score);
  };

  const calculateElevator = () => {
    const start = parseInt(elevatorStart) || 0;
    const time = parseInt(elevatorTime) || 0;
    const position = start + (time * (-3));
    setElevatorPosition(position);
  };

  const calculateTemperature = () => {
    const start = parseInt(startTemp) || 0;
    const hours = parseInt(tempHours) || 0;
    const temp = start + (hours * (-5));
    setFinalTemp(temp);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(false);
  };

  const checkAnswer = () => {
    const currentQuestion = practiceQuestions[practiceStep];
    setShowResult(true);
    if (selectedAnswer === currentQuestion.correct) {
      setTotalCorrect(totalCorrect + 1);
    }
  };

  const handleModeChange = (newMode: 'learn' | 'practice' | 'realworld') => {
    setMode(newMode);
    setLearnStep(0);
    setPracticeStep(0);
    setRealWorldStep(0);
    setTotalCorrect(0);
  };

  const handleNext = () => {
    if (mode === 'learn' && learnStep < LEARN_STEPS - 1) {
      setLearnStep(learnStep + 1);
    } else if (mode === 'practice' && practiceStep < PRACTICE_STEPS - 1) {
      setPracticeStep(practiceStep + 1);
      setSelectedAnswer('');
      setShowResult(false);
    } else if (mode === 'realworld' && realWorldStep < REALWORLD_STEPS - 1) {
      setRealWorldStep(realWorldStep + 1);
    }
  };

  const handlePrevious = () => {
    if (mode === 'learn' && learnStep > 0) {
      setLearnStep(learnStep - 1);
    } else if (mode === 'practice' && practiceStep > 0) {
      setPracticeStep(practiceStep - 1);
      setSelectedAnswer('');
      setShowResult(false);
    } else if (mode === 'realworld' && realWorldStep > 0) {
      setRealWorldStep(realWorldStep - 1);
    }
  };

  const getCurrentStep = () => {
    if (mode === 'learn') return learnStep + 1;
    if (mode === 'practice') return practiceStep + 1;
    return realWorldStep + 1;
  };

  const getTotalSteps = () => {
    if (mode === 'learn') return LEARN_STEPS;
    if (mode === 'practice') return PRACTICE_STEPS;
    return REALWORLD_STEPS;
  };

  const isLastStep = () => {
    if (mode === 'learn') return learnStep === LEARN_STEPS - 1;
    if (mode === 'practice') return practiceStep === PRACTICE_STEPS - 1;
    return realWorldStep === REALWORLD_STEPS - 1;
  };

  const isFirstStep = () => {
    if (mode === 'learn') return learnStep === 0;
    if (mode === 'practice') return practiceStep === 0;
    return realWorldStep === 0;
  };

  // Icon components with responsive sizing
  const CheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );

  const AlertIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  );

  const ChevronLeftIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  );

  const ChevronRightIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );

  const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );

  return (
    <div style={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: 'clamp(16px, 3vw, 24px)',
      fontFamily: 'Poppins, system-ui, -apple-system, sans-serif',
      boxSizing: 'border-box',
      minHeight: '100vh',
      background: '#F5F5F5'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #533086 0%, #FC9145 100%)',
        borderRadius: '12px',
        padding: 'clamp(20px, 4vw, 32px)',
        marginBottom: 'clamp(20px, 4vw, 32px)',
        boxShadow: '0 4px 12px rgba(83, 48, 134, 0.15)'
      }}>
        <h1 style={{
          fontSize: 'clamp(24px, 5vw, 36px)',
          fontWeight: '600',
          color: '#FFFFFF',
          marginBottom: 'clamp(12px, 2vw, 16px)',
          lineHeight: '1.2',
          margin: '0 0 clamp(12px, 2vw, 16px) 0'
        }}>
          2.2 Multiplication of Integers
        </h1>
        <p style={{
          fontSize: 'clamp(14px, 3vw, 18px)',
          color: '#FFF3E4',
          lineHeight: '1.6',
          marginBottom: 'clamp(20px, 4vw, 24px)',
          margin: '0 0 clamp(20px, 4vw, 24px) 0'
        }}>
          {mode === 'learn' && "Explore integer multiplication through token models and patterns."}
          {mode === 'practice' && "Test your understanding with practice questions."}
          {mode === 'realworld' && "See how integer multiplication applies in real life."}
        </p>

        {/* Mode Selector */}
        <div style={{
          display: 'flex',
          gap: 'clamp(8px, 2vw, 16px)',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => handleModeChange('learn')}
            style={{
              padding: '12px 24px',
              borderRadius: '40px',
              border: 'none',
              fontSize: 'clamp(14px, 3vw, 16px)',
              fontWeight: '500',
              fontFamily: 'Poppins, sans-serif',
              cursor: 'pointer',
              background: mode === 'learn' ? '#4A4DC9' : '#C1C1EA',
              color: mode === 'learn' ? '#FFFFFF' : '#533086',
              transition: 'all 0.3s ease',
              flex: '1 1 auto',
              minWidth: 'clamp(120px, 28vw, 140px)',
              maxWidth: '200px',
              minHeight: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: mode === 'learn' ? '0 4px 8px rgba(74, 77, 201, 0.3)' : 'none'
            }}
          >
            <span>🪙</span> Learn
          </button>
          <button
            onClick={() => handleModeChange('practice')}
            style={{
              padding: '12px 24px',
              borderRadius: '40px',
              border: 'none',
              fontSize: 'clamp(14px, 3vw, 16px)',
              fontWeight: '500',
              fontFamily: 'Poppins, sans-serif',
              cursor: 'pointer',
              background: mode === 'practice' ? '#4A4DC9' : '#C1C1EA',
              color: mode === 'practice' ? '#FFFFFF' : '#533086',
              transition: 'all 0.3s ease',
              flex: '1 1 auto',
              minWidth: 'clamp(120px, 28vw, 140px)',
              maxWidth: '200px',
              minHeight: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: mode === 'practice' ? '0 4px 8px rgba(74, 77, 201, 0.3)' : 'none'
            }}
          >
            <span>✍️</span> Practice
          </button>
          <button
            onClick={() => handleModeChange('realworld')}
            style={{
              padding: '12px 24px',
              borderRadius: '40px',
              border: 'none',
              fontSize: 'clamp(14px, 3vw, 16px)',
              fontWeight: '500',
              fontFamily: 'Poppins, sans-serif',
              cursor: 'pointer',
              background: mode === 'realworld' ? '#FF7212' : '#FFF3E4',
              color: mode === 'realworld' ? '#FFFFFF' : '#FC9145',
              transition: 'all 0.3s ease',
              flex: '1 1 auto',
              minWidth: 'clamp(120px, 28vw, 140px)',
              maxWidth: '200px',
              minHeight: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: mode === 'realworld' ? '0 4px 8px rgba(255, 114, 18, 0.3)' : 'none'
            }}
          >
            <span>🌍</span> Real World
          </button>
        </div>
      </div>

      {/* LEARN MODE */}
      {mode === 'learn' && (
        <>
          {/* Step 0: Token Model */}
          {learnStep === 0 && (
            <div style={{
              border: '2px solid #C1C1EA',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              marginBottom: 'clamp(20px, 4vw, 32px)',
              background: '#FFFFFF'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #C1C1EA 0%, #EBEBEB 100%)',
                padding: 'clamp(16px, 3vw, 24px)',
                borderBottom: '2px solid #C1C1EA'
              }}>
                <h2 style={{
                  fontSize: 'clamp(20px, 4vw, 28px)',
                  color: '#533086',
                  fontWeight: '600',
                  margin: 0,
                  lineHeight: '1.3',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  🪙 Token Model for Multiplication
                </h2>
              </div>
              <div style={{
                padding: 'clamp(20px, 4vw, 32px)'
              }}>
                <p style={{
                  color: '#4E4E4E',
                  marginBottom: 'clamp(20px, 4vw, 24px)',
                  lineHeight: '1.6',
                  fontSize: 'clamp(14px, 3vw, 16px)',
                  margin: '0 0 clamp(20px, 4vw, 24px) 0',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  We use green tokens (●) for positive numbers and red tokens (●) for negative numbers. 
                  Let's explore how multiplication works with different combinations!
                </p>

                {/* 4 × 2 Example */}
                <div style={{
                  background: '#F5F5F5',
                  padding: 'clamp(16px, 4vw, 24px)',
                  borderRadius: '12px',
                  marginBottom: 'clamp(20px, 4vw, 24px)',
                  border: '2px solid #EBEBEB'
                }}>
                  <h3 style={{
                    fontSize: 'clamp(16px, 3.5vw, 20px)',
                    color: '#533086',
                    marginBottom: 'clamp(12px, 3vw, 16px)',
                    margin: '0 0 clamp(12px, 3vw, 16px) 0',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: '600'
                  }}>
                    Example 1: 4 × 2 = 8
                  </h3>
                  <p style={{
                    fontSize: 'clamp(13px, 3vw, 15px)',
                    color: '#4E4E4E',
                    marginBottom: 'clamp(12px, 3vw, 16px)',
                    margin: '0 0 clamp(12px, 3vw, 16px) 0',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Place 2 positive (green) tokens into the bag 4 times:
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: 'clamp(8px, 2vw, 12px)',
                    flexWrap: 'wrap',
                    marginBottom: 'clamp(12px, 3vw, 16px)',
                    justifyContent: 'center'
                  }}>
                    {[...Array(4)].map((_, groupIndex) => (
                      <div key={groupIndex} style={{
                        display: 'flex',
                        gap: 'clamp(6px, 1.5vw, 8px)',
                        padding: 'clamp(8px, 2vw, 12px)',
                        background: 'white',
                        borderRadius: '8px',
                        border: '2px solid #CACACA',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                      }}>
                        {[...Array(2)].map((_, tokenIndex) => (
                          <div key={tokenIndex} style={{
                            width: 'clamp(32px, 7vw, 40px)',
                            height: 'clamp(32px, 7vw, 40px)',
                            minWidth: 'clamp(32px, 7vw, 40px)',
                            minHeight: 'clamp(32px, 7vw, 40px)',
                            background: '#4A4DC9',
                            borderRadius: '50%',
                            border: '3px solid #533086',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: 'clamp(14px, 3vw, 18px)',
                            flexShrink: 0,
                            fontFamily: 'Poppins, sans-serif'
                          }}>
                            +
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <p style={{
                    fontSize: 'clamp(13px, 3vw, 15px)',
                    color: '#533086',
                    fontWeight: '600',
                    margin: 0,
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Result: 8 positive tokens = 8
                  </p>
                </div>

                {/* 4 × (−2) Example */}
                <div style={{
                  background: '#FFF3E4',
                  padding: 'clamp(16px, 4vw, 24px)',
                  borderRadius: '12px',
                  marginBottom: 'clamp(20px, 4vw, 24px)',
                  border: '2px solid #FC9145'
                }}>
                  <h3 style={{
                    fontSize: 'clamp(16px, 3.5vw, 20px)',
                    color: '#FC9145',
                    marginBottom: 'clamp(12px, 3vw, 16px)',
                    margin: '0 0 clamp(12px, 3vw, 16px) 0',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: '600'
                  }}>
                    Example 2: 4 × (−2) = −8
                  </h3>
                  <p style={{
                    fontSize: 'clamp(13px, 3vw, 15px)',
                    color: '#4E4E4E',
                    marginBottom: 'clamp(12px, 3vw, 16px)',
                    margin: '0 0 clamp(12px, 3vw, 16px) 0',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Place 2 negative (red) tokens into the bag 4 times:
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: 'clamp(8px, 2vw, 12px)',
                    flexWrap: 'wrap',
                    marginBottom: 'clamp(12px, 3vw, 16px)',
                    justifyContent: 'center'
                  }}>
                    {[...Array(4)].map((_, groupIndex) => (
                      <div key={groupIndex} style={{
                        display: 'flex',
                        gap: 'clamp(6px, 1.5vw, 8px)',
                        padding: 'clamp(8px, 2vw, 12px)',
                        background: 'white',
                        borderRadius: '8px',
                        border: '2px solid #CACACA',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                      }}>
                        {[...Array(2)].map((_, tokenIndex) => (
                          <div key={tokenIndex} style={{
                            width: 'clamp(32px, 7vw, 40px)',
                            height: 'clamp(32px, 7vw, 40px)',
                            minWidth: 'clamp(32px, 7vw, 40px)',
                            minHeight: 'clamp(32px, 7vw, 40px)',
                            background: '#FF7212',
                            borderRadius: '50%',
                            border: '3px solid #FC9145',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: 'clamp(14px, 3vw, 18px)',
                            flexShrink: 0,
                            fontFamily: 'Poppins, sans-serif'
                          }}>
                            −
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <p style={{
                    fontSize: 'clamp(13px, 3vw, 15px)',
                    color: '#FC9145',
                    fontWeight: '600',
                    margin: 0,
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Result: 8 negative tokens = −8
                  </p>
                </div>

                {/* Key Rule */}
                <div style={{
                  background: 'linear-gradient(135deg, #C1C1EA 0%, #F5F5F5 100%)',
                  padding: 'clamp(16px, 3vw, 20px)',
                  borderRadius: '12px',
                  border: '2px solid #C1C1EA'
                }}>
                  <p style={{
                    fontSize: 'clamp(14px, 3vw, 16px)',
                    color: '#533086',
                    fontWeight: '600',
                    margin: '0 0 clamp(8px, 2vw, 12px) 0',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Key Rule:
                  </p>
                  <p style={{
                    fontSize: 'clamp(13px, 2.5vw, 15px)',
                    color: '#4E4E4E',
                    margin: 0,
                    lineHeight: '1.6',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    • Positive multiplier = Place tokens into bag<br/>
                    • Negative multiplier = Remove tokens from bag (using zero pairs)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Patterns */}
          {learnStep === 1 && (
            <div style={{
              border: '2px solid #C1C1EA',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              marginBottom: 'clamp(20px, 4vw, 32px)',
              background: '#FFFFFF'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #C1C1EA 0%, #EBEBEB 100%)',
                padding: 'clamp(16px, 3vw, 24px)',
                borderBottom: '2px solid #C1C1EA'
              }}>
                <h2 style={{
                  fontSize: 'clamp(20px, 4vw, 28px)',
                  color: '#533086',
                  fontWeight: '600',
                  margin: 0,
                  lineHeight: '1.3',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  📊 Patterns in Integer Multiplication
                </h2>
              </div>
              <div style={{
                padding: 'clamp(20px, 4vw, 32px)'
              }}>
                <p style={{
                  color: '#4E4E4E',
                  marginBottom: 'clamp(20px, 4vw, 24px)',
                  lineHeight: '1.6',
                  fontSize: 'clamp(14px, 3vw, 16px)',
                  margin: '0 0 clamp(20px, 4vw, 24px) 0',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  Let's observe what happens when we decrease the multiplier by 1 each time.
                </p>

                {/* Pattern 1: Positive Multiplicand */}
                <div style={{
                  background: '#F5F5F5',
                  padding: 'clamp(16px, 4vw, 24px)',
                  borderRadius: '12px',
                  border: '2px solid #EBEBEB',
                  marginBottom: 'clamp(20px, 4vw, 24px)'
                }}>
                  <h3 style={{
                    fontSize: 'clamp(16px, 3.5vw, 20px)',
                    color: '#533086',
                    marginBottom: 'clamp(12px, 3vw, 16px)',
                    margin: '0 0 clamp(12px, 3vw, 16px) 0',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: '600'
                  }}>
                    Pattern 1: Multiplying by 3
                  </h3>
                  <div style={{
                    fontFamily: 'Poppins, monospace',
                    fontSize: 'clamp(12px, 2.5vw, 15px)',
                    lineHeight: 'clamp(2, 2.5vw, 2.2)',
                    color: '#4E4E4E',
                    overflowX: 'auto'
                  }}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px', gap: '12px', flexWrap: 'wrap'}}>
                      <span style={{whiteSpace: 'nowrap'}}>4 × 3 = 12</span>
                      <span style={{color: '#FF7212', whiteSpace: 'nowrap'}}>−3</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px', gap: '12px', flexWrap: 'wrap'}}>
                      <span style={{whiteSpace: 'nowrap'}}>3 × 3 = 9</span>
                      <span style={{color: '#FF7212', whiteSpace: 'nowrap'}}>−3</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px', gap: '12px', flexWrap: 'wrap'}}>
                      <span style={{whiteSpace: 'nowrap'}}>2 × 3 = 6</span>
                      <span style={{color: '#FF7212', whiteSpace: 'nowrap'}}>−3</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px', gap: '12px', flexWrap: 'wrap'}}>
                      <span style={{whiteSpace: 'nowrap'}}>1 × 3 = 3</span>
                      <span style={{color: '#FF7212', whiteSpace: 'nowrap'}}>−3</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px', gap: '12px', flexWrap: 'wrap'}}>
                      <span style={{whiteSpace: 'nowrap'}}>0 × 3 = 0</span>
                      <span style={{color: '#FF7212', whiteSpace: 'nowrap'}}>−3</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px', background: '#FFF3E4', padding: '8px 12px', borderRadius: '8px', gap: '12px', flexWrap: 'wrap'}}>
                      <span style={{fontWeight: 'bold', whiteSpace: 'nowrap'}}>−1 × 3 = −3</span>
                      <span style={{color: '#FF7212', whiteSpace: 'nowrap'}}>−3</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px', background: '#FFF3E4', padding: '8px 12px', borderRadius: '8px', gap: '12px', flexWrap: 'wrap'}}>
                      <span style={{fontWeight: 'bold', whiteSpace: 'nowrap'}}>−2 × 3 = −6</span>
                      <span style={{color: '#FF7212', whiteSpace: 'nowrap'}}>−3</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', background: '#FFF3E4', padding: '8px 12px', borderRadius: '8px', gap: '12px', flexWrap: 'wrap'}}>
                      <span style={{fontWeight: 'bold', whiteSpace: 'nowrap'}}>−3 × 3 = −9</span>
                    </div>
                  </div>
                  <p style={{
                    fontSize: 'clamp(13px, 2.5vw, 15px)',
                    color: '#533086',
                    fontWeight: '600',
                    marginTop: 'clamp(12px, 3vw, 16px)',
                    margin: 'clamp(12px, 3vw, 16px) 0 0 0',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Pattern: Product decreases by 3 each time
                  </p>
                </div>

                {/* Pattern 2: Negative Multiplicand */}
                <div style={{
                  background: '#F5F5F5',
                  padding: 'clamp(16px, 4vw, 24px)',
                  borderRadius: '12px',
                  border: '2px solid #EBEBEB',
                  marginBottom: 'clamp(20px, 4vw, 24px)'
                }}>
                  <h3 style={{
                    fontSize: 'clamp(16px, 3.5vw, 20px)',
                    color: '#533086',
                    marginBottom: 'clamp(12px, 3vw, 16px)',
                    margin: '0 0 clamp(12px, 3vw, 16px) 0',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: '600'
                  }}>
                    Pattern 2: Multiplying by −3
                  </h3>
                  <div style={{
                    fontFamily: 'Poppins, monospace',
                    fontSize: 'clamp(12px, 2.5vw, 15px)',
                    lineHeight: 'clamp(2, 2.5vw, 2.2)',
                    color: '#4E4E4E',
                    overflowX: 'auto'
                  }}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px', gap: '12px', flexWrap: 'wrap'}}>
                      <span style={{whiteSpace: 'nowrap'}}>4 × (−3) = −12</span>
                      <span style={{color: '#4A4DC9', whiteSpace: 'nowrap'}}>+3</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px', gap: '12px', flexWrap: 'wrap'}}>
                      <span style={{whiteSpace: 'nowrap'}}>3 × (−3) = −9</span>
                      <span style={{color: '#4A4DC9', whiteSpace: 'nowrap'}}>+3</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px', gap: '12px', flexWrap: 'wrap'}}>
                      <span style={{whiteSpace: 'nowrap'}}>2 × (−3) = −6</span>
                      <span style={{color: '#4A4DC9', whiteSpace: 'nowrap'}}>+3</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px', gap: '12px', flexWrap: 'wrap'}}>
                      <span style={{whiteSpace: 'nowrap'}}>1 × (−3) = −3</span>
                      <span style={{color: '#4A4DC9', whiteSpace: 'nowrap'}}>+3</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px', gap: '12px', flexWrap: 'wrap'}}>
                      <span style={{whiteSpace: 'nowrap'}}>0 × (−3) = 0</span>
                      <span style={{color: '#4A4DC9', whiteSpace: 'nowrap'}}>+3</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px', background: '#C1C1EA', padding: '8px 12px', borderRadius: '8px', gap: '12px', flexWrap: 'wrap'}}>
                      <span style={{fontWeight: 'bold', whiteSpace: 'nowrap'}}>−1 × (−3) = 3</span>
                      <span style={{color: '#4A4DC9', whiteSpace: 'nowrap'}}>+3</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px', background: '#C1C1EA', padding: '8px 12px', borderRadius: '8px', gap: '12px', flexWrap: 'wrap'}}>
                      <span style={{fontWeight: 'bold', whiteSpace: 'nowrap'}}>−2 × (−3) = 6</span>
                      <span style={{color: '#4A4DC9', whiteSpace: 'nowrap'}}>+3</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', background: '#C1C1EA', padding: '8px 12px', borderRadius: '8px', gap: '12px', flexWrap: 'wrap'}}>
                      <span style={{fontWeight: 'bold', whiteSpace: 'nowrap'}}>−3 × (−3) = 9</span>
                    </div>
                  </div>
                  <p style={{
                    fontSize: 'clamp(13px, 2.5vw, 15px)',
                    color: '#533086',
                    fontWeight: '600',
                    marginTop: 'clamp(12px, 3vw, 16px)',
                    margin: 'clamp(12px, 3vw, 16px) 0 0 0',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Pattern: Product increases by 3 each time
                  </p>
                </div>

                {/* Key Insight */}
                <div style={{
                  background: 'linear-gradient(135deg, #C1C1EA 0%, #F5F5F5 100%)',
                  padding: 'clamp(16px, 3vw, 20px)',
                  borderRadius: '12px',
                  border: '2px solid #C1C1EA'
                }}>
                  <p style={{
                    fontSize: 'clamp(14px, 3vw, 16px)',
                    color: '#533086',
                    fontWeight: '600',
                    margin: '0 0 clamp(8px, 2vw, 12px) 0',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    💡 Key Insight:
                  </p>
                  <p style={{
                    fontSize: 'clamp(13px, 2.5vw, 15px)',
                    color: '#4E4E4E',
                    margin: 0,
                    lineHeight: '1.6',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Patterns continue consistently even when the multiplier becomes negative! 
                    This shows that negative × negative = positive.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Properties */}
          {learnStep === 2 && (
            <div style={{
              border: '2px solid #C1C1EA',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              marginBottom: 'clamp(20px, 4vw, 32px)',
              background: '#FFFFFF'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #C1C1EA 0%, #EBEBEB 100%)',
                padding: 'clamp(16px, 3vw, 24px)',
                borderBottom: '2px solid #C1C1EA'
              }}>
                <h2 style={{
                  fontSize: 'clamp(20px, 4vw, 28px)',
                  color: '#533086',
                  fontWeight: '600',
                  margin: 0,
                  lineHeight: '1.3',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  ⚡ Multiplication Properties
                </h2>
              </div>
              <div style={{
                padding: 'clamp(20px, 4vw, 32px)'
              }}>
                {/* Sign Rules Table */}
                <div style={{
                  background: '#F5F5F5',
                  padding: 'clamp(16px, 3vw, 24px)',
                  borderRadius: '12px',
                  border: '2px solid #EBEBEB',
                  marginBottom: 'clamp(20px, 4vw, 24px)',
                  overflowX: 'auto',
                  WebkitOverflowScrolling: 'touch'
                }}>
                  <h3 style={{
                    fontSize: 'clamp(16px, 3.5vw, 20px)',
                    color: '#533086',
                    marginBottom: 'clamp(12px, 3vw, 16px)',
                    margin: '0 0 clamp(12px, 3vw, 16px) 0',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: '600'
                  }}>
                    Sign Rules
                  </h3>
                  <div style={{overflowX: 'auto', WebkitOverflowScrolling: 'touch'}}>
                    <table style={{
                      width: '100%',
                      minWidth: '300px',
                      borderCollapse: 'collapse',
                      fontSize: 'clamp(12px, 2.5vw, 15px)',
                      tableLayout: 'auto',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      <thead>
                        <tr style={{background: '#EBEBEB'}}>
                          <th style={{padding: '12px', border: '2px solid #CACACA', textAlign: 'left', whiteSpace: 'nowrap', fontSize: 'clamp(12px, 2.5vw, 14px)', fontWeight: '600'}}>First Number</th>
                          <th style={{padding: '12px', border: '2px solid #CACACA', textAlign: 'left', whiteSpace: 'nowrap', fontSize: 'clamp(12px, 2.5vw, 14px)', fontWeight: '600'}}>Second Number</th>
                          <th style={{padding: '12px', border: '2px solid #CACACA', textAlign: 'left', whiteSpace: 'nowrap', fontSize: 'clamp(12px, 2.5vw, 14px)', fontWeight: '600'}}>Product</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{padding: '12px', border: '2px solid #CACACA', whiteSpace: 'nowrap'}}>Positive (+)</td>
                          <td style={{padding: '12px', border: '2px solid #CACACA', whiteSpace: 'nowrap'}}>Positive (+)</td>
                          <td style={{padding: '12px', border: '2px solid #CACACA', color: '#4A4DC9', fontWeight: 'bold', whiteSpace: 'nowrap'}}>Positive (+)</td>
                        </tr>
                        <tr style={{background: '#F5F5F5'}}>
                          <td style={{padding: '12px', border: '2px solid #CACACA', whiteSpace: 'nowrap'}}>Positive (+)</td>
                          <td style={{padding: '12px', border: '2px solid #CACACA', whiteSpace: 'nowrap'}}>Negative (−)</td>
                          <td style={{padding: '12px', border: '2px solid #CACACA', color: '#FF7212', fontWeight: 'bold', whiteSpace: 'nowrap'}}>Negative (−)</td>
                        </tr>
                        <tr>
                          <td style={{padding: '12px', border: '2px solid #CACACA', whiteSpace: 'nowrap'}}>Negative (−)</td>
                          <td style={{padding: '12px', border: '2px solid #CACACA', whiteSpace: 'nowrap'}}>Positive (+)</td>
                          <td style={{padding: '12px', border: '2px solid #CACACA', color: '#FF7212', fontWeight: 'bold', whiteSpace: 'nowrap'}}>Negative (−)</td>
                        </tr>
                        <tr style={{background: '#F5F5F5'}}>
                          <td style={{padding: '12px', border: '2px solid #CACACA', whiteSpace: 'nowrap'}}>Negative (−)</td>
                          <td style={{padding: '12px', border: '2px solid #CACACA', whiteSpace: 'nowrap'}}>Negative (−)</td>
                          <td style={{padding: '12px', border: '2px solid #CACACA', color: '#4A4DC9', fontWeight: 'bold', whiteSpace: 'nowrap'}}>Positive (+)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Commutative Property */}
                <div style={{
                  background: '#C1C1EA',
                  padding: 'clamp(16px, 3vw, 20px)',
                  borderRadius: '12px',
                  border: '2px solid #533086',
                  marginBottom: 'clamp(16px, 3vw, 20px)'
                }}>
                  <p style={{
                    fontSize: 'clamp(14px, 3vw, 16px)',
                    color: '#533086',
                    fontWeight: '600',
                    margin: '0 0 clamp(8px, 2vw, 12px) 0',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Commutative Property
                  </p>
                  <p style={{
                    fontSize: 'clamp(13px, 2.5vw, 15px)',
                    color: '#4E4E4E',
                    margin: '0 0 clamp(6px, 1.5vw, 8px) 0',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    <strong>a × b = b × a</strong>
                  </p>
                  <p style={{
                    fontSize: 'clamp(12px, 2.5vw, 14px)',
                    color: '#4E4E4E',
                    margin: 0,
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Example: 3 × (−4) = (−4) × 3 = −12
                  </p>
                </div>

                {/* Associative Property */}
                <div style={{
                  background: '#FFF3E4',
                  padding: 'clamp(16px, 3vw, 20px)',
                  borderRadius: '12px',
                  border: '2px solid #FC9145',
                  marginBottom: 'clamp(16px, 3vw, 20px)'
                }}>
                  <p style={{
                    fontSize: 'clamp(14px, 3vw, 16px)',
                    color: '#FC9145',
                    fontWeight: '600',
                    margin: '0 0 clamp(8px, 2vw, 12px) 0',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Associative Property
                  </p>
                  <p style={{
                    fontSize: 'clamp(13px, 2.5vw, 15px)',
                    color: '#4E4E4E',
                    margin: '0 0 clamp(6px, 1.5vw, 8px) 0',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    <strong>a × (b × c) = (a × b) × c</strong>
                  </p>
                  <p style={{
                    fontSize: 'clamp(12px, 2.5vw, 14px)',
                    color: '#4E4E4E',
                    margin: 0,
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Example: 5 × (−3 × 4) = (5 × −3) × 4 = −60
                  </p>
                </div>

                {/* Distributive Property */}
                <div style={{
                  background: '#F5F5F5',
                  padding: 'clamp(16px, 3vw, 20px)',
                  borderRadius: '12px',
                  border: '2px solid #CACACA'
                }}>
                  <p style={{
                    fontSize: 'clamp(14px, 3vw, 16px)',
                    color: '#4E4E4E',
                    fontWeight: '600',
                    margin: '0 0 clamp(8px, 2vw, 12px) 0',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Distributive Property
                  </p>
                  <p style={{
                    fontSize: 'clamp(13px, 2.5vw, 15px)',
                    color: '#4E4E4E',
                    margin: '0 0 clamp(6px, 1.5vw, 8px) 0',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    <strong>a × (b + c) = (a × b) + (a × c)</strong>
                  </p>
                  <p style={{
                    fontSize: 'clamp(12px, 2.5vw, 14px)',
                    color: '#4E4E4E',
                    margin: 0,
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Example: 4 × (2 + (−3)) = 4×2 + 4×(−3) = 8−12 = −4
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* PRACTICE MODE */}
      {mode === 'practice' && (
        <div style={{
          border: '2px solid #C1C1EA',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          marginBottom: 'clamp(20px, 4vw, 32px)',
          background: '#FFFFFF'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #C1C1EA 0%, #EBEBEB 100%)',
            padding: 'clamp(16px, 3vw, 24px)',
            borderBottom: '2px solid #C1C1EA'
          }}>
            <h2 style={{
              fontSize: 'clamp(20px, 4vw, 28px)',
              color: '#533086',
              fontWeight: '600',
              margin: 0,
              lineHeight: '1.3',
              fontFamily: 'Poppins, sans-serif'
            }}>
              ✍️ Question {practiceStep + 1} of {PRACTICE_STEPS}
            </h2>
          </div>
          <div style={{
            padding: 'clamp(20px, 4vw, 32px)'
          }}>
            {practiceStep === PRACTICE_STEPS && (
              <div style={{
                background: totalCorrect >= 7 ? '#C1C1EA' : totalCorrect >= 5 ? '#FFF3E4' : '#EBEBEB',
                padding: 'clamp(24px, 5vw, 32px)',
                borderRadius: '12px',
                marginBottom: 'clamp(20px, 4vw, 24px)',
                border: '2px solid',
                borderColor: totalCorrect >= 7 ? '#533086' : totalCorrect >= 5 ? '#FC9145' : '#CACACA',
                textAlign: 'center'
              }}>
                <h3 style={{
                  fontSize: 'clamp(24px, 5vw, 32px)',
                  fontWeight: '600',
                  marginBottom: 'clamp(12px, 2vw, 16px)',
                  color: totalCorrect >= 7 ? '#533086' : totalCorrect >= 5 ? '#FC9145' : '#4E4E4E',
                  margin: '0 0 clamp(12px, 2vw, 16px) 0',
                  lineHeight: '1.2',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  Quiz Complete!
                </h3>
                <p style={{
                  fontSize: 'clamp(18px, 4vw, 24px)',
                  marginBottom: 'clamp(8px, 2vw, 12px)',
                  color: totalCorrect >= 7 ? '#533086' : totalCorrect >= 5 ? '#FC9145' : '#4E4E4E',
                  margin: '0 0 clamp(8px, 2vw, 12px) 0',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '600'
                }}>
                  Your Score: {totalCorrect}/{PRACTICE_STEPS}
                </p>
                <p style={{
                  fontSize: 'clamp(15px, 3.5vw, 18px)',
                  margin: 0,
                  color: totalCorrect >= 7 ? '#533086' : totalCorrect >= 5 ? '#FC9145' : '#4E4E4E',
                  lineHeight: '1.4',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  {totalCorrect >= 7 ? '🎉 Excellent work!' : totalCorrect >= 5 ? '👍 Good job! Keep practicing.' : '💪 Keep learning and try again!'}
                </p>
              </div>
            )}

            {practiceStep < PRACTICE_STEPS && (
              <>
                <div style={{
                  background: '#F5F5F5',
                  padding: 'clamp(20px, 4vw, 24px)',
                  borderRadius: '12px',
                  marginBottom: 'clamp(20px, 4vw, 24px)',
                  border: '2px solid #EBEBEB'
                }}>
                  <p style={{
                    fontWeight: '600',
                    marginBottom: 'clamp(20px, 4vw, 24px)',
                    color: '#4E4E4E',
                    fontSize: 'clamp(15px, 3.5vw, 18px)',
                    lineHeight: '1.6',
                    margin: '0 0 clamp(20px, 4vw, 24px) 0',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    hyphens: 'auto',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    {practiceQuestions[practiceStep].question}
                  </p>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'clamp(12px, 2.5vw, 16px)'
                  }}>
                    {practiceQuestions[practiceStep].options.map((option, optIndex) => (
                      <label
                        key={optIndex}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: 'clamp(14px, 3vw, 18px)',
                          borderRadius: '12px',
                          border: '2px solid',
                          borderColor: selectedAnswer === option ? '#4A4DC9' : '#CACACA',
                          background: selectedAnswer === option ? '#C1C1EA' : 'white',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          fontSize: 'clamp(14px, 3vw, 16px)',
                          lineHeight: '1.5',
                          minHeight: '56px',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          fontFamily: 'Poppins, sans-serif'
                        }}
                      >
                        <input
                          type="radio"
                          name={`question-${practiceQuestions[practiceStep].id}`}
                          value={option}
                          checked={selectedAnswer === option}
                          onChange={() => handleAnswerSelect(option)}
                          style={{
                            marginRight: 'clamp(12px, 2vw, 16px)',
                            cursor: 'pointer',
                            width: '20px',
                            height: '20px',
                            flexShrink: 0,
                            touchAction: 'manipulation',
                            accentColor: '#4A4DC9'
                          }}
                        />
                        <span style={{
                          color: '#4E4E4E', 
                          flex: 1,
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word'
                        }}>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {!showResult && (
                  <button
                    onClick={checkAnswer}
                    disabled={!selectedAnswer}
                    style={{
                      width: '100%',
                      background: selectedAnswer ? '#4A4DC9' : '#CACACA',
                      color: 'white',
                      padding: 'clamp(14px, 3vw, 16px) clamp(20px, 4vw, 24px)',
                      border: 'none',
                      borderRadius: '40px',
                      fontSize: 'clamp(15px, 3vw, 17px)',
                      fontWeight: '600',
                      cursor: selectedAnswer ? 'pointer' : 'not-allowed',
                      transition: 'all 0.3s ease',
                      minHeight: '56px',
                      touchAction: 'manipulation',
                      fontFamily: 'Poppins, sans-serif',
                      boxShadow: selectedAnswer ? '0 4px 8px rgba(74, 77, 201, 0.3)' : 'none'
                    }}
                  >
                    Check Answer
                  </button>
                )}

                {showResult && (
                  <div style={{
                    padding: 'clamp(16px, 3vw, 20px)',
                    borderRadius: '12px',
                    background: selectedAnswer === practiceQuestions[practiceStep].correct ? '#C1C1EA' : '#FFF3E4',
                    border: '2px solid',
                    borderColor: selectedAnswer === practiceQuestions[practiceStep].correct ? '#533086' : '#FC9145',
                    marginBottom: 'clamp(16px, 3vw, 20px)'
                  }}>
                    <p style={{
                      fontWeight: '600',
                      color: selectedAnswer === practiceQuestions[practiceStep].correct ? '#533086' : '#FC9145',
                      marginBottom: 'clamp(8px, 2vw, 12px)',
                      fontSize: 'clamp(15px, 3vw, 17px)',
                      margin: '0 0 clamp(8px, 2vw, 12px) 0',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      {selectedAnswer === practiceQuestions[practiceStep].correct ? '✓ Correct!' : '✗ Incorrect'}
                    </p>
                    {selectedAnswer !== practiceQuestions[practiceStep].correct && (
                      <p style={{
                        color: '#4E4E4E',
                        margin: 0,
                        fontSize: 'clamp(13px, 2.5vw, 15px)',
                        lineHeight: '1.5',
                        fontFamily: 'Poppins, sans-serif'
                      }}>
                        <strong>Correct answer:</strong> {practiceQuestions[practiceStep].correct}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* REAL WORLD MODE */}
      {mode === 'realworld' && (
        <>
          {/* Exam Scoring */}
          {realWorldStep === 0 && (
            <div style={{
              border: '2px solid #FFF3E4',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              marginBottom: 'clamp(20px, 4vw, 32px)',
              background: '#FFFFFF'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #FFF3E4 0%, #EBEBEB 100%)',
                padding: 'clamp(16px, 3vw, 24px)',
                borderBottom: '2px solid #FC9145'
              }}>
                <h2 style={{
                  fontSize: 'clamp(20px, 4vw, 28px)',
                  color: '#FC9145',
                  fontWeight: '600',
                  margin: 0,
                  lineHeight: '1.3',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  📝 Exam Scoring System
                </h2>
              </div>
              <div style={{padding: 'clamp(20px, 4vw, 32px)'}}>
                <div style={{
                  background: '#F5F5F5',
                  padding: 'clamp(16px, 3vw, 20px)',
                  borderRadius: '12px',
                  marginBottom: 'clamp(20px, 4vw, 24px)',
                  border: '2px solid #EBEBEB'
                }}>
                  <p style={{
                    color: '#4E4E4E',
                    fontSize: 'clamp(14px, 3vw, 16px)',
                    lineHeight: '1.6',
                    margin: 0,
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    An exam awards <strong>+5 marks</strong> for each correct answer and <strong>−2 marks</strong> for each wrong answer.
                  </p>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
                  gap: 'clamp(16px, 3vw, 20px)',
                  marginBottom: 'clamp(20px, 4vw, 24px)'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'clamp(13px, 2.5vw, 15px)',
                      fontWeight: '600',
                      marginBottom: 'clamp(8px, 2vw, 12px)',
                      color: '#4E4E4E',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Correct Answers
                    </label>
                    <input
                      type="number"
                      value={correctAnswers}
                      onChange={(e) => setCorrectAnswers(e.target.value)}
                      style={{
                        width: '100%',
                        padding: 'clamp(12px, 2vw, 14px)',
                        border: '2px solid #CACACA',
                        borderRadius: '8px',
                        fontSize: 'clamp(14px, 3vw, 16px)',
                        boxSizing: 'border-box',
                        fontFamily: 'Poppins, sans-serif',
                        outline: 'none',
                        transition: 'border-color 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#4A4DC9'}
                      onBlur={(e) => e.target.style.borderColor = '#CACACA'}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'clamp(13px, 2.5vw, 15px)',
                      fontWeight: '600',
                      marginBottom: 'clamp(8px, 2vw, 12px)',
                      color: '#4E4E4E',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Wrong Answers
                    </label>
                    <input
                      type="number"
                      value={wrongAnswers}
                      onChange={(e) => setWrongAnswers(e.target.value)}
                      style={{
                        width: '100%',
                        padding: 'clamp(12px, 2vw, 14px)',
                        border: '2px solid #CACACA',
                        borderRadius: '8px',
                        fontSize: 'clamp(14px, 3vw, 16px)',
                        boxSizing: 'border-box',
                        fontFamily: 'Poppins, sans-serif',
                        outline: 'none',
                        transition: 'border-color 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#4A4DC9'}
                      onBlur={(e) => e.target.style.borderColor = '#CACACA'}
                    />
                  </div>
                </div>

                <button
                  onClick={calculateExamScore}
                  style={{
                    width: '100%',
                    background: '#FF7212',
                    color: 'white',
                    padding: 'clamp(14px, 3vw, 16px)',
                    border: 'none',
                    borderRadius: '40px',
                    fontSize: 'clamp(15px, 3vw, 17px)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginBottom: 'clamp(20px, 4vw, 24px)',
                    minHeight: '56px',
                    transition: 'all 0.3s ease',
                    touchAction: 'manipulation',
                    fontFamily: 'Poppins, sans-serif',
                    boxShadow: '0 4px 8px rgba(255, 114, 18, 0.3)'
                  }}
                >
                  Calculate Score
                </button>

                {examScore !== null && (
                  <div style={{
                    background: '#C1C1EA',
                    padding: 'clamp(16px, 3vw, 20px)',
                    borderRadius: '12px',
                    border: '2px solid #533086'
                  }}>
                    <p style={{
                      color: '#533086',
                      fontWeight: '600',
                      marginBottom: 'clamp(8px, 2vw, 12px)',
                      fontSize: 'clamp(15px, 3vw, 17px)',
                      margin: '0 0 clamp(8px, 2vw, 12px) 0',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Total Score: {examScore} marks
                    </p>
                    <p style={{
                      color: '#4E4E4E',
                      fontSize: 'clamp(13px, 2.5vw, 15px)',
                      margin: 0,
                      lineHeight: '1.5',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      <strong>Calculation:</strong> ({correctAnswers} × 5) + ({wrongAnswers} × −2) = {examScore}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Elevator */}
          {realWorldStep === 1 && (
            <div style={{
              border: '2px solid #EBEBEB',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              marginBottom: 'clamp(20px, 4vw, 32px)',
              background: '#FFFFFF'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #EBEBEB 0%, #F5F5F5 100%)',
                padding: 'clamp(16px, 3vw, 24px)',
                borderBottom: '2px solid #CACACA'
              }}>
                <h2 style={{
                  fontSize: 'clamp(20px, 4vw, 28px)',
                  color: '#4E4E4E',
                  fontWeight: '600',
                  margin: 0,
                  lineHeight: '1.3',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  🏗️ Mining Elevator
                </h2>
              </div>
              <div style={{padding: 'clamp(20px, 4vw, 32px)'}}>
                <div style={{
                  background: '#F5F5F5',
                  padding: 'clamp(16px, 3vw, 20px)',
                  borderRadius: '12px',
                  marginBottom: 'clamp(20px, 4vw, 24px)',
                  border: '2px solid #EBEBEB'
                }}>
                  <p style={{
                    color: '#4E4E4E',
                    fontSize: 'clamp(14px, 3vw, 16px)',
                    lineHeight: '1.6',
                    margin: 0,
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    The elevator descends at <strong>3 meters per minute</strong>. Calculate the final position!
                  </p>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                  gap: 'clamp(16px, 3vw, 20px)',
                  marginBottom: 'clamp(20px, 4vw, 24px)'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'clamp(13px, 2.5vw, 15px)',
                      fontWeight: '600',
                      marginBottom: 'clamp(8px, 2vw, 12px)',
                      color: '#4E4E4E',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Starting Position (m)
                    </label>
                    <input
                      type="number"
                      value={elevatorStart}
                      onChange={(e) => setElevatorStart(e.target.value)}
                      style={{
                        width: '100%',
                        padding: 'clamp(12px, 2vw, 14px)',
                        border: '2px solid #CACACA',
                        borderRadius: '8px',
                        fontSize: 'clamp(14px, 3vw, 16px)',
                        boxSizing: 'border-box',
                        fontFamily: 'Poppins, sans-serif',
                        outline: 'none',
                        transition: 'border-color 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#4A4DC9'}
                      onBlur={(e) => e.target.style.borderColor = '#CACACA'}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'clamp(13px, 2.5vw, 15px)',
                      fontWeight: '600',
                      marginBottom: 'clamp(8px, 2vw, 12px)',
                      color: '#4E4E4E',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Time (minutes)
                    </label>
                    <input
                      type="number"
                      value={elevatorTime}
                      onChange={(e) => setElevatorTime(e.target.value)}
                      style={{
                        width: '100%',
                        padding: 'clamp(12px, 2vw, 14px)',
                        border: '2px solid #CACACA',
                        borderRadius: '8px',
                        fontSize: 'clamp(14px, 3vw, 16px)',
                        boxSizing: 'border-box',
                        fontFamily: 'Poppins, sans-serif',
                        outline: 'none',
                        transition: 'border-color 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#4A4DC9'}
                      onBlur={(e) => e.target.style.borderColor = '#CACACA'}
                    />
                  </div>
                </div>

                <button
                  onClick={calculateElevator}
                  style={{
                    width: '100%',
                    background: '#4A4DC9',
                    color: 'white',
                    padding: 'clamp(14px, 3vw, 16px)',
                    border: 'none',
                    borderRadius: '40px',
                    fontSize: 'clamp(15px, 3vw, 17px)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginBottom: 'clamp(20px, 4vw, 24px)',
                    minHeight: '56px',
                    transition: 'all 0.3s ease',
                    touchAction: 'manipulation',
                    fontFamily: 'Poppins, sans-serif',
                    boxShadow: '0 4px 8px rgba(74, 77, 201, 0.3)'
                  }}
                >
                  Calculate Position
                </button>

                {elevatorPosition !== null && (
                  <div style={{
                    background: '#C1C1EA',
                    padding: 'clamp(16px, 3vw, 20px)',
                    borderRadius: '12px',
                    border: '2px solid #533086'
                  }}>
                    <p style={{
                      color: '#533086',
                      fontWeight: '600',
                      marginBottom: 'clamp(8px, 2vw, 12px)',
                      fontSize: 'clamp(15px, 3vw, 17px)',
                      margin: '0 0 clamp(8px, 2vw, 12px) 0',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Final Position: {elevatorPosition} meters
                    </p>
                    <p style={{
                      color: '#4E4E4E',
                      fontSize: 'clamp(13px, 2.5vw, 15px)',
                      margin: 0,
                      lineHeight: '1.5',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      <strong>Calculation:</strong> {elevatorStart} + ({elevatorTime} × −3) = {elevatorPosition}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Temperature */}
          {realWorldStep === 2 && (
            <div style={{
              border: '2px solid #FFF3E4',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              marginBottom: 'clamp(20px, 4vw, 32px)',
              background: '#FFFFFF'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #FFF3E4 0%, #EBEBEB 100%)',
                padding: 'clamp(16px, 3vw, 24px)',
                borderBottom: '2px solid #FC9145'
              }}>
                <h2 style={{
                  fontSize: 'clamp(20px, 4vw, 28px)',
                  color: '#FC9145',
                  fontWeight: '600',
                  margin: 0,
                  lineHeight: '1.3',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  🌡️ Temperature Changes
                </h2>
              </div>
              <div style={{padding: 'clamp(20px, 4vw, 32px)'}}>
                <div style={{
                  background: '#F5F5F5',
                  padding: 'clamp(16px, 3vw, 20px)',
                  borderRadius: '12px',
                  marginBottom: 'clamp(20px, 4vw, 24px)',
                  border: '2px solid #EBEBEB'
                }}>
                  <p style={{
                    color: '#4E4E4E',
                    fontSize: 'clamp(14px, 3vw, 16px)',
                    lineHeight: '1.6',
                    margin: 0,
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Temperature drops by <strong>5°C every hour</strong> during a cold snap.
                  </p>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                  gap: 'clamp(16px, 3vw, 20px)',
                  marginBottom: 'clamp(20px, 4vw, 24px)'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'clamp(13px, 2.5vw, 15px)',
                      fontWeight: '600',
                      marginBottom: 'clamp(8px, 2vw, 12px)',
                      color: '#4E4E4E',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Starting Temp (°C)
                    </label>
                    <input
                      type="number"
                      value={startTemp}
                      onChange={(e) => setStartTemp(e.target.value)}
                      style={{
                        width: '100%',
                        padding: 'clamp(12px, 2vw, 14px)',
                        border: '2px solid #CACACA',
                        borderRadius: '8px',
                        fontSize: 'clamp(14px, 3vw, 16px)',
                        boxSizing: 'border-box',
                        fontFamily: 'Poppins, sans-serif',
                        outline: 'none',
                        transition: 'border-color 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#4A4DC9'}
                      onBlur={(e) => e.target.style.borderColor = '#CACACA'}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'clamp(13px, 2.5vw, 15px)',
                      fontWeight: '600',
                      marginBottom: 'clamp(8px, 2vw, 12px)',
                      color: '#4E4E4E',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Number of Hours
                    </label>
                    <input
                      type="number"
                      value={tempHours}
                      onChange={(e) => setTempHours(e.target.value)}
                      style={{
                        width: '100%',
                        padding: 'clamp(12px, 2vw, 14px)',
                        border: '2px solid #CACACA',
                        borderRadius: '8px',
                        fontSize: 'clamp(14px, 3vw, 16px)',
                        boxSizing: 'border-box',
                        fontFamily: 'Poppins, sans-serif',
                        outline: 'none',
                        transition: 'border-color 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#4A4DC9'}
                      onBlur={(e) => e.target.style.borderColor = '#CACACA'}
                    />
                  </div>
                </div>

                <button
                  onClick={calculateTemperature}
                  style={{
                    width: '100%',
                    background: '#FF7212',
                    color: 'white',
                    padding: 'clamp(14px, 3vw, 16px)',
                    border: 'none',
                    borderRadius: '40px',
                    fontSize: 'clamp(15px, 3vw, 17px)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginBottom: 'clamp(20px, 4vw, 24px)',
                    minHeight: '56px',
                    transition: 'all 0.3s ease',
                    touchAction: 'manipulation',
                    fontFamily: 'Poppins, sans-serif',
                    boxShadow: '0 4px 8px rgba(255, 114, 18, 0.3)'
                  }}
                >
                  Calculate Temperature
                </button>

                {finalTemp !== null && (
                  <div style={{
                    background: '#C1C1EA',
                    padding: 'clamp(16px, 3vw, 20px)',
                    borderRadius: '12px',
                    border: '2px solid #533086'
                  }}>
                    <p style={{
                      color: '#533086',
                      fontWeight: '600',
                      marginBottom: 'clamp(8px, 2vw, 12px)',
                      fontSize: 'clamp(15px, 3vw, 17px)',
                      margin: '0 0 clamp(8px, 2vw, 12px) 0',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Final Temperature: {finalTemp}°C
                    </p>
                    <p style={{
                      color: '#4E4E4E',
                      fontSize: 'clamp(13px, 2.5vw, 15px)',
                      margin: 0,
                      lineHeight: '1.5',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      <strong>Calculation:</strong> {startTemp} + ({tempHours} × −5) = {finalTemp}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Navigation Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'clamp(20px, 4vw, 32px)',
        gap: 'clamp(12px, 2vw, 16px)',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={handlePrevious}
          disabled={isFirstStep()}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: isFirstStep() ? '#EBEBEB' : '#4A4DC9',
            color: isFirstStep() ? '#CACACA' : 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '40px',
            fontSize: 'clamp(14px, 3vw, 16px)',
            fontWeight: '600',
            cursor: isFirstStep() ? 'not-allowed' : 'pointer',
            flex: '1 1 auto',
            minWidth: 'clamp(120px, 28vw, 140px)',
            maxWidth: '200px',
            minHeight: '48px',
            transition: 'all 0.3s ease',
            touchAction: 'manipulation',
            fontFamily: 'Poppins, sans-serif',
            boxShadow: isFirstStep() ? 'none' : '0 4px 8px rgba(74, 77, 201, 0.3)'
          }}
        >
          <ChevronLeftIcon />
          <span>Previous</span>
        </button>

        <div style={{
          flex: '1 1 auto',
          textAlign: 'center',
          fontSize: 'clamp(13px, 2.5vw, 16px)',
          fontWeight: '600',
          color: '#4E4E4E',
          minWidth: 'clamp(100px, 22vw, 140px)',
          padding: 'clamp(8px, 2vw, 12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Poppins, sans-serif'
        }}>
          Step {getCurrentStep()} of {getTotalSteps()}
        </div>

        <button
          onClick={handleNext}
          disabled={isLastStep()}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: isLastStep() ? '#EBEBEB' : '#4A4DC9',
            color: isLastStep() ? '#CACACA' : 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '40px',
            fontSize: 'clamp(14px, 3vw, 16px)',
            fontWeight: '600',
            cursor: isLastStep() ? 'not-allowed' : 'pointer',
            flex: '1 1 auto',
            minWidth: 'clamp(120px, 28vw, 140px)',
            maxWidth: '200px',
            minHeight: '48px',
            transition: 'all 0.3s ease',
            touchAction: 'manipulation',
            fontFamily: 'Poppins, sans-serif',
            boxShadow: isLastStep() ? 'none' : '0 4px 8px rgba(74, 77, 201, 0.3)'
          }}
        >
          <span>Next</span>
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
};

export default MultiplicationIntegers;