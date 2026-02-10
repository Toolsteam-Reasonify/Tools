import React, { useState, useRef } from 'react';
import { Flame, Play, Pause, RotateCcw, ChevronRight, ChevronLeft, CheckCircle, XCircle, Award, ChevronDown } from 'lucide-react';

// Type Definitions
export type QuestionType = 'mcq' | 'true-false';
export type Difficulty = 'easy' | 'medium' | 'hard';

// Interfaces
export interface Question {
  id: number;
  question: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string | boolean;
  explanation: string;
  difficulty: Difficulty;
  points: number;
}

interface RealWorldApplication {
  id: number;
  category: 'nature' | 'home' | 'everyday' | 'technology';
  title: string;
  description: string;
  howItWorks: string;
  example: string;
  icon: string;
}

// Navbar
interface NavbarProps {
  mode: 'learn' | 'practice' | 'applications';
  setMode: (mode: 'learn' | 'practice' | 'applications') => void;
}

const Navbar: React.FC<NavbarProps> = ({ mode, setMode }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-teal-50 via-purple-50 to-teal-50 border-b border-teal-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
            <span className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
              Heat Transfer
            </span>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setMode('learn')}
              className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                mode === 'learn' ? 'bg-teal-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>📚</span>
              <span>Learn</span>
            </button>

            <button
              onClick={() => setMode('practice')}
              className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                mode === 'practice' ? 'bg-purple-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>🎯</span>
              <span>Practice</span>
            </button>

            <button
              onClick={() => setMode('applications')}
              className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                mode === 'applications' ? 'bg-gradient-to-r from-teal-500 to-purple-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>🌍</span>
              <span>Real World</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// LEARN MODE
