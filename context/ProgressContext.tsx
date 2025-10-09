'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UserProgress, ModuleProgress, LessonProgress, PracticeAttempt, Badge } from '@/lib/types/progress';
import { getOrCreateUserProgress, updateUserProgress } from '@/lib/db';

interface ProgressContextType {
  userProgress: UserProgress | null;
  loading: boolean;
  error: string | null;
  loadUserProgress: () => Promise<void>; // Expose the loading function
  updateModuleProgress: (moduleId: string, moduleType: 'learn' | 'practice', newStatus: 'not-started' | 'in-progress' | 'completed', score?: number, lastAccessedLessonId?: string, practiceState?: { currentIndex: number; correctAnswersCount: number; }) => Promise<void>;
  updateLessonProgress: (moduleId: string, lessonId: string, completed: boolean, score?: number) => Promise<void>;
  resetModuleProgress: (moduleId: string) => Promise<void>;
  addBadge: (badge: Badge) => Promise<void>; // New function
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

interface ProgressProviderProps {
  children: ReactNode;
  userId: string; // The ID of the currently logged-in user
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({ children, userId }) => {
  const [userProgress, setUserProgress] = useState<UserProgress>(() => ({ userId: '', modules: [], badges: [], lastUpdated: Date.now() }));
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserProgress = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (userId === 'guest') {
      setUserProgress({ userId: 'guest', modules: [], badges: [], lastUpdated: Date.now() }); // Initialize badges for guest
      setLoading(false);
      return;
    }
    try {
      const progress = await getOrCreateUserProgress(userId);
      // Ensure badges array exists
      if (!progress.badges) {
        progress.badges = [];
      }
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

  const addBadge = useCallback(async (newBadge: Badge) => {
    if (!userProgress) return;

    const updatedBadges = userProgress.badges ? [...userProgress.badges] : [];
    // Prevent duplicate badges (e.g., if user refreshes page after earning)
    if (!updatedBadges.some(badge => badge.id === newBadge.id)) {
      updatedBadges.push(newBadge);
    }

    const newProgress = { ...userProgress, badges: updatedBadges, lastUpdated: Date.now() };
    await saveProgress(newProgress);
  }, [userProgress, saveProgress]);

    const updateModuleProgress = useCallback(async (moduleId: string, moduleType: 'learn' | 'practice', newStatus: 'not-started' | 'in-progress' | 'completed', score?: number, lastAccessedLessonId?: string, practiceState?: { currentIndex: number; correctAnswersCount: number; }) => {
      console.log(`updateModuleProgress called for moduleId: ${moduleId}, status: ${newStatus}, score: ${score}`);
  
      setUserProgress(prevUserProgress => {
        if (!prevUserProgress) {
          console.log('updateModuleProgress: prevUserProgress is null, returning.');
          return prevUserProgress; // Return current state if null
        }

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
        console.log('updateModuleProgress: newProgress object before DB update:', JSON.stringify(newProgress, null, 2));

        // Await the DB update (this will run outside the synchronous state update)
        updateUserProgress(newProgress).then(() => {
          console.log('updateModuleProgress: DB updated successfully for moduleId:', moduleId);
        }).catch(error => {
          console.error('updateModuleProgress: Failed to save user progress to DB for moduleId:', moduleId, error);
        });

        // Return the new state immediately for local update
        console.log('updateModuleProgress: Local state updated for moduleId:', moduleId);
        return newProgress;
      });
    }, []); // Empty dependency array because we use functional update

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
        } as ModuleProgress;
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
    loadUserProgress, // Add this to the context value
    updateModuleProgress,
    updateLessonProgress,
    resetModuleProgress,
    addBadge,
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
