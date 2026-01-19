import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

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
