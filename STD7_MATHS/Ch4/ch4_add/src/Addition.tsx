import React, { Component, ErrorInfo, ReactNode, createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Brain, ClipboardCheck, Globe } from 'lucide-react';

// ============================================================================
// CONTEXTS
// ============================================================================

// InterruptContext
interface InterruptContextType {
  isInterrupted: boolean;
  interruptedToolId: string | null;
  interruptTool: (toolId: string) => void;
  resumeTool: (toolId: string) => void;
  pauseAllTools: () => void;
  resumeAllTools: () => void;
}

const InterruptContext = createContext<InterruptContextType | undefined>(undefined);

export const useInterrupt = () => {
  const context = useContext(InterruptContext);
  if (!context) {
    throw new Error('useInterrupt must be used within an InterruptProvider');
  }
  return context;
};

interface InterruptProviderProps {
  children: ReactNode;
}

export const InterruptProvider: React.FC<InterruptProviderProps> = ({ children }) => {
  const [isInterrupted, setIsInterrupted] = useState(false);
  const [interruptedToolId, setInterruptedToolId] = useState<string | null>(null);

  const interruptTool = useCallback((toolId: string) => {
    setIsInterrupted(true);
    setInterruptedToolId(toolId);
  }, []);

  const resumeTool = useCallback((toolId: string) => {
    if (interruptedToolId === toolId) {
      setIsInterrupted(false);
      setInterruptedToolId(null);
    }
  }, [interruptedToolId]);

  const pauseAllTools = useCallback(() => {
    setIsInterrupted(true);
  }, []);

  const resumeAllTools = useCallback(() => {
    setIsInterrupted(false);
    setInterruptedToolId(null);
  }, []);

  const value: InterruptContextType = {
    isInterrupted,
    interruptedToolId,
    interruptTool,
    resumeTool,
    pauseAllTools,
    resumeAllTools
  };

  return (
    <InterruptContext.Provider value={value}>
      {children}
    </InterruptContext.Provider>
  );
};

// SessionContext
interface LearningSession {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  currentTool: string;
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  practiceResults: any[];
  sessionData: any;
  isActive: boolean;
}

interface SessionContextType {
  currentSession: LearningSession | null;
  startSession: (toolType: string, sessionData: any) => string;
  endSession: () => void;
  updateSessionProgress: (step: number, completed: boolean) => void;
  addPracticeResult: (result: any) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  isSessionActive: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [currentSession, setCurrentSession] = useState<LearningSession | null>(null);

  const startSession = useCallback((toolType: string, sessionData: any) => {
    const sessionId = `session_${Date.now()}`;
    const newSession: LearningSession = {
      sessionId,
      startTime: new Date(),
      currentTool: toolType,
      currentStep: 0,
      totalSteps: sessionData.demonstration?.steps.length || 0,
      completedSteps: [],
      practiceResults: [],
      sessionData,
      isActive: true
    };
    
    setCurrentSession(newSession);
    return sessionId;
  }, []);

  const endSession = useCallback(() => {
    if (currentSession) {
      setCurrentSession(prev => prev ? {
        ...prev,
        endTime: new Date(),
        isActive: false
      } : null);
    }
  }, [currentSession]);

