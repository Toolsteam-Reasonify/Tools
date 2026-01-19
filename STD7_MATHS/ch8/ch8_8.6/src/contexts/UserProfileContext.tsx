import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

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
