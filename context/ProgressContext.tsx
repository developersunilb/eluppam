'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UserProgress, ModuleProgress, LessonProgress, PracticeAttempt } from '@/lib/types/progress';
import { getOrCreateUserProgress, updateUserProgress } from '@/lib/db';

interface ProgressContextType {
  userProgress: UserProgress | null;
  loading: boolean;
  error: string | null;
  updateModuleProgress: (moduleId: string, moduleType: 'learn' | 'practice', newStatus: 'not-started' | 'in-progress' | 'completed', score?: number, lastAccessedLessonId?: string, practiceState?: { currentIndex: number; correctAnswersCount: number; }) => Promise<void>;
  updateLessonProgress: (moduleId: string, lessonId: string, completed: boolean, score?: number) => Promise<void>;
  resetModuleProgress: (moduleId: string) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

interface ProgressProviderProps {
  children: ReactNode;
  userId: string; // The ID of the currently logged-in user
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({ children, userId }) => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserProgress = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (userId === 'guest') {
      setUserProgress({ userId: 'guest', modules: [], lastUpdated: Date.now() });
      setLoading(false);
      return;
    }
    try {
      const progress = await getOrCreateUserProgress(userId);
      setUserProgress(progress);
    } catch (err) {
      console.error("Failed to load user progress:", err);
      setError("Failed to load user progress.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadUserProgress();
    }
  }, [userId, loadUserProgress]);

  const saveProgress = useCallback(async (updatedProgress: UserProgress) => {
    if (updatedProgress.userId === 'guest') {
      setUserProgress(updatedProgress); // Update local state but don't save to DB
      return;
    }
    try {
      await updateUserProgress(updatedProgress);
      setUserProgress(updatedProgress);
    } catch (err) {
      console.error("Failed to save user progress:", err);
      setError("Failed to save user progress.");
    }
  }, []);

  const updateModuleProgress = useCallback(async (moduleId: string, moduleType: 'learn' | 'practice', newStatus: 'not-started' | 'in-progress' | 'completed', score?: number, lastAccessedLessonId?: string, practiceState?: { currentIndex: number; correctAnswersCount: number; }) => {
    const prevUserProgress = userProgress; 

    if (!prevUserProgress) return;

    const updatedModules = prevUserProgress.modules.map(module => {
      if (module.moduleId === moduleId) {
        const newAttempt: PracticeAttempt | undefined = moduleType === 'practice' && score !== undefined
          ? { attemptId: Date.now().toString(), timestamp: Date.now(), score }
          : undefined;

        const practiceAttempts = newAttempt 
          ? [...(module.practiceAttempts || []), newAttempt] 
          : module.practiceAttempts;

        return { 
          ...module, 
          moduleType, 
          status: newStatus, 
          score: score !== undefined ? score : module.score, 
          lastAccessed: Date.now(), 
          lastAccessedLessonId: lastAccessedLessonId !== undefined ? lastAccessedLessonId : module.lastAccessedLessonId, 
          practiceState: practiceState !== undefined ? practiceState : module.practiceState,
          practiceAttempts
        };
      }
      return module;
    });

    // If module doesn't exist, add it
    if (!updatedModules.some(module => module.moduleId === moduleId)) {
      updatedModules.push({
        moduleId,
        moduleType,
        status: newStatus,
        score: score,
        lastAccessed: Date.now(),
        lessons: [],
        practiceAttempts: [],
        lastAccessedLessonId: lastAccessedLessonId,
        practiceState: practiceState,
      });
    }

    const newProgress = { ...prevUserProgress, modules: updatedModules };

    // Await the DB update
    await updateUserProgress(newProgress);

    // Then update local state
    setUserProgress(newProgress);
  }, [userProgress]); // userProgress is now a dependency again, but this is okay because we await the DB update

  const updateLessonProgress = useCallback(async (moduleId: string, lessonId: string, completed: boolean, score?: number) => {
    const prevUserProgress = userProgress;

    if (!prevUserProgress) return;

    const updatedModules = prevUserProgress.modules.map(module => {
      if (module.moduleId === moduleId) {
        const updatedLessons = module.lessons.map(lesson =>
          lesson.lessonId === lessonId
            ? { ...lesson, completed, score: score !== undefined ? score : lesson.score, lastAttempted: Date.now() }
            : lesson
        );

        // If lesson doesn't exist, add it
        if (!updatedLessons.some(lesson => lesson.lessonId === lessonId)) {
          updatedLessons.push({
            lessonId,
            completed,
            score,
            lastAttempted: Date.now(),
          });
        }

        return { ...module, lessons: updatedLessons, lastAccessed: Date.now() };
      }
      return module;
    });

    // Ensure the module exists if it was just created by lesson update
    if (!updatedModules.some(module => module.moduleId === moduleId)) {
      updatedModules.push({
        moduleId,
        moduleType: 'learn',
        status: 'in-progress', // Default status when a lesson is updated for a new module
        lastAccessed: Date.now(),
        lessons: [{
          lessonId,
          completed,
          score,
          lastAttempted: Date.now(),
        }],
        practiceAttempts: [], // Initialize practiceAttempts
      });
    }

    const newProgress = { ...prevUserProgress, modules: updatedModules };
    await updateUserProgress(newProgress);
    setUserProgress(newProgress);
  }, [userProgress]);

  

  const resetModuleProgress = useCallback(async (moduleId: string) => {
    if (!userProgress) return;

    const updatedModules = userProgress.modules.map(module => {
      if (module.moduleId === moduleId) {
        return {
          ...module,
          status: 'not-started',
          score: undefined,
          lessons: [],
          practiceAttempts: [],
          lastAccessed: Date.now(),
          lastAccessedLessonId: undefined,
          practiceState: undefined,
        };
      }
      return module;
    });

    const newProgress = { ...userProgress, modules: updatedModules };
    await saveProgress(newProgress);
    await loadUserProgress(); // Reload progress after reset
  }, [userProgress, saveProgress, loadUserProgress]);

  const value = {
    userProgress,
    loading,
    error,
    updateModuleProgress,
    updateLessonProgress,
    resetModuleProgress,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