  const updateSessionProgress = useCallback((step: number, completed: boolean) => {
    setCurrentSession(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        currentStep: step,
        completedSteps: completed 
          ? [...prev.completedSteps, step]
          : prev.completedSteps
      };
    });
  }, []);

  const addPracticeResult = useCallback((result: any) => {
    setCurrentSession(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        practiceResults: [...prev.practiceResults, result]
      };
    });
  }, []);

  const pauseSession = useCallback(() => {
    setCurrentSession(prev => prev ? { ...prev, isActive: false } : null);
  }, []);

  const resumeSession = useCallback(() => {
    setCurrentSession(prev => prev ? { ...prev, isActive: true } : null);
  }, []);

  const value: SessionContextType = {
    currentSession,
    startSession,
    endSession,
    updateSessionProgress,
    addPracticeResult,
    pauseSession,
    resumeSession,
    isSessionActive: currentSession?.isActive || false
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

// VisualizationStateContext
interface ToolState {
  toolId: string;
  toolType: string;
  isActive: boolean;
  isInterrupted: boolean;
  currentStep: number;
  totalSteps: number;
  progress: number;
  data: any;
  timestamp: string;
  canResume: boolean;
  mode: string;
  practiceResults?: any[];
}

interface VisualizationStateContextType {
  toolStates: { [toolId: string]: ToolState };
  setToolState: (toolId: string, state: ToolState) => void;
  getToolState: (toolId: string) => ToolState | undefined;
  clearToolState: (toolId: string) => void;
  getAllActiveTools: () => ToolState[];
}

const VisualizationStateContext = createContext<VisualizationStateContextType | undefined>(undefined);

export const useVisualizationState = () => {
  const context = useContext(VisualizationStateContext);
  if (!context) {
    throw new Error('useVisualizationState must be used within a VisualizationStateProvider');
  }
  return context;
};

interface VisualizationStateProviderProps {
  children: ReactNode;
}

export const VisualizationStateProvider: React.FC<VisualizationStateProviderProps> = ({ children }) => {
  const [toolStates, setToolStates] = useState<{ [toolId: string]: ToolState }>({});

  const setToolState = useCallback((toolId: string, state: ToolState) => {
    setToolStates(prev => ({
      ...prev,
      [toolId]: state
    }));
  }, []);

  const getToolState = useCallback((toolId: string) => {
    return toolStates[toolId];
  }, [toolStates]);

  const clearToolState = useCallback((toolId: string) => {
    setToolStates(prev => {
      const newStates = { ...prev };
      delete newStates[toolId];
      return newStates;
    });
  }, []);

  const getAllActiveTools = useCallback(() => {
    return Object.values(toolStates).filter(tool => tool.isActive);
  }, [toolStates]);

  const value: VisualizationStateContextType = {
    toolStates,
    setToolState,
    getToolState,
    clearToolState,
    getAllActiveTools
  };

  return (
    <VisualizationStateContext.Provider value={value}>
      {children}
    </VisualizationStateContext.Provider>
  );
};

// LanguageContext
interface LanguageContextType {
  language: 'en' | 'hi' | 'gu';
  setLanguage: (lang: 'en' | 'hi' | 'gu') => void;
  t: (key: string) => string;
  isTransitioning: boolean;
  localizeDigitsInText: (text: string) => string;
  formatNumber: (num: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Comprehensive translations
const translations = {
  en: {
    // Navigation
    home: 'Home',
    introduction: 'Introduction',
    learn: 'Learn',
    realWorld: 'Real World',
    simpleEquations: 'Simple Equations - Addition',
    simpleEquationsTitle: 'Simple Equations - Addition',
    
    // Home Page
    masterSimpleEquations: 'Master Simple Equations',
    masterClass7Mathematics: 'Master Class 7 Mathematics with interactive learning, practice exercises, and engaging games based on NCERT curriculum',
    startLearning: 'Start Learning',
    whatYoullLearn: 'What You\'ll Learn',
    comprehensiveTools: 'Comprehensive tools designed to make learning simple equations engaging and effective',
    introductionDesc: 'Learn the basics of simple equations with interactive examples',
    learnDesc: 'Step-by-step explanations with visual aids',
    practiceDesc: 'Solve exercises and check your solutions',
    realWorldDesc: 'See how equations apply in everyday life',
    practiceProblems: 'Practice Problems',
    interactiveExamples: 'Interactive Examples',
    readyToMaster: 'Ready to Master Simple Equations?',
    joinThousands: 'Join thousands of students and teachers who are making mathematics engaging and accessible.',
    startYourJourney: 'Start Your Journey',
    
    // Common
    correct: 'Correct!',
    incorrect: 'Try again!',
    learning: 'Learning',
    practice: 'Practice',
    assessment: 'Assessment',
    selectEquation: 'Select Equation:',
    yourAnswer: 'Your Answer:',
    submit: 'Submit',
    hint: 'Hint',
    progress: 'Progress:',
    accuracy: 'Accuracy',
    avgTime: 'Avg Time',
    correctAnswers: 'Correct',
    incorrectAnswers: 'Incorrect',
    totalExercises: 'Total',
    excellent: 'Excellent!',
    goodJob: 'Good Job!',
    keepTrying: 'Keep Trying!',
    showSolution: 'Show Solution',
    hideSolution: 'Hide Solution',
    reset: 'Reset',
    stepByStepSolution: 'Step-by-Step Solution:',
    nextStep: 'Next Step',
    complete: 'Complete',
    
    // Real World
    realWorldApps: 'Real World Applications',
    selectCategory: 'Select Category:',
    difficulty: 'Difficulty:',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    equation: 'Equation:',
    solution: 'Solution:',
    context: 'Context:',
    shopping: 'Shopping',
    cooking: 'Cooking',
    construction: 'Construction',
    sports: 'Sports',
    finance: 'Finance',
    science: 'Science',
    
    // Learn Section
    linearEquations: 'Linear Equations',
    linearEquationsDesc: 'Linear equations are equations where the highest power of the variable is 1. They can be solved using basic algebraic operations like addition, subtraction, multiplication, and division.',
    solvingByAddition: 'Solving by Addition',
    solvingByAdditionDesc: 'When we have subtraction in an equation, we add the same number to both sides to isolate the variable. This maintains the balance of the equation.',
    solvingBySubtraction: 'Solving by Subtraction',
    solvingBySubtractionDesc: 'When we have addition in an equation, we subtract the same number from both sides to isolate the variable. This maintains the balance of the equation.',
    solvingByMultiplication: 'Solving by Multiplication',
    solvingByMultiplicationDesc: 'When we have division in an equation, we multiply both sides by the same number to isolate the variable. This maintains the balance of the equation.',
    solvingByDivision: 'Solving by Division',
    solvingByDivisionDesc: 'When we have multiplication in an equation, we divide both sides by the same number to isolate the variable. This maintains the balance of the equation.',
    originalEquation: 'Original equation',
    originalEquationWithSubtraction: 'Original equation with subtraction',
    originalEquationWithAddition: 'Original equation with addition',
    originalEquationWithDivision: 'Original equation with division',
    originalEquationWithMultiplication: 'Original equation with multiplication',
    subtractFromBothSides: 'Subtract 5 from both sides',
    addToBothSides: 'Add 3 to both sides to isolate x',
    subtractFromBothSidesToIsolate: 'Subtract 4 from both sides to isolate x',
    multiplyBothSides: 'Multiply both sides by 3 to isolate x',
    divideBothSides: 'Divide both sides by 3 to isolate x',
    simplifyToFindAnswer: 'Simplify to find the answer',
    simplifyStep: 'Simplify: 5 - 5 = 0 and 12 - 5 = 7',
    verifySolution: 'Verify the solution by substituting x = 7',
    simplifyAdditionStep: 'Simplify: -3 + 3 = 0 and 8 + 3 = 11',
    verifyAdditionSolution: 'Verify the solution by substituting x = 11',
    simplifySubtractionStep: 'Simplify: 4 - 4 = 0 and 7 - 4 = 3',
    verifySubtractionSolution: 'Verify the solution by substituting x = 3',
    simplifyMultiplicationStep: 'Simplify: 3/3 = 1 and 4 × 3 = 12',
    verifyMultiplicationSolution: 'Verify the solution by substituting x = 12',
    simplifyDivisionStep: 'Simplify: 3x ÷ 3 = x and 15 ÷ 3 = 5',
    verifyDivisionSolution: 'Verify the solution by substituting x = 5',
    linearEquationExample: 'Linear Equation Example',
    additionMethodExample: 'Addition Method Example',
    subtractionMethodExample: 'Subtraction Method Example',
    multiplicationMethodExample: 'Multiplication Method Example',
    divisionMethodExample: 'Division Method Example',
    solving: 'Solving:',
    play: 'Play',
    pause: 'Pause',
    previous: 'Previous',
    next: 'Next',
    
    // Practice Mode
    practiceMode: 'Practice Mode',
    question: 'Question',
    skippedQuestions: 'Skipped Questions',
    notAttempted: 'Not Attempted',
    totalQuestions: 'Total Questions',
    finalGrade: 'Final Grade',
    accuracyRate: 'Accuracy Rate',
    avgTimePerQuestion: 'Avg Time/Question',
    questionByQuestionReview: 'Question by Question Review',
    startNewSession: 'Start New Session',
    loadingQuestions: 'Loading questions...',
    showAnswer: 'Show Answer',
    hideAnswer: 'Hide Answer',
    tryAgain: 'Try Again',
    skip: 'Skip',
    skipped: 'Skipped',
    sessionComplete: 'Session Complete!',
    sessionSummary: 'Here\'s your complete session summary',
    correctAnswer: 'Correct Answer',
    check: 'Check',
    notAttempt: 'Not Attempt',
    
    // Practice Questions
    practice_q1: 'Solve: x + 7 = 15',
    practice_q2: 'Solve: x + 4 = 12',
    practice_q3: 'Solve: x + 3 = 21',
    practice_q4: 'Solve: x + 2 = 8',
    practice_q5: 'Solve: x + 3 = 11',
    practice_q6: 'Solve: x + 5 = 9',
    practice_q7: 'Solve: x + 6 = 18',
    practice_q8: 'Solve: x + 2 = 7',
    practice_q9: 'Solve: x + 8 = 33',
    practice_q10: 'Solve: x + 7 = 13',
    practice_q11: 'Solve: x + 3 = 8',
    practice_q12: 'Solve: x + 12 = 30'
  },
  hi: {
    // Navigation
    home: 'होम',
    introduction: 'परिचय',
    learn: 'सीखें',
    realWorld: 'वास्तविक दुनिया',
    simpleEquations: 'सरल समीकरण - जोड़',
    simpleEquationsTitle: 'सरल समीकरण - जोड़',
    
    // Home Page
    masterSimpleEquations: 'सरल समीकरणों में महारत हासिल करें',
    masterClass7Mathematics: 'एनसीईआरटी पाठ्यक्रम के आधार पर इंटरैक्टिव सीखने, अभ्यास अभ्यास और आकर्षक गेम के साथ कक्षा 7 गणित में महारत हासिल करें',
    startLearning: 'सीखना शुरू करें',
    whatYoullLearn: 'आप क्या सीखेंगे',
    comprehensiveTools: 'सरल समीकरणों को सीखने को आकर्षक और प्रभावी बनाने के लिए डिज़ाइन किए गए व्यापक उपकरण',
    introductionDesc: 'इंटरैक्टिव उदाहरणों के साथ सरल समीकरणों की मूल बातें सीखें',
    learnDesc: 'दृश्य सहायता के साथ चरण-दर-चरण स्पष्टीकरण',
    practiceDesc: 'अभ्यास हल करें और अपने समाधान जांचें',
    realWorldDesc: 'देखें कि समीकरण रोजमर्रा की जिंदगी में कैसे लागू होते हैं',
    practiceProblems: 'अभ्यास समस्याएं',
    interactiveExamples: 'इंटरैक्टिव उदाहरण',
    readyToMaster: 'सरल समीकरणों में महारत हासिल करने के लिए तैयार हैं?',
    joinThousands: 'हजारों छात्रों और शिक्षकों में शामिल हों जो गणित को आकर्षक और सुलभ बना रहे हैं।',
    startYourJourney: 'अपनी यात्रा शुरू करें',
    
    // Common
    correct: 'सही!',
    incorrect: 'फिर कोशिश करें!',
    learning: 'सीखना',
    practice: 'अभ्यास',
    assessment: 'मूल्यांकन',
    selectEquation: 'समीकरण चुनें:',
    yourAnswer: 'आपका उत्तर:',
    submit: 'जमा करें',
    hint: 'संकेत',
    progress: 'प्रगति:',
    accuracy: 'सटीकता',
    avgTime: 'औसत समय',
    correctAnswers: 'सही',
    incorrectAnswers: 'गलत',
    totalExercises: 'कुल',
    excellent: 'उत्कृष्ट!',
    goodJob: 'अच्छा काम!',
    keepTrying: 'कोशिश करते रहें!',
    showSolution: 'समाधान दिखाएं',
    hideSolution: 'समाधान छुपाएं',
    reset: 'रीसेट',
    stepByStepSolution: 'चरण-दर-चरण समाधान:',
    nextStep: 'अगला चरण',
    complete: 'पूर्ण',
    
    // Real World
    realWorldApps: 'वास्तविक दुनिया के अनुप्रयोग',
    selectCategory: 'श्रेणी चुनें:',
    difficulty: 'कठिनाई:',
    beginner: 'शुरुआती',
    intermediate: 'मध्यम',
    advanced: 'उन्नत',
    equation: 'समीकरण:',
    solution: 'समाधान:',
    context: 'संदर्भ:',
    shopping: 'खरीदारी',
    cooking: 'खाना पकाना',
    construction: 'निर्माण',
    sports: 'खेल',
    finance: 'वित्त',
    science: 'विज्ञान',
    
    // Learn Section
    linearEquations: 'रैखिक समीकरण',
    linearEquationsDesc: 'रैखिक समीकरण वे समीकरण हैं जहाँ चर की सबसे बड़ी घात 1 है।',
    solvingByAddition: 'जोड़ द्वारा हल करना',
    solvingByAdditionDesc: 'जब हमारे पास समीकरण में घटाव होता है, तो हम चर को अलग करने के लिए दोनों पक्षों में समान संख्या जोड़ते हैं। यह समीकरण के संतुलन को बनाए रखता है।',
    solvingBySubtraction: 'घटाव द्वारा हल करना',
    solvingBySubtractionDesc: 'जब हमारे पास समीकरण में जोड़ होता है, तो हम चर को अलग करने के लिए दोनों पक्षों से समान संख्या घटाते हैं। यह समीकरण के संतुलन को बनाए रखता है।',
    solvingByMultiplication: 'गुणा द्वारा हल करना',
    solvingByMultiplicationDesc: 'जब हमारे पास समीकरण में भाग होता है, तो हम चर को अलग करने के लिए दोनों पक्षों को समान संख्या से गुणा करते हैं। यह समीकरण के संतुलन को बनाए रखता है।',
    solvingByDivision: 'भाग द्वारा हल करना',
    solvingByDivisionDesc: 'जब हमारे पास समीकरण में गुणा होता है, तो हम चर को अलग करने के लिए दोनों पक्षों को समान संख्या से भाग देते हैं। यह समीकरण के संतुलन को बनाए रखता है।',
    originalEquation: 'मूल समीकरण',
    originalEquationWithSubtraction: 'घटाव के साथ मूल समीकरण',
    originalEquationWithAddition: 'जोड़ के साथ मूल समीकरण',
    originalEquationWithDivision: 'भाग के साथ मूल समीकरण',
    originalEquationWithMultiplication: 'गुणा के साथ मूल समीकरण',
    subtractFromBothSides: 'दोनों पक्षों से 5 घटाएं',
    addToBothSides: 'x को अलग करने के लिए दोनों पक्षों में 3 जोड़ें',
    subtractFromBothSidesToIsolate: 'x को अलग करने के लिए दोनों पक्षों से 4 घटाएं',
    multiplyBothSides: 'x को अलग करने के लिए दोनों पक्षों को 3 से गुणा करें',
    divideBothSides: 'x को अलग करने के लिए दोनों पक्षों को 3 से भाग दें',
    simplifyToFindAnswer: 'उत्तर ज्ञात करने के लिए सरल करें',
    simplifyStep: 'सरल करें: 5 - 5 = 0 और 12 - 5 = 7',
    verifySolution: 'x = 7 प्रतिस्थापित करके समाधान सत्यापित करें',
    simplifyAdditionStep: 'सरल करें: -3 + 3 = 0 और 8 + 3 = 11',
    verifyAdditionSolution: 'x = 11 प्रतिस्थापित करके समाधान सत्यापित करें',
    simplifySubtractionStep: 'सरल करें: 4 - 4 = 0 और 7 - 4 = 3',
    verifySubtractionSolution: 'x = 3 प्रतिस्थापित करके समाधान सत्यापित करें',
    simplifyMultiplicationStep: 'सरल करें: 3/3 = 1 और 4 × 3 = 12',
    verifyMultiplicationSolution: 'x = 12 प्रतिस्थापित करके समाधान सत्यापित करें',
    simplifyDivisionStep: 'सरल करें: 3x ÷ 3 = x और 15 ÷ 3 = 5',
    verifyDivisionSolution: 'x = 5 प्रतिस्थापित करके समाधान सत्यापित करें',
    linearEquationExample: 'रैखिक समीकरण उदाहरण',
    additionMethodExample: 'जोड़ विधि उदाहरण',
    subtractionMethodExample: 'घटाव विधि उदाहरण',
    multiplicationMethodExample: 'गुणा विधि उदाहरण',
    divisionMethodExample: 'भाग विधि उदाहरण',
    solving: 'हल करना:',
    play: 'चलाएं',
    pause: 'रोकें',
    previous: 'पिछला',
    next: 'अगला',
    
    // Practice Mode
    practiceMode: 'अभ्यास मोड',
    question: 'प्रश्न',
    skippedQuestions: 'छोड़े गए प्रश्न',
    notAttempted: 'प्रयास नहीं किया',
    totalQuestions: 'कुल प्रश्न',
    finalGrade: 'अंतिम ग्रेड',
    accuracyRate: 'सटीकता दर',
    avgTimePerQuestion: 'प्रति प्रश्न औसत समय',
    questionByQuestionReview: 'प्रश्न दर प्रश्न समीक्षा',
    startNewSession: 'नया सत्र शुरू करें',
    loadingQuestions: 'प्रश्न लोड हो रहे हैं...',
    showAnswer: 'उत्तर दिखाएं',
    hideAnswer: 'उत्तर छुपाएं',
    tryAgain: 'फिर कोशिश करें',
    skip: 'छोड़ें',
    skipped: 'छोड़ा गया',
    sessionComplete: 'सत्र पूरा!',
    sessionSummary: 'यहाँ आपका पूरा सत्र सारांश है',
    correctAnswer: 'सही उत्तर',
    check: 'जांच',
    notAttempt: 'प्रयास नहीं करें',
    
    // Practice Questions
    practice_q1: 'हल करें: x + 7 = 15',
    practice_q2: 'हल करें: x + 4 = 12',
    practice_q3: 'हल करें: x + 3 = 21',
    practice_q4: 'हल करें: x + 2 = 8',
    practice_q5: 'हल करें: x + 3 = 11',
    practice_q6: 'हल करें: x + 5 = 9',
    practice_q7: 'हल करें: x + 6 = 18',
    practice_q8: 'हल करें: x + 2 = 7',
    practice_q9: 'हल करें: x + 8 = 33',
    practice_q10: 'हल करें: x + 7 = 13',
    practice_q11: 'हल करें: x + 3 = 8',
    practice_q12: 'हल करें: x + 12 = 30'
  },
  gu: {
    // Navigation
    home: 'ઘર',
    introduction: 'પરિચય',
    learn: 'શીખો',
    realWorld: 'વાસ્તવિક વિશ્વ',
    simpleEquations: 'સરળ સમીકરણો - ઉમેરણ',
    simpleEquationsTitle: 'સરળ સમીકરણો - ઉમેરણ',
    
    // Home Page
    masterSimpleEquations: 'સરળ સમીકરણોમાં નિપુણતા મેળવો',
    masterClass7Mathematics: 'એનસીઇઆરટી અભ્યાસક્રમના આધારે ઇન્ટરેક્ટિવ શીખવા, પ્રેક્ટિસ કસરતો અને આકર્ષક રમતો સાથે ધોરણ 7 ગણિતમાં નિપુણતા મેળવો',
    startLearning: 'શીખવાનું શરૂ કરો',
    whatYoullLearn: 'તમે શું શીખશો',
    comprehensiveTools: 'સરળ સમીકરણોને શીખવાનું આકર્ષક અને અસરકારક બનાવવા માટે ડિઝાઇન કરેલા વ્યાપક સાધનો',
    introductionDesc: 'ઇન્ટરેક્ટિવ ઉદાહરણો સાથે સરળ સમીકરણોની મૂળભૂત વાતો શીખો',
    learnDesc: 'વિઝ્યુઅલ સહાયતા સાથે પગલું-દર-પગલું સ્પષ્ટતા',
    practiceDesc: 'કસરતો હલ કરો અને તમારા ઉકેલો તપાસો',
    realWorldDesc: 'જુઓ કે સમીકરણો રોજિંદા જીવનમાં કેવી રીતે લાગુ પડે છે',
    practiceProblems: 'પ્રેક્ટિસ સમસ્યાઓ',
    interactiveExamples: 'ઇન્ટરેક્ટિવ ઉદાહરણો',
    readyToMaster: 'સરળ સમીકરણોમાં નિપુણતા મેળવવા માટે તૈયાર છો?',
    joinThousands: 'હજારો વિદ્યાર્થીઓ અને શિક્ષકોમાં જોડાઓ જે ગણિતને આકર્ષક અને સુલભ બનાવી રહ્યા છે.',
    startYourJourney: 'તમારી યાત્રા શરૂ કરો',
    
    // Common
    correct: 'સાચું!',
    incorrect: 'ફરી કોશિશ કરો!',
    learning: 'શીખવું',
    practice: 'પ્રેક્ટિસ',
    assessment: 'મૂલ્યાંકન',
    selectEquation: 'સમીકરણ પસંદ કરો:',
    yourAnswer: 'તમારો જવાબ:',
    submit: 'સબમિટ',
    hint: 'સંકેત',
    progress: 'પ્રગતિ:',
    accuracy: 'ચોકસાઈ',
    avgTime: 'સરેરાશ સમય',
    correctAnswers: 'સાચું',
    incorrectAnswers: 'ખોટું',
    totalExercises: 'કુલ',
    excellent: 'ઉત્તમ!',
    goodJob: 'સારું કામ!',
    keepTrying: 'કોશિશ કરતા રહો!',
    showSolution: 'ઉકેલ બતાવો',
    hideSolution: 'ઉકેલ છુપાવો',
    reset: 'રીસેટ',
    stepByStepSolution: 'પગલું-દર-પગલું ઉકેલ:',
    nextStep: 'આગળનું પગલું',
    complete: 'પૂર્ણ',
    
    // Real World
    realWorldApps: 'વાસ્તવિક વિશ્વના ઉપયોગો',
    selectCategory: 'શ્રેણી પસંદ કરો:',
    difficulty: 'મુશ્કેલી:',
    beginner: 'શરૂઆત',
    intermediate: 'મધ્યમ',
    advanced: 'અદ્યતન',
    equation: 'સમીકરણ:',
    solution: 'ઉકેલ:',
    context: 'સંદર્ભ:',
    shopping: 'ખરીદી',
    cooking: 'રસોઈ',
    construction: 'બાંધકામ',
    sports: 'રમત',
    finance: 'વિત્ત',
    science: 'વિજ્ઞાન',
    
    // Learn Section
    linearEquations: 'રેખીય સમીકરણો',
    linearEquationsDesc: 'રેખીય સમીકરણો એવા સમીકરણો છે જ્યાં ચલની સર્વોચ્ચ ઘાત 1 છે. તેમને જોડાણ, બાદબાકી, ગુણાકાર અને ભાગાકાર જેવી મૂળભૂત બીજગણિતીય ક્રિયાઓનો ઉપયોગ કરીને હલ કરી શકાય છે.',
    solvingByAddition: 'જોડાણ દ્વારા હલ કરવું',
    solvingByAdditionDesc: 'જ્યારે આપણી પાસે સમીકરણમાં બાદબાકી હોય છે, ત્યારે આપણે ચલને અલગ કરવા માટે બંને બાજુઓમાં સમાન સંખ્યા ઉમેરીએ છીએ. આ સમીકરણનું સંતુલન જાળવે છે.',
    solvingBySubtraction: 'બાદબાકી દ્વારા હલ કરવું',
    solvingBySubtractionDesc: 'જ્યારે આપણી પાસે સમીકરણમાં જોડાણ હોય છે, ત્યારે આપણે ચલને અલગ કરવા માટે બંને બાજુઓમાંથી સમાન સંખ્યા બાદ કરીએ છીએ. આ સમીકરણનું સંતુલન જાળવે છે.',
    solvingByMultiplication: 'ગુણાકાર દ્વારા હલ કરવું',
    solvingByMultiplicationDesc: 'જ્યારે આપણી પાસે સમીકરણમાં ભાગાકાર હોય છે, ત્યારે આપણે ચલને અલગ કરવા માટે બંને બાજુઓને સમાન સંખ્યા વડે ગુણીએ છીએ. આ સમીકરણનું સંતુલન જાળવે છે.',
    solvingByDivision: 'ભાગાકાર દ્વારા હલ કરવું',
    solvingByDivisionDesc: 'જ્યારે આપણી પાસે સમીકરણમાં ગુણાકાર હોય છે, ત્યારે આપણે ચલને અલગ કરવા માટે બંને બાજુઓને સમાન સંખ્યા વડે ભાગીએ છીએ. આ સમીકરણનું સંતુલન જાળવે છે.',
    originalEquation: 'મૂળ સમીકરણ',
    originalEquationWithSubtraction: 'બાદબાકી સાથે મૂળ સમીકરણ',
    originalEquationWithAddition: 'જોડાણ સાથે મૂળ સમીકરણ',
    originalEquationWithDivision: 'ભાગાકાર સાથે મૂળ સમીકરણ',
    originalEquationWithMultiplication: 'ગુણાકાર સાથે મૂળ સમીકરણ',
    subtractFromBothSides: 'બંને બાજુઓમાંથી 5 બાદ કરો',
    addToBothSides: 'x ને અલગ કરવા માટે બંને બાજુઓમાં 3 ઉમેરો',
    subtractFromBothSidesToIsolate: 'x ને અલગ કરવા માટે બંને બાજુઓમાંથી 4 બાદ કરો',
    multiplyBothSides: 'x ને અલગ કરવા માટે બંને બાજુઓને 3 વડે ગુણો',
    divideBothSides: 'x ને અલગ કરવા માટે બંને બાજુઓને 3 વડે ભાગો',
    simplifyToFindAnswer: 'જવાબ શોધવા માટે સરળ બનાવો',
    simplifyStep: 'સરળ બનાવો: 5 - 5 = 0 અને 12 - 5 = 7',
    verifySolution: 'x = 7 મૂકીને ઉકેલ ચકાસો',
    simplifyAdditionStep: 'સરળ બનાવો: -3 + 3 = 0 અને 8 + 3 = 11',
    verifyAdditionSolution: 'x = 11 મૂકીને ઉકેલ ચકાસો',
    simplifySubtractionStep: 'સરળ બનાવો: 4 - 4 = 0 અને 7 - 4 = 3',
    verifySubtractionSolution: 'x = 3 મૂકીને ઉકેલ ચકાસો',
    simplifyMultiplicationStep: 'સરળ બનાવો: 3/3 = 1 અને 4 × 3 = 12',
    verifyMultiplicationSolution: 'x = 12 મૂકીને ઉકેલ ચકાસો',
    simplifyDivisionStep: 'સરળ બનાવો: 3x ÷ 3 = x અને 15 ÷ 3 = 5',
    verifyDivisionSolution: 'x = 5 મૂકીને ઉકેલ ચકાસો',
    linearEquationExample: 'રેખીય સમીકરણ ઉદાહરણ',
    additionMethodExample: 'જોડાણ પદ્ધતિ ઉદાહરણ',
    subtractionMethodExample: 'બાદબાકી પદ્ધતિ ઉદાહરણ',
    multiplicationMethodExample: 'ગુણાકાર પદ્ધતિ ઉદાહરણ',
    divisionMethodExample: 'ભાગાકાર પદ્ધતિ ઉદાહરણ',
    solving: 'હલ કરવું:',
    play: 'ચલાવો',
    pause: 'રોકો',
    previous: 'પાછલું',
    next: 'આગળનું',
    
    // Practice Mode
    practiceMode: 'પ્રેક્ટિસ મોડ',
    question: 'પ્રશ્ન',
    skippedQuestions: 'છોડેલા પ્રશ્નો',
    notAttempted: 'પ્રયાસ નથી કર્યો',
    totalQuestions: 'કુલ પ્રશ્નો',
    finalGrade: 'અંતિમ ગ્રેડ',
    accuracyRate: 'ચોકસાઈ દર',
    avgTimePerQuestion: 'પ્રતિ પ્રશ્ન સરેરાશ સમય',
    questionByQuestionReview: 'પ્રશ્ન દર પ્રશ્ન સમીક્ષા',
    startNewSession: 'નવો સત્ર શરૂ કરો',
    loadingQuestions: 'પ્રશ્નો લોડ થઈ રહ્યા છે...',
    showAnswer: 'જવાબ બતાવો',
    hideAnswer: 'જવાબ છુપાવો',
    tryAgain: 'ફરી કોશિશ કરો',
    skip: 'છોડો',
    skipped: 'છોડાયેલું',
    sessionComplete: 'સત્ર પૂર્ણ!',
    sessionSummary: 'અહીં તમારો સંપૂર્ણ સત્ર સારાંશ છે',
    correctAnswer: 'સાચો જવાબ',
    check: 'તપાસ',
    notAttempt: 'પ્રયાસ ન કરો',
    
    // Practice Questions
    practice_q1: 'હલ કરો: x + 7 = 15',
    practice_q2: 'હલ કરો: x + 4 = 12',
    practice_q3: 'હલ કરો: x + 3 = 21',
    practice_q4: 'હલ કરો: x + 2 = 8',
    practice_q5: 'હલ કરો: x + 3 = 11',
    practice_q6: 'હલ કરો: x + 5 = 9',
    practice_q7: 'હલ કરો: x + 6 = 18',
    practice_q8: 'હલ કરો: x + 2 = 7',
    practice_q9: 'હલ કરો: x + 8 = 33',
    practice_q10: 'હલ કરો: x + 7 = 13',
    practice_q11: 'હલ કરો: x + 3 = 8',
    practice_q12: 'હલ કરો: x + 12 = 30'
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'hi' | 'gu'>(() => {
    // Load language from localStorage on initialization
    const savedLanguage = localStorage.getItem('selectedLanguage') as 'en' | 'hi' | 'gu' | null;
    return savedLanguage || 'en';
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const localizeDigitsInText = (text: string): string => {
    // For now, just return the text as-is
    // In a real implementation, this would convert digits to the appropriate script
    return text;
  };

  const formatNumber = (num: number): string => {
    return num.toString();
  };

  const handleSetLanguage = (lang: 'en' | 'hi' | 'gu') => {
    setIsTransitioning(true);
    // Save language to localStorage
    localStorage.setItem('selectedLanguage', lang);
    setTimeout(() => {
      setLanguage(lang);
      setIsTransitioning(false);
    }, 100); // Further reduced for smoother switching
  };

  const value: LanguageContextType = {
    language,
    setLanguage: handleSetLanguage,
    t,
    isTransitioning,
    localizeDigitsInText,
    formatNumber
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// UserProfileContext
interface UserProgress {
  toolType: string;
  progress: number;
  timeSpent: number;
  exercisesCompleted: number;
  accuracy: number;
  finalScore?: number;
  completed?: boolean;
  masteryLevel?: number;
}

interface UserProfile {
  userId: string;
  name: string;
  level: string;
  preferences: {
    language: 'en' | 'hi' | 'gu';
    theme: 'light' | 'dark';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  };
  progress: { [toolType: string]: UserProgress };
  totalTimeSpent: number;
  totalExercisesCompleted: number;
  averageAccuracy: number;
}

interface UserProfileContextType {
  userProfile: UserProfile;
  updateProgress: (progress: UserProgress) => void;
  trackToolUsage: (toolType: string) => void;
  updatePreferences: (preferences: Partial<UserProfile['preferences']>) => void;
  resetProgress: () => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

interface UserProfileProviderProps {
  children: ReactNode;
}

export const UserProfileProvider: React.FC<UserProfileProviderProps> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    userId: 'student_001',
    name: 'Student',
    level: 'beginner',
    preferences: {
      language: 'en',
      theme: 'light',
      difficulty: 'beginner'
    },
    progress: {},
    totalTimeSpent: 0,
    totalExercisesCompleted: 0,
    averageAccuracy: 0
  });

  const updateProgress = useCallback((progress: UserProgress) => {
    setUserProfile(prev => {
      const newProgress = { ...prev.progress, [progress.toolType]: progress };
      
      // Calculate totals
      const totalTimeSpent = Object.values(newProgress).reduce((sum, p) => sum + p.timeSpent, 0);
      const totalExercisesCompleted = Object.values(newProgress).reduce((sum, p) => sum + p.exercisesCompleted, 0);
      const averageAccuracy = Object.values(newProgress).reduce((sum, p) => sum + p.accuracy, 0) / Object.keys(newProgress).length || 0;
      
      return {
        ...prev,
        progress: newProgress,
        totalTimeSpent,
        totalExercisesCompleted,
        averageAccuracy
      };
    });
  }, []);

  const trackToolUsage = useCallback((toolType: string) => {
    setUserProfile(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        [toolType]: {
          ...prev.progress[toolType],
          toolType,
          progress: prev.progress[toolType]?.progress || 0,
          timeSpent: prev.progress[toolType]?.timeSpent || 0,
          exercisesCompleted: prev.progress[toolType]?.exercisesCompleted || 0,
          accuracy: prev.progress[toolType]?.accuracy || 0
        }
      }
    }));
  }, []);

  const updatePreferences = useCallback((preferences: Partial<UserProfile['preferences']>) => {
    setUserProfile(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...preferences }
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setUserProfile(prev => ({
      ...prev,
      progress: {},
      totalTimeSpent: 0,
      totalExercisesCompleted: 0,
      averageAccuracy: 0
    }));
  }, []);

  const value: UserProfileContextType = {
    userProfile,
    updateProgress,
    trackToolUsage,
    updatePreferences,
    resetProgress
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};

// ============================================================================
// DATA
// ============================================================================

// Problem interface
interface Problem {
  id: number;
  equation: string;
  solution: string;
  explanation: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

// Question interface
interface Question {
  id: number;
  question: string;
  options: string[];
  correct: string;
  explanation: string;
}

// Practice Problems Data
export const practiceProblems: Problem[] = [
  {
    id: 1,
    equation: 'x + 7 = 15',
    solution: '8',
    explanation: 'Subtract 7 from both sides: x + 7 - 7 = 15 - 7, so x = 8'
  },
  {
    id: 2,
    equation: 'y - 4 = 12',
    solution: '16',
    explanation: 'Add 4 to both sides: y - 4 + 4 = 12 + 4, so y = 16'
  },
  {
    id: 3,
    equation: '3z = 21',
    solution: '7',
    explanation: 'Divide both sides by 3: 3z ÷ 3 = 21 ÷ 3, so z = 7'
  },
  {
    id: 4,
    equation: 'w ÷ 5 = 4',
    solution: '20',
    explanation: 'Multiply both sides by 5: w ÷ 5 × 5 = 4 × 5, so w = 20'
  },
  {
    id: 5,
    equation: '2a + 3 = 11',
    solution: '4',
    explanation: 'Subtract 3 from both sides: 2a = 8, then divide by 2: a = 4'
  },
  {
    id: 6,
    equation: 'b - 6 = 14',
    solution: '20',
    explanation: 'Add 6 to both sides: b - 6 + 6 = 14 + 6, so b = 20'
  },
  {
    id: 7,
    equation: '4c = 28',
    solution: '7',
    explanation: 'Divide both sides by 4: 4c ÷ 4 = 28 ÷ 4, so c = 7'
  },
  {
    id: 8,
    equation: 'd ÷ 3 = 6',
    solution: '18',
    explanation: 'Multiply both sides by 3: d ÷ 3 × 3 = 6 × 3, so d = 18'
  },
  {
    id: 9,
    equation: 'e + 9 = 17',
    solution: '8',
    explanation: 'Subtract 9 from both sides: e + 9 - 9 = 17 - 9, so e = 8'
  },
  {
    id: 10,
    equation: 'f - 8 = 12',
    solution: '20',
    explanation: 'Add 8 to both sides: f - 8 + 8 = 12 + 8, so f = 20'
  },
  {
    id: 11,
    equation: '5x + 2 = 27',
    solution: '5',
    explanation: 'Subtract 2 from both sides: 5x = 25, then divide by 5: x = 5'
  },
  {
    id: 12,
    equation: '3y - 7 = 14',
    solution: '7',
    explanation: 'Add 7 to both sides: 3y = 21, then divide by 3: y = 7'
  },
  {
    id: 13,
    equation: '2z + 5 = 19',
    solution: '7',
    explanation: 'Subtract 5 from both sides: 2z = 14, then divide by 2: z = 7'
  },
  {
    id: 14,
    equation: '4w - 3 = 13',
    solution: '4',
    explanation: 'Add 3 to both sides: 4w = 16, then divide by 4: w = 4'
  },
  {
    id: 15,
    equation: '6a + 4 = 28',
    solution: '4',
    explanation: 'Subtract 4 from both sides: 6a = 24, then divide by 6: a = 4'
  }
];

// Assessment Questions Data
export const assessmentQuestions: Question[] = [
  {
    id: 1,
    question: 'What is the value of x in the equation x + 5 = 12?',
    options: ['5', '6', '7', '8'],
    correct: '7',
    explanation: 'Subtract 5 from both sides: x + 5 - 5 = 12 - 5, so x = 7'
  },
  {
    id: 2,
    question: 'Solve for y: y - 3 = 8',
    options: ['5', '10', '11', '12'],
    correct: '11',
    explanation: 'Add 3 to both sides: y - 3 + 3 = 8 + 3, so y = 11'
  },
  {
    id: 3,
    question: 'What is the solution to 2z = 14?',
    options: ['6', '7', '8', '9'],
    correct: '7',
    explanation: 'Divide both sides by 2: 2z ÷ 2 = 14 ÷ 2, so z = 7'
  },
  {
    id: 4,
    question: 'Find the value of w in w ÷ 4 = 3',
    options: ['10', '11', '12', '13'],
    correct: '12',
    explanation: 'Multiply both sides by 4: w ÷ 4 × 4 = 3 × 4, so w = 12'
  },
  {
    id: 5,
    question: 'Solve: 2a + 3 = 11',
    options: ['3', '4', '5', '6'],
    correct: '4',
    explanation: 'Subtract 3 from both sides: 2a = 8, then divide by 2: a = 4'
  },
  {
    id: 6,
    question: 'What is the value of x in the equation 3x + 5 = 20?',
    options: ['4', '5', '6', '7'],
    correct: '5',
    explanation: 'Subtract 5 from both sides: 3x = 15, then divide by 3: x = 5'
  },
  {
    id: 7,
    question: 'Solve for y: 4y - 6 = 18',
    options: ['5', '6', '7', '8'],
    correct: '6',
    explanation: 'Add 6 to both sides: 4y = 24, then divide by 4: y = 6'
  },
  {
    id: 8,
    question: 'Find the value of z in 5z + 3 = 28',
    options: ['4', '5', '6', '7'],
    correct: '5',
    explanation: 'Subtract 3 from both sides: 5z = 25, then divide by 5: z = 5'
  },
  {
    id: 9,
    question: 'Solve: 6w - 4 = 20',
    options: ['3', '4', '5', '6'],
    correct: '4',
    explanation: 'Add 4 to both sides: 6w = 24, then divide by 6: w = 4'
  },
  {
    id: 10,
    question: 'What is the solution to 7a + 2 = 30?',
    options: ['3', '4', '5', '6'],
    correct: '4',
    explanation: 'Subtract 2 from both sides: 7a = 28, then divide by 7: a = 4'
  },
  {
    id: 11,
    question: 'Solve for b: 8b - 5 = 19',
    options: ['2', '3', '4', '5'],
    correct: '3',
    explanation: 'Add 5 to both sides: 8b = 24, then divide by 8: b = 3'
  },
  {
    id: 12,
    question: 'Find the value of x in x ÷ 6 = 4',
    options: ['20', '22', '24', '26'],
    correct: '24',
    explanation: 'Multiply both sides by 6: x ÷ 6 × 6 = 4 × 6, so x = 24'
  },
  {
    id: 13,
    question: 'Solve: y ÷ 7 = 3',
    options: ['18', '20', '21', '24'],
    correct: '21',
    explanation: 'Multiply both sides by 7: y ÷ 7 × 7 = 3 × 7, so y = 21'
  },
  {
    id: 14,
    question: 'What is the value of z in 9z = 45?',
    options: ['4', '5', '6', '7'],
    correct: '5',
    explanation: 'Divide both sides by 9: 9z ÷ 9 = 45 ÷ 9, so z = 5'
  },
  {
    id: 15,
    question: 'Solve: 10w = 60',
    options: ['5', '6', '7', '8'],
    correct: '6',
    explanation: 'Divide both sides by 10: 10w ÷ 10 = 60 ÷ 10, so w = 6'
  }
];

// ============================================================================
// COMPONENTS
// ============================================================================

// ErrorBoundary Component
interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
              <p className="text-gray-600 mb-4">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Navigation Component
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { language, setLanguage, t } = useLanguage()

  const navItems = [
    { path: '/', label: t('learn'), icon: Brain },
    { path: '/practice', label: t('practice'), icon: ClipboardCheck },
    { path: '/real-world', label: t('realWorld'), icon: Globe },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-gradient-to-r from-teal-500/90 to-purple-600/90 backdrop-blur-md border-b border-white/30 fixed top-0 left-0 right-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Left side - Navigation Buttons */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Center - Logo */}
          <div className="flex-1 flex justify-center">
            <Link to="/" className="flex items-center space-x-2 text-white">
              <span className="text-xl font-bold">{t('simpleEquations')}</span>
            </Link>
          </div>

          {/* Right side - Language Selector */}
          <div className="hidden md:flex items-center justify-end">
            <div className="flex items-center gap-2">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'hi' | 'gu')}
                className="px-3 py-2 text-sm border border-white/30 rounded-lg bg-white/20 text-white focus:ring-2 focus:ring-teal-500 hover:bg-white/30 transition-colors cursor-pointer"
                style={{fontFamily: 'Poppins, sans-serif'}}
              >
                <option value="en" className="bg-gray-800 text-white">🇺🇸 English</option>
                <option value="hi" className="bg-gray-800 text-white">🇮🇳 हिन्दी</option>
                <option value="gu" className="bg-gray-800 text-white">🇮🇳 ગુજરાતી</option>
              </select>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden absolute right-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-white/80 p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gradient-to-r from-teal-500/80 to-purple-600/80 backdrop-blur-md rounded-lg mt-2 shadow-lg">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              
              {/* Mobile Language Selector */}
              <div className="flex items-center gap-2 px-3 py-2">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'hi' | 'gu')}
                  className="px-3 py-2 text-sm border border-white/30 rounded-lg bg-white/20 text-white focus:ring-2 focus:ring-teal-500 hover:bg-white/30 transition-colors cursor-pointer"
                  style={{fontFamily: 'Poppins, sans-serif'}}
                >
                  <option value="en" className="bg-gray-800 text-white">🇺🇸 English</option>
                  <option value="hi" className="bg-gray-800 text-white">🇮🇳 हिन्दी</option>
                  <option value="gu" className="bg-gray-800 text-white">🇮🇳 ગુજરાતી</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// Layout Component
interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        {children}
      </main>
    </div>
  )
}

