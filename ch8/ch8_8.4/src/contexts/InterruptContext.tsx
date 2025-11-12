import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

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
