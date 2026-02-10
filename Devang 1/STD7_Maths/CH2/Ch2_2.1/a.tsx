import React, { useState } from 'react';

const RecapIntegers = () => {
  const [mode, setMode] = useState('learn');
  const [learnStep, setLearnStep] = useState(0);
  const [practiceStep, setPracticeStep] = useState(0);
  const [realWorldStep, setRealWorldStep] = useState(0);
  const [firstNumber, setFirstNumber] = useState('');
  const [secondNumber, setSecondNumber] = useState('');
  const [sum, setSum] = useState(null);
  const [difference, setDifference] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [coinPosition, setCoinPosition] = useState(0);
  const [firstStrike, setFirstStrike] = useState('');
  const [secondStrike, setSecondStrike] = useState('');
  const [showZeroPairs, setShowZeroPairs] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [temperature, setTemperature] = useState('8');
  const [hours, setHours] = useState('4');
  const [finalTemp, setFinalTemp] = useState(null);
  const [bankBalance, setBankBalance] = useState('1000');
  const [deposit, setDeposit] = useState('');
  const [withdrawal, setWithdrawal] = useState('');
  const [finalBalance, setFinalBalance] = useState(null);
  const [seaLevel, setSeaLevel] = useState('0');
  const [elevationChange, setElevationChange] = useState('');
  const [finalElevation, setFinalElevation] = useState(null);

  const LEARN_STEPS = 3;
  const PRACTICE_STEPS = 10;
  const REALWORLD_STEPS = 3;

  const practiceQuestions = [
    { id: 1, question: "If two numbers have a sum of 15 and a difference of 5, what are the two numbers?", options: ["8 and 7", "10 and 5", "12 and 3", "9 and 6"], correct: "10 and 5" },
    { id: 2, question: "A carrom coin starts at position 0. It moves 7 units right, then 3 units left. What is its final position?", options: ["10", "4", "-4", "3"], correct: "4" },
    { id: 3, question: "What is the additive inverse of -15?", options: ["-15", "0", "15", "30"], correct: "15" },
    { id: 4, question: "Calculate: 8 - 12 = ?", options: ["20", "-4", "4", "-20"], correct: "-4" },
    { id: 5, question: "Which statement is TRUE about subtracting integers?", options: ["Subtracting a number is the same as adding its opposite", "Subtracting always makes numbers smaller", "You cannot subtract a larger number from a smaller number", "Subtraction and addition are the same operation"], correct: "Subtracting a number is the same as adding its opposite" },
    { id: 6, question: "If the first movement on a number line is -5 and the final position is 3, what is the second movement?", options: ["-8", "8", "-2", "2"], correct: "8" },
    { id: 7, question: "In the token model, one green token and one red token together equal:", options: ["2", "1", "0", "-1"], correct: "0" },
    { id: 8, question: "Calculate: (-3) + (-7) = ?", options: ["10", "-10", "4", "-4"], correct: "-10" },
    { id: 9, question: "Two numbers have a sum of 0 and a difference of 14. What are the numbers?", options: ["7 and -7", "14 and 0", "7 and 7", "14 and -14"], correct: "7 and -7" },
    { id: 10, question: "What is 5 - (-3)?", options: ["2", "8", "-8", "-2"], correct: "8" }
  ];

  const checkPuzzle = (targetSum, targetDiff) => {
    const num1 = parseInt(firstNumber);
    const num2 = parseInt(secondNumber);
    if (isNaN(num1) || isNaN(num2)) {
      setFeedback('Please enter valid numbers');
      return;
    }
    const calculatedSum = num1 + num2;
    const calculatedDiff = num1 - num2;
    setSum(calculatedSum);
    setDifference(calculatedDiff);
    if (calculatedSum === targetSum && calculatedDiff === targetDiff) {
      setFeedback('🎉 Correct! You found the right pair!');
    } else {
      setFeedback('Try again! Check if the sum and difference match.');
    }
  };

  const calculateCarromPosition = () => {
    const strike1 = parseInt(firstStrike);
    const strike2 = parseInt(secondStrike);
    if (!isNaN(strike1) && !isNaN(strike2)) {
      setCoinPosition(strike1 + strike2);
    }
  };

  const resetPuzzle = () => {
    setFirstNumber('');
    setSecondNumber('');
    setSum(null);
    setDifference(null);
    setFeedback('');
  };

  const resetCarrom = () => {
    setFirstStrike('');
    setSecondStrike('');
    setCoinPosition(0);
  };

  const handleAnswerSelect = (answer) => {
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

  const nextPracticeQuestion = () => {
    if (practiceStep < PRACTICE_STEPS - 1) {
      setPracticeStep(practiceStep + 1);
      setSelectedAnswer('');
      setShowResult(false);
    }
  };

  const previousPracticeQuestion = () => {
    if (practiceStep > 0) {
      setPracticeStep(practiceStep - 1);
      setSelectedAnswer('');
      setShowResult(false);
    }
  };

  const calculateTemperature = () => {
    const temp = parseFloat(temperature);
    const hrs = parseFloat(hours);
    if (!isNaN(temp) && !isNaN(hrs)) {
      setFinalTemp(temp + (hrs * -5));
    }
  };

  const calculateBankBalance = () => {
    const balance = parseFloat(bankBalance);
    const dep = parseFloat(deposit) || 0;
    const with_ = parseFloat(withdrawal) || 0;
    if (!isNaN(balance)) {
      setFinalBalance(balance + dep - with_);
    }
  };

  const calculateElevation = () => {
    const level = parseFloat(seaLevel);
    const change = parseFloat(elevationChange);
    if (!isNaN(level) && !isNaN(change)) {
      setFinalElevation(level + change);
    }
  };

  const handleModeChange = (newMode) => {
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
      nextPracticeQuestion();
    } else if (mode === 'realworld' && realWorldStep < REALWORLD_STEPS - 1) {
      setRealWorldStep(realWorldStep + 1);
    }
  };

  const handlePrevious = () => {
    if (mode === 'learn' && learnStep > 0) {
      setLearnStep(learnStep - 1);
    } else if (mode === 'practice' && practiceStep > 0) {
      previousPracticeQuestion();
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

  return (
    <div style={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: 'clamp(12px, 3vw, 24px)',
      fontFamily: 'Poppins, system-ui, -apple-system, sans-serif',
      boxSizing: 'border-box',
      background: '#F5F5F5',
      minHeight: '100vh'
    }}>
      {/* Header with gradient matching PDF design */}
      <div style={{
        background: 'linear-gradient(135deg, #533086 0%, #FC9145 100%)',
        borderRadius: 'clamp(12px, 2vw, 16px)',
        padding: 'clamp(20px, 4vw, 32px)',
        marginBottom: 'clamp(20px, 4vw, 32px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          fontSize: 'clamp(24px, 5vw, 36px)',
          fontWeight: '600',
          color: '#FFFFFF',
          margin: '0 0 clamp(12px, 2vw, 16px) 0',
          lineHeight: '1.3'
        }}>
          2.1 A Quick Recap of Integers
        </h1>
        <p style={{
          fontSize: 'clamp(14px, 3vw, 18px)',
          color: '#FFFFFF',
          lineHeight: '1.6',
          margin: '0 0 clamp(20px, 4vw, 24px) 0',
          opacity: 0.95
        }}>
          {mode === 'learn' && "Let's revisit integers through interactive puzzles and visual models."}
          {mode === 'practice' && "Test your understanding with practice questions."}
          {mode === 'realworld' && "Explore real-world applications of integers."}
        </p>

        {/* Mode Selector with PDF colors */}
        <div style={{
          display: 'flex',
          gap: 'clamp(8px, 2vw, 12px)',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {['learn', 'practice', 'realworld'].map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              style={{
                padding: 'clamp(10px, 2vw, 12px) clamp(20px, 4vw, 24px)',
                borderRadius: 'clamp(8px, 1.5vw, 10px)',
                border: 'none',
                fontSize: 'clamp(14px, 3vw, 16px)',
                fontWeight: '500',
                cursor: 'pointer',
                background: mode === m ? '#FFFFFF' : 'rgba(255,255,255,0.2)',
                color: mode === m ? '#533086' : '#FFFFFF',
                transition: 'all 0.3s ease',
                flex: '1 1 auto',
                minWidth: 'clamp(110px, 28vw, 140px)',
                maxWidth: '220px',
                whiteSpace: 'nowrap',
                boxShadow: mode === m ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                transform: mode === m ? 'translateY(-2px)' : 'none'
              }}
            >
              {m === 'learn' ? '📚 Learn' : m === 'practice' ? '✍️ Practice' : '🌍 Real World'}
            </button>
          ))}
        </div>
      </div>

      {/* LEARN MODE */}
      {mode === 'learn' && (
        <>
          {/* Step 0: Rakesh's Puzzle */}
          {learnStep === 0 && (
            <div style={{
              border: '2px solid #C1C1EA',
              borderRadius: 'clamp(12px, 2vw, 16px)',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(83, 48, 134, 0.1)',
              marginBottom: 'clamp(20px, 4vw, 32px)',
              background: '#FFFFFF'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #533086 0%, #4A4DC9 100%)',
                padding: 'clamp(16px, 3vw, 24px) clamp(20px, 4vw, 32px)',
                borderBottom: '1px solid #C1C1EA'
              }}>
                <h2 style={{
                  fontSize: 'clamp(20px, 4vw, 28px)',
                  color: '#FFFFFF',
                  fontWeight: '600',
                  margin: 0,
                  lineHeight: '1.3',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  🧩 Rakesh's Puzzle: A Number Game
                </h2>
              </div>
              <div style={{
                padding: 'clamp(20px, 4vw, 32px)'
              }}>
                <div style={{
                  background: '#FFF3E4',
                  padding: 'clamp(16px, 3vw, 20px)',
                  borderRadius: 'clamp(8px, 1.5vw, 12px)',
                  borderLeft: '4px solid #FF7212',
                  marginBottom: 'clamp(20px, 4vw, 28px)'
                }}>
                  <p style={{
                    fontWeight: '600',
                    color: '#533086',
                    marginBottom: 'clamp(8px, 2vw, 12px)',
                    fontSize: 'clamp(15px, 3vw, 18px)',
                    margin: '0 0 clamp(8px, 2vw, 12px) 0',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Challenge 1:
                  </p>
                  <p style={{
                    color: '#4E4E4E',
                    margin: 0,
                    fontSize: 'clamp(14px, 3vw, 16px)',
                    lineHeight: '1.6',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Find two numbers whose <strong>sum is 25</strong> and <strong>difference is 11</strong>.
                  </p>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                  gap: 'clamp(12px, 3vw, 16px)',
                  marginBottom: 'clamp(20px, 4vw, 24px)'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'clamp(13px, 2.5vw, 15px)',
                      fontWeight: '500',
                      marginBottom: 'clamp(8px, 1.5vw, 10px)',
                      color: '#533086',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      First Number
                    </label>
                    <input
                      type="number"
                      value={firstNumber}
                      onChange={(e) => setFirstNumber(e.target.value)}
                      placeholder="Enter first number"
                      style={{
                        width: '100%',
                        padding: 'clamp(10px, 2vw, 14px)',
                        border: '2px solid #EBEBEB',
                        borderRadius: 'clamp(8px, 1vw, 10px)',
                        fontSize: 'clamp(14px, 3vw, 16px)',
                        boxSizing: 'border-box',
                        fontFamily: 'Poppins, sans-serif',
                        outline: 'none',
                        transition: 'border-color 0.3s ease'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'clamp(13px, 2.5vw, 15px)',
                      fontWeight: '500',
                      marginBottom: 'clamp(8px, 1.5vw, 10px)',
                      color: '#533086',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Second Number
                    </label>
                    <input
                      type="number"
                      value={secondNumber}
                      onChange={(e) => setSecondNumber(e.target.value)}
                      placeholder="Enter second number"
                      style={{
                        width: '100%',
                        padding: 'clamp(10px, 2vw, 14px)',
                        border: '2px solid #EBEBEB',
                        borderRadius: 'clamp(8px, 1vw, 10px)',
                        fontSize: 'clamp(14px, 3vw, 16px)',
                        boxSizing: 'border-box',
                        fontFamily: 'Poppins, sans-serif',
                        outline: 'none',
                        transition: 'border-color 0.3s ease'
                      }}
                    />
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: 'clamp(10px, 2vw, 12px)',
                  marginBottom: 'clamp(20px, 4vw, 24px)',
                  flexWrap: 'wrap'
                }}>
                  <button 
                    onClick={() => checkPuzzle(25, 11)}
                    style={{
                      background: '#4A4DC9',
                      color: 'white',
                      padding: 'clamp(10px, 2vw, 12px) clamp(20px, 4vw, 24px)',
                      border: 'none',
                      borderRadius: 'clamp(8px, 1vw, 10px)',
                      fontSize: 'clamp(14px, 3vw, 16px)',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      flex: '1 1 auto',
                      minWidth: 'clamp(140px, 35vw, 160px)',
                      fontFamily: 'Poppins, sans-serif',
                      boxShadow: '0 4px 12px rgba(74, 77, 201, 0.3)'
                    }}
                  >
                    Check Answer
                  </button>
                  <button 
                    onClick={resetPuzzle}
                    style={{
                      background: 'transparent',
                      color: '#4A4DC9',
                      padding: 'clamp(10px, 2vw, 12px) clamp(20px, 4vw, 24px)',
                      border: '2px solid #4A4DC9',
                      borderRadius: 'clamp(8px, 1vw, 10px)',
                      fontSize: 'clamp(14px, 3vw, 16px)',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'clamp(6px, 1.5vw, 8px)',
                      flex: '1 1 auto',
                      minWidth: 'clamp(120px, 30vw, 140px)',
                      fontFamily: 'Poppins, sans-serif',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <span>Reset</span>
                  </button>
                </div>

                {(sum !== null || difference !== null) && (
                  <div style={{
                    background: '#F5F5F5',
                    padding: 'clamp(16px, 3vw, 20px)',
                    borderRadius: 'clamp(8px, 1.5vw, 12px)',
                    marginBottom: 'clamp(20px, 4vw, 24px)',
                    border: '2px solid #EBEBEB'
                  }}>
                    <p style={{
                      color: '#4E4E4E',
                      margin: '0 0 clamp(8px, 2vw, 10px) 0',
                      fontSize: 'clamp(14px, 3vw, 16px)',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      <strong>Sum:</strong> {firstNumber} + {secondNumber} = {sum}
                    </p>
                    <p style={{
                      color: '#4E4E4E',
                      margin: 0,
                      fontSize: 'clamp(14px, 3vw, 16px)',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      <strong>Difference:</strong> {firstNumber} - {secondNumber} = {difference}
                    </p>
                  </div>
                )}

                {feedback && (
                  <div style={{
                    padding: 'clamp(16px, 3vw, 20px)',
                    borderRadius: 'clamp(8px, 1.5vw, 12px)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'clamp(8px, 2vw, 12px)',
                    background: feedback.includes('Correct') ? '#FFF3E4' : '#EBEBEB',
                    color: feedback.includes('Correct') ? '#533086' : '#4E4E4E',
                    border: `2px solid ${feedback.includes('Correct') ? '#FF7212' : '#CACACA'}`,
                    marginBottom: 'clamp(20px, 4vw, 24px)',
                    fontSize: 'clamp(14px, 3vw, 16px)',
                    lineHeight: '1.5',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    <span style={{ flex: 1 }}>{feedback}</span>
                  </div>
                )}

                <div style={{
                  background: '#C1C1EA',
                  padding: 'clamp(16px, 3vw, 20px)',
                  borderRadius: 'clamp(8px, 1.5vw, 12px)'
                }}>
                  <p style={{
                    fontWeight: '600',
                    color: '#533086',
                    marginBottom: 'clamp(8px, 2vw, 12px)',
                    fontSize: 'clamp(15px, 3vw, 18px)',
                    margin: '0 0 clamp(8px, 2vw, 12px) 0',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Challenge 2:
                  </p>
                  <p style={{
                    color: '#4E4E4E',
                    marginBottom: 'clamp(8px, 2vw, 10px)',
                    fontSize: 'clamp(14px, 3vw, 16px)',
                    lineHeight: '1.6',
                    margin: '0 0 clamp(8px, 2vw, 10px) 0',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Now try: Find two numbers whose <strong>sum is 25</strong> and <strong>difference is -11</strong>.
                  </p>
                  <p style={{
                    fontSize: 'clamp(13px, 2.5vw, 15px)',
                    color: '#4E4E4E',
                    margin: 0,
                    fontStyle: 'italic',
                    lineHeight: '1.5',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Hint: If you swap the numbers from Challenge 1, the first becomes 7 and the second becomes 18!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Carrom Coin */}
          {learnStep === 1 && (
            <div style={{
              border: '2px solid #FFF3E4',
              borderRadius: 'clamp(12px, 2vw, 16px)',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(255, 114, 18, 0.1)',
              marginBottom: 'clamp(20px, 4vw, 32px)',
              background: '#FFFFFF'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #FF7212 0%, #FC9145 100%)',
                padding: 'clamp(16px, 3vw, 24px) clamp(20px, 4vw, 32px)',
                borderBottom: '1px solid #FFF3E4'
              }}>
                <h2 style={{
                  fontSize: 'clamp(20px, 4vw, 28px)',
                  color: '#FFFFFF',
                  fontWeight: '600',
                  margin: 0,
                  lineHeight: '1.3',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  🎯 Carrom Coin Integers
                </h2>
              </div>
              <div style={{
                padding: 'clamp(20px, 4vw, 32px)'
              }}>
                <p style={{
                  color: '#4E4E4E',
                  marginBottom: 'clamp(20px, 4vw, 28px)',
                  lineHeight: '1.6',
                  fontSize: 'clamp(14px, 3vw, 16px)',
                  margin: '0 0 clamp(20px, 4vw, 28px) 0',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  A carrom coin is struck to move it on a number line. Each strike moves the coin 
                  a certain distance based on the force and direction.
                </p>

                {/* Number Line Visualization */}
                <div style={{
                  background: '#FFFFFF',
                  padding: 'clamp(16px, 3vw, 24px)',
                  borderRadius: 'clamp(8px, 1.5vw, 12px)',
                  border: '2px solid #EBEBEB',
                  marginBottom: 'clamp(20px, 4vw, 28px)',
                  overflowX: 'auto'
                }}>
                  <div style={{
                    position: 'relative',
                    height: 'clamp(80px, 15vw, 100px)',
                    marginBottom: 'clamp(16px, 3vw, 20px)',
                    minWidth: '500px'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: '#CACACA',
                      transform: 'translateY(-50%)'
                    }}></div>
                    
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: 0,
                      right: 0,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transform: 'translateY(-50%)'
                    }}>
                      {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <div key={num} style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}>
                          <div style={{
                            width: '3px',
                            height: 'clamp(10px, 2vw, 14px)',
                            background: '#CACACA'
                          }}></div>
                          <span style={{
                            fontSize: 'clamp(10px, 2vw, 13px)',
                            marginTop: 'clamp(4px, 1vw, 6px)',
                            color: num === 0 ? '#FF7212' : '#4E4E4E',
                            fontWeight: num === 0 ? '600' : 'normal',
                            fontFamily: 'Poppins, sans-serif'
                          }}>
                            {num}
                          </span>
                        </div>
                      ))}
                    </div>

                    {coinPosition !== 0 && firstStrike && secondStrike && (
                      <div 
                        style={{
                          position: 'absolute',
                          top: '10%',
                          left: `${((coinPosition + 5) / 15) * 100}%`,
                          transform: 'translateX(-50%)',
                          transition: 'all 0.6s ease'
                        }}
                      >
                        <div style={{
                          width: 'clamp(28px, 6vw, 40px)',
                          height: 'clamp(28px, 6vw, 40px)',
                          background: 'linear-gradient(135deg, #FF7212 0%, #FC9145 100%)',
                          borderRadius: '50%',
                          border: '3px solid #FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(255, 114, 18, 0.4)',
                          fontSize: 'clamp(12px, 2.5vw, 16px)',
                          fontWeight: 'bold',
                          color: '#FFFFFF'
                        }}>
                          ●
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{
                  background: '#C1C1EA',
                  padding: 'clamp(16px, 3vw, 20px)',
                  borderRadius: 'clamp(8px, 1.5vw, 12px)',
                  marginBottom: 'clamp(20px, 4vw, 28px)'
                }}>
                  <p style={{
                    color: '#533086',
                    margin: '0 0 clamp(8px, 2vw, 10px) 0',
                    fontSize: 'clamp(14px, 3vw, 16px)',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: '600'
                  }}>
                    <strong>Formula:</strong> P = a + b
                  </p>
                  <p style={{
                    fontSize: 'clamp(13px, 2.5vw, 15px)',
                    color: '#4E4E4E',
                    margin: 0,
                    lineHeight: '1.5',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Where P is the final position, 'a' is the first movement, and 'b' is the second movement.
                  </p>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                  gap: 'clamp(12px, 3vw, 16px)',
                  marginBottom: 'clamp(20px, 4vw, 24px)'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'clamp(13px, 2.5vw, 15px)',
                      fontWeight: '500',
                      marginBottom: 'clamp(8px, 1.5vw, 10px)',
                      color: '#533086',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      First Strike
                    </label>
                    <input
                      type="number"
                      value={firstStrike}
                      onChange={(e) => setFirstStrike(e.target.value)}
                      placeholder="e.g., 5 or -3"
                      style={{
                        width: '100%',
                        padding: 'clamp(10px, 2vw, 14px)',
                        border: '2px solid #EBEBEB',
                        borderRadius: 'clamp(8px, 1vw, 10px)',
                        fontSize: 'clamp(14px, 3vw, 16px)',
                        boxSizing: 'border-box',
                        fontFamily: 'Poppins, sans-serif',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'clamp(13px, 2.5vw, 15px)',
                      fontWeight: '500',
                      marginBottom: 'clamp(8px, 1.5vw, 10px)',
                      color: '#533086',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Second Strike
                    </label>
                    <input
                      type="number"
                      value={secondStrike}
                      onChange={(e) => setSecondStrike(e.target.value)}
                      placeholder="e.g., -7 or 4"
                      style={{
                        width: '100%',
                        padding: 'clamp(10px, 2vw, 14px)',
                        border: '2px solid #EBEBEB',
                        borderRadius: 'clamp(8px, 1vw, 10px)',
                        fontSize: 'clamp(14px, 3vw, 16px)',
                        boxSizing: 'border-box',
                        fontFamily: 'Poppins, sans-serif',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: 'clamp(10px, 2vw, 12px)',
                  marginBottom: 'clamp(20px, 4vw, 24px)',
                  flexWrap: 'wrap'
                }}>
                  <button 
                    onClick={calculateCarromPosition}
                    style={{
                      background: '#FF7212',
                      color: 'white',
                      padding: 'clamp(10px, 2vw, 12px) clamp(20px, 4vw, 24px)',
                      border: 'none',
                      borderRadius: 'clamp(8px, 1vw, 10px)',
                      fontSize: 'clamp(14px, 3vw, 16px)',
                      fontWeight: '500',
                      cursor: 'pointer',
                      flex: '1 1 auto',
                      minWidth: 'clamp(160px, 40vw, 180px)',
                      fontFamily: 'Poppins, sans-serif',
                      boxShadow: '0 4px 12px rgba(255, 114, 18, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Calculate Position
                  </button>
                  <button 
                    onClick={resetCarrom}
                    style={{
                      background: 'transparent',
                      color: '#FF7212',
                      padding: 'clamp(10px, 2vw, 12px) clamp(20px, 4vw, 24px)',
                      border: '2px solid #FF7212',
                      borderRadius: 'clamp(8px, 1vw, 10px)',
                      fontSize: 'clamp(14px, 3vw, 16px)',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'clamp(6px, 1.5vw, 8px)',
                      flex: '1 1 auto',
                      minWidth: 'clamp(120px, 30vw, 140px)',
                      fontFamily: 'Poppins, sans-serif',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <span>Reset</span>
                  </button>
                </div>

                {coinPosition !== 0 && firstStrike && secondStrike && (
                  <div style={{
                    background: '#FFF3E4',
                    padding: 'clamp(16px, 3vw, 20px)',
                    borderRadius: 'clamp(8px, 1.5vw, 12px)',
                    border: '2px solid #FF7212'
                  }}>
                    <p style={{
                      color: '#533086',
                      fontWeight: '600',
                      margin: '0 0 clamp(8px, 2vw, 10px) 0',
                      fontSize: 'clamp(16px, 3vw, 18px)',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Final Position: {coinPosition}
                    </p>
                    <p style={{
                      fontSize: 'clamp(14px, 2.5vw, 15px)',
                      color: '#4E4E4E',
                      margin: '0 0 clamp(6px, 1vw, 8px) 0',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      <strong>Calculation:</strong> {firstStrike} + ({secondStrike}) = {coinPosition}
                    </p>
                    <p style={{
                      fontSize: 'clamp(13px, 2.5vw, 14px)',
                      color: '#4E4E4E',
                      margin: 0,
                      lineHeight: '1.5',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      The coin is {Math.abs(coinPosition)} units {coinPosition >= 0 ? 'to the right' : 'to the left'} of 0.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Token Model */}
          {learnStep === 2 && (
            <div style={{
              border: '2px solid #C1C1EA',
              borderRadius: 'clamp(12px, 2vw, 16px)',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(83, 48, 134, 0.1)',
              marginBottom: 'clamp(20px, 4vw, 32px)',
              background: '#FFFFFF'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #533086 0%, #4A4DC9 100%)',
                padding: 'clamp(16px, 3vw, 24px) clamp(20px, 4vw, 32px)',
                borderBottom: '1px solid #C1C1EA'
              }}>
                <h2 style={{
                  fontSize: 'clamp(20px, 4vw, 28px)',
                  color: '#FFFFFF',
                  fontWeight: '600',
                  margin: 0,
                  lineHeight: '1.3',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  🪙 Token Model for Integers
                </h2>
              </div>
              <div style={{
                padding: 'clamp(20px, 4vw, 32px)'
              }}>
                <p style={{
                  color: '#4E4E4E',
                  marginBottom: 'clamp(20px, 4vw, 28px)',
                  lineHeight: '1.6',
                  fontSize: 'clamp(14px, 3vw, 16px)',
                  margin: '0 0 clamp(20px, 4vw, 28px) 0',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  We use green tokens (●) for positive 1 and red tokens (●) for negative 1 (-1). 
                  Together, one green and one red token make zero (they cancel each other out).
                </p>

                <div style={{
                  background: '#FFF3E4',
                  padding: 'clamp(20px, 4vw, 28px)',
                  borderRadius: 'clamp(8px, 1.5vw, 12px)',
                  border: '2px solid #FF7212'
                }}>
                  <h3 style={{
                    fontWeight: '600',
                    color: '#533086',
                    marginBottom: 'clamp(16px, 3vw, 20px)',
                    fontSize: 'clamp(18px, 3.5vw, 22px)',
                    margin: '0 0 clamp(16px, 3vw, 20px) 0',
                    lineHeight: '1.3',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Example: Find (+7) - (+18)
                  </h3>
                  
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'clamp(20px, 4vw, 24px)'
                  }}>
                    <div>
                      <p style={{
                        fontSize: 'clamp(14px, 2.5vw, 16px)',
                        fontWeight: '500',
                        marginBottom: 'clamp(12px, 2vw, 14px)',
                        margin: '0 0 clamp(12px, 2vw, 14px) 0',
                        fontFamily: 'Poppins, sans-serif',
                        color: '#533086'
                      }}>
                        Step 1: Start with 7 positive tokens
                      </p>
                      <div style={{
                        display: 'flex',
                        gap: 'clamp(4px, 1vw, 6px)',
                        flexWrap: 'wrap'
                      }}>
                        {Array(7).fill(0).map((_, i) => (
                          <div key={i} style={{
                            width: 'clamp(28px, 5vw, 40px)',
                            height: 'clamp(28px, 5vw, 40px)',
                            background: 'linear-gradient(135deg, #4A4DC9 0%, #533086 100%)',
                            borderRadius: '50%',
                            border: '3px solid #FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: 'clamp(14px, 2.5vw, 18px)',
                            boxShadow: '0 2px 8px rgba(74, 77, 201, 0.3)'
                          }}>
                            +
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p style={{
                        fontSize: 'clamp(14px, 2.5vw, 16px)',
                        fontWeight: '500',
                        marginBottom: 'clamp(8px, 1.5vw, 10px)',
                        margin: '0 0 clamp(8px, 1.5vw, 10px) 0',
                        fontFamily: 'Poppins, sans-serif',
                        color: '#533086'
                      }}>
                        Step 2: We need to remove 18 positives, but we only have 7!
                      </p>
                      <p style={{
                        fontSize: 'clamp(13px, 2.5vw, 15px)',
                        color: '#4E4E4E',
                        marginBottom: 'clamp(12px, 2vw, 14px)',
                        margin: '0 0 clamp(12px, 2vw, 14px) 0',
                        lineHeight: '1.5',
                        fontFamily: 'Poppins, sans-serif'
                      }}>
                        Add 11 zero pairs (11 green + 11 red tokens):
                      </p>
                      <button
                        onClick={() => setShowZeroPairs(!showZeroPairs)}
                        style={{
                          background: 'transparent',
                          color: '#4A4DC9',
                          padding: 'clamp(8px, 1.5vw, 10px) clamp(16px, 3vw, 20px)',
                          border: '2px solid #4A4DC9',
                          borderRadius: 'clamp(8px, 1vw, 10px)',
                          fontSize: 'clamp(13px, 2.5vw, 15px)',
                          cursor: 'pointer',
                          fontFamily: 'Poppins, sans-serif',
                          fontWeight: '500'
                        }}
                      >
                        {showZeroPairs ? 'Hide' : 'Show'} Zero Pairs
                      </button>
                    </div>

                    {showZeroPairs && (
                      <div style={{
                        background: 'white',
                        padding: 'clamp(16px, 3vw, 20px)',
                        borderRadius: 'clamp(8px, 1.5vw, 12px)',
                        border: '2px solid #EBEBEB'
                      }}>
                        <p style={{
                          fontSize: 'clamp(13px, 2.5vw, 15px)',
                          marginBottom: 'clamp(12px, 2vw, 14px)',
                          margin: '0 0 clamp(12px, 2vw, 14px) 0',
                          fontFamily: 'Poppins, sans-serif',
                          color: '#533086',
                          fontWeight: '500'
                        }}>
                          Now we have 18 green and 11 red tokens:
                        </p>
                        <div style={{
                          display: 'flex',
                          gap: 'clamp(4px, 1vw, 6px)',
                          flexWrap: 'wrap',
                          marginBottom: 'clamp(12px, 2vw, 14px)'
                        }}>
                          {Array(18).fill(0).map((_, i) => (
                            <div key={`g-${i}`} style={{
                              width: 'clamp(22px, 4vw, 32px)',
                              height: 'clamp(22px, 4vw, 32px)',
                              background: 'linear-gradient(135deg, #4A4DC9 0%, #533086 100%)',
                              borderRadius: '50%',
                              border: '2px solid #FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: 'clamp(10px, 2vw, 14px)',
                              fontWeight: 'bold',
                              boxShadow: '0 2px 6px rgba(74, 77, 201, 0.2)'
                            }}>
                              +
                            </div>
                          ))}
                        </div>
                        <div style={{
                          display: 'flex',
                          gap: 'clamp(4px, 1vw, 6px)',
                          flexWrap: 'wrap'
                        }}>
                          {Array(11).fill(0).map((_, i) => (
                            <div key={`r-${i}`} style={{
                              width: 'clamp(22px, 4vw, 32px)',
                              height: 'clamp(22px, 4vw, 32px)',
                              background: 'linear-gradient(135deg, #FF7212 0%, #FC9145 100%)',
                              borderRadius: '50%',
                              border: '2px solid #FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: 'clamp(10px, 2vw, 14px)',
                              fontWeight: 'bold',
                              boxShadow: '0 2px 6px rgba(255, 114, 18, 0.2)'
                            }}>
                              -
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <p style={{
                        fontSize: 'clamp(14px, 2.5vw, 16px)',
                        fontWeight: '500',
                        marginBottom: 'clamp(8px, 1.5vw, 10px)',
                        margin: '0 0 clamp(8px, 1.5vw, 10px) 0',
                        fontFamily: 'Poppins, sans-serif',
                        color: '#533086'
                      }}>
                        Step 3: Remove 18 green tokens
                      </p>
                      <p style={{
                        fontSize: 'clamp(13px, 2.5vw, 15px)',
                        color: '#4E4E4E',
                        margin: 0,
                        lineHeight: '1.5',
                        fontFamily: 'Poppins, sans-serif'
                      }}>
                        What's left? 11 red tokens = -11
                      </p>
                    </div>

                    <div style={{
                      background: '#C1C1EA',
                      padding: 'clamp(12px, 2.5vw, 16px)',
                      borderRadius: 'clamp(8px, 1vw, 10px)',
                      border: '2px solid #4A4DC9'
                    }}>
                      <p style={{
                        fontWeight: '600',
                        color: '#533086',
                        margin: 0,
                        fontSize: 'clamp(16px, 3vw, 18px)',
                        fontFamily: 'Poppins, sans-serif'
                      }}>
                        Result: 7 - 18 = -11
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{
                  background: '#C1C1EA',
                  padding: 'clamp(16px, 3vw, 20px)',
                  borderRadius: 'clamp(8px, 1.5vw, 12px)',
                  marginTop: 'clamp(20px, 4vw, 28px)'
                }}>
                  <h4 style={{
                    fontWeight: '600',
                    color: '#533086',
                    marginBottom: 'clamp(12px, 2vw, 14px)',
                    fontSize: 'clamp(16px, 3vw, 18px)',
                    margin: '0 0 clamp(12px, 2vw, 14px) 0',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Key Concept:
                  </h4>
                  <p style={{
                    color: '#4E4E4E',
                    marginBottom: 'clamp(10px, 1.5vw, 12px)',
                    fontSize: 'clamp(14px, 2.5vw, 15px)',
                    margin: '0 0 clamp(10px, 1.5vw, 12px) 0',
                    lineHeight: '1.5',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Subtracting a number is the same as adding its additive inverse:
                  </p>
                  <ul style={{
                    margin: '0 0 clamp(10px, 2vw, 12px) 0',
                    paddingLeft: 'clamp(20px, 4vw, 24px)',
                    color: '#4E4E4E'
                  }}>
                    <li style={{fontSize: 'clamp(13px, 2.5vw, 15px)', lineHeight: '1.6', fontFamily: 'Poppins, sans-serif'}}>7 - 18 = 7 + (-18)</li>
                    <li style={{fontSize: 'clamp(13px, 2.5vw, 15px)', lineHeight: '1.6', fontFamily: 'Poppins, sans-serif'}}>4 - (-12) = 4 + 12</li>
                  </ul>
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
          borderRadius: 'clamp(12px, 2vw, 16px)',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(83, 48, 134, 0.1)',
          marginBottom: 'clamp(20px, 4vw, 32px)',
          background: '#FFFFFF'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #533086 0%, #4A4DC9 100%)',
            padding: 'clamp(16px, 3vw, 24px) clamp(20px, 4vw, 32px)',
            borderBottom: '1px solid #C1C1EA'
          }}>
            <h2 style={{
              fontSize: 'clamp(20px, 4vw, 28px)',
              color: '#FFFFFF',
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
                background: totalCorrect >= 7 ? '#FFF3E4' : totalCorrect >= 5 ? '#C1C1EA' : '#EBEBEB',
                padding: 'clamp(24px, 5vw, 32px)',
                borderRadius: 'clamp(8px, 1.5vw, 12px)',
                marginBottom: 'clamp(20px, 4vw, 28px)',
                border: '3px solid',
                borderColor: totalCorrect >= 7 ? '#FF7212' : totalCorrect >= 5 ? '#4A4DC9' : '#CACACA',
                textAlign: 'center'
              }}>
                <h3 style={{
                  fontSize: 'clamp(24px, 5vw, 32px)',
                  fontWeight: '600',
                  marginBottom: 'clamp(12px, 2vw, 16px)',
                  color: totalCorrect >= 7 ? '#533086' : totalCorrect >= 5 ? '#533086' : '#4E4E4E',
                  margin: '0 0 clamp(12px, 2vw, 16px) 0',
                  lineHeight: '1.2',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  Quiz Complete!
                </h3>
                <p style={{
                  fontSize: 'clamp(20px, 4vw, 26px)',
                  marginBottom: 'clamp(8px, 1.5vw, 10px)',
                  color: totalCorrect >= 7 ? '#533086' : totalCorrect >= 5 ? '#533086' : '#4E4E4E',
                  margin: '0 0 clamp(8px, 1.5vw, 10px) 0',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '600'
                }}>
                  Your Score: {totalCorrect}/{PRACTICE_STEPS}
                </p>
                <p style={{
                  fontSize: 'clamp(16px, 3.5vw, 20px)',
                  margin: 0,
                  color: totalCorrect >= 7 ? '#533086' : totalCorrect >= 5 ? '#533086' : '#4E4E4E',
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
                  background: 'white',
                  padding: 'clamp(20px, 4vw, 24px)',
                  borderRadius: 'clamp(8px, 1.5vw, 12px)',
                  marginBottom: 'clamp(20px, 4vw, 24px)',
                  border: '2px solid #EBEBEB'
                }}>
                  <p style={{
                    fontWeight: '600',
                    marginBottom: 'clamp(20px, 4vw, 24px)',
                    color: '#533086',
                    fontSize: 'clamp(16px, 3.5vw, 20px)',
                    lineHeight: '1.6',
                    margin: '0 0 clamp(20px, 4vw, 24px) 0',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    {practiceQuestions[practiceStep].question}
                  </p>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'clamp(12px, 2.5vw, 14px)'
                  }}>
                    {practiceQuestions[practiceStep].options.map((option, optIndex) => (
                      <label
                        key={optIndex}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: 'clamp(12px, 2.5vw, 16px)',
                          borderRadius: 'clamp(8px, 1vw, 10px)',
                          border: '2px solid',
                          borderColor: selectedAnswer === option ? '#4A4DC9' : '#EBEBEB',
                          background: selectedAnswer === option ? '#C1C1EA' : 'white',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          fontSize: 'clamp(14px, 3vw, 16px)',
                          lineHeight: '1.5',
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
                            marginRight: 'clamp(10px, 2vw, 14px)',
                            cursor: 'pointer',
                            width: 'clamp(18px, 4vw, 20px)',
                            height: 'clamp(18px, 4vw, 20px)',
                            flexShrink: 0,
                            accentColor: '#4A4DC9'
                          }}
                        />
                        <span style={{ color: '#4E4E4E', flex: 1 }}>{option}</span>
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
                      padding: 'clamp(12px, 2.5vw, 14px) clamp(20px, 4vw, 24px)',
                      border: 'none',
                      borderRadius: 'clamp(8px, 1vw, 10px)',
                      fontSize: 'clamp(15px, 3vw, 17px)',
                      fontWeight: '600',
                      cursor: selectedAnswer ? 'pointer' : 'not-allowed',
                      transition: 'all 0.3s ease',
                      fontFamily: 'Poppins, sans-serif',
                      boxShadow: selectedAnswer ? '0 4px 12px rgba(74, 77, 201, 0.3)' : 'none'
                    }}
                  >
                    Check Answer
                  </button>
                )}

                {showResult && (
                  <div style={{
                    padding: 'clamp(16px, 3vw, 20px)',
                    borderRadius: 'clamp(8px, 1.5vw, 12px)',
                    background: selectedAnswer === practiceQuestions[practiceStep].correct ? '#FFF3E4' : '#EBEBEB',
                    border: '2px solid',
                    borderColor: selectedAnswer === practiceQuestions[practiceStep].correct ? '#FF7212' : '#CACACA',
                    marginBottom: 'clamp(16px, 3vw, 20px)'
                  }}>
                    <p style={{
                      fontWeight: '600',
                      color: selectedAnswer === practiceQuestions[practiceStep].correct ? '#533086' : '#4E4E4E',
                      marginBottom: 'clamp(8px, 1.5vw, 10px)',
                      fontSize: 'clamp(15px, 3vw, 17px)',
                      margin: '0 0 clamp(8px, 1.5vw, 10px) 0',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      {selectedAnswer === practiceQuestions[practiceStep].correct ? '✓ Correct!' : '✗ Incorrect'}
                    </p>
                    {selectedAnswer !== practiceQuestions[practiceStep].correct && (
                      <p style={{
                        color: '#4E4E4E',
                        margin: 0,
                        fontSize: 'clamp(14px, 2.5vw, 15px)',
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
          {/* Temperature Example */}
          {realWorldStep === 0 && (
            <div style={{
              border: '2px solid #FFF3E4',
              borderRadius: 'clamp(12px, 2vw, 16px)',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(255, 114, 18, 0.1)',
              marginBottom: 'clamp(20px, 4vw, 32px)',
              background: '#FFFFFF'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #FF7212 0%, #FC9145 100%)',
                padding: 'clamp(16px, 3vw, 24px) clamp(20px, 4vw, 32px)',
                borderBottom: '1px solid #FFF3E4'
              }}>
                <h2 style={{
                  fontSize: 'clamp(20px, 4vw, 28px)',
                  color: '#FFFFFF',
                  fontWeight: '600',
                  margin: 0,
                  lineHeight: '1.3',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  🌡️ Temperature Changes
                </h2>
              </div>
              <div style={{
                padding: 'clamp(20px, 4vw, 32px)'
              }}>
                <div style={{
                  background: '#C1C1EA',
                  padding: 'clamp(16px, 3vw, 20px)',
                  borderRadius: 'clamp(8px, 1.5vw, 12px)',
                  marginBottom: 'clamp(20px, 4vw, 28px)'
                }}>
                  <p style={{
                    color: '#533086',
                    fontWeight: '600',
                    marginBottom: 'clamp(8px, 1.5vw, 10px)',
                    fontSize: 'clamp(15px, 3vw, 18px)',
                    margin: '0 0 clamp(8px, 1.5vw, 10px) 0',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Real-World Scenario:
                  </p>
                  <p style={{
                    color: '#4E4E4E',
                    margin: 0,
                    lineHeight: '1.6',
                    fontSize: 'clamp(14px, 2.5vw, 16px)',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    A freezing process requires that the room temperature be lowered at the rate of 5°C every hour. 
                    Integers help us calculate the final temperature after several hours.
                  </p>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                  gap: 'clamp(12px, 3vw, 16px)',
                  marginBottom: 'clamp(20px, 4vw, 24px)'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'clamp(13px, 2.5vw, 15px)',
                      fontWeight: '500',
                      marginBottom: 'clamp(8px, 1.5vw, 10px)',
                      color: '#533086',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Starting Temperature (°C)
                    </label>
                    <input
                      type="number"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      style={{
                        width: '100%',
                        padding: 'clamp(10px, 2vw, 14px)',
                        border: '2px solid #EBEBEB',
                        borderRadius: 'clamp(8px, 1vw, 10px)',
                        fontSize: 'clamp(14px, 3vw, 16px)',
                        boxSizing: 'border-box',
                        fontFamily: 'Poppins, sans-serif',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'clamp(13px, 2.5vw, 15px)',
                      fontWeight: '500',
                      marginBottom: 'clamp(8px, 1.5vw, 10px)',
                      color: '#533086',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Number of Hours
                    </label>
                    <input
                      type="number"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      style={{
                        width: '100%',
                        padding: 'clamp(10px, 2vw, 14px)',
                        border: '2px solid #EBEBEB',
                        borderRadius: 'clamp(8px, 1vw, 10px)',
                        fontSize: 'clamp(14px, 3vw, 16px)',
                        boxSizing: 'border-box',
                        fontFamily: 'Poppins, sans-serif',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={calculateTemperature}
                  style={{
                    width: '100%',
                    background: '#FF7212',
                    color: 'white',
                    padding: 'clamp(12px, 2.5vw, 14px) clamp(20px, 4vw, 24px)',
                    border: 'none',
                    borderRadius: 'clamp(8px, 1vw, 10px)',
                    fontSize: 'clamp(15px, 3vw, 17px)',
                    fontWeight: '500',
                    cursor: 'pointer',
                    marginBottom: 'clamp(20px, 4vw, 24px)',
                    fontFamily: 'Poppins, sans-serif',
                    boxShadow: '0 4px 12px rgba(255, 114, 18, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Calculate Final Temperature
                </button>

                {finalTemp !== null && (
                  <div style={{
                    background: '#FFF3E4',
                    padding: 'clamp(16px, 3vw, 20px)',
                    borderRadius: 'clamp(8px, 1.5vw, 12px)',
                    border: '2px solid #FF7212'
                  }}>
                    <p style={{
                      color: '#533086',
                      fontWeight: '600',
                      marginBottom: 'clamp(8px, 1.5vw, 10px)',
                      fontSize: 'clamp(16px, 3vw, 18px)',
                      margin: '0 0 clamp(8px, 1.5vw, 10px) 0',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Result:
                    </p>
                    <p style={{
                      color: '#4E4E4E',
                      margin: '0 0 clamp(8px, 1.5vw, 10px) 0',
                      fontSize: 'clamp(14px, 2.5vw, 15px)',
                      lineHeight: '1.5',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      <strong>Calculation:</strong> {temperature}°C + ({hours} × -5°C) = {finalTemp}°C
                    </p>
                    <p style={{
                      color: '#4E4E4E',
                      margin: 0,
                      fontSize: 'clamp(14px, 2.5vw, 15px)',
                      lineHeight: '1.5',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      After {hours} hours, the temperature will be <strong>{finalTemp}°C</strong>
                    </p>
                  </div>
                )}

                <div style={{
                  background: '#C1C1EA',
                  padding: 'clamp(16px, 3vw, 20px)',
                  borderRadius: 'clamp(8px, 1.5vw, 12px)',
                  marginTop: 'clamp(20px, 4vw, 28px)'
                }}>
                  <p style={{
                    fontWeight: '600',
                    color: '#533086',
                    marginBottom: 'clamp(8px, 1.5vw, 10px)',
                    fontSize: 'clamp(15px, 3vw, 18px)',
                    margin: '0 0 clamp(8px, 1.5vw, 10px) 0',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    💡 Understanding with Integers:
                  </p>
                  <p style={{
                    color: '#4E4E4E',
                    margin: 0,
                    lineHeight: '1.6',
                    fontSize: 'clamp(14px, 2.5vw, 15px)',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    The temperature decrease is represented by negative integers (-5°C per hour). 
                    Starting temperature is positive, and we add negative values to find the final temperature.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bank Balance Example */}
          {realWorldStep === 1 && (
            <div style={{
              border: '2px solid #C1C1EA',
              borderRadius: 'clamp(12px, 2vw, 16px)',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(83, 48, 134, 0.1)',
              marginBottom: 'clamp(20px, 4vw, 32px)',
              background: '#FFFFFF'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #533086 0%, #4A4DC9 100%)',
                padding: 'clamp(16px, 3vw, 24px) clamp(20px, 4vw, 32px)',
                borderBottom: '1px solid #C1C1EA'
              }}>
                <h2 style={{
                  fontSize: 'clamp(20px, 4vw, 28px)',
                  color: '#FFFFFF',
                  fontWeight: '600',
                  margin: 0,
                  lineHeight: '1.3',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  💰 Bank Account Transactions
                </h2>
              </div>
              <div style={{
                padding: 'clamp(20px, 4vw, 32px)'
              }}>
                <div style={{
                  background: '#FFF3E4',
                  padding: 'clamp(16px, 3vw, 20px)',
                  borderRadius: 'clamp(8px, 1.5vw, 12px)',
                  marginBottom: 'clamp(20px, 4vw, 28px)'
                }}>
                  <p style={{
                    color: '#533086',
                    fontWeight: '600',
                    marginBottom: 'clamp(8px, 1.5vw, 10px)',
                    fontSize: 'clamp(15px, 3vw, 18px)',
                    margin: '0 0 clamp(8px, 1.5vw, 10px) 0',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Real-World Scenario:
                  </p>
                  <p style={{
                    color: '#4E4E4E',
                    margin: 0,
                    lineHeight: '1.6',
                    fontSize: 'clamp(14px, 2.5vw, 16px)',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Track your bank account balance using integers. Deposits are positive numbers and withdrawals are negative numbers.
                  </p>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
                  gap: 'clamp(12px, 3vw, 16px)',
                  marginBottom: 'clamp(20px, 4vw, 24px)'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'clamp(13px, 2.5vw, 15px)',
                      fontWeight: '500',
                      marginBottom: 'clamp(8px, 1.5vw, 10px)',
                      color: '#533086',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Starting Balance (₹)
                    </label>
                    <input
                      type="number"
                      value={bankBalance}
                      onChange={(e) => setBankBalance(e.target.value)}
                      style={{
                        width: '100%',
                        padding: 'clamp(10px, 2vw, 14px)',
                        border: '2px solid #EBEBEB',
                        borderRadius: 'clamp(8px, 1vw, 10px)',
                        fontSize: 'clamp(14px, 3vw, 16px)',
                        boxSizing: 'border-box',
                        fontFamily: 'Poppins, sans-serif',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'clamp(13px, 2.5vw, 15px)',
                      fontWeight: '500',
                      marginBottom: 'clamp(8px, 1.5vw, 10px)',
                      color: '#533086',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Deposit Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={deposit}
                      onChange={(e) => setDeposit(e.target.value)}
                      placeholder="0"
                      style={{
                        width: '100%',
                        padding: 'clamp(10px, 2vw, 14px)',
                        border: '2px solid #EBEBEB',
                        borderRadius: 'clamp(8px, 1vw, 10px)',
                        fontSize: 'clamp(14px, 3vw, 16px)',
                        boxSizing: 'border-box',
                        fontFamily: 'Poppins, sans-serif',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'clamp(13px, 2.5vw, 15px)',
                      fontWeight: '500',
                      marginBottom: 'clamp(8px, 1.5vw, 10px)',
                      color: '#533086',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Withdrawal Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={withdrawal}
                      onChange={(e) => setWithdrawal(e.target.value)}
                      placeholder="0"
                      style={{
                        width: '100%',
                        padding: 'clamp(10px, 2vw, 14px)',
                        border: '2px solid #EBEBEB',
                        borderRadius: 'clamp(8px, 1vw, 10px)',
                        fontSize: 'clamp(14px, 3vw, 16px)',
                        boxSizing: 'border-box',
                        fontFamily: 'Poppins, sans-serif',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={calculateBankBalance}
                  style={{
                    width: '100%',
                    background: '#4A4DC9',
                    color: 'white',
                    padding: 'clamp(12px, 2.5vw, 14px) clamp(20px, 4vw, 24px)',
                    border: 'none',
                    borderRadius: 'clamp(8px, 1vw, 10px)',
                    fontSize: 'clamp(15px, 3vw, 17px)',
                    fontWeight: '500',
                    cursor: 'pointer',
                    marginBottom: 'clamp(20px, 4vw, 24px)',
                    fontFamily: 'Poppins, sans-serif',
                    boxShadow: '0 4px 12px rgba(74, 77, 201, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Calculate Final Balance
                </button>

                {finalBalance !== null && (
                  <div style={{
                    background: '#C1C1EA',
                    padding: 'clamp(16px, 3vw, 20px)',
                    borderRadius: 'clamp(8px, 1.5vw, 12px)',
                    border: '2px solid #4A4DC9'
                  }}>
                    <p style={{
                      color: '#533086',
                      fontWeight: '600',
                      marginBottom: 'clamp(8px, 1.5vw, 10px)',
                      fontSize: 'clamp(16px, 3vw, 18px)',
                      margin: '0 0 clamp(8px, 1.5vw, 10px) 0',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Result:
                    </p>
                    <p style={{
                      color: '#4E4E4E',
                      margin: '0 0 clamp(8px, 1.5vw, 10px) 0',
                      fontSize: 'clamp(14px, 2.5vw, 15px)',
                      lineHeight: '1.5',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      <strong>Calculation:</strong> ₹{bankBalance} + ₹{deposit || 0} - ₹{withdrawal || 0} = ₹{finalBalance}
                    </p>
                    <p style={{
                      color: '#4E4E4E',
                      margin: 0,
                      fontSize: 'clamp(14px, 2.5vw, 15px)',
                      lineHeight: '1.5',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Your final balance is <strong>₹{finalBalance}</strong>
                    </p>
                  </div>
                )}

                <div style={{
                  background: '#FFF3E4',
                  padding: 'clamp(16px, 3vw, 20px)',
                  borderRadius: 'clamp(8px, 1.5vw, 12px)',
                  marginTop: 'clamp(20px, 4vw, 28px)'
                }}>
                  <p style={{
                    fontWeight: '600',
                    color: '#533086',
                    marginBottom: 'clamp(8px, 1.5vw, 10px)',
                    fontSize: 'clamp(15px, 3vw, 18px)',
                    margin: '0 0 clamp(8px, 1.5vw, 10px) 0',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    💡 Understanding with Integers:
                  </p>
                  <p style={{
                    color: '#4E4E4E',
                    margin: 0,
                    lineHeight: '1.6',
                    fontSize: 'clamp(14px, 2.5vw, 15px)',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Deposits add to your balance (positive integers), while withdrawals subtract from it (negative integers). 
                    The final balance shows the net result of all transactions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Elevation Example */}
          {realWorldStep === 2 && (
            <div style={{
              border: '2px solid #FFF3E4',
              borderRadius: 'clamp(12px, 2vw, 16px)',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(255, 114, 18, 0.1)',
              marginBottom: 'clamp(20px, 4vw, 32px)',
              background: '#FFFFFF'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #FF7212 0%, #FC9145 100%)',
                padding: 'clamp(16px, 3vw, 24px) clamp(20px, 4vw, 32px)',
                borderBottom: '1px solid #FFF3E4'
              }}>
                <h2 style={{
                  fontSize: 'clamp(20px, 4vw, 28px)',
                  color: '#FFFFFF',
                  fontWeight: '600',
                  margin: 0,
                  lineHeight: '1.3',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  ⛰️ Sea Level and Elevation
                </h2>
              </div>
              <div style={{
                padding: 'clamp(20px, 4vw, 32px)'
              }}>
                <div style={{
                  background: '#C1C1EA',
                  padding: 'clamp(16px, 3vw, 20px)',
                  borderRadius: 'clamp(8px, 1.5vw, 12px)',
                  marginBottom: 'clamp(20px, 4vw, 28px)'
                }}>
                  <p style={{
                    color: '#533086',
                    fontWeight: '600',
                    marginBottom: 'clamp(8px, 1.5vw, 10px)',
                    fontSize: 'clamp(15px, 3vw, 18px)',
                    margin: '0 0 clamp(8px, 1.5vw, 10px) 0',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Real-World Scenario:
                  </p>
                  <p style={{
                    color: '#4E4E4E',
                    margin: 0,
                    lineHeight: '1.6',
                    fontSize: 'clamp(14px, 2.5vw, 16px)',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Sea level is at 0. Elevations above sea level are positive, and depths below sea level are negative.
                  </p>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                  gap: 'clamp(12px, 3vw, 16px)',
                  marginBottom: 'clamp(20px, 4vw, 24px)'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'clamp(13px, 2.5vw, 15px)',
                      fontWeight: '500',
                      marginBottom: 'clamp(8px, 1.5vw, 10px)',
                      color: '#533086',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Current Position (m)
                    </label>
                    <input
                      type="number"
                      value={seaLevel}
                      onChange={(e) => setSeaLevel(e.target.value)}
                      style={{
                        width: '100%',
                        padding: 'clamp(10px, 2vw, 14px)',
                        border: '2px solid #EBEBEB',
                        borderRadius: 'clamp(8px, 1vw, 10px)',
                        fontSize: 'clamp(14px, 3vw, 16px)',
                        boxSizing: 'border-box',
                        fontFamily: 'Poppins, sans-serif',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'clamp(13px, 2.5vw, 15px)',
                      fontWeight: '500',
                      marginBottom: 'clamp(8px, 1.5vw, 10px)',
                      color: '#533086',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Elevation Change (m)
                    </label>
                    <input
                      type="number"
                      value={elevationChange}
                      onChange={(e) => setElevationChange(e.target.value)}
                      placeholder="e.g., 500 or -300"
                      style={{
                        width: '100%',
                        padding: 'clamp(10px, 2vw, 14px)',
                        border: '2px solid #EBEBEB',
                        borderRadius: 'clamp(8px, 1vw, 10px)',
                        fontSize: 'clamp(14px, 3vw, 16px)',
                        boxSizing: 'border-box',
                        fontFamily: 'Poppins, sans-serif',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={calculateElevation}
                  style={{
                    width: '100%',
                    background: '#FF7212',
                    color: 'white',
                    padding: 'clamp(12px, 2.5vw, 14px) clamp(20px, 4vw, 24px)',
                    border: 'none',
                    borderRadius: 'clamp(8px, 1vw, 10px)',
                    fontSize: 'clamp(15px, 3vw, 17px)',
                    fontWeight: '500',
                    cursor: 'pointer',
                    marginBottom: 'clamp(20px, 4vw, 24px)',
                    fontFamily: 'Poppins, sans-serif',
                    boxShadow: '0 4px 12px rgba(255, 114, 18, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Calculate Final Elevation
                </button>

                {finalElevation !== null && (
                  <div style={{
                    background: '#FFF3E4',
                    padding: 'clamp(16px, 3vw, 20px)',
                    borderRadius: 'clamp(8px, 1.5vw, 12px)',
                    border: '2px solid #FF7212'
                  }}>
                    <p style={{
                      color: '#533086',
                      fontWeight: '600',
                      marginBottom: 'clamp(8px, 1.5vw, 10px)',
                      fontSize: 'clamp(16px, 3vw, 18px)',
                      margin: '0 0 clamp(8px, 1.5vw, 10px) 0',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Result:
                    </p>
                    <p style={{
                      color: '#4E4E4E',
                      margin: '0 0 clamp(8px, 1.5vw, 10px) 0',
                      fontSize: 'clamp(14px, 2.5vw, 15px)',
                      lineHeight: '1.5',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      <strong>Calculation:</strong> {seaLevel}m + {elevationChange}m = {finalElevation}m
                    </p>
                    <p style={{
                      color: '#4E4E4E',
                      margin: 0,
                      fontSize: 'clamp(14px, 2.5vw, 15px)',
                      lineHeight: '1.5',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Final elevation: <strong>{finalElevation}m</strong> {finalElevation > 0 ? 'above' : finalElevation < 0 ? 'below' : 'at'} sea level
                    </p>
                  </div>
                )}

                <div style={{
                  background: '#C1C1EA',
                  padding: 'clamp(16px, 3vw, 20px)',
                  borderRadius: 'clamp(8px, 1.5vw, 12px)',
                  marginTop: 'clamp(20px, 4vw, 28px)'
                }}>
                  <p style={{
                    fontWeight: '600',
                    color: '#533086',
                    marginBottom: 'clamp(8px, 1.5vw, 10px)',
                    fontSize: 'clamp(15px, 3vw, 18px)',
                    margin: '0 0 clamp(8px, 1.5vw, 10px) 0',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    💡 Understanding with Integers:
                  </p>
                  <p style={{
                    color: '#4E4E4E',
                    margin: 0,
                    lineHeight: '1.6',
                    fontSize: 'clamp(14px, 2.5vw, 15px)',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Positive integers represent heights above sea level, negative integers represent depths below sea level, 
                    and zero represents sea level itself.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Navigation Buttons matching PDF design */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'clamp(20px, 4vw, 32px)',
        gap: 'clamp(10px, 2vw, 16px)',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={handlePrevious}
          disabled={isFirstStep()}
          style={{
            background: isFirstStep() ? '#EBEBEB' : '#4A4DC9',
            color: isFirstStep() ? '#CACACA' : 'white',
            padding: 'clamp(10px, 2vw, 12px) clamp(16px, 3vw, 24px)',
            border: 'none',
            borderRadius: 'clamp(8px, 1vw, 10px)',
            fontSize: 'clamp(14px, 3vw, 16px)',
            fontWeight: '500',
            cursor: isFirstStep() ? 'not-allowed' : 'pointer',
            flex: '1 1 auto',
            minWidth: 'clamp(120px, 30vw, 140px)',
            maxWidth: '220px',
            boxShadow: isFirstStep() ? 'none' : '0 4px 12px rgba(74, 77, 201, 0.3)',
            transition: 'all 0.3s ease'
          }}
        >
          ← Previous
        </button>

        <div style={{
          flex: '1 1 auto',
          textAlign: 'center',
          fontSize: 'clamp(14px, 3vw, 16px)',
          fontWeight: '600',
          color: '#533086',
          minWidth: 'clamp(100px, 25vw, 120px)'
        }}>
          Step {getCurrentStep()} of {getTotalSteps()}
        </div>

        <button
          onClick={handleNext}
          disabled={isLastStep()}
          style={{
            background: isLastStep() ? '#EBEBEB' : '#4A4DC9',
            color: isLastStep() ? '#CACACA' : 'white',
            padding: 'clamp(10px, 2vw, 12px) clamp(16px, 3vw, 24px)',
            border: 'none',
            borderRadius: 'clamp(8px, 1vw, 10px)',
            fontSize: 'clamp(14px, 3vw, 16px)',
            fontWeight: '500',
            cursor: isLastStep() ? 'not-allowed' : 'pointer',
            flex: '1 1 auto',
            minWidth: 'clamp(120px, 30vw, 140px)',
            maxWidth: '220px',
            boxShadow: isLastStep() ? 'none' : '0 4px 12px rgba(74, 77, 201, 0.3)',
            transition: 'all 0.3s ease'
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default RecapIntegers;