// SimpleEquationsTool Component
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


// Visual equation data with icons and colors
const equationTypes: EquationType[] = [
  {
    id: 'simple_addition',
    name: 'Simple Addition',
    equation: 'x + 5 = 12',
    solution: '7',
    rule: 'Subtract 5',
    description: 'Simple addition equations',
    icon: '➕',
    color: 'bg-blue-500',
    steps: [
      'Start with: x + 5 = 12',
      'To isolate x, subtract 5 from both sides',
      'x + 5 - 5 = 12 - 5',
      'Simplify: x = 7',
      'Check: 7 + 5 = 12 ✓'
    ],
    translations: {
      gu: { 
        name: 'સરળ સરવાળો', 
        rule: '5 બાદ કરો', 
        description: 'સરળ સરવાળા સમીકરણો',
        steps: [
          'શરૂ કરો: x + 5 = 12',
          'x ને અલગ કરવા માટે, બંને બાજુથી 5 બાદ કરો',
          'x + 5 - 5 = 12 - 5',
          'સરળ બનાવો: x = 7',
          'તપાસો: 7 + 5 = 12 ✓'
        ]
      },
      hi: { 
        name: 'सरल जोड़', 
        rule: '5 घटाएं', 
        description: 'सरल जोड़ के समीकरण',
        steps: [
          'शुरू करें: x + 5 = 12',
          'x को अलग करने के लिए, दोनों तरफ से 5 घटाएं',
          'x + 5 - 5 = 12 - 5',
          'सरल करें: x = 7',
          'जांचें: 7 + 5 = 12 ✓'
        ]
      }
    }
  },
  {
    id: 'addition_with_coefficient',
    name: 'Addition with Coefficient',
    equation: '2x + 3 = 11',
    solution: '4',
    rule: 'Subtract 3, then divide by 2',
    description: 'Addition equations with coefficients',
    icon: '➕',
    color: 'bg-green-500',
    steps: [
      'Start with: 2x + 3 = 11',
      'Step 1: Subtract 3 from both sides',
      '2x + 3 - 3 = 11 - 3',
      'Simplify: 2x = 8',
      'Step 2: Divide both sides by 2',
      '2x ÷ 2 = 8 ÷ 2',
      'Final answer: x = 4',
      'Check: 2 × 4 + 3 = 11 ✓'
    ],
    translations: {
      gu: { 
        name: 'ગુણાંક સાથે સરવાળો', 
        rule: '3 બાદ કરો, પછી 2 થી ભાગો', 
        description: 'ગુણાંક સાથે સરવાળા સમીકરણો',
        steps: [
          'શરૂ કરો: 2x + 3 = 11',
          'પગલું 1: બંને બાજુથી 3 બાદ કરો',
          '2x + 3 - 3 = 11 - 3',
          'સરળ બનાવો: 2x = 8',
          'પગલું 2: બંને બાજુથી 2 થી ભાગો',
          '2x ÷ 2 = 8 ÷ 2',
          'અંતિમ જવાબ: x = 4',
          'તપાસો: 2 × 4 + 3 = 11 ✓'
        ]
      },
      hi: { 
        name: 'गुणांक के साथ जोड़', 
        rule: '3 घटाएं, फिर 2 से भाग दें', 
        description: 'गुणांक के साथ जोड़ के समीकरण',
        steps: [
          'शुरू करें: 2x + 3 = 11',
          'चरण 1: दोनों तरफ से 3 घटाएं',
          '2x + 3 - 3 = 11 - 3',
          'सरल करें: 2x = 8',
          'चरण 2: दोनों तरफ 2 से भाग दें',
          '2x ÷ 2 = 8 ÷ 2',
          'अंतिम उत्तर: x = 4',
          'जांचें: 2 × 4 + 3 = 11 ✓'
        ]
      }
    }
  },
  {
    id: 'addition_word_problem',
    name: 'Addition Word Problem',
    equation: 'x + 7 = 15',
    solution: '8',
    rule: 'Subtract 7',
    description: 'Real-world addition problems',
    icon: '📝',
    color: 'bg-purple-500',
    steps: [
      'Start with: x + 7 = 15',
      'To isolate x, subtract 7 from both sides',
      'x + 7 - 7 = 15 - 7',
      'Simplify: x = 8',
      'Check: 8 + 7 = 15 ✓'
    ],
    translations: {
      gu: { 
        name: 'સરવાળા શબ્દ સમસ્યા', 
        rule: '7 બાદ કરો', 
        description: 'વાસ્તવિક જગતની સરવાળા સમસ્યાઓ',
        steps: [
          'શરૂ કરો: x + 7 = 15',
          'x ને અલગ કરવા માટે, બંને બાજુથી 7 બાદ કરો',
          'x + 7 - 7 = 15 - 7',
          'સરળ બનાવો: x = 8',
          'તપાસો: 8 + 7 = 15 ✓'
        ]
      },
      hi: { 
        name: 'जोड़ शब्द समस्या', 
        rule: '7 घटाएं', 
        description: 'वास्तविक दुनिया की जोड़ की समस्याएं',
        steps: [
          'शुरू करें: x + 7 = 15',
          'x को अलग करने के लिए, दोनों तरफ से 7 घटाएं',
          'x + 7 - 7 = 15 - 7',
          'सरल करें: x = 8',
          'जांचें: 8 + 7 = 15 ✓'
        ]
      }
    }
  }
];