const RadiationLearnMode: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { 
      title: "What is Radiation?", 
      desc: "Pema and Palden sit by a fireplace and feel warm without touching it. Heat travels directly from fire to them by RADIATION - no medium needed!", 
      vis: "🔥" 
    },
    { 
      title: "Heat from the Sun", 
      desc: "The Sun is 150 million km away, yet we feel its warmth. Radiation travels through the vacuum of space!", 
      vis: "☀️" 
    },
    { 
      title: "All Objects Radiate", 
      desc: "A hot utensil cools down by radiating heat to cooler surroundings. All objects exchange heat through radiation.", 
      vis: "🍳" 
    },
    { 
      title: "Color & Heat", 
      desc: "Light colors REFLECT heat (cool in summer). Dark colors ABSORB heat (warm in winter).", 
      vis: "👕" 
    },
    { 
      title: "Unique Property", 
      desc: "CONDUCTION: needs contact. CONVECTION: needs medium. RADIATION: works in vacuum too!", 
      vis: "✨" 
    },
    { 
      title: "Daily Examples", 
      desc: "Fireplace warmth, drying clothes, solar cookers, thermal cameras - radiation is everywhere!", 
      vis: "🌍" 
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 text-center bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent leading-tight">
        Topic 7.3: Radiation
      </h1>
      <p className="text-center text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Heat Transfer Without Any Medium</p>

      <div className="mb-4">
        <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
          <div 
            className="bg-gradient-to-r from-teal-500 to-purple-500 h-2 sm:h-3 rounded-full transition-all" 
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} 
          />
        </div>
      </div>

      <div className="bg-gradient-to-br from-teal-50 to-purple-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
          <span className="text-3xl sm:text-4xl md:text-5xl">{steps[currentStep].vis}</span>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-teal-700 leading-tight">{steps[currentStep].title}</h2>
        </div>
        <p className="text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed">{steps[currentStep].desc}</p>
        
        <div className="bg-white rounded-lg p-3 sm:p-4 mt-3 sm:mt-4 h-36 sm:h-48 flex items-center justify-center border-2 border-gray-200">
          <div className="text-center">
            <div className="text-4xl sm:text-5xl md:text-6xl mb-2">{steps[currentStep].vis}</div>
            <p className="text-xs sm:text-sm text-gray-600">Interactive Animation Area</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
        <button
          onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
          disabled={currentStep === 0}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all ${
            currentStep === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-teal-500 text-white hover:bg-teal-600'
          }`}
        >
          <ChevronLeft size={16} className="sm:w-5 sm:h-5" /> Previous
        </button>

        <div className="flex gap-1.5 sm:gap-2">
          {steps.map((_, i) => (
            <div key={i} className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${i === currentStep ? 'bg-teal-500 w-6 sm:w-8' : 'bg-gray-300'}`} />
          ))}
        </div>

        <button
          onClick={() => currentStep < steps.length - 1 && setCurrentStep(currentStep + 1)}
          disabled={currentStep === steps.length - 1}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all ${
            currentStep === steps.length - 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-purple-500 text-white hover:bg-purple-600'
          }`}
        >
          {currentStep === steps.length - 1 ? 'Finish' : 'Next'} <ChevronRight size={16} className="sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};

// PRACTICE MODE  
const RadiationPracticeMode: React.FC = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const questions: Question[] = [
    { 
      id: 1, 
      question: "How does heat from the Sun reach Earth?", 
      type: "mcq", 
      options: ["Conduction", "Convection", "Radiation", "Air molecules"], 
      correctAnswer: "Radiation", 
      explanation: "Heat travels through the vacuum of space by radiation, which doesn't need any medium.", 
      difficulty: "easy", 
      points: 10 
    },
    { 
      id: 2, 
      question: "Radiation requires a medium to transfer heat.", 
      type: "true-false", 
      correctAnswer: false, 
      explanation: "FALSE. Radiation does NOT need a medium - it can travel through vacuum.", 
      difficulty: "easy", 
      points: 10 
    },
    { 
      id: 3, 
      question: "Which color absorbs more heat?", 
      type: "mcq", 
      options: ["White", "Black", "Red", "Yellow"], 
      correctAnswer: "Black", 
      explanation: "Black (dark) surfaces absorb more heat, while light colors reflect heat.", 
      difficulty: "easy", 
      points: 10 
    },
    { 
      id: 4, 
      question: "Why do we wear light-colored clothes in summer?", 
      type: "mcq", 
      options: ["They absorb more heat", "They reflect most of the heat", "They conduct heat better", "They are thinner"], 
      correctAnswer: "They reflect most of the heat", 
      explanation: "Light-colored clothes reflect heat, keeping you cool in summer.", 
      difficulty: "medium", 
      points: 15 
    },
    { 
      id: 5, 
      question: "All objects radiate heat to their surroundings.", 
      type: "true-false", 
      correctAnswer: true, 
      explanation: "TRUE. All objects continuously radiate heat to their surroundings.", 
      difficulty: "medium", 
      points: 15 
    },
    { 
      id: 6, 
      question: "What happens when a hot utensil is kept away from the flame?", 
      type: "mcq", 
      options: ["It stays hot forever", "It cools down by radiating heat", "It absorbs more heat", "Nothing happens"], 
      correctAnswer: "It cools down by radiating heat", 
      explanation: "The hot utensil cools down by radiating heat to its cooler surroundings.", 
      difficulty: "medium", 
      points: 15 
    },
    { 
      id: 7, 
      question: "Which heat transfer process can work in a vacuum?", 
      type: "mcq", 
      options: ["Conduction", "Convection", "Radiation", "None"], 
      correctAnswer: "Radiation", 
      explanation: "Only radiation can transfer heat through vacuum - conduction and convection need matter.", 
      difficulty: "hard", 
      points: 20 
    },
    { 
      id: 8, 
      question: "When sitting near a fireplace, you feel warm due to convection.", 
      type: "true-false", 
      correctAnswer: false, 
      explanation: "FALSE. You feel warm primarily due to RADIATION from the fire.", 
      difficulty: "hard", 
      points: 20 
    }
  ];

  const currentQuestion = questions[currentQ];
  const isCorrect = answered && selected === String(currentQuestion.correctAnswer);

  if (showResults) {
    const maxScore = questions.reduce((s, q) => s + q.points, 0);
    const percentage = Math.round((score / maxScore) * 100);
    const grade = percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : percentage >= 60 ? 'D' : 'F';

    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-6 sm:p-8 text-center">
        <Award className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto text-yellow-500 mb-3 sm:mb-4" />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-teal-700">Your Final Score</h1>
        <div className="bg-gradient-to-br from-teal-50 to-purple-50 rounded-lg sm:rounded-xl p-6 sm:p-8 mb-4 sm:mb-6">
          <div className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-4 text-purple-600">{percentage}%</div>
          <div className="text-lg sm:text-xl md:text-2xl mb-2">{score} / {maxScore} Points</div>
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-teal-600 mt-3 sm:mt-4">Grade: {grade}</div>
        </div>
        <button
          onClick={() => { 
            setCurrentQ(0); 
            setSelected(null); 
            setAnswered(false); 
            setScore(0); 
            setShowResults(false); 
          }}
          className="flex items-center gap-2 mx-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-teal-500 to-purple-500 text-white rounded-lg text-sm sm:text-base font-medium hover:shadow-lg transition-all"
        >
          <RotateCcw size={16} className="sm:w-5 sm:h-5" /> Restart Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
          Radiation Practice Quiz
        </h1>
        <div className="text-right">
          <div className="text-xs sm:text-sm text-gray-600">Score</div>
          <div className="text-xl sm:text-2xl font-bold text-purple-600">{score}</div>
        </div>
      </div>

      <div className="mb-4 sm:mb-6">
        <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
          <span>Question {currentQ + 1} of {questions.length}</span>
          <span>{currentQuestion.points} Points</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
          <div 
            className="bg-gradient-to-r from-teal-500 to-purple-500 h-1.5 sm:h-2 rounded-full transition-all" 
            style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} 
          />
        </div>
      </div>

      <div className="bg-gradient-to-br from-teal-50 to-purple-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
        <div className={`px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4 inline-block ${
          currentQuestion.difficulty === 'easy' ? 'bg-green-200 text-green-700' : 
          currentQuestion.difficulty === 'medium' ? 'bg-yellow-200 text-yellow-700' : 
          'bg-red-200 text-red-700'
        }`}>
          {currentQuestion.difficulty.toUpperCase()}
        </div>
        <h2 className="text-base sm:text-lg md:text-xl font-bold mb-4 sm:mb-6 text-gray-800 leading-snug">{currentQuestion.question}</h2>

        <div className="space-y-2 sm:space-y-3">
          {currentQuestion.type === 'mcq' && currentQuestion.options?.map((opt, i) => (
            <button
              key={i}
              onClick={() => !answered && setSelected(opt)}
              disabled={answered}
              className={`w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all ${
                selected === opt ? 
                  (answered ? 
                    (opt === currentQuestion.correctAnswer ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') 
                    : 'border-purple-500 bg-purple-50'
                  ) : 'border-gray-200 hover:border-purple-300'
              } ${answered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex justify-between items-center gap-2">
                <span className="text-sm sm:text-base font-medium">{opt}</span>
                {answered && opt === currentQuestion.correctAnswer && <CheckCircle className="text-green-500 flex-shrink-0" size={20} />}
                {answered && selected === opt && opt !== currentQuestion.correctAnswer && <XCircle className="text-red-500 flex-shrink-0" size={20} />}
              </div>
            </button>
          ))}

          {currentQuestion.type === 'true-false' && ['true', 'false'].map(val => (
            <button
              key={val}
              onClick={() => !answered && setSelected(val)}
              disabled={answered}
              className={`w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all ${
                selected === val ? 
                  (answered ? 
                    (currentQuestion.correctAnswer === (val === 'true') ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') 
                    : 'border-purple-500 bg-purple-50'
                  ) : 'border-gray-200 hover:border-purple-300'
              } ${answered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex justify-between items-center gap-2">
                <span className="text-sm sm:text-base font-medium">{val === 'true' ? 'True ✓' : 'False ✗'}</span>
                {answered && currentQuestion.correctAnswer === (val === 'true') && <CheckCircle className="text-green-500 flex-shrink-0" size={20} />}
                {answered && selected === val && currentQuestion.correctAnswer !== (val === 'true') && <XCircle className="text-red-500 flex-shrink-0" size={20} />}
              </div>
            </button>
          ))}
        </div>

        {answered && (
          <div className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg border-l-4 ${isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? <CheckCircle className="text-green-600 flex-shrink-0" size={20} /> : <XCircle className="text-red-600 flex-shrink-0" size={20} />}
              <span className={`text-sm sm:text-base font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
        <div className="text-xs sm:text-sm text-gray-600 self-start sm:self-auto">{currentQ + 1} / {questions.length}</div>
        {!answered ? (
          <button
            onClick={() => { 
              if (selected) {
                setAnswered(true);
                if (selected === String(currentQuestion.correctAnswer)) {
                  setScore(score + currentQuestion.points);
                }
              }
            }}
            disabled={!selected}
            className={`w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all ${
              !selected ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-teal-500 to-purple-500 text-white hover:shadow-lg'
            }`}
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={() => {
              if (currentQ < questions.length - 1) { 
                setCurrentQ(currentQ + 1); 
                setSelected(null); 
                setAnswered(false); 
              } else {
                setShowResults(true);
              }
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-teal-500 to-purple-500 text-white rounded-lg text-sm sm:text-base font-medium hover:shadow-lg transition-all"
          >
            {currentQ === questions.length - 1 ? 'Finish Quiz' : 'Next Question'} <ChevronRight size={16} className="sm:w-5 sm:h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

// REAL WORLD MODE
const RadiationRealWorld: React.FC = () => {
  const [category, setCategory] = useState('all');
  const [expanded, setExpanded] = useState<number | null>(null);

  const apps: RealWorldApplication[] = [
    { 
      id: 1, 
      category: 'nature', 
      title: "Sun Warming Earth", 
      description: "Heat travels 150 million km through space", 
      howItWorks: "The Sun emits electromagnetic radiation that travels through the vacuum of space to reach Earth.", 
      example: "We feel warm in sunlight every day, even though space between Sun and Earth is a vacuum.", 
      icon: "☀️" 
    },
    { 
      id: 2, 
      category: 'home', 
      title: "Fireplace Warmth", 
      description: "Feel heat without touching fire", 
      howItWorks: "When wood burns, it releases heat energy as infrared radiation that travels in all directions.", 
      example: "Pema and Palden sitting around their fireplace feel warm because heat radiates directly from the fire.", 
      icon: "🔥" 
    },
    { 
      id: 3, 
      category: 'everyday', 
      title: "Drying Clothes in Sunlight", 
      description: "Clothes dry faster in the Sun", 
      howItWorks: "Solar radiation provides energy to water molecules, helping them evaporate faster.", 
      example: "In India, people dry clothes on rooftops. They dry much faster in direct sunlight.", 
      icon: "👕" 
    },
    { 
      id: 4, 
      category: 'everyday', 
      title: "White vs Black Clothing", 
      description: "Light colors keep you cool", 
      howItWorks: "Light surfaces reflect radiation while dark surfaces absorb it and convert it to heat.", 
      example: "Wearing white clothes in summer reflects Sun's heat. Dark clothes absorb heat - perfect for winter!", 
      icon: "🎽" 
    },
    { 
      id: 5, 
      category: 'technology', 
      title: "Solar Cookers", 
      description: "Cook food using only sunlight", 
      howItWorks: "Reflective surfaces concentrate sunlight onto a cooking pot. The concentrated radiation heats the pot.", 
      example: "Many villages in India use solar cookers. They're environmentally friendly and save cooking fuel.", 
      icon: "🍳" 
    },
    { 
      id: 6, 
      category: 'technology', 
      title: "Thermal Imaging Cameras", 
      description: "See heat with special cameras", 
      howItWorks: "All objects emit infrared radiation. Thermal cameras detect this and create heat images.", 
      example: "Doctors use thermal imaging to detect fever. Security forces use it to see in darkness.", 
      icon: "📷" 
    },
    { 
      id: 7, 
      category: 'home', 
      title: "Room Heaters", 
      description: "Electric heaters warm you directly", 
      howItWorks: "Electric heaters have hot coils that emit infrared radiation, warming whatever they hit.", 
      example: "When you stand in front of a heater, you feel warm immediately through direct radiation.", 
      icon: "🌡️" 
    },
    { 
      id: 8, 
      category: 'nature', 
      title: "Earth's Heat Balance", 
      description: "Planet maintains stable temperature", 
      howItWorks: "Earth receives radiation from the Sun and also radiates heat back into space.", 
      example: "During day, Earth absorbs solar radiation. At night, Earth radiates heat back to space.", 
      icon: "🌍" 
    },
    { 
      id: 9, 
      category: 'technology', 
      title: "Solar Panels", 
      description: "Converting sunlight to electricity", 
      howItWorks: "Solar panels contain materials that convert solar radiation directly into electrical energy.", 
      example: "Many homes in India have solar panels on roofs to generate electricity from sunlight.", 
      icon: "⚡" 
    },
    { 
      id: 10, 
      category: 'home', 
      title: "Greenhouse Effect", 
      description: "Keeping greenhouses warm", 
      howItWorks: "Glass allows solar radiation to enter but traps heat radiation inside.", 
      example: "Farmers use greenhouses to grow vegetables even in cold weather.", 
      icon: "🌱" 
    }
  ];

  const cats = [
    { id: 'all', name: 'All Applications', icon: '📋', shortName: 'All' },
    { id: 'nature', name: 'Nature', icon: '🌿', shortName: 'Nature' },
    { id: 'home', name: 'Home', icon: '🏠', shortName: 'Home' },
    { id: 'everyday', name: 'Everyday Life', icon: '👔', shortName: 'Daily' },
    { id: 'technology', name: 'Technology', icon: '💡', shortName: 'Tech' }
  ];

  const filtered = category === 'all' ? apps : apps.filter(a => a.category === category);

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
          Radiation in the Real World
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600">Discover How Radiation Works in Daily Life</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
        {cats.map(c => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              category === c.id ? 
                'bg-gradient-to-r from-teal-500 to-purple-500 text-white shadow-lg scale-105' : 
                'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="text-base sm:text-lg">{c.icon}</span>
            <span className="hidden xs:inline">{c.name}</span>
            <span className="xs:hidden">{c.shortName}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filtered.map(app => (
          <div
            key={app.id}
            className="bg-gradient-to-br from-teal-50 to-purple-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border-2 border-transparent hover:border-purple-300 transition-all cursor-pointer"
            onClick={() => setExpanded(expanded === app.id ? null : app.id)}
          >
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="text-3xl sm:text-4xl flex-shrink-0">{app.icon}</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-teal-700 mb-1 sm:mb-2 leading-tight">{app.title}</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-snug">{app.description}</p>
              </div>
              <ChevronDown 
                className={`text-purple-600 transition-transform flex-shrink-0 ${expanded === app.id ? 'rotate-180' : ''}`} 
                size={20} 
              />
            </div>

            {expanded === app.id && (
              <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4 animate-fadeIn">
                <div className="bg-white rounded-lg p-3 sm:p-4">
                  <h4 className="text-sm sm:text-base font-bold text-teal-600 mb-1.5 sm:mb-2">How It Works:</h4>
                  <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">{app.howItWorks}</p>
                </div>
                <div className="bg-white rounded-lg p-3 sm:p-4">
                  <h4 className="text-sm sm:text-base font-bold text-purple-600 mb-1.5 sm:mb-2">Real Example:</h4>
                  <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">{app.example}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-500 text-sm sm:text-base md:text-lg">No applications found in this category.</p>
        </div>
      )}
    </div>
  );
};

// Main Component
interface RadiationLearningProps {
  mode: 'learn' | 'practice' | 'applications';
  setMode: (m: 'learn' | 'practice' | 'applications') => void;
}

const RadiationLearning: React.FC<RadiationLearningProps> = ({ mode, setMode }) => (
  <>
    <Navbar mode={mode} setMode={setMode} />
    <div className="pt-16 sm:pt-20 px-3 sm:px-4 md:px-6 pb-6 sm:pb-8 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {mode === 'learn' && <RadiationLearnMode />}
      {mode === 'practice' && <RadiationPracticeMode />}
      {mode === 'applications' && <RadiationRealWorld />}
    </div>
  </>
);

// App wrapper
const App: React.FC = () => {
  const [mode, setMode] = useState<'learn' | 'practice' | 'applications'>('learn');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <RadiationLearning mode={mode} setMode={setMode} />
    </div>
  );
};

export default App;