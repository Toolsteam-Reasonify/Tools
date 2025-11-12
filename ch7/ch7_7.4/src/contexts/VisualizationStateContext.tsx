import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

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