const SimpleEquationsTool: React.FC = () => {
  const [currentMode] = useState<'demonstration' | 'practice' | 'assessment'>('demonstration');
  const { language, t } = useLanguage();
  const [selectedEquation, setSelectedEquation] = useState<string>('simple_addition');
  
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
    { id: 'q1', promptKey: 'practice_q1', prompt: 'Solve: x + 5 = 12', answer: '7' },
    { id: 'q2', promptKey: 'practice_q2', prompt: 'Solve: y + 8 = 15', answer: '7' },
    { id: 'q3', promptKey: 'practice_q3', prompt: 'Solve: 2x + 3 = 11', answer: '4' },
    { id: 'q4', promptKey: 'practice_q4', prompt: 'Solve: z + 7 = 20', answer: '13' },
    { id: 'q5', promptKey: 'practice_q5', prompt: 'Solve: 3a + 4 = 16', answer: '4' },
    { id: 'q6', promptKey: 'practice_q6', prompt: 'Solve: b + 12 = 25', answer: '13' },
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
            <label className="text-lg font-semibold text-gray-700">Select Equation Type</label>
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
                <div className="text-lg font-semibold text-gray-800">Step-by-Step Solution</div>
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

// Exports
export default SimpleEquationsTool;
export { ErrorBoundary, Navigation, Layout